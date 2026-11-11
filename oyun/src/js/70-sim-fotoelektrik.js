/* 70-sim-fotoelektrik.js (S6) Fotoelektrik olay simülasyonu. Yalnızca Q.sim.register çağırır. */
(function(){
  'use strict';
  var H = 4.136e-15; // eV·s
  var METAL = { Cs: 2.1, Na: 2.3, Zn: 4.3 };

  Q.sim.register('fotoelektrik', {
    mount: function(host, params, api){
      params = params || {};
      api = api || {};
      var base = params.baslangic || {};
      function num(v, d){ v = Number(v); return isFinite(v) ? v : d; }
      var mk0 = params.metal || base.metal;
      var st = {
        f: num(params.f != null ? params.f : base.f, 3),
        I: num(params.I != null ? params.I : base.I, 5),
        metal: METAL[mk0] ? mk0 : 'Cs'
      };
      var doneCalled = false, destroyed = false, raf = 0, tweenRaf = 0, last = 0;
      var photons = [], elecs = [], acc = 0;
      var reduce = false;
      try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

      function css(n, d){
        var v = ''; try { v = getComputedStyle(host).getPropertyValue(n).trim(); } catch (e) {}
        return v || d;
      }
      function calc(){
        var phi = METAL[st.metal], e = H * st.f * 1e14;
        var ok = e >= phi;
        return { phi: phi, e: e, ok: ok, K: ok ? e - phi : 0, n: ok ? Math.round(st.I * 10) : 0 };
      }

      host.innerHTML = '';
      var wrap = document.createElement('div');
      wrap.style.cssText = 'display:flex;flex-direction:column;gap:8px;width:100%';
      var cv = document.createElement('canvas');
      cv.style.cssText = 'width:100%;display:block;border-radius:8px';
      cv.setAttribute('role', 'img');
      cv.setAttribute('aria-label', 'Photoelectric effect (fotoelektrik olay) simulation');
      var ctl = document.createElement('div');
      ctl.style.cssText = 'display:flex;flex-wrap:wrap;gap:10px;align-items:center';
      function mk(label, input){
        var l = document.createElement('label');
        l.style.cssText = 'display:flex;flex-direction:column;gap:2px;flex:1 1 140px;font-size:14px;color:' + css('--muted', '#c4b9ec');
        var s = document.createElement('span'); s.textContent = label;
        l.appendChild(s); l.appendChild(input); input.style.minHeight = '40px';
        return { l: l, s: s };
      }
      var fIn = document.createElement('input');
      fIn.type = 'range'; fIn.min = '1'; fIn.max = '10'; fIn.step = '0.1';
      var iIn = document.createElement('input');
      iIn.type = 'range'; iIn.min = '1'; iIn.max = '10'; iIn.step = '1';
      var mSel = document.createElement('select');
      mSel.style.fontSize = '16px';
      ['Cs', 'Na', 'Zn'].forEach(function(k){
        var o = document.createElement('option'); o.value = k;
        o.textContent = k + ' ' + METAL[k] + ' eV';
        mSel.appendChild(o);
      });
      var fC = mk('Frequency (frekans)', fIn), iC = mk('Intensity (şiddet)', iIn), mC = mk('Metal', mSel);
      ctl.appendChild(fC.l); ctl.appendChild(iC.l); ctl.appendChild(mC.l);
      wrap.appendChild(cv); wrap.appendChild(ctl); host.appendChild(wrap);
      var ctx = cv.getContext('2d');
      var W = 300, Hh = 200, dpr = 1;

      function syncUI(){
        fIn.value = st.f; iIn.value = st.I; mSel.value = st.metal;
        fC.s.textContent = 'Frequency ' + st.f.toFixed(1) + '×10¹⁴ Hz';
        iC.s.textContent = 'Intensity ' + Math.round(st.I);
      }

      function resize(){
        var w = Math.max(240, host.clientWidth || 320);
        var h = Math.max(180, Math.min(260, (window.innerHeight || 800) * 0.22));
        dpr = window.devicePixelRatio || 1;
        W = w; Hh = h;
        cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
        cv.style.height = h + 'px';
        draw();
      }

      function lightColor(f){
        var t = Math.min(1, Math.max(0, (f - 1) / 9));
        return 'hsl(' + Math.round(10 + t * 270) + ',100%,60%)';
      }

      function draw(){
        var c = calc();
        var sky = css('--sky', '#120a30'), yel = css('--yellow', '#ffd23f'), cy = css('--cyan', '#00e5ff'),
            ink = css('--ink', '#fff'), mut = css('--muted', '#c4b9ec');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, W, Hh);
        ctx.fillStyle = sky; ctx.fillRect(0, 0, W, Hh);
        var top = 8, bot = Hh - 56, mid = (top + bot) / 2;
        var plateX = W * 0.46, colX = W * 0.9;
        ctx.fillStyle = lightColor(st.f);
        ctx.globalAlpha = 0.35 + 0.065 * st.I;
        ctx.beginPath(); ctx.arc(14, mid, 12 + st.I, 0, 6.2832); ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = mut; ctx.fillRect(plateX, top + 6, 10, bot - top - 12);
        ctx.fillStyle = ink; ctx.font = '700 13px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(st.metal, plateX + 5, top + 4);
        ctx.strokeStyle = cy; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(colX, top + 6); ctx.lineTo(colX, bot - 6); ctx.stroke();
        ctx.fillStyle = yel;
        photons.forEach(function(p){ ctx.beginPath(); ctx.arc(p.x * W, p.y, 3, 0, 6.2832); ctx.fill(); });
        ctx.fillStyle = cy;
        elecs.forEach(function(e){ ctx.beginPath(); ctx.arc(e.x * W, e.y, 4, 0, 6.2832); ctx.fill(); });
        ctx.fillStyle = mut; ctx.font = '12px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('hf = ' + c.e.toFixed(2) + ' eV  |  φ = ' + c.phi.toFixed(1) + ' eV', W * 0.5, Hh - 46);
        var gy = Hh - 40, gw = (W - 24) / 2;
        box(8, gy, gw, 34, 'Electrons/s', String(c.n), c.ok ? cy : mut);
        box(16 + gw, gy, gw, 34, 'Kinetic energy (eV)', c.K.toFixed(2), c.ok ? yel : mut);
        function box(x, y, w, h, lab, val, col){
          ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
          ctx.fillStyle = mut; ctx.font = '12px sans-serif'; ctx.textAlign = 'left';
          ctx.fillText(lab, x + 6, y + 13);
          ctx.fillStyle = ink; ctx.font = '700 16px sans-serif';
          ctx.fillText(val, x + 6, y + 29);
        }
      }

      function step(ts){
        if (destroyed) return;
        var dt = last ? Math.min(0.05, (ts - last) / 1000) : 0.016; last = ts;
        var c = calc();
        var top = 8, bot = Hh - 56, plateFrac = 0.46, colFrac = 0.9;
        acc += dt * (1.5 + st.I * 1.5);
        while (acc >= 1) {
          acc -= 1;
          photons.push({ x: 0.05, y: top + 10 + Math.random() * (bot - top - 20) });
        }
        var i, j;
        for (i = photons.length - 1; i >= 0; i--) {
          var p = photons[i]; p.x += dt * 0.5;
          if (p.x >= plateFrac) {
            if (c.ok && Math.random() < 0.7) {
              elecs.push({ x: plateFrac + 0.02, y: p.y, v: 0.12 + Math.sqrt(c.K) * 0.2 });
            }
            photons.splice(i, 1);
          }
        }
        for (j = elecs.length - 1; j >= 0; j--) {
          elecs[j].x += dt * elecs[j].v;
          if (elecs[j].x >= colFrac) elecs.splice(j, 1);
        }
        draw();
        raf = requestAnimationFrame(step);
      }

      function check(){
        if (!params.basari || doneCalled) return;
        var c = calc(), b = params.basari, ok = false;
        if (b.esikAlti) ok = !c.ok && c.n === 0 && Math.round(st.I) >= (b.siddet || 10);
        else if (b.kinetik) ok = c.ok && c.K >= b.kinetik[0] && c.K <= b.kinetik[1];
        if (ok) {
          doneCalled = true;
          if (api.done) api.done({ basari: true, olcum: { f: st.f, I: st.I, metal: st.metal, K: c.K, n: c.n } });
        }
      }

      function update(){ syncUI(); if (reduce) draw(); check(); }
      function onF(){ st.f = num(fIn.value, st.f); update(); }
      function onI(){ st.I = num(iIn.value, st.I); update(); }
      function onM(){ st.metal = mSel.value; update(); }
      fIn.addEventListener('input', onF);
      iIn.addEventListener('input', onI);
      mSel.addEventListener('change', onM);

      var ro = null;
      if (typeof ResizeObserver !== 'undefined') { ro = new ResizeObserver(resize); ro.observe(host); }
      else window.addEventListener('resize', resize);

      if (api.hint) api.hint('Işığın frequency (frekans) değeri electron (elektron) energy (enerji) değerini belirler, intensity (şiddet) yalnızca electron sayısını.');
      syncUI(); resize();
      var k, q;
      for (k = 0; k < 8; k++) photons.push({ x: 0.05 + k * 0.05, y: 14 + (k * 37) % 90 });
      if (calc().ok) for (q = 0; q < 5; q++) elecs.push({ x: 0.5 + q * 0.08, y: 20 + (q * 29) % 90, v: 0.2 });
      draw();
      if (!reduce) raf = requestAnimationFrame(step);
      check();

      return {
        destroy: function(){
          destroyed = true;
          if (raf) cancelAnimationFrame(raf);
          if (tweenRaf) cancelAnimationFrame(tweenRaf);
          if (ro) ro.disconnect(); else window.removeEventListener('resize', resize);
          fIn.removeEventListener('input', onF);
          iIn.removeEventListener('input', onI);
          mSel.removeEventListener('change', onM);
          host.innerHTML = '';
        },
        getState: function(){ var c = calc(); return { f: st.f, I: st.I, metal: st.metal, K: c.K, n: c.n }; },
        set: function(p){
          p = p || {};
          if (p.metal && METAL[p.metal]) st.metal = p.metal;
          var f0 = st.f, i0 = st.I;
          var f1 = p.f != null ? num(p.f, st.f) : st.f, i1 = p.I != null ? num(p.I, st.I) : st.I;
          if (tweenRaf) cancelAnimationFrame(tweenRaf);
          var t0 = 0;
          function tw(ts){
            if (destroyed) return;
            if (!t0) t0 = ts;
            var t = reduce ? 1 : Math.min(1, (ts - t0) / 1000);
            st.f = f0 + (f1 - f0) * t; st.I = i0 + (i1 - i0) * t;
            syncUI(); if (reduce) draw();
            if (t < 1) tweenRaf = requestAnimationFrame(tw); else { tweenRaf = 0; check(); }
          }
          tweenRaf = requestAnimationFrame(tw);
        }
      };
    }
  });
})();
