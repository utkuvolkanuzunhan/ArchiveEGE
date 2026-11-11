/* 70-sim-bohr.js (S7) Hidrojen seviyeleri ve madde dalgası.
 * Q.sim.register("bohr", ...) dışında bir şey yapmaz. */
(function(){
  'use strict';
  function seviye(n){ return -13.6 / (n * n); }
  function dEnerji(n, m){ return 13.6 * Math.abs(1 / (m * m) - 1 / (n * n)); }
  function dalgaboyu(n, m){ var d = dEnerji(n, m); return d > 0 ? 1240 / d : Infinity; }
  /* nm -> renk (görünür 380-750); dışı null */
  function renk(nm){
    var r = 0, g = 0, b = 0, f;
    if (!(nm >= 380 && nm <= 750)) return null;
    if (nm < 440) { r = (440 - nm) / 60; b = 1; }
    else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
    else if (nm < 510) { g = 1; b = (510 - nm) / 20; }
    else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
    else if (nm < 645) { r = 1; g = (645 - nm) / 65; }
    else { r = 1; }
    f = nm < 420 ? 0.4 + 0.6 * (nm - 380) / 40 : (nm > 700 ? 0.4 + 0.6 * (750 - nm) / 50 : 1);
    return 'rgb(' + Math.round(255 * r * f) + ',' + Math.round(255 * g * f) + ',' + Math.round(255 * b * f) + ')';
  }
  function bolge(nm){ return nm < 380 ? 'mor ötesi' : (nm > 750 ? 'kızıl ötesi' : 'görünür'); }

  var impl = {
    mount: function(host, params, api){
      params = params || {}; api = api || {};
      var b0 = params.baslangic || {};
      function sinir(v, d){ v = Math.round(Number(v)); return v >= 1 && v <= 6 ? v : d; }
      var n = sinir(params.n != null ? params.n : b0.n, 3);
      var m = sinir(params.m != null ? params.m : b0.m, 2);
      var level = n;
      var anim = null, foton = null, raf = 0, timers = [], bitti = false, destroyed = false;
      var enAltDenendi = false, sonGecis = null, bounce = 0;
      var ro = null, onWin = null, t0 = 0;
      var reduced = false;
      try { reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) {}

      host.innerHTML = '';
      var wrap = document.createElement('div');
      wrap.style.cssText = 'display:flex;flex-direction:column;gap:6px;width:100%;';
      var cv = document.createElement('canvas');
      cv.style.cssText = 'display:block;width:100%;height:clamp(112px,16vh,200px);background:var(--track,#0b0620);border:3px solid var(--line,#f4f0ff);border-radius:10px;';
      cv.setAttribute('role','img');
      var bar = document.createElement('div');
      bar.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px 8px;align-items:center;';
      wrap.appendChild(cv); wrap.appendChild(bar); host.appendChild(wrap);

      var ctlStyle = 'min-height:40px;padding:0 12px;font:700 16px var(--font-b,Nunito,sans-serif);color:var(--ink,#fff);background:var(--panel2,#25164f);border:3px solid var(--line,#f4f0ff);border-radius:8px;cursor:pointer;';
      function mkSel(etiket, dgr, fn, sifir){
        var l = document.createElement('label');
        l.style.cssText = 'display:flex;gap:6px;align-items:center;font:700 16px var(--font-b,Nunito,sans-serif);color:var(--ink,#fff);';
        l.appendChild(document.createTextNode(etiket));
        var s = document.createElement('select'); s.style.cssText = ctlStyle;
        s.setAttribute('aria-label', etiket);
        for (var i = sifir ? 0 : 1; i <= 6; i++) {
          var o = document.createElement('option'); o.value = String(i); o.textContent = String(i); s.appendChild(o);
        }
        s.value = String(dgr);
        s.addEventListener('change', function(){ fn(parseInt(s.value, 10)); });
        l.appendChild(s); bar.appendChild(l); return s;
      }
      var selN = mkSel('Initial n (başlangıç n)', n, function(v){ n = v; if (!anim) level = n; sonGecis = null; yenile(); });
      var selM = mkSel('Final m (bitiş m)', m, function(v){
        if (v < 1) { altinaDene(); selM.value = String(m); return; }
        m = v; sonGecis = null; yenile();
      }, true);
      var btn = document.createElement('button');
      btn.type = 'button'; btn.textContent = 'Photon (foton)'; btn.style.cssText = ctlStyle;
      btn.style.background = 'var(--accent,#ffd23f)'; btn.style.color = 'var(--accent-ink,#0b0620)';
      btn.addEventListener('click', function(){ gec(); });
      bar.appendChild(btn);
      var info = document.createElement('div');
      info.style.cssText = 'flex:1 1 260px;font:700 15px var(--font-b,Nunito,sans-serif);color:var(--ink,#fff);';
      info.setAttribute('aria-live','polite');
      bar.appendChild(info);

      function col(k, fb){
        try { var v = getComputedStyle(host).getPropertyValue(k).trim(); return v || fb; } catch (e) { return fb; }
      }
      function tm(fn, ms){ var id = setTimeout(function(){ timers = timers.filter(function(x){ return x !== id; }); fn(); }, ms); timers.push(id); return id; }
      function toast(t){
        try { if (typeof Q !== 'undefined' && Q.ui && Q.ui.toast) { Q.ui.toast(t); return true; } } catch (e) {}
        return false;
      }

      function metin(){
        if (n === m) return 'n = m: geçiş yok, foton yok.';
        var d = dEnerji(n, m), l = dalgaboyu(n, m), tur = n > m ? 'Yayılır' : 'Soğurulur';
        return tur + ': ΔE = ' + d.toFixed(2) + ' eV · λ = ' + Math.round(l) + ' nm (' + bolge(l) + ')';
      }
      function yenile(){
        if (destroyed) return;
        selN.value = String(n); selM.value = String(m);
        info.textContent = metin();
        cv.setAttribute('aria-label', 'Hidrojen: n=' + n + ' ile m=' + m + ' arası geçiş, ' + metin());
        ciz();
      }

      function basariKontrol(){
        if (bitti || !params.basari) return;
        var b = params.basari, ok = false;
        if (b.gecis && sonGecis && sonGecis[0] === b.gecis[0] && sonGecis[1] === b.gecis[1]) ok = true;
        if (b.enAlt && enAltDenendi) ok = true;
        if (ok) {
          bitti = true;
          try { if (api.done) api.done({ basari:true, olcum:{ n:n, m:m, dE:n === m ? 0 : dEnerji(n, m), lambda:n === m ? null : dalgaboyu(n, m), enAlt:enAltDenendi } }); } catch (e) {}
        }
      }

      function gec(){
        if (destroyed) return;
        if (n === m) { info.textContent = 'n = m: geçiş yok, foton yok.'; return; }
        if (anim) return;
        sonGecis = [n, m];
        anim = { from: n, to: m, t: 0, dur: reduced ? 1 : 1400, kind: 'gec' };
        foton = { yay: n > m, t: 0 };
        level = n; info.textContent = metin();
        basla();
      }
      function altinaDene(){
        if (destroyed) return;
        enAltDenendi = true;
        toast('n=1: en alt');
        info.textContent = 'n=1: ground state (temel hal). Altında level (seviye) yok.';
        if (!anim) {
          level = 1; bounce = 1;
          anim = { from: 1, to: 1, t: 0, dur: reduced ? 1 : 1100, kind: 'alt' };
          basla();
        }
        basariKontrol();
      }

      function basla(){
        if (raf) return;
        t0 = 0;
        raf = requestAnimationFrame(adim);
      }
      function adim(ts){
        raf = 0;
        if (destroyed) return;
        if (!t0) t0 = ts;
        var dt = ts - t0; t0 = ts;
        if (anim) {
          anim.t += dt;
          var u = Math.min(1, anim.t / anim.dur), e = u * u * (3 - 2 * u);
          if (anim.kind === 'gec') {
            level = anim.from + (anim.to - anim.from) * e;
            if (foton) foton.t = u;
          } else {
            bounce = Math.sin(u * Math.PI);
          }
          if (u >= 1) {
            var k = anim.kind, h = anim.to;
            anim = null; foton = null; bounce = 0;
            if (k === 'gec') { level = h; info.textContent = metin(); basariKontrol(); }
            else level = n;
          }
        }
        ciz();
        if (anim) raf = requestAnimationFrame(adim);
      }

      var W = 0, H = 0, dpr = 1;
      function boyutla(){
        if (destroyed) return;
        var r = cv.getBoundingClientRect();
        dpr = window.devicePixelRatio || 1;
        W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
        cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
        ciz();
      }
      function ciz(){
        if (destroyed || !W) return;
        var c = cv.getContext('2d');
        c.setTransform(dpr, 0, 0, dpr, 0, 0);
        c.clearRect(0, 0, W, H);
        var cyan = col('--cyan','#00e5ff'), mag = col('--magenta','#ff3df0'), yel = col('--yellow','#ffd23f'),
            lime = col('--lime','#39ff88'), ink = col('--ink','#ffffff'), muted = col('--muted','#c4b9ec'),
            dark = col('--ink-dark','#0b0620');
        var fb = col('--font-b','Nunito, sans-serif');
        var fr = (n === m) ? null : renk(dalgaboyu(n, m));
        var fcol = fr || muted;
        var i, k;

        /* sol yarı: enerji merdiveni (En = -13.6/n²) */
        var lw = W * 0.46, top = 22, bot = H - 14, ex0 = 40, ex1 = lw - 8;
        function yN(q){ return bot - (bot - top) * (1 - 1 / (q * q)); }
        c.font = '700 12px ' + fb; c.textBaseline = 'middle';
        var etY = [];
        function etOk(yy){ for (var z = 0; z < etY.length; z++) if (Math.abs(etY[z] - yy) < 13) return false; return true; }
        var sira = [n, m, 1, 2, 3, 4, 5, 6], goster = {};
        for (i = 0; i < sira.length; i++) {
          if (sira[i] >= 1 && !goster[sira[i]] && (i < 1 || etOk(yN(sira[i])))) { goster[sira[i]] = 1; etY.push(yN(sira[i])); }
        }
        for (k = 1; k <= 6; k++) {
          var y = yN(k), sel = (k === n || k === m);
          c.strokeStyle = k === n ? yel : (k === m ? cyan : muted);
          c.globalAlpha = sel ? 1 : 0.6; c.lineWidth = sel ? 4 : 2;
          c.beginPath(); c.moveTo(ex0, y); c.lineTo(ex1, y); c.stroke();
          c.globalAlpha = 1; c.fillStyle = sel ? ink : muted;
          if (!goster[k] && !sel) continue;
          c.textAlign = 'right'; c.fillText('n=' + k, ex0 - 4, y);
          if (!goster[k]) continue;
          c.textAlign = 'left'; c.fillText(seviye(k).toFixed(2), ex1 - 42, y - 9);
        }
        c.fillStyle = muted; c.textAlign = 'left'; c.fillText('eV', ex0 + 8, 9);
        if (n !== m) {
          var xa = (ex0 + ex1) / 2 + 6, ya = yN(n), yb = yN(m), dir = yb > ya ? 1 : -1;
          c.strokeStyle = fcol; c.fillStyle = fcol; c.lineWidth = 4;
          c.beginPath(); c.moveTo(xa, ya); c.lineTo(xa, yb); c.stroke();
          c.beginPath(); c.moveTo(xa, yb); c.lineTo(xa - 7, yb - 10 * dir); c.lineTo(xa + 7, yb - 10 * dir); c.closePath(); c.fill();
        }
        var ly = yN(level);
        c.beginPath(); c.arc(ex0 + 14, ly, 6, 0, Math.PI * 2); c.fillStyle = lime; c.fill();

        /* sağ yarı: yörünge + madde dalgası */
        var cx = lw + (W - lw) * 0.5, cy = H * 0.5 - 4;
        var rMax = Math.min((W - lw) * 0.46, H * 0.4);
        function R(L){ return rMax * (0.18 + 0.82 * (L * L) / 36); }
        for (var j = 1; j <= 6; j++) {
          c.beginPath(); c.arc(cx, cy, R(j), 0, Math.PI * 2);
          c.strokeStyle = muted; c.globalAlpha = 0.18; c.lineWidth = 1; c.stroke(); c.globalAlpha = 1;
        }
        c.beginPath(); c.arc(cx, cy, 7, 0, Math.PI * 2); c.fillStyle = mag; c.fill();
        var rr = R(level), tam = Math.abs(level - Math.round(level)) < 0.04;
        var gen = Math.min(rr * 0.16, 14) * (1 + 0.5 * bounce);
        var N = 240, th, rad;
        c.beginPath();
        for (i = 0; i <= N; i++) {
          th = i / N * Math.PI * 2;
          rad = rr + gen * Math.sin(level * th);
          if (i === 0) c.moveTo(cx + rad * Math.cos(th), cy + rad * Math.sin(th));
          else c.lineTo(cx + rad * Math.cos(th), cy + rad * Math.sin(th));
        }
        c.lineWidth = tam ? 4 : 2.5; c.strokeStyle = tam ? cyan : mag;
        c.globalAlpha = tam ? 1 : 0.7;
        c.setLineDash(tam ? [] : [5, 6]);
        if (tam) { c.shadowColor = cyan; c.shadowBlur = 10; }
        c.stroke(); c.shadowBlur = 0; c.setLineDash([]); c.globalAlpha = 1;
        c.beginPath(); c.arc(cx, cy - rr, 5, 0, Math.PI * 2); c.fillStyle = lime; c.fill();
        /* foton: yayılırsa dışarı, soğurulursa içeri doğru dalgalı çizgi */
        if (foton) {
          var xs = foton.yay ? cx + rr + foton.t * (W - cx - rr - 6) : W - 6 - foton.t * (W - cx - rr - 6);
          c.strokeStyle = fcol; c.lineWidth = 3; c.beginPath();
          for (i = 0; i < 26; i++) {
            var qx = xs - i * 3 * (foton.yay ? 1 : -1), qy = cy + 6 * Math.sin(i * 0.9 + foton.t * 20);
            if (i === 0) c.moveTo(qx, qy); else c.lineTo(qx, qy);
          }
          c.stroke();
        }
        c.textAlign = 'center'; c.font = '700 15px ' + fb;
        c.fillStyle = tam ? cyan : muted;
        c.fillText(tam ? 'n = ' + Math.round(level) + ' full wave (tam dalga)' : 'wave (dalga) sığmıyor', cx, H - 8);
        c.textAlign = 'left'; void dark;
      }

      if (typeof ResizeObserver !== 'undefined') { ro = new ResizeObserver(boyutla); ro.observe(cv); }
      else { onWin = boyutla; window.addEventListener('resize', onWin); }
      if (api.hint) { try { api.hint('Dalga yörüngeye tam sığarsa seviye vardır.'); } catch (e) {} }
      boyutla(); yenile();
      if (params.altinaDene) tm(function(){ altinaDene(); }, 400);

      return {
        destroy: function(){
          destroyed = true;
          if (raf) { cancelAnimationFrame(raf); raf = 0; }
          timers.forEach(clearTimeout); timers = [];
          if (ro) { try { ro.disconnect(); } catch (e) {} ro = null; }
          if (onWin) { window.removeEventListener('resize', onWin); onWin = null; }
          host.innerHTML = '';
        },
        getState: function(){
          return { n:n, m:m, dE:n === m ? 0 : dEnerji(n, m), lambda:n === m ? null : dalgaboyu(n, m), enAlt:enAltDenendi, gecis:sonGecis };
        },
        set: function(p){
          if (!p || destroyed) return;
          if (p.n != null) n = sinir(p.n, n);
          if (p.m != null) m = sinir(p.m, m);
          if (!anim) level = n;
          sonGecis = null; yenile();
          if (p.altinaDene) altinaDene();
          else if (p.n != null || p.m != null) gec();
        }
      };
    }
  };
  if (typeof Q !== 'undefined' && Q.sim && Q.sim.register) Q.sim.register('bohr', impl);
})();
