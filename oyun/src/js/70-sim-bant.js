/* 70-sim-bant.js (S12) Atomdan banda: N atom, her seviye N çizgiye yarılır; Pauli dolumu; iletken/yalıtkan/yarıiletken.
 * Q.sim.register("bant", ...) dışında bir şey yapmaz. */
(function(){
  'use strict';
  var NLER = [1,2,4,8,16,32,64];
  var MALZ = ['iletken','yalitkan','yariiletken'];
  var AD = { iletken:'İletken', yalitkan:'Yalıtkan', yariiletken:'Yarıiletken' };
  var EG = { iletken:0, yalitkan:5, yariiletken:1.1 };
  var W = 2;          /* bant genişliği (eV), N'den bağımsız */
  var EMAX = 2 * W + 5 + 0.6;

  /* alt bant (3s benzeri) [0,W], üst bant (3p benzeri) [W+Eg, 2W+Eg] */
  function merkez(k, mal){ return k === 0 ? W / 2 : W + EG[mal] + W / 2; }
  function seviyeler(k, N, mal){
    var out = [], i;
    for (i = 0; i < N; i++) out.push(merkez(k, mal) + (N === 1 ? 0 : W * (i / (N - 1) - 0.5)));
    return out;
  }
  /* Elektron sayısı: iletkende atom başına 1 (alt bant yarı dolu), diğerlerinde 2 (alt bant tam dolu) */
  function elektronSayisi(mal, N){ return (mal === 'iletken' ? 1 : 2) * N; }

  var impl = {
    mount: function(host, params, api){
      params = params || {}; api = api || {};
      var b0 = params.baslangic || {};
      var N0 = params.N != null ? params.N : (b0.N != null ? b0.N : 8);
      var nIdx = NLER.indexOf(N0); if (nIdx < 0) nIdx = 3;
      var mal = MALZ.indexOf(params.malzeme) >= 0 ? params.malzeme : (MALZ.indexOf(b0.malzeme) >= 0 ? b0.malzeme : 'yariiletken');
      var gezilen = {}; gezilen[mal] = true;
      var dolu = 0, hedef = 0, raf = 0, bitti = false, destroyed = false, ro = null, onWin = null;

      host.innerHTML = '';
      var wrap = document.createElement('div');
      wrap.style.cssText = 'display:flex;flex-direction:column;gap:8px;width:100%;';
      var cv = document.createElement('canvas');
      cv.style.cssText = 'display:block;width:100%;height:clamp(180px,22vh,260px);background:var(--track,#0b0620);border:3px solid var(--line,#f4f0ff);border-radius:10px;';
      cv.setAttribute('role','img');
      var bar = document.createElement('div');
      bar.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;align-items:center;';
      wrap.appendChild(cv); wrap.appendChild(bar); host.appendChild(wrap);

      var btnStyle = 'min-height:40px;padding:0 14px;font:700 16px var(--font-b,Nunito,sans-serif);color:var(--ink,#fff);background:var(--panel2,#25164f);border:3px solid var(--line,#f4f0ff);border-radius:8px;cursor:pointer;';
      function mkBtn(text, fn){
        var b = document.createElement('button');
        b.type = 'button'; b.textContent = text; b.style.cssText = btnStyle;
        b.addEventListener('click', fn); return b;
      }
      /* 1) Atom sayısı N */
      var nBox = document.createElement('label');
      nBox.style.cssText = 'display:flex;align-items:center;gap:8px;font:700 16px var(--font-b,Nunito,sans-serif);color:var(--ink,#fff);';
      var nTxt = document.createElement('span');
      var sl = document.createElement('input');
      sl.type = 'range'; sl.min = '0'; sl.max = String(NLER.length - 1); sl.step = '1'; sl.value = String(nIdx);
      sl.setAttribute('aria-label', 'Atom sayısı N');
      sl.style.cssText = 'min-height:40px;width:140px;accent-color:var(--cyan,#00e5ff);';
      nBox.appendChild(nTxt); nBox.appendChild(sl); bar.appendChild(nBox);
      sl.addEventListener('input', function(){
        nIdx = parseInt(sl.value, 10) || 0; dolu = 0; hedef = 0; durdur(); guncelle();
      });
      /* 2) Elektron doldur */
      var fillBtn = mkBtn('Elektron doldur', function(){ doldur(); });
      fillBtn.style.background = 'var(--accent,#ffd23f)'; fillBtn.style.color = 'var(--accent-ink,#0b0620)';
      bar.appendChild(fillBtn);
      /* 3) Malzeme */
      var grp = document.createElement('div');
      grp.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;';
      var mBtn = {};
      MALZ.forEach(function(m){
        mBtn[m] = mkBtn(AD[m], function(){ sec(m); });
        grp.appendChild(mBtn[m]);
      });
      bar.appendChild(grp);
      var info = document.createElement('div');
      info.style.cssText = 'flex:1 1 220px;font:700 16px var(--font-b,Nunito,sans-serif);color:var(--ink,#fff);';
      info.setAttribute('aria-live','polite');
      bar.appendChild(info);
      var note = document.createElement('span');
      note.textContent = 'oyun modeli';
      note.style.cssText = 'font:600 16px var(--font-b,Nunito,sans-serif);color:var(--muted,#c4b9ec);';
      bar.appendChild(note);

      function col(n, fb){
        try { var v = getComputedStyle(host).getPropertyValue(n).trim(); return v || fb; } catch (e) { return fb; }
      }
      function durdur(){ if (raf) { cancelAnimationFrame(raf); raf = 0; } }
      function sec(m){ mal = m; gezilen[m] = true; dolu = 0; hedef = 0; durdur(); guncelle(); }

      function doldur(){
        var N = NLER[nIdx];
        hedef = elektronSayisi(mal, N); dolu = 0; durdur();
        var t0 = null, dur = 900;
        function adim(t){
          if (destroyed) return;
          if (t0 == null) t0 = t;
          var f = Math.min(1, (t - t0) / dur);
          dolu = Math.round(hedef * f);
          ciz();
          if (f < 1) raf = requestAnimationFrame(adim);
          else { raf = 0; dolu = hedef; guncelle(); }
        }
        raf = requestAnimationFrame(adim);
      }

      function kontrolBasari(){
        if (bitti || !params.basari) return;
        var h = params.basari, say = 0;
        MALZ.forEach(function(m){ if (gezilen[m]) say++; });
        if (NLER[nIdx] >= (h.N || 0) && say >= (h.malzemeler || 0)) {
          bitti = true;
          try { if (api.done) api.done({ basari:true, olcum:{ N:NLER[nIdx], malzemeler:say } }); } catch (e) {}
        }
      }

      function durumMetni(){
        var N = NLER[nIdx], eg = EG[mal];
        var s = 'N=' + N + ' · Eg=' + String(eg).replace('.', ',') + ' eV';
        if (dolu > 0 && dolu >= hedef && hedef > 0) {
          s += mal === 'iletken' ? ' · Bant yarı dolu: elektron akar'
             : (mal === 'yalitkan' ? ' · Alt bant dolu, aralık büyük: akmaz' : ' · Alt bant dolu, aralık küçük: ısıyla geçer');
        } else s += ' · ' + (N === 1 ? 'Tek atom: tek seviye' : N + ' çizgi, bir bant gibi');
        return s;
      }

      function guncelle(){
        if (destroyed) return;
        var N = NLER[nIdx];
        nTxt.textContent = 'N = ' + N;
        sl.value = String(nIdx);
        MALZ.forEach(function(m){
          var on = m === mal;
          mBtn[m].style.background = on ? 'var(--sel,#0a3a52)' : 'var(--panel2,#25164f)';
          mBtn[m].style.borderColor = on ? 'var(--cyan,#00e5ff)' : 'var(--line,#f4f0ff)';
          mBtn[m].setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        info.textContent = durumMetni();
        cv.setAttribute('aria-label', 'Enerji bandı: ' + N + ' atom, ' + AD[mal] + ', aralık ' + EG[mal] + ' eV');
        ciz();
        kontrolBasari();
      }

      var CW = 0, CH = 0, dpr = 1;
      function boyutla(){
        if (destroyed) return;
        var r = cv.getBoundingClientRect();
        dpr = window.devicePixelRatio || 1;
        CW = Math.max(1, Math.round(r.width)); CH = Math.max(1, Math.round(r.height));
        cv.width = Math.round(CW * dpr); cv.height = Math.round(CH * dpr);
        ciz();
      }
      function ciz(){
        if (destroyed || !CW) return;
        var c = cv.getContext('2d');
        c.setTransform(dpr, 0, 0, dpr, 0, 0);
        c.clearRect(0, 0, CW, CH);
        var cyan = col('--cyan','#00e5ff'), mag = col('--magenta','#ff3df0'), yel = col('--yellow','#ffd23f'),
            lime = col('--lime','#39ff88'), ink = col('--ink','#ffffff'), muted = col('--muted','#c4b9ec');
        var N = NLER[nIdx], eg = EG[mal];
        var top = 14, bot = CH - 22, ph = bot - top;
        function Y(e){ return bot - (e / EMAX) * ph; }
        var xA0 = CW * 0.06, xA1 = CW * 0.2;       /* tek atom */
        var xB0 = CW * 0.42, xB1 = CW * 0.74;      /* N atomlu bant */
        var font = col('--font-b','Nunito, sans-serif');
        c.font = '700 14px ' + font; c.textBaseline = 'middle';
        c.strokeStyle = muted; c.lineWidth = 1.5; c.globalAlpha = 0.7;
        c.beginPath(); c.moveTo(4, bot); c.lineTo(4, top); c.stroke(); c.globalAlpha = 1;
        c.fillStyle = muted; c.textAlign = 'left'; c.fillText('E', 8, top + 4);
        var renk = [cyan, mag];
        var k, i;
        var alfa = Math.min(0.35, 0.04 + 0.05 * Math.log(N) / Math.LN2);
        for (k = 0; k < 2; k++) {
          var lo = k === 0 ? 0 : W + eg, hi = lo + W;
          c.globalAlpha = alfa; c.fillStyle = renk[k];
          c.fillRect(xB0, Y(hi), xB1 - xB0, Y(lo) - Y(hi)); c.globalAlpha = 1;
        }
        for (k = 0; k < 2; k++) {
          var e0 = merkez(k, mal), ls = seviyeler(k, N, mal);
          c.strokeStyle = renk[k]; c.lineWidth = 1; c.globalAlpha = 0.35;
          for (i = 0; i < ls.length; i++) {
            c.beginPath(); c.moveTo(xA1, Y(e0)); c.lineTo(xB0, Y(ls[i])); c.stroke();
          }
          c.globalAlpha = 1;
          c.strokeStyle = renk[k]; c.lineWidth = 3;
          c.beginPath(); c.moveTo(xA0, Y(e0)); c.lineTo(xA1, Y(e0)); c.stroke();
          c.fillStyle = ink; c.textAlign = 'center';
          c.fillText(k === 0 ? '3s' : '3p', (xA0 + xA1) / 2, Y(e0) - 12);
          c.lineWidth = N >= 32 ? 1.5 : 2.5;
          for (i = 0; i < ls.length; i++) {
            c.beginPath(); c.moveTo(xB0, Y(ls[i])); c.lineTo(xB1, Y(ls[i])); c.stroke();
          }
        }
        /* elektronlar: enerji sırasıyla, çizgi başına en çok 2 (Pauli) */
        var tum = seviyeler(0, N, mal).concat(seviyeler(1, N, mal));
        var kalan = dolu, r = Math.max(2, Math.min(4.5, ph / (N * 5 + 8)));
        c.fillStyle = yel;
        for (i = 0; i < tum.length && kalan > 0; i++) {
          var n2 = Math.min(2, kalan), ny = Y(tum[i]);
          /* dolu seviye: sarı çizgi; az çizgide iki elektron noktası */
          c.globalAlpha = 0.8; c.strokeStyle = yel; c.lineWidth = N >= 32 ? 1.5 : 2.5;
          c.beginPath(); c.moveTo(xB0, ny); c.lineTo(xB1, ny); c.stroke(); c.globalAlpha = 1;
          if (N <= 16) {
            c.beginPath(); c.arc(xB1 - 4 * r - 2, ny, r, 0, Math.PI * 2); c.fill();
            if (n2 > 1) { c.beginPath(); c.arc(xB1 - 2 * r, ny, r, 0, Math.PI * 2); c.fill(); }
          }
          kalan -= n2;
        }
        var gx = xB1 + 22;
        c.textAlign = 'left';
        if (eg > 0) {
          c.strokeStyle = lime; c.fillStyle = lime; c.lineWidth = 2.5;
          c.beginPath(); c.moveTo(gx, Y(W)); c.lineTo(gx, Y(W + eg)); c.stroke();
          c.beginPath(); c.moveTo(gx - 5, Y(W) - 6); c.lineTo(gx, Y(W)); c.lineTo(gx + 5, Y(W) - 6); c.stroke();
          c.beginPath(); c.moveTo(gx - 5, Y(W + eg) + 6); c.lineTo(gx, Y(W + eg)); c.lineTo(gx + 5, Y(W + eg) + 6); c.stroke();
          c.fillText('Eg = ' + String(eg).replace('.', ',') + ' eV', gx + 10, (Y(W) + Y(W + eg)) / 2);
        } else {
          c.fillStyle = lime; c.fillText('Eg = 0', gx + 4, Y(W));
        }
        c.fillStyle = muted; c.textAlign = 'center';
        c.fillText('1 atom', (xA0 + xA1) / 2, CH - 8);
        c.fillText(N + ' atom', (xB0 + xB1) / 2, CH - 8);
      }

      if (typeof ResizeObserver !== 'undefined') {
        ro = new ResizeObserver(boyutla);
        ro.observe(cv);
      } else {
        onWin = boyutla;
        window.addEventListener('resize', onWin);
      }
      if (api.hint) { try { api.hint('N büyüdükçe çizgiler banda döner; Eg iletkenliği belirler.'); } catch (e) {} }
      boyutla(); guncelle();

      return {
        destroy: function(){
          destroyed = true; durdur();
          if (ro) { try { ro.disconnect(); } catch (e) {} ro = null; }
          if (onWin) { window.removeEventListener('resize', onWin); onWin = null; }
          host.innerHTML = '';
        },
        getState: function(){ return { N: NLER[nIdx], malzeme: mal, Eg: EG[mal], dolu: dolu, malzemeler: Object.keys(gezilen).length }; },
        set: function(p){
          if (!p) return;
          if (p.N != null && NLER.indexOf(p.N) >= 0) { nIdx = NLER.indexOf(p.N); dolu = 0; }
          if (MALZ.indexOf(p.malzeme) >= 0) { mal = p.malzeme; gezilen[mal] = true; dolu = 0; }
          durdur(); guncelle();
        }
      };
    }
  };
  if (typeof Q !== 'undefined' && Q.sim && Q.sim.register) Q.sim.register('bant', impl);
})();
