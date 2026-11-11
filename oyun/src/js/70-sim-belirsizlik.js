/* 70-sim-belirsizlik.js (S11) Dalga paketi ve belirsizlik. Yalnızca Q.sim.register çağırır. */
(function(){
  'use strict';
  var HBAR = 1.0546e-34; // J·s

  Q.sim.register('belirsizlik', {
    mount: function(host, params, api){
      params = params || {};
      api = api || {};
      var base = params.baslangic || {};
      function num(v, d){ v = Number(v); return isFinite(v) ? v : d; }
      function clampS(v){ return Math.min(5, Math.max(0.5, v)); }
      var st = { sx: clampS(num(params.sx != null ? params.sx : base.sx, 3)), eslenik: true };
      var doneCalled = false, destroyed = false, tweenRaf = 0, sawNarrow = false;
      var reduce = false;
      try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

      function css(n, d){
        var v = ''; try { v = getComputedStyle(host).getPropertyValue(n).trim(); } catch (e) {}
        return v || d;
      }
      // sigma_p = hbar/(2 sigma_x); birim: 1e-26 kg·m/s
      function calc(){
        var sp = HBAR / (2 * st.sx * 1e-9) / 1e-26;
        return { sx: st.sx, sp: sp };
      }

      host.innerHTML = '';
      var wrap = document.createElement('div');
      wrap.style.cssText = 'display:flex;flex-direction:column;gap:8px;width:100%';
      var cv = document.createElement('canvas');
      cv.style.cssText = 'width:100%;display:block;border-radius:8px';
      cv.setAttribute('role', 'img');
      cv.setAttribute('aria-label', 'Gauss dalga paketi ve momentum dağılımı');
      var ctl = document.createElement('div');
      ctl.style.cssText = 'display:flex;flex-wrap:wrap;gap:10px;align-items:center';
      var lab = document.createElement('label');
      lab.style.cssText = 'display:flex;flex-direction:column;gap:2px;flex:2 1 200px;font-size:14px;color:' + css('--muted', '#c4b9ec');
      var labS = document.createElement('span');
      var sIn = document.createElement('input');
      sIn.type = 'range'; sIn.min = '0.5'; sIn.max = '5'; sIn.step = '0.1'; sIn.style.minHeight = '40px';
      lab.appendChild(labS); lab.appendChild(sIn);
      var tg = document.createElement('button');
      tg.type = 'button'; tg.setAttribute('aria-pressed', 'true');
      tg.style.cssText = 'min-height:40px;flex:1 1 120px;font-size:15px;cursor:pointer';
      ctl.appendChild(lab); ctl.appendChild(tg);
      wrap.appendChild(cv); wrap.appendChild(ctl); host.appendChild(wrap);
      var ctx = cv.getContext('2d');
      var W = 300, Hh = 200, dpr = 1;

      function syncUI(){
        sIn.value = st.sx;
        labS.textContent = 'Position width (konum genişliği) σx = ' + st.sx.toFixed(1) + ' nm';
        tg.textContent = 'Conjugate (eşlenik): ' + (st.eslenik ? 'açık' : 'kapalı');
        tg.setAttribute('aria-pressed', st.eslenik ? 'true' : 'false');
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

      // Gauss: dağılım exp(-x²/(2σ²)); σ standart sapma
      function panel(x0, y0, w, h, sigma, xmax, col, name, unit, sigTxt){
        var ink = css('--ink', '#fff'), mut = css('--muted', '#c4b9ec');
        var base = y0 + h - 14, amp = h - 34, cx = x0 + w / 2, px = w / (2 * xmax), i, x, X, y;
        ctx.strokeStyle = mut; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x0, base); ctx.lineTo(x0 + w, base); ctx.stroke();
        ctx.beginPath();
        for (i = 0; i <= 120; i++) {
          x = -xmax + (2 * xmax) * i / 120;
          y = base - amp * Math.exp(-(x * x) / (2 * sigma * sigma));
          X = cx + x * px;
          if (i === 0) ctx.moveTo(X, y); else ctx.lineTo(X, y);
        }
        ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.stroke();
        ctx.lineTo(x0 + w, base); ctx.lineTo(x0, base); ctx.closePath();
        ctx.globalAlpha = 0.25; ctx.fillStyle = col; ctx.fill(); ctx.globalAlpha = 1;
        var by = base + 7;
        ctx.strokeStyle = ink; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(cx - sigma * px, by); ctx.lineTo(cx + sigma * px, by);
        ctx.moveTo(cx - sigma * px, by - 4); ctx.lineTo(cx - sigma * px, by + 4);
        ctx.moveTo(cx + sigma * px, by - 4); ctx.lineTo(cx + sigma * px, by + 4);
        ctx.stroke();
        ctx.fillStyle = ink; ctx.font = '700 12px sans-serif'; ctx.textAlign = 'left';
        ctx.fillText(name, x0 + 4, y0 + 12);
        ctx.textAlign = 'right'; ctx.fillStyle = col;
        ctx.fillText(sigTxt, x0 + w - 4, y0 + 12);
        ctx.fillStyle = mut; ctx.font = '11px sans-serif'; ctx.textAlign = 'left';
        ctx.fillText(unit, x0 + 4, y0 + h - 1);
      }

      function draw(){
        var c = calc();
        var sky = css('--sky', '#120a30'), cy = css('--cyan', '#00e5ff'), mg = css('--magenta', '#ff3df0'),
            yel = css('--yellow', '#ffd23f'), ink = css('--ink', '#fff'), mut = css('--muted', '#c4b9ec');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, W, Hh);
        ctx.fillStyle = sky; ctx.fillRect(0, 0, W, Hh);
        var pw = W - 16, strip = 22;
        var avail = Hh - strip - 4;
        var ph = st.eslenik ? avail / 2 : avail;
        panel(8, 2, pw, ph, c.sx, 8, cy, '|ψ(x)|²  konum', 'x (nm)', 'σx = ' + c.sx.toFixed(1) + ' nm');
        if (st.eslenik) panel(8, 2 + ph, pw, ph, c.sp, 12, mg, '|φ(p)|²  momentum', 'p (10⁻²⁶ kg·m/s)', 'σp = ' + c.sp.toFixed(1) + ' ×10⁻²⁶');
        var gy = Hh - strip;
        ctx.strokeStyle = yel; ctx.lineWidth = 2; ctx.strokeRect(8, gy, pw, strip - 3);
        ctx.fillStyle = ink; ctx.font = '700 13px sans-serif'; ctx.textAlign = 'left';
        ctx.fillText('σx·σp = ħ/2', 14, gy + 14);
        ctx.fillStyle = mut; ctx.font = '11px sans-serif'; ctx.textAlign = 'right';
        ctx.fillText('Alet kusuru değil', 8 + pw - 6, gy + 14);
      }

      function check(){
        if (st.sx <= 1.0 && st.eslenik) sawNarrow = true;
        if (!params.basari || doneCalled) return;
        if (params.basari.dar && st.sx <= 1.0 && st.eslenik) {
          doneCalled = true;
          var c = calc();
          if (api.done) api.done({ basari: true, olcum: { sx: st.sx, sp: c.sp } });
        }
      }

      function update(){ syncUI(); draw(); check(); }
      function onS(){ st.sx = clampS(num(sIn.value, st.sx)); update(); }
      function onT(){ st.eslenik = !st.eslenik; update(); }
      sIn.addEventListener('input', onS);
      tg.addEventListener('click', onT);

      var ro = null;
      if (typeof ResizeObserver !== 'undefined') { ro = new ResizeObserver(resize); ro.observe(host); }
      else window.addEventListener('resize', resize);

      if (api.hint) api.hint('Konumu daralt: momentum yayılır. Çarpım hep ħ/2.');
      syncUI(); resize(); check();

      return {
        destroy: function(){
          destroyed = true;
          if (tweenRaf) cancelAnimationFrame(tweenRaf);
          if (ro) ro.disconnect(); else window.removeEventListener('resize', resize);
          sIn.removeEventListener('input', onS);
          tg.removeEventListener('click', onT);
          host.innerHTML = '';
        },
        getState: function(){ var c = calc(); return { sx: st.sx, sp: c.sp, eslenik: st.eslenik, dar: sawNarrow }; },
        set: function(p){
          p = p || {};
          if (p.sx == null) return;
          var s0 = st.sx, s1 = clampS(num(p.sx, st.sx));
          if (tweenRaf) cancelAnimationFrame(tweenRaf);
          var t0 = 0;
          function tw(ts){
            if (destroyed) return;
            if (!t0) t0 = ts;
            var t = reduce ? 1 : Math.min(1, (ts - t0) / 1000);
            st.sx = s0 + (s1 - s0) * t;
            syncUI(); draw();
            if (t < 1) tweenRaf = requestAnimationFrame(tw); else { tweenRaf = 0; check(); }
          }
          tweenRaf = requestAnimationFrame(tw);
        }
      };
    }
  });
})();
