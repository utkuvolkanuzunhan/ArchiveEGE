/* 70-sim-basamak.js (S9) Basamak potansiyeli ve bariyerden tünelleme.
 * Q.sim.register("basamak", ...) dışında bir şey yapmaz.
 * Birim: elektron, enerji eV, uzunluk nm; ħ²/2m = 0.0381 eV·nm². */
(function(){
  'use strict';
  var C0 = 0.0381;
  var SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  function kOf(e){ return Math.sqrt(Math.max(0, e) / C0); }
  /* karmaşık sayı yardımcıları: [re, im] */
  function cA(a,b){ return [a[0]+b[0], a[1]+b[1]]; }
  function cM(a,b){ return [a[0]*b[0]-a[1]*b[1], a[0]*b[1]+a[1]*b[0]]; }
  function cD(a,b){ var d = b[0]*b[0]+b[1]*b[1]; return [(a[0]*b[0]+a[1]*b[1])/d, (a[1]*b[0]-a[0]*b[1])/d]; }
  function cE(th){ return [Math.cos(th), Math.sin(th)]; }
  function cS(a,s){ return [a[0]*s, a[1]*s]; }
  function cAbs2(a){ return a[0]*a[0]+a[1]*a[1]; }

  function dengele(E, V0){ return Math.abs(E - V0) < 0.005 ? V0 + 0.005 : E; }

  /* Basamak: R, T ve ψ(x) */
  function basamak(E, V0){
    E = dengele(E, V0);
    var k1 = kOf(E), r, t, k2 = 0, kap = 0, R;
    if (E > V0) {
      k2 = kOf(E - V0);
      r = [(k1 - k2)/(k1 + k2), 0]; t = [2*k1/(k1 + k2), 0];
      R = r[0]*r[0];
    } else {
      kap = kOf(V0 - E);
      var den = [k1, kap];
      r = cD([k1, -kap], den); t = cD([2*k1, 0], den);
      R = 1;
    }
    return { R: R, T: 1 - R, k1: k1, k2: k2, kap: kap, psi: function(x){
      if (x < 0) return cA(cE(k1*x), cM(r, cE(-k1*x)));
      if (E > V0) return cM(t, cE(k2*x));
      return cS(t, Math.exp(-kap*x));
    }};
  }

  /* Bariyer [0,a]: sınır koşullarıyla tam çözüm */
  function bariyer(E, V0, a){
    E = dengele(E, V0);
    var k1 = kOf(E), q = E > V0 ? [kOf(E - V0), 0] : [0, kOf(V0 - E)];
    var ka = [k1, 0];
    var oran = cD(ka, q);
    var Bk = cS(cA([1,0], oran), 0.5), Ck = cS(cA([1,0], cS(oran,-1)), 0.5);
    function eiq(x){ /* e^{i q x}, q karmaşık olabilir */
      return cS(cE(q[0]*x), Math.exp(-q[1]*x));
    }
    /* t' = t·e^{i k1 a};  B = t'·Bk·e^{-iqa},  C = t'·Ck·e^{iqa} */
    var Bf = cM(Bk, eiq(-a)), Cf = cM(Ck, eiq(a));
    var P = cA(Bf, Cf), Qp = cM(q, cA(Bf, cS(Cf,-1)));
    var tp = cD([2,0], cA(P, cD(Qp, ka)));
    var B = cM(tp, Bf), C = cM(tp, Cf);
    var r = cA(cM(tp, P), [-1,0]);
    var T = cAbs2(tp);
    return { T: T, R: Math.max(0, 1 - T), k1: k1, q: q, psi: function(x){
      if (x < 0) return cA(cE(k1*x), cM(r, cE(-k1*x)));
      if (x <= a) return cA(cM(B, eiq(x)), cM(C, eiq(-x)));
      return cM(tp, cE(k1*(x - a)));
    }};
  }
  /* yaklaşık formül (κa ≫ 1) */
  function yaklasik(E, V0, a){
    if (E >= V0) return 1;
    return Math.min(1, 16*(E/V0)*(1 - E/V0)*Math.exp(-2*kOf(V0 - E)*a));
  }

  function fmt(x){
    if (x >= 0.1) return x.toFixed(2);
    if (x >= 0.001) return x.toFixed(3);
    if (x <= 0) return '0';
    var s = x.toExponential(1), p = s.split('e'), ex = p[1].replace('-', '');
    return p[0] + '×10⁻' + ex.replace(/^0+/, '').split('').map(function(c){ return SUP[+c]; }).join('');
  }

  var impl = {
    mount: function(host, params, api){
      params = params || {}; api = api || {};
      var b0 = params.baslangic || {};
      function pick(n, d){ var v = params[n] != null ? params[n] : b0[n]; return typeof v === 'number' && isFinite(v) ? v : d; }
      var mod = (params.mod || b0.mod) === 'bariyer' ? 'bariyer' : 'basamak';
      var E = pick('E', mod === 'bariyer' ? 0.5 : 1.5);
      var V0 = pick('V0', 1);
      var a = pick('a', 0.6);
      var bitti = false, destroyed = false, aMax = a, kalin = false, raf = 0, ro = null, onWin = null;
      var reduce = false;
      try { reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) {}

      host.innerHTML = '';
      var wrap = document.createElement('div');
      wrap.style.cssText = 'display:flex;flex-direction:column;gap:8px;width:100%;';
      var cv = document.createElement('canvas');
      cv.style.cssText = 'display:block;width:100%;height:clamp(180px,22vh,260px);background:var(--track,#0b0620);border:3px solid var(--line,#f4f0ff);border-radius:10px;';
      cv.setAttribute('role','img');
      var bar = document.createElement('div');
      bar.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;';
      wrap.appendChild(cv); wrap.appendChild(bar); host.appendChild(wrap);

      var lblStyle = 'display:flex;align-items:center;gap:8px;flex:1 1 200px;font:700 16px var(--font-b,Nunito,sans-serif);color:var(--ink,#fff);';
      function mkSlider(ad, min, max, step, get, set){
        var l = document.createElement('label'); l.style.cssText = lblStyle;
        var s = document.createElement('span'); s.textContent = ad;
        var inp = document.createElement('input');
        inp.type = 'range'; inp.min = min; inp.max = max; inp.step = step;
        inp.style.cssText = 'flex:1;min-height:40px;min-width:80px;accent-color:var(--accent,#ffd23f);';
        var v = document.createElement('span'); v.style.cssText = 'min-width:70px;color:var(--yellow,#ffd23f);';
        inp.addEventListener('input', function(){ set(parseFloat(inp.value)); kullanici(); });
        l.appendChild(s); l.appendChild(inp); l.appendChild(v); bar.appendChild(l);
        return { l: l, s: s, inp: inp, v: v, get: get };
      }
      var sE = mkSlider('Enerji E', 0.1, 3, 0.05, function(){ return E; }, function(x){ E = x; });
      var sV = mkSlider('Basamak V₀', 0.2, 3, 0.05, function(){ return V0; }, function(x){ V0 = x; });
      var sA = mkSlider('Kalınlık a', 0.1, 2, 0.05, function(){ return a; }, function(x){ a = x; });
      var info = document.createElement('div');
      info.style.cssText = 'flex:1 1 100%;font:700 16px var(--font-b,Nunito,sans-serif);color:var(--ink,#fff);';
      info.setAttribute('aria-live','polite');
      bar.appendChild(info);
      var note = document.createElement('span');
      note.textContent = 'oyun modeli';
      note.style.cssText = 'font:600 16px var(--font-b,Nunito,sans-serif);color:var(--muted,#c4b9ec);';
      bar.appendChild(note);

      function col(n, fb){
        try { var v = getComputedStyle(host).getPropertyValue(n).trim(); return v || fb; } catch (e) { return fb; }
      }
      function hesap(){ return mod === 'bariyer' ? bariyer(E, V0, a) : basamak(E, V0); }
      function bilgi(h){
        return mod === 'bariyer'
          ? 'T = ' + fmt(h.T) + ' · R = ' + fmt(h.R) + (E < V0 ? ' · tünelleme' : ' · E > V₀')
          : 'R = ' + fmt(h.R) + ' · T = ' + fmt(h.T) + (E < V0 ? ' · ψ sönümlenir' : ' · E > V₀ ama yansıma var');
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
        var h = hesap();
        info.textContent = bilgi(h);
        cv.setAttribute('aria-label', (mod === 'bariyer' ? 'Bariyer' : 'Basamak') + ': E=' + E.toFixed(2) + ' eV, V0=' + V0.toFixed(2) + ' eV, T=' + fmt(h.T) + ', R=' + fmt(h.R));
        var c = cv.getContext('2d');
        c.setTransform(dpr, 0, 0, dpr, 0, 0);
        c.clearRect(0, 0, W, H);
        var cyan = col('--cyan','#00e5ff'), mag = col('--magenta','#ff3df0'), yel = col('--yellow','#ffd23f'),
            lime = col('--lime','#39ff88'), ink = col('--ink','#ffffff'), muted = col('--muted','#c4b9ec');
        var x0 = -2.5, x1 = (mod === 'bariyer' ? a : 0) + 2.5;
        var padL = 10, padR = 10, pw = W - padL - padR;
        function X(x){ return padL + (x - x0) / (x1 - x0) * pw; }
        var vmax = 3.2;
        var topY0 = 8, topY1 = H * 0.44, botY0 = H * 0.5, botY1 = H - 8;
        function YV(e){ return topY1 - (e / vmax) * (topY1 - topY0); }
        var xe = mod === 'bariyer' ? a : x1;
        /* dolgu */
        c.beginPath(); c.moveTo(X(0), YV(0)); c.lineTo(X(0), YV(V0)); c.lineTo(X(xe), YV(V0)); c.lineTo(X(xe), YV(0)); c.closePath();
        c.globalAlpha = 0.2; c.fillStyle = mag; c.fill(); c.globalAlpha = 1;
        /* potansiyel profili */
        c.beginPath(); c.moveTo(X(x0), YV(0)); c.lineTo(X(0), YV(0)); c.lineTo(X(0), YV(V0)); c.lineTo(X(xe), YV(V0));
        if (mod === 'bariyer') { c.lineTo(X(xe), YV(0)); c.lineTo(X(x1), YV(0)); }
        c.strokeStyle = mag; c.lineWidth = 3; c.stroke();
        /* E çizgisi */
        c.setLineDash([6,4]); c.strokeStyle = yel; c.lineWidth = 2;
        c.beginPath(); c.moveTo(X(x0), YV(E)); c.lineTo(X(x1), YV(E)); c.stroke(); c.setLineDash([]);
        var fb = col('--font-b','Nunito, sans-serif');
        c.font = '700 14px ' + fb; c.textBaseline = 'bottom'; c.textAlign = 'left';
        c.fillStyle = yel; c.fillText('E', X(x0) + 2, YV(E) - 2);
        c.fillStyle = mag; c.fillText('V₀', X(0) + 4, YV(V0) - 2);
        /* dalga fonksiyonu */
        var N = Math.max(120, Math.round(pw)), ys = [], re = [], mx = 0.5, i, x, p;
        for (i = 0; i <= N; i++) {
          x = x0 + (x1 - x0) * i / N; p = h.psi(x);
          ys.push(cAbs2(p)); re.push(p[0]); if (ys[i] > mx) mx = ys[i];
        }
        var yb = botY1, hgt = (botY1 - botY0) * 0.92;
        function YP(v){ return yb - (v / mx) * hgt; }
        c.beginPath(); c.moveTo(X(x0), yb);
        for (i = 0; i <= N; i++) c.lineTo(padL + pw * i / N, YP(ys[i]));
        c.lineTo(X(x1), yb); c.closePath();
        c.globalAlpha = 0.28; c.fillStyle = cyan; c.fill(); c.globalAlpha = 1;
        c.beginPath();
        for (i = 0; i <= N; i++) { var px = padL + pw * i / N; if (i) c.lineTo(px, YP(ys[i])); else c.moveTo(px, YP(ys[i])); }
        c.strokeStyle = cyan; c.lineWidth = 2; c.stroke();
        var ym = yb - hgt * 0.5, amp = hgt * 0.25 / Math.sqrt(mx);
        c.beginPath();
        for (i = 0; i <= N; i++) { var qx = padL + pw * i / N; if (i) c.lineTo(qx, ym - re[i]*amp); else c.moveTo(qx, ym - re[i]*amp); }
        c.globalAlpha = 0.7; c.strokeStyle = lime; c.lineWidth = 1.5; c.stroke(); c.globalAlpha = 1;
        c.strokeStyle = muted; c.lineWidth = 1; c.globalAlpha = 0.5;
        c.beginPath(); c.moveTo(X(0), botY0 - 4); c.lineTo(X(0), botY1);
        if (mod === 'bariyer') { c.moveTo(X(a), botY0 - 4); c.lineTo(X(a), botY1); }
        c.stroke(); c.globalAlpha = 1;
        c.fillStyle = cyan; c.textBaseline = 'top'; c.fillText('|ψ|²', padL + 2, botY0 - 2);
        c.fillStyle = lime; c.fillText('Re ψ', padL + 50, botY0 - 2);
        /* T (log) veya R çubuğu */
        var bw = Math.min(110, pw * 0.25), bx = W - padR - bw, by = topY0 + 4;
        c.textAlign = 'right'; c.textBaseline = 'top'; c.fillStyle = ink; c.font = '700 14px ' + fb;
        c.strokeStyle = ink; c.lineWidth = 2;
        if (mod === 'bariyer') {
          c.fillText('log T', bx - 6, by - 2);
          var fr = Math.max(0, Math.min(1, (Math.log(Math.max(h.T, 1e-6)) / Math.LN10 + 6) / 6));
          c.strokeRect(bx, by, bw, 10);
          c.fillStyle = lime; c.fillRect(bx + 1, by + 1, (bw - 2) * fr, 8);
        } else {
          c.fillText('R', bx - 6, by - 2);
          c.strokeRect(bx, by, bw, 10);
          c.fillStyle = mag; c.fillRect(bx + 1, by + 1, (bw - 2) * h.R, 8);
        }
      }

      function guncelleKontrol(){
        sA.l.style.display = mod === 'bariyer' ? 'flex' : 'none';
        sV.s.textContent = mod === 'bariyer' ? 'Bariyer V₀' : 'Basamak V₀';
        [sE, sV, sA].forEach(function(s){
          s.inp.value = s.get(); s.v.textContent = s.get().toFixed(2) + (s === sA ? ' nm' : ' eV');
        });
        sE.inp.setAttribute('aria-label', 'Enerji E, eV'); sV.inp.setAttribute('aria-label', 'V0, eV'); sA.inp.setAttribute('aria-label', 'Kalınlık a, nm');
      }
      function guncelle(){ if (destroyed) return; guncelleKontrol(); ciz(); }

      function kullanici(){
        if (a > aMax + 0.3 && E < V0) kalin = true;
        if (a > aMax) aMax = a;
        guncelle();
        basariKontrol();
      }
      function basariKontrol(){
        var b = params.basari;
        if (!b || bitti) return;
        var h = hesap(), ok = false;
        function aralik(v, ar){ return ar && v >= ar[0] && v <= ar[1]; }
        if (b.R) ok = aralik(h.R, b.R);
        else if (b.tunel) ok = mod === 'bariyer' && E < V0 && (!b.T || aralik(h.T, b.T));
        else if (b.kalinlasti) ok = kalin;
        if (ok) {
          bitti = true;
          try { if (api.done) api.done({ basari:true, olcum:{ mod:mod, E:E, V0:V0, a:a, T:h.T, R:h.R } }); } catch (e) {}
        }
      }

      function animasyon(p){
        if (raf) { cancelAnimationFrame(raf); raf = 0; }
        var hedef = { E: p.E != null ? p.E : E, V0: p.V0 != null ? p.V0 : V0, a: p.a != null ? p.a : a };
        if (reduce || typeof requestAnimationFrame !== 'function') { E = hedef.E; V0 = hedef.V0; a = hedef.a; guncelle(); return; }
        var s = { E: E, V0: V0, a: a }, t0 = null;
        function adim(ts){
          if (destroyed) return;
          if (t0 == null) t0 = ts;
          var u = Math.min(1, (ts - t0) / 1000), e = u < 0.5 ? 2*u*u : 1 - Math.pow(-2*u + 2, 2)/2;
          E = s.E + (hedef.E - s.E) * e; V0 = s.V0 + (hedef.V0 - s.V0) * e; a = s.a + (hedef.a - s.a) * e;
          guncelle();
          raf = u < 1 ? requestAnimationFrame(adim) : 0;
        }
        raf = requestAnimationFrame(adim);
      }

      if (typeof ResizeObserver !== 'undefined') {
        ro = new ResizeObserver(boyutla); ro.observe(cv);
      } else {
        onWin = boyutla; window.addEventListener('resize', onWin);
      }
      if (api.hint) { try { api.hint(mod === 'bariyer' ? 'Bariyeri kalınlaştır; geçen kısmın nasıl azaldığına bak.' : 'E > V₀ iken bile dalganın yansıdığına bak.'); } catch (e) {} }
      boyutla(); guncelle();

      return {
        destroy: function(){
          destroyed = true;
          if (raf) { cancelAnimationFrame(raf); raf = 0; }
          if (ro) { try { ro.disconnect(); } catch (e) {} ro = null; }
          if (onWin) { window.removeEventListener('resize', onWin); onWin = null; }
          host.innerHTML = '';
        },
        getState: function(){
          var h = hesap();
          return { mod: mod, E: E, V0: V0, a: a, T: h.T, R: h.R, yaklasikT: mod === 'bariyer' ? yaklasik(E, V0, a) : null, kalinlasti: kalin };
        },
        set: function(p){
          if (!p) return;
          if (p.mod === 'basamak' || p.mod === 'bariyer') mod = p.mod;
          animasyon(p);
        }
      };
    }
  };
  if (typeof Q !== 'undefined' && Q.sim && Q.sim.register) Q.sim.register('basamak', impl);
})();
