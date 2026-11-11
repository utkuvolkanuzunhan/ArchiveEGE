/* 70-sim-olcum.js (S10) Süperpozisyon, ölçüm, çökme.
 * Q.sim.register("olcum", ...) dışında bir şey yapmaz. */
(function(){
  'use strict';
  function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }

  var impl = {
    mount: function(host, params, api){
      params = params || {}; api = api || {};
      var b0 = params.baslangic || {};
      var c1sq = clamp(+(params.c1sq != null ? params.c1sq : (b0.c1sq != null ? b0.c1sq : 0.5)), 0, 1);
      var collapsed = 0;            /* 0: süperpozisyon, 1 veya 2: çökmüş */
      var gecmis = [];              /* son ölçüm sonuçları (en çok 20) */
      var sayac = [0, 0];           /* yığılma */
      var tekrarYapti = false, yuzYapti = false, bitti = false, destroyed = false;
      var sonMetin = '';
      var raf = 0, t0 = 0, ro = null, onWin = null, tmo = 0;
      var anim = 1;
      var cubuk = [c1sq, 1 - c1sq]; /* gösterilen çubuk yükseklikleri */

      host.innerHTML = '';
      var wrap = document.createElement('div');
      wrap.style.cssText = 'display:flex;flex-direction:column;gap:8px;width:100%;';
      var cv = document.createElement('canvas');
      cv.style.cssText = 'display:block;width:100%;height:clamp(180px,22vh,260px);background:var(--track,#0b0620);border:3px solid var(--line,#f4f0ff);border-radius:10px;';
      cv.setAttribute('role', 'img');
      var bar = document.createElement('div');
      bar.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;align-items:center;';
      wrap.appendChild(cv); wrap.appendChild(bar); host.appendChild(wrap);

      var btnStyle = 'min-height:40px;padding:0 14px;font:700 16px var(--font-b,Nunito,sans-serif);color:var(--ink,#fff);background:var(--panel2,#25164f);border:3px solid var(--line,#f4f0ff);border-radius:8px;cursor:pointer;';
      function mkBtn(text, fn){
        var b = document.createElement('button');
        b.type = 'button'; b.textContent = text; b.style.cssText = btnStyle;
        b.addEventListener('click', fn); return b;
      }
      var lab = document.createElement('label');
      lab.style.cssText = 'display:flex;align-items:center;gap:8px;font:700 16px var(--font-b,Nunito,sans-serif);color:var(--ink,#fff);flex:1 1 180px;';
      var labT = document.createElement('span'); labT.textContent = 'c₁²';
      var sl = document.createElement('input');
      sl.type = 'range'; sl.min = '0'; sl.max = '1'; sl.step = '0.01'; sl.value = String(c1sq);
      sl.setAttribute('aria-label', 'c₁ kare');
      sl.style.cssText = 'flex:1;min-height:40px;accent-color:var(--cyan,#00e5ff);';
      var slV = document.createElement('span'); slV.style.cssText = 'min-width:40px;color:var(--yellow,#ffd23f);';
      lab.appendChild(labT); lab.appendChild(sl); lab.appendChild(slV);
      bar.appendChild(lab);
      var bOlc = mkBtn('Ölç', function(){ hazirla(); olc(true); });
      var bTek = mkBtn('Tekrar ölç', tekrarOlc);
      var bYuz = mkBtn('100 kez', yuzKez);
      bOlc.style.background = 'var(--accent,#ffd23f)'; bOlc.style.color = 'var(--accent-ink,#0b0620)';
      bar.appendChild(bOlc); bar.appendChild(bTek); bar.appendChild(bYuz);
      var info = document.createElement('div');
      info.style.cssText = 'flex:1 1 100%;font:700 16px var(--font-b,Nunito,sans-serif);color:var(--ink,#fff);min-height:22px;';
      info.setAttribute('aria-live', 'polite');
      bar.appendChild(info);

      function col(n, fb){
        try { var v = getComputedStyle(host).getPropertyValue(n).trim(); return v || fb; } catch (e) { return fb; }
      }
      function bildir(){
        if (bitti || !params.basari) return;
        var h = params.basari;
        if ((h.tekrarAyni && tekrarYapti) || (h.yuz && yuzYapti)) {
          bitti = true;
          try { if (api.done) api.done({ basari: true, olcum: { c1sq: c1sq, sonuc: collapsed, n: sayac[0] + sayac[1], tekrarAyni: tekrarYapti } }); } catch (e) {}
        }
      }
      function hazirla(){          /* ψ'yi başlangıç süperpozisyonuna döndür */
        collapsed = 0; cubuk = [c1sq, 1 - c1sq]; anim = 1;
      }
      function kaydet(s){
        gecmis.push(s); if (gecmis.length > 20) gecmis.shift();
        sayac[s - 1]++;
      }
      function olc(){
        var s = Math.random() < c1sq ? 1 : 2;
        collapsed = s; anim = 0;
        kaydet(s);
        sonMetin = 'ÇÖKTÜ: sonuç ' + s;
        guncelle();
      }
      function tekrarOlc(){
        if (!collapsed) { sonMetin = 'Önce bir kez ölç.'; guncelle(); return; }
        kaydet(collapsed);
        tekrarYapti = true;
        sonMetin = 'Tekrar: yine ' + collapsed + '. Çökmüş durum değişmez.';
        guncelle(); bildir();
      }
      function yuzKez(){
        var i;
        for (i = 0; i < 100; i++) kaydet(Math.random() < c1sq ? 1 : 2);
        hazirla();
        yuzYapti = true;
        sonMetin = '100 taze hazırlık: toplam ' + sayac[0] + ' kez 1, ' + sayac[1] + ' kez 2.';
        guncelle(); bildir();
      }
      sl.addEventListener('input', function(){
        c1sq = clamp(parseFloat(sl.value), 0, 1);
        hazirla(); sonMetin = ''; guncelle();
      });

      function guncelle(){
        if (destroyed) return;
        slV.textContent = c1sq.toFixed(2);
        bTek.disabled = !collapsed; bTek.style.opacity = collapsed ? '1' : '0.5';
        info.textContent = sonMetin || ('|c₁|² = ' + c1sq.toFixed(2) + ', |c₂|² = ' + (1 - c1sq).toFixed(2));
        cv.setAttribute('aria-label', collapsed ? 'Durum ' + collapsed + '. özdurumda çöktü' : 'Süperpozisyon: ' + c1sq.toFixed(2) + ' ve ' + (1 - c1sq).toFixed(2));
      }

      var W = 0, H = 0, dpr = 1;
      function boyutla(){
        if (destroyed) return;
        var r = cv.getBoundingClientRect();
        dpr = window.devicePixelRatio || 1;
        W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
        cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
        ciz(performance.now());
      }
      function ok(c, cx, cy, r, ang, renk){
        var x = cx + r * Math.cos(ang), y = cy - r * Math.sin(ang);
        c.strokeStyle = renk; c.fillStyle = renk; c.lineWidth = 3;
        c.beginPath(); c.moveTo(cx, cy); c.lineTo(x, y); c.stroke();
        c.beginPath(); c.arc(x, y, 4, 0, Math.PI * 2); c.fill();
      }
      function ciz(now){
        if (destroyed || !W) return;
        var tt = (now - t0) / 1000;
        var hedef = collapsed ? [collapsed === 1 ? 1 : 0, collapsed === 2 ? 1 : 0] : [c1sq, 1 - c1sq];
        anim = Math.min(1, anim + 0.08);
        var k = Math.min(1, anim * 0.5 + 0.2);
        cubuk = [cubuk[0] + (hedef[0] - cubuk[0]) * k, cubuk[1] + (hedef[1] - cubuk[1]) * k];
        var c = cv.getContext('2d');
        c.setTransform(dpr, 0, 0, dpr, 0, 0);
        c.clearRect(0, 0, W, H);
        var cyan = col('--cyan', '#00e5ff'), mag = col('--magenta', '#ff3df0'), yel = col('--yellow', '#ffd23f'),
            ink = col('--ink', '#ffffff'), muted = col('--muted', '#c4b9ec');
        var renk = [cyan, mag];
        var fb = col('--font-b', 'Nunito, sans-serif');
        var ust = H * 0.62, taban = ust - 6, maxH = ust - 34;
        c.font = '700 16px ' + fb; c.textBaseline = 'middle'; c.textAlign = 'center';
        var i, bw = Math.min(70, W * 0.12);
        for (i = 0; i < 2; i++) {
          var cx = W * (0.14 + i * 0.3), h = Math.max(2, cubuk[i] * maxH);
          c.fillStyle = renk[i]; c.globalAlpha = 0.85;
          c.fillRect(cx - bw / 2, taban - h, bw, h);
          c.globalAlpha = 1; c.strokeStyle = ink; c.lineWidth = 2; c.strokeRect(cx - bw / 2, taban - h, bw, h);
          c.fillStyle = ink;
          c.fillText('|c' + (i + 1) + '|² = ' + (cubuk[i] < 0.005 ? '0' : cubuk[i] > 0.995 ? '1' : cubuk[i].toFixed(2)), cx, Math.max(12, taban - h - 12));
          c.fillText('E' + (i + 1), cx, taban + 12);
          /* faz oku: e^(-iEt/ħ), E2 > E1 */
          var rr = Math.min(22, W * 0.05), ax = cx + bw / 2 + rr + 8, ay = taban - rr - 4;
          c.strokeStyle = muted; c.lineWidth = 1.5;
          c.beginPath(); c.arc(ax, ay, rr, 0, Math.PI * 2); c.stroke();
          ok(c, ax, ay, rr, -(1 + 1.7 * i) * tt, renk[i]);
        }
        c.textAlign = 'left';
        if (collapsed) {
          c.fillStyle = yel; c.font = '400 ' + Math.round(Math.min(34, H * 0.14)) + 'px ' + col('--font-d', 'Impact, sans-serif');
          c.fillText('ÇÖKTÜ', W * 0.64, H * 0.12);
        } else {
          c.fillStyle = muted; c.font = '700 16px ' + fb; c.fillText('süperpozisyon', W * 0.64, H * 0.12);
        }
        /* histogram (sağ) */
        var tot = sayac[0] + sayac[1], hx = W * 0.64, hw = W * 0.3, hb = ust - 6;
        c.font = '700 16px ' + fb; c.textAlign = 'center';
        for (i = 0; i < 2; i++) {
          var f = tot ? sayac[i] / tot : 0, hh = f * (maxH * 0.6), bx = hx + i * hw * 0.5 + 6;
          c.fillStyle = renk[i]; c.globalAlpha = 0.9;
          c.fillRect(bx, hb - hh, hw * 0.4, Math.max(1, hh));
          c.globalAlpha = 1; c.fillStyle = ink;
          c.fillText(String(sayac[i]), bx + hw * 0.2, hb - hh - 10);
        }
        /* sonuç şeridi: son 20 */
        var sw = Math.min(26, (W - 24) / 20), sy = H - sw - 8, sx = 12, off = 20 - gecmis.length;
        c.strokeStyle = muted; c.lineWidth = 1;
        for (i = 0; i < 20; i++) {
          if (i >= off) { c.fillStyle = renk[gecmis[i - off] - 1]; c.fillRect(sx + i * sw, sy, sw - 3, sw); }
          else c.strokeRect(sx + i * sw + 0.5, sy + 0.5, sw - 4, sw - 1);
        }
        c.fillStyle = muted; c.textAlign = 'left'; c.font = '600 16px ' + fb;
        c.fillText('son 20 ölçüm', sx, sy - 12);
      }
      function dongu(now){
        raf = 0;
        if (destroyed) return;
        ciz(now);
        raf = requestAnimationFrame(dongu);
      }

      if (typeof ResizeObserver !== 'undefined') {
        ro = new ResizeObserver(boyutla); ro.observe(cv);
      } else { onWin = boyutla; window.addEventListener('resize', onWin); }
      if (api.hint) { try { api.hint('Ölç, sonra tekrar ölç: çökmüş durum değişmez.'); } catch (e) {} }
      t0 = performance.now();
      guncelle(); boyutla();
      if (params.olcTekrar) { olc(); tmo = setTimeout(function(){ tmo = 0; if (!destroyed) tekrarOlc(); }, 600); }
      raf = requestAnimationFrame(dongu);

      return {
        destroy: function(){
          destroyed = true;
          if (raf) { cancelAnimationFrame(raf); raf = 0; }
          if (tmo) { clearTimeout(tmo); tmo = 0; }
          if (ro) { try { ro.disconnect(); } catch (e) {} ro = null; }
          if (onWin) { window.removeEventListener('resize', onWin); onWin = null; }
          host.innerHTML = '';
        },
        getState: function(){ return { c1sq: c1sq, cokmus: collapsed, sayac: sayac.slice(), gecmis: gecmis.slice(), tekrarAyni: tekrarYapti, yuz: yuzYapti }; },
        set: function(p){
          if (p && p.c1sq != null) {
            c1sq = clamp(+p.c1sq, 0, 1); sl.value = String(c1sq); hazirla(); sonMetin = ''; guncelle();
          }
          if (p && p.olcTekrar) { olc(); tekrarOlc(); }
        }
      };
    }
  };
  if (typeof Q !== 'undefined' && Q.sim && Q.sim.register) Q.sim.register('olcum', impl);
})();
