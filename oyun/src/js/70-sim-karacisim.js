/* 70-sim-karacisim.js · Simülasyon S5: kara cisim ışıması (Planck ve Rayleigh-Jeans).
 * Ekler: Q.sim.register("karacisim", {mount}). Başka bir şey yapmaz.
 * Bağlı: 00-q.js (Q.sim.register), 05 §1.1 renk tokenları (CSS değişkenleri).
 * params: T (K), baslangic {T, klasikGoster}, basari {T:[lo,hi], klasikGoster:true}.
 */
(function(){
  'use strict';
  var Q = window.Q;
  var H = 6.62607015e-34, C = 2.99792458e8, K = 1.380649e-23, WIEN = 2.897771955e-3;
  var LMIN = 100, LMAX = 3000, YMAX = 1.25;
  var TMIN = 2000, TMAX = 7000;

  function planck(l, T){ // l metre
    var x = H*C/(l*K*T);
    return (2*H*C*C/Math.pow(l,5)) / (Math.exp(x) - 1);
  }
  function rj(l, T){ return 2*C*K*T/Math.pow(l,4); }
  function planckPeak(T){ return planck(WIEN/T, T); }
  function lambdaMaxNm(T){ return WIEN/T*1e9; }

  // Kara cisim rengi (yaklaşık, Tanner Helland yöntemi)
  function bbColor(T){
    var t = T/100, r, g, b;
    r = t <= 66 ? 255 : 329.698727446*Math.pow(t-60, -0.1332047592);
    g = t <= 66 ? 99.4708025861*Math.log(t) - 161.1195681661 : 288.1221695283*Math.pow(t-60, -0.0755148492);
    b = t >= 66 ? 255 : (t <= 19 ? 0 : 138.5177312231*Math.log(t-10) - 305.0447927307);
    function cl(v){ return Math.max(0, Math.min(255, Math.round(v))); }
    return 'rgb(' + cl(r) + ',' + cl(g) + ',' + cl(b) + ')';
  }

  function tok(name, fb){
    var v = '';
    try { v = getComputedStyle(document.documentElement).getPropertyValue(name).trim(); } catch(e){}
    return v || fb;
  }

  function mount(host, params, api){
    params = params || {};
    var base = params.baslangic || {};
    var T = clampT(base.T != null ? base.T : (params.T != null ? params.T : 5000));
    var klasik = !!base.klasikGoster;
    var basari = params.basari || null;
    var doneCalled = false;
    var raf = 0, destroyed = false;
    var reduce = false;
    try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch(e){}

    function clampT(v){ v = Math.round(v/100)*100; return Math.max(TMIN, Math.min(TMAX, v)); }

    host.textContent = '';
    var wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;gap:10px;width:100%;';
    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'display:block;width:100%;height:clamp(180px,22vh,260px);border-radius:var(--rs,8px);';
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'Blackbody (kara cisim) radiation curve: Planck and classical');
    var ctrls = document.createElement('div');
    ctrls.style.cssText = 'display:flex;flex-wrap:wrap;align-items:center;gap:12px;';

    var lab = document.createElement('label');
    lab.style.cssText = 'display:flex;align-items:center;gap:10px;flex:1 1 220px;min-height:40px;color:var(--ink,#fff);font-size:var(--fs-small,14px);';
    var labTxt = document.createElement('span');
    labTxt.textContent = 'Temperature (sıcaklık)';
    var sl = document.createElement('input');
    sl.type = 'range'; sl.min = TMIN; sl.max = TMAX; sl.step = 100; sl.value = T;
    sl.style.cssText = 'flex:1;min-height:40px;accent-color:var(--cyan,#00e5ff);';
    sl.setAttribute('aria-label', 'Temperature (sıcaklık) (K)');
    var val = document.createElement('span');
    val.style.cssText = 'min-width:56px;text-align:right;font-weight:700;';
    lab.appendChild(labTxt); lab.appendChild(sl); lab.appendChild(val);

    var tg = document.createElement('button');
    tg.type = 'button';
    tg.textContent = 'Classical curve (klasik eğri)';
    tg.style.cssText = 'min-height:40px;padding:0 14px;border-radius:var(--rs,8px);border:var(--bw,3px) solid var(--line,#f4f0ff);background:var(--panel2,#25164f);color:var(--ink,#fff);font:inherit;font-size:var(--fs-small,14px);font-weight:700;cursor:pointer;';

    ctrls.appendChild(lab); ctrls.appendChild(tg);
    wrap.appendChild(canvas); wrap.appendChild(ctrls);
    host.appendChild(wrap);

    function syncToggle(){
      tg.setAttribute('aria-pressed', klasik ? 'true' : 'false');
      tg.style.background = klasik ? 'var(--magenta,#ff3df0)' : 'var(--panel2,#25164f)';
      tg.style.color = klasik ? 'var(--ink-dark,#0b0620)' : 'var(--ink,#fff)';
    }

    var W = 0, Hh = 0, dpr = 1, ctx = canvas.getContext('2d');
    function resize(){
      var r = canvas.getBoundingClientRect();
      dpr = window.devicePixelRatio || 1;
      W = Math.max(120, Math.round(r.width)); Hh = Math.max(120, Math.round(r.height));
      canvas.width = Math.round(W*dpr); canvas.height = Math.round(Hh*dpr);
      draw();
    }

    function draw(){
      if (destroyed || !ctx) return;
      var fb = tok('--font-b','sans-serif');
      var cSky = tok('--sky','#120a30'), cCyan = tok('--cyan','#00e5ff'), cRed = tok('--red','#ff4d6d'),
          cInk = tok('--ink','#ffffff'), cMuted = tok('--muted','#c4b9ec'), cYellow = tok('--yellow','#ffd23f'),
          cGrid = tok('--grid','rgba(255,61,240,.22)');
      ctx.setTransform(dpr,0,0,dpr,0,0);
      ctx.clearRect(0,0,W,Hh);
      ctx.fillStyle = cSky; ctx.fillRect(0,0,W,Hh);
      var L = 40, R = 18, Tp = 12, B = 34;
      var pw = W-L-R, ph = Hh-Tp-B;
      function X(nm){ return L + (nm-LMIN)/(LMAX-LMIN)*pw; }
      function Y(v){ return Tp + ph - Math.min(v, YMAX)/YMAX*ph; }
      var i, x, v;
      ctx.lineWidth = 1; ctx.strokeStyle = cGrid; ctx.fillStyle = cMuted;
      ctx.font = '12px ' + fb; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      var xs = [500,1000,1500,2000,2500,3000];
      for (i = 0; i < xs.length; i++){
        ctx.beginPath(); ctx.moveTo(X(xs[i])+.5, Tp); ctx.lineTo(X(xs[i])+.5, Tp+ph); ctx.stroke();
        ctx.fillText(String(xs[i]), X(xs[i]), Tp+ph+4);
      }
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      var ys = [0, .5, 1];
      for (i = 0; i < ys.length; i++){
        ctx.beginPath(); ctx.moveTo(L, Y(ys[i])+.5); ctx.lineTo(L+pw, Y(ys[i])+.5); ctx.stroke();
        ctx.fillText(String(ys[i]), L-5, Y(ys[i]));
      }
      ctx.strokeStyle = cMuted; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(L, Tp); ctx.lineTo(L, Tp+ph); ctx.lineTo(L+pw, Tp+ph); ctx.stroke();
      ctx.fillStyle = cMuted; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      ctx.font = '13px ' + fb;
      ctx.fillText('Wavelength (nm)', L + pw/2, Hh-1);
      ctx.save(); ctx.translate(11, Tp+ph/2); ctx.rotate(-Math.PI/2);
      ctx.textBaseline = 'top'; ctx.fillText('Intensity (şiddet)', 0, -4); ctx.restore();

      var pk = planckPeak(T), n = Math.max(60, Math.round(pw/2));
      ctx.beginPath(); ctx.moveTo(X(LMIN), Y(0));
      for (i = 0; i <= n; i++){ x = LMIN + (LMAX-LMIN)*i/n; ctx.lineTo(X(x), Y(planck(x*1e-9,T)/pk)); }
      ctx.lineTo(X(LMAX), Y(0)); ctx.closePath();
      ctx.globalAlpha = .15; ctx.fillStyle = cCyan; ctx.fill(); ctx.globalAlpha = 1;
      if (klasik){
        ctx.beginPath(); ctx.setLineDash([7,6]); ctx.strokeStyle = cRed; ctx.lineWidth = 3;
        for (i = 0; i <= n; i++){
          x = LMIN + (LMAX-LMIN)*i/n; v = rj(x*1e-9,T)/pk;
          if (i === 0) ctx.moveTo(X(x), Y(v)); else ctx.lineTo(X(x), Y(v));
        }
        ctx.stroke(); ctx.setLineDash([]);
      }
      ctx.beginPath(); ctx.strokeStyle = cCyan; ctx.lineWidth = 3.5; ctx.lineJoin = 'round';
      for (i = 0; i <= n; i++){
        x = LMIN + (LMAX-LMIN)*i/n; v = planck(x*1e-9,T)/pk;
        if (i === 0) ctx.moveTo(X(x), Y(v)); else ctx.lineTo(X(x), Y(v));
      }
      ctx.stroke();
      var lm = lambdaMaxNm(T);
      ctx.strokeStyle = cYellow; ctx.lineWidth = 1.5; ctx.setLineDash([3,4]);
      ctx.beginPath(); ctx.moveTo(X(lm), Y(1)); ctx.lineTo(X(lm), Y(0)); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = cYellow; ctx.beginPath(); ctx.arc(X(lm), Y(1), 4.5, 0, 7); ctx.fill();
      ctx.font = '700 14px ' + fb; ctx.textBaseline = 'top'; ctx.textAlign = 'left';
      ctx.fillStyle = cCyan; ctx.fillText('— Planck', L+8, Tp+4);
      if (klasik){ ctx.fillStyle = cRed; ctx.fillText('- - Classical', L+8, Tp+22); }
      ctx.fillStyle = cYellow;
      ctx.fillText('λmax = ' + Math.round(lm) + ' nm', Math.max(L+8, Math.min(X(lm)+10, L+pw-125)), Tp+ph*0.7);
      var sw = 34, sx = L+pw-sw-6, sy = Tp+6;
      ctx.fillStyle = bbColor(T); ctx.fillRect(sx, sy, sw, sw);
      ctx.strokeStyle = cInk; ctx.lineWidth = 2; ctx.strokeRect(sx, sy, sw, sw);
      ctx.fillStyle = cInk; ctx.textAlign = 'right'; ctx.font = '700 13px ' + fb;
      ctx.fillText(Math.round(T) + ' K', sx-6, sy+9);
    }

    function updateUI(){
      val.textContent = Math.round(T) + ' K';
      sl.value = T;
      syncToggle();
    }

    function checkSuccess(){
      if (doneCalled || !basari || !api || typeof api.done !== 'function') return;
      var ok = true;
      if (basari.T) ok = ok && T >= basari.T[0] && T <= basari.T[1];
      if (basari.klasikGoster) ok = ok && klasik;
      if (ok){
        doneCalled = true;
        api.done({ basari:true, olcum:{ T:T, klasikGoster:klasik, lambdaMax:Math.round(lambdaMaxNm(T)) } });
      }
    }

    function stopAnim(){ if (raf){ cancelAnimationFrame(raf); raf = 0; } }
    function onInput(){ stopAnim(); T = clampT(+sl.value); updateUI(); draw(); checkSuccess(); }
    function onToggle(){
      klasik = !klasik; updateUI(); draw();
      if (klasik && api && api.hint) api.hint('Classical curve (klasik eğri) kısa wavelength (dalga boyu) değerinde sonsuza gider.');
      checkSuccess();
    }
    sl.addEventListener('input', onInput);
    tg.addEventListener('click', onToggle);

    var ro = null;
    if (typeof ResizeObserver !== 'undefined'){ ro = new ResizeObserver(function(){ resize(); }); ro.observe(canvas); }
    else window.addEventListener('resize', resize);

    function animateTo(target, ms){
      stopAnim();
      if (reduce || ms <= 0){ T = target; updateUI(); draw(); checkSuccess(); return; }
      var from = T, t0 = null;
      function step(ts){
        if (destroyed) return;
        if (t0 === null) t0 = ts;
        var p = Math.min(1, (ts-t0)/ms), e = p < .5 ? 2*p*p : 1-Math.pow(-2*p+2,2)/2;
        T = from + (target-from)*e;
        updateUI(); draw();
        if (p < 1) raf = requestAnimationFrame(step);
        else { raf = 0; T = target; updateUI(); draw(); checkSuccess(); }
      }
      raf = requestAnimationFrame(step);
    }

    updateUI();
    resize();
    if (api && api.hint) api.hint('Temperature (sıcaklık) değiştir, classical curve (klasik eğri) ile compare (karşılaştır).');

    return {
      destroy: function(){
        destroyed = true; stopAnim();
        sl.removeEventListener('input', onInput);
        tg.removeEventListener('click', onToggle);
        if (ro) ro.disconnect(); else window.removeEventListener('resize', resize);
        host.textContent = '';
      },
      getState: function(){ return { T:T, klasikGoster:klasik, lambdaMax:lambdaMaxNm(T) }; },
      set: function(p){
        p = p || {};
        if (p.klasikGoster != null){ klasik = !!p.klasikGoster; updateUI(); draw(); }
        if (p.T != null) animateTo(clampT(p.T), 1000); else checkSuccess();
      }
    };
  }

  if (Q && Q.sim && Q.sim.register) Q.sim.register('karacisim', { mount: mount });
})();
