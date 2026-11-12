/* 70-sim-kuyu.js (S8) Sonsuz potansiyel kuyusu / gitar teli.
 * Yalnızca Q.sim.register("kuyu", ...) çağırır. Bağımlılık: 00-q.js (Q.sim). */
(function () {
  'use strict';

  var SUB = ['₀', '₁', '₂', '₃', '₄'];
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function energy(n, L) { return 0.376 * n * n / (L * L); } /* eV, L nm */
  function fmtE(e) { return e >= 1 ? e.toFixed(2) + ' eV' : (e * 1000).toFixed(1) + ' meV'; }

  function mount(host, params, api) {
    params = params || {};
    var base = params.baslangic || {};
    var L = clamp(+(base.L != null ? base.L : (params.L != null ? params.L : 2)) || 2, 1, 10);
    var n = clamp(Math.round(+(base.n != null ? base.n : (params.n != null ? params.n : 1)) || 1), 1, 4);
    var mod = (base.mod || params.mod) === 'tel' ? 'tel' : 'kuyu';
    var basari = params.basari || null;
    var doneFired = false, destroyed = false, flat = false, maxL = L;
    var shownL = L, shownN = n, amp = 1; /* amp: 1 = dalga, 0 = düz çizgi (n=0 denemesi) */
    var raf = 0, timers = [], listeners = [];
    var reduce = false;
    try { reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { reduce = false; }

    function on(el, ev, fn) { el.addEventListener(ev, fn); listeners.push([el, ev, fn]); }

    host.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;gap:8px;width:100%;color:var(--ink);font-family:var(--font-b);';
    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'display:block;width:100%;border-radius:var(--rs);background:var(--sky);';
    canvas.setAttribute('role', 'img');
    var ctrl = document.createElement('div');
    ctrl.style.cssText = 'display:flex;flex-direction:column;gap:6px;';
    wrap.appendChild(canvas); wrap.appendChild(ctrl);
    host.appendChild(wrap);

    function row() {
      var r = document.createElement('div');
      r.style.cssText = 'display:flex;gap:6px;align-items:center;';
      ctrl.appendChild(r); return r;
    }
    function lab(txt, r) {
      var s = document.createElement('span');
      s.textContent = txt; s.style.cssText = 'font-family:var(--font-d);font-size:15px;min-width:92px;';
      r.appendChild(s); return s;
    }
    function mkBtn(txt, flex) {
      var b = document.createElement('button');
      b.type = 'button'; b.textContent = txt;
      b.style.cssText = 'min-height:40px;min-width:40px;flex:' + (flex || 1) + ';border:2px solid var(--line);border-radius:var(--rs);background:var(--panel2);color:var(--ink);font-family:var(--font-d);font-size:16px;cursor:pointer;';
      return b;
    }
    function styleBtn(b, act) {
      b.style.background = act ? 'var(--sel)' : 'var(--panel2)';
      b.style.borderColor = act ? 'var(--cyan)' : 'var(--line)';
      b.setAttribute('aria-pressed', act ? 'true' : 'false');
    }

    /* 1) L kaydırıcısı */
    var r1 = row();
    lab('Well width (kuyu genişliği) L', r1);
    var slider = document.createElement('input');
    slider.type = 'range'; slider.min = '1'; slider.max = '10'; slider.step = '0.5'; slider.value = String(L);
    slider.style.cssText = 'flex:1;min-height:40px;accent-color:var(--cyan);';
    slider.setAttribute('aria-label', 'Well width (kuyu genişliği) L (nm)');
    r1.appendChild(slider);
    var lVal = document.createElement('span');
    lVal.style.cssText = 'font-family:var(--font-d);min-width:56px;text-align:right;';
    r1.appendChild(lVal);

    /* 2) n düğmeleri + n=0 dene */
    var r2 = row();
    lab('Level (seviye) n', r2);
    var nBtns = [1, 2, 3, 4].map(function (k) {
      var b = mkBtn(String(k), 1);
      b.setAttribute('aria-label', 'Level (seviye) n = ' + k);
      on(b, 'click', function () { n = k; shownN = k; flat = false; amp = 1; refresh(); });
      r2.appendChild(b); return b;
    });
    var zeroBtn = mkBtn('n = 0 dene', 2);
    on(zeroBtn, 'click', tryZero);
    r2.appendChild(zeroBtn);

    /* 3) Tel <-> Kuyu */
    var modBtn = mkBtn('', 2);
    on(modBtn, 'click', function () { mod = mod === 'kuyu' ? 'tel' : 'kuyu'; refresh(); });
    r2.style.flexWrap = 'wrap';
    r2.appendChild(modBtn);  /* ayri satir yerine seviye satirinda: 1366x768 dock'a sigsin */

    on(slider, 'input', function () { L = clamp(+slider.value, 1, 10); shownL = L; flat = false; amp = 1; refresh(); });

    function tryZero() {
      if (destroyed) { return; }
      flat = true;
      animAmp(0);
      refresh();
      finishCheck({ n0Dene: true });
    }

    function animAmp(target) {
      cancelAnimationFrame(raf);
      if (reduce) { amp = target; draw(); return; }
      var from = amp, t0 = null;
      function step(ts) {
        if (destroyed) { return; }
        if (t0 === null) { t0 = ts; }
        var p = Math.min(1, (ts - t0) / 500);
        amp = from + (target - from) * p;
        draw();
        if (p < 1) { raf = requestAnimationFrame(step); }
      }
      raf = requestAnimationFrame(step);
    }

    /* olay: { n0Dene:true } veya {} (durum kontrolü) */
    function finishCheck(ev) {
      if (doneFired || !basari || destroyed) { return; }
      maxL = Math.max(maxL, L);
      var ok = false;
      if (basari.L != null && basari.n != null && !flat && L === +basari.L && n === +basari.n) { ok = true; }
      if (basari.n0Dene && ev && ev.n0Dene) { ok = true; }
      if (basari.yariya && !flat && maxL >= 2 && L <= 1) { ok = true; }
      if (ok) {
        doneFired = true;
        api.done({ basari: true, olcum: { L: L, n: n, E1: +energy(1, L).toFixed(4), n0Dene: !!(ev && ev.n0Dene), yariya: maxL >= 2 && L <= 1 } });
      }
    }

    function refresh() {
      if (destroyed) { return; }
      slider.value = String(L);
      lVal.textContent = (Math.round(L * 10) / 10) + ' nm';
      nBtns.forEach(function (b, k) { styleBtn(b, !flat && n === k + 1); });
      zeroBtn.style.borderColor = flat ? 'var(--yellow)' : 'var(--line)';
      modBtn.textContent = mod === 'tel' ? 'Wire (Tel) ⇄ Well (Kuyu): Wire' : 'Wire (Tel) ⇄ Well (Kuyu): Well';
      styleBtn(modBtn, false);
      canvas.setAttribute('aria-label', flat ? 'No wave (dalga yok), no particle (parçacık yok)'
        : (mod === 'tel' ? 'Wire (iki ucu sabit tel)' : 'Infinite well (sonsuz kuyu)') + ', n = ' + n + ', L = ' + L + ' nm, E' + SUB[n] + ' = ' + fmtE(energy(n, L)));
      if (!flat) { amp = 1; }
      draw();
      finishCheck(null);
    }

    function cssVar(nm, fb) {
      var v = ''; try { v = getComputedStyle(host).getPropertyValue(nm).trim(); } catch (e) { v = ''; }
      return v || fb;
    }
    var W = 300, H = 200;
    function resize() {
      if (destroyed) { return; }
      var dpr = window.devicePixelRatio || 1;
      W = Math.max(220, host.clientWidth || 300);
      var ih = window.innerHeight || 800;
      H = ih <= 800 ? Math.max(100, Math.round(ih * 0.14)) : Math.max(150, Math.min(260, Math.round(ih * 0.2)));
      canvas.style.height = H + 'px';
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      canvas.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }

    function draw() {
      if (destroyed) { return; }
      var ctx = canvas.getContext('2d');
      var ink = cssVar('--ink', '#fff'), muted = cssVar('--muted', '#c4b9ec');
      var cy = cssVar('--cyan', '#00e5ff'), mg = cssVar('--magenta', '#ff3df0'), yel = cssVar('--yellow', '#ffd23f');
      var fd = cssVar('--font-d', 'sans-serif');
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = cssVar('--sky', '#120a30'); ctx.fillRect(0, 0, W, H);

      var ladderW = Math.min(86, W * 0.24);
      var area0 = 12, area1 = W - ladderW - 12;
      var cx = (area0 + area1) / 2;
      var half = (area1 - area0 - 16) / 2 * (0.25 + 0.75 * (shownL - 1) / 9); /* L kaydıkça görsel genişlik değişir */
      var x0 = cx - half, x1 = cx + half;
      var top = 26, y0 = H - 42, hw = (y0 - top) * 0.62;
      var i, N = 120, x, s;

      ctx.strokeStyle = muted; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(area0, y0); ctx.lineTo(area1, y0); ctx.stroke(); ctx.setLineDash([]);

      if (mod === 'kuyu') {
        ctx.strokeStyle = ink; ctx.lineWidth = 5; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(x0, top - 8); ctx.lineTo(x0, y0 + 16); ctx.moveTo(x1, top - 8); ctx.lineTo(x1, y0 + 16); ctx.stroke();
        ctx.globalAlpha = 0.3 * amp; ctx.fillStyle = mg;
        ctx.beginPath(); ctx.moveTo(x0, y0);
        for (i = 0; i <= N; i++) { x = x0 + (x1 - x0) * i / N; s = Math.sin(shownN * Math.PI * i / N); ctx.lineTo(x, y0 - s * s * hw * 1.2); }
        ctx.lineTo(x1, y0); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
        ctx.strokeStyle = mg; ctx.lineWidth = 1.5; ctx.beginPath();
        for (i = 0; i <= N; i++) { x = x0 + (x1 - x0) * i / N; s = Math.sin(shownN * Math.PI * i / N); if (i) { ctx.lineTo(x, y0 - s * s * hw * 1.2 * amp); } else { ctx.moveTo(x, y0); } }
        ctx.stroke();
      } else {
        ctx.fillStyle = ink;
        ctx.fillRect(x0 - 5, y0 - 16, 8, 32); ctx.fillRect(x1 - 3, y0 - 16, 8, 32);
      }
      ctx.strokeStyle = cy; ctx.lineWidth = mod === 'tel' ? 2.5 : 3; ctx.lineJoin = 'round';
      ctx.beginPath();
      for (i = 0; i <= N; i++) {
        x = x0 + (x1 - x0) * i / N;
        s = Math.sin(shownN * Math.PI * i / N) * amp;
        if (i) { ctx.lineTo(x, y0 - s * hw * 0.7); } else { ctx.moveTo(x, y0 - s * hw * 0.7); }
      }
      ctx.stroke();
      if (mod === 'tel') {
        ctx.globalAlpha = 0.35; ctx.beginPath();
        for (i = 0; i <= N; i++) { x = x0 + (x1 - x0) * i / N; s = Math.sin(shownN * Math.PI * i / N) * amp; if (i) { ctx.lineTo(x, y0 + s * hw * 0.7); } else { ctx.moveTo(x, y0 + s * hw * 0.7); } }
        ctx.stroke(); ctx.globalAlpha = 1;
      }

      ctx.fillStyle = ink; ctx.font = '700 13px ' + fd; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
      ctx.fillText('L = ' + (Math.round(shownL * 10) / 10) + ' nm', cx, H - 8);
      ctx.textAlign = 'left'; ctx.fillStyle = cy; ctx.fillText('ψ', area0 + 4, 16);
      if (mod === 'kuyu') { ctx.fillStyle = mg; ctx.fillText('|ψ|²', area0 + 24, 16); }
      if (flat) {
        ctx.fillStyle = yel; ctx.font = '700 15px ' + fd; ctx.textAlign = 'center';
        ctx.fillText('No wave (dalga yok) → no particle (parçacık yok)', cx, top + 10);
      }

      /* enerji merdiveni (sağ şerit) */
      var lx0 = W - ladderW, lx1 = W - 8, ly0 = H - 24, ly1 = 24, emax = energy(4, 1);
      ctx.strokeStyle = muted; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(lx0 - 4, ly1 - 6); ctx.lineTo(lx0 - 4, ly0 + 2); ctx.stroke();
      ctx.textBaseline = 'middle';
      for (var k = 1; k <= 4; k++) {
        var e = energy(k, shownL), yy = ly0 - (ly0 - ly1) * Math.min(1, e / emax);
        var act = k === n && !flat;
        ctx.strokeStyle = act ? yel : muted; ctx.lineWidth = act ? 4 : 2; ctx.globalAlpha = act ? 1 : 0.55;
        ctx.beginPath(); ctx.moveTo(lx0, yy); ctx.lineTo(lx1 - 14, yy); ctx.stroke();
        ctx.fillStyle = act ? yel : muted; ctx.font = (act ? '700 13px ' : '12px ') + fd; ctx.textAlign = 'left';
        ctx.fillText(String(k), lx1 - 11, yy);
        ctx.globalAlpha = 1;
      }
      ctx.textBaseline = 'top'; ctx.textAlign = 'right'; ctx.fillStyle = yel; ctx.font = '700 16px ' + fd;
      ctx.fillText(flat ? 'E = ?' : 'E' + SUB[n] + ' = ' + fmtE(energy(n, shownL)), W - 8, 4);
    }

    var ro = null;
    if (typeof ResizeObserver !== 'undefined') { ro = new ResizeObserver(function () { resize(); }); ro.observe(host); }
    else { on(window, 'resize', resize); }

    if (api && api.hint) { api.hint('Well\'i (kuyuyu) daralt, level (seviye) değiştir; energy (enerji) değerine bak.'); }
    resize();
    refresh();

    return {
      destroy: function () {
        destroyed = true;
        cancelAnimationFrame(raf);
        timers.forEach(clearTimeout); timers = [];
        listeners.forEach(function (l) { l[0].removeEventListener(l[1], l[2]); });
        listeners = [];
        if (ro) { ro.disconnect(); ro = null; }
        host.innerHTML = '';
      },
      getState: function () {
        return { L: L, n: n, mod: mod, E: flat ? null : energy(n, L), dalgaYok: flat };
      },
      set: function (p) {
        if (!p || destroyed) { return; }
        if (p.mod) { mod = p.mod === 'tel' ? 'tel' : 'kuyu'; }
        if (p.basari) { basari = p.basari; }
        var tL = p.L != null ? clamp(+p.L, 1, 10) : L;
        var tN = p.n != null ? clamp(Math.round(+p.n), 1, 4) : n;
        flat = false; amp = 1;
        cancelAnimationFrame(raf);
        var fL = shownL, fN = shownN, t0 = null;
        function end() { L = tL; n = tN; shownL = L; shownN = n; refresh(); }
        if (reduce) { end(); return; }
        n = tN;
        function step(ts) {
          if (destroyed) { return; }
          if (t0 === null) { t0 = ts; }
          var q = Math.min(1, (ts - t0) / 1000), e = q * (2 - q);
          shownL = fL + (tL - fL) * e; shownN = fN + (tN - fN) * e;
          slider.value = String(shownL);
          lVal.textContent = (Math.round(shownL * 10) / 10) + ' nm';
          draw();
          if (q < 1) { raf = requestAnimationFrame(step); } else { end(); }
        }
        raf = requestAnimationFrame(step);
      }
    };
  }

  Q.sim.register('kuyu', { mount: mount });
})();
