/* 70-sim-kafes.js (S3) Kafes türleri ve atom sayımı: sc / bcc / fcc / elmas.
 * Q.sim.register("kafes", ...) dışında bir şey yapmaz. */
(function(){
  'use strict';
  var TURLER = ['sc','bcc','fcc','elmas'];
  var DOGRU = { sc:1, bcc:2, fcc:4, elmas:8 };
  var DOLULUK = { sc:52, bcc:68, fcc:74, elmas:34 };
  var KOMSU = { sc:6, bcc:8, fcc:12, elmas:4 };

  /* k: köşe, y: yüz, g: gövde içi; pay = hücreye katkı */
  function atomlar(tur){
    var a = [], i, j, l;
    for (i = 0; i < 2; i++) for (j = 0; j < 2; j++) for (l = 0; l < 2; l++) a.push({x:i,y:j,z:l,k:'k',pay:0.125});
    if (tur === 'bcc') a.push({x:.5,y:.5,z:.5,k:'g',pay:1});
    if (tur === 'fcc' || tur === 'elmas') {
      [0,1].forEach(function(v){
        a.push({x:v,y:.5,z:.5,k:'y',pay:0.5});
        a.push({x:.5,y:v,z:.5,k:'y',pay:0.5});
        a.push({x:.5,y:.5,z:v,k:'y',pay:0.5});
      });
    }
    if (tur === 'elmas') {
      [[.25,.25,.25],[.75,.75,.25],[.75,.25,.75],[.25,.75,.75]].forEach(function(p){
        a.push({x:p[0],y:p[1],z:p[2],k:'g',pay:1});
      });
    }
    return a;
  }
  function baglar(tur){
    if (tur !== 'elmas') return [];
    var a = atomlar(tur), out = [], i, j, d;
    for (i = 0; i < a.length; i++) for (j = i + 1; j < a.length; j++) {
      d = Math.sqrt(Math.pow(a[i].x-a[j].x,2)+Math.pow(a[i].y-a[j].y,2)+Math.pow(a[i].z-a[j].z,2));
      if (Math.abs(d - Math.sqrt(3)/4) < 1e-6) out.push([a[i], a[j]]);
    }
    return out;
  }
  function kirilim(t){
    var k = 0, y = 0, g = 0, p = [];
    atomlar(t).forEach(function(x){ if (x.k === 'k') k++; else if (x.k === 'y') y++; else g++; });
    if (k) p.push(k + '×1/8');
    if (y) p.push(y + '×1/2');
    if (g) p.push(g + '×1');
    return p.join(' + ');
  }

  var impl = {
    mount: function(host, params, api){
      params = params || {}; api = api || {};
      var b0 = params.baslangic || {};
      var tur = TURLER.indexOf(params.tur) >= 0 ? params.tur : (TURLER.indexOf(b0.tur) >= 0 ? b0.tur : 'sc');
      var sayModu = false, tahmin = 1, sonuc = '', bitti = false, destroyed = false;
      var ro = null, onWin = null;

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
      var tBtn = {};
      var grp = document.createElement('div');
      grp.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;';
      TURLER.forEach(function(t){
        tBtn[t] = mkBtn(t, function(){ sec(t); });
        grp.appendChild(tBtn[t]);
      });
      bar.appendChild(grp);
      var sayBtn = mkBtn('Say', function(){ sayModu = !sayModu; sonuc = ''; tahmin = 1; guncelle(); });
      bar.appendChild(sayBtn);
      var sayGrp = document.createElement('div');
      sayGrp.style.cssText = 'display:flex;gap:6px;align-items:center;';
      var eksi = mkBtn('−', function(){ tahmin = Math.max(0, tahmin - 1); sonuc = ''; guncelle(); });
      var val = document.createElement('span');
      val.style.cssText = 'min-width:32px;text-align:center;font:700 22px var(--font-d,Impact,sans-serif);color:var(--yellow,#ffd23f);';
      var arti = mkBtn('+', function(){ tahmin = Math.min(16, tahmin + 1); sonuc = ''; guncelle(); });
      var kontrol = mkBtn('Kontrol', kontrolEt);
      kontrol.style.background = 'var(--accent,#ffd23f)'; kontrol.style.color = 'var(--accent-ink,#0b0620)';
      sayGrp.appendChild(eksi); sayGrp.appendChild(val); sayGrp.appendChild(arti); sayGrp.appendChild(kontrol);
      bar.appendChild(sayGrp);
      var info = document.createElement('div');
      info.style.cssText = 'flex:1 1 220px;min-width:0;overflow-wrap:anywhere;font:700 16px var(--font-b,Nunito,sans-serif);color:var(--ink,#fff);';
      info.setAttribute('aria-live','polite');
      bar.appendChild(info);
      var note = document.createElement('span');
      note.textContent = 'oyun modeli';
      note.style.cssText = 'font:600 16px var(--font-b,Nunito,sans-serif);color:var(--muted,#c4b9ec);';
      bar.appendChild(note);

      function col(n, fb){
        try { var v = getComputedStyle(host).getPropertyValue(n).trim(); return v || fb; } catch (e) { return fb; }
      }
      function sec(t){ tur = t; sonuc = ''; tahmin = 1; guncelle(); }

      function guncelle(){
        if (destroyed) return;
        TURLER.forEach(function(t){
          var on = t === tur;
          tBtn[t].style.background = on ? 'var(--sel,#0a3a52)' : 'var(--panel2,#25164f)';
          tBtn[t].style.borderColor = on ? 'var(--cyan,#00e5ff)' : 'var(--line,#f4f0ff)';
          tBtn[t].setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        sayBtn.style.borderColor = sayModu ? 'var(--cyan,#00e5ff)' : 'var(--line,#f4f0ff)';
        sayBtn.style.background = sayModu ? 'var(--sel,#0a3a52)' : 'var(--panel2,#25164f)';
        sayBtn.setAttribute('aria-pressed', sayModu ? 'true' : 'false');
        sayGrp.style.display = sayModu ? 'flex' : 'none';
        val.textContent = String(tahmin);
        if (sayModu) info.textContent = sonuc || 'Atoms per unit cell (hücre başına atom): ?';
        else info.textContent = 'Atoms per unit cell (hücre başına atom): ' + DOGRU[tur] + ' (' + kirilim(tur) + ') · Packing fraction (doluluk) %' + DOLULUK[tur] +
          (tur === 'elmas' ? ' · 4 nearest neighbors (en yakın komşu) per atom' : '');
        cv.setAttribute('aria-label', 'Lattice (kafes): ' + tur + ', atoms per unit cell (hücre başına) ' + (sayModu ? 'unknown (bilinmeyen)' : DOGRU[tur]) + ' atoms (atom)');
        ciz();
      }

      function kontrolEt(){
        var d = DOGRU[tur];
        if (tahmin === d) {
          sonuc = 'Doğru: ' + d + ' atoms (atom). ' + kirilim(tur);
          if (params.basari && params.basari.say && !bitti) {
            var h = params.basari.say;
            if ((!h.tur || h.tur === tur) && (h.atom == null || h.atom === d)) {
              bitti = true;
              try { if (api.done) api.done({ basari:true, olcum:{ tur:tur, atom:d } }); } catch (e) {}
            }
          }
        } else {
          sonuc = 'Yanlış. Corner (köşe) 1/8, face (yüz) 1/2, body (iç) atom (atom) tam sayılır.';
        }
        guncelle();
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
      function dilim(c, x, y, r, f){
        c.beginPath();
        if (f >= 1) c.arc(x, y, r, 0, Math.PI*2);
        else { c.moveTo(x, y); c.arc(x, y, r, -Math.PI/2, -Math.PI/2 + Math.PI*2*f); c.closePath(); }
      }
      function ciz(){
        if (destroyed || !W) return;
        var c = cv.getContext('2d');
        c.setTransform(dpr, 0, 0, dpr, 0, 0);
        c.clearRect(0, 0, W, H);
        var cyan = col('--cyan','#00e5ff'), mag = col('--magenta','#ff3df0'), yel = col('--yellow','#ffd23f'),
            lime = col('--lime','#39ff88'), ink = col('--ink','#ffffff'), muted = col('--muted','#c4b9ec'),
            dark = col('--ink-dark','#0b0620');
        var s = Math.min(H * 0.42, W * 0.22);
        var ox = W * 0.32, oy = H * 0.5 + s * 0.5;
        var c30 = Math.cos(Math.PI/6);
        function P(x, y, z){ return [ox + (x - y) * c30 * s, oy + (x + y) * 0.5 * s - z * s - s * 0.5]; }
        var K = [[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,1],[1,0,1],[1,1,1],[0,1,1]];
        var E = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
        c.lineWidth = 2;
        E.forEach(function(e){
          var a = K[e[0]], b = K[e[1]], pa = P(a[0],a[1],a[2]), pb = P(b[0],b[1],b[2]);
          /* görünmeyen (uzak) kenarlar: yalnız (0,0,0) köşesine değenler */
          var arka = (a[0]+a[1]+a[2] === 0) || (b[0]+b[1]+b[2] === 0);
          c.strokeStyle = arka ? muted : ink; c.globalAlpha = arka ? 0.55 : 0.9;
          c.setLineDash(arka ? [5,4] : []);
          c.beginPath(); c.moveTo(pa[0], pa[1]); c.lineTo(pb[0], pb[1]); c.stroke();
        });
        c.setLineDash([]); c.globalAlpha = 1;
        baglar(tur).forEach(function(b){
          var pa = P(b[0].x,b[0].y,b[0].z), pb = P(b[1].x,b[1].y,b[1].z);
          c.strokeStyle = lime; c.lineWidth = 3; c.globalAlpha = 0.85;
          c.beginPath(); c.moveTo(pa[0], pa[1]); c.lineTo(pb[0], pb[1]); c.stroke();
        });
        c.globalAlpha = 1;
        var list = atomlar(tur).slice().sort(function(a,b){ return (a.x+a.y+a.z) - (b.x+b.y+b.z); });
        var rr = Math.max(7, s * 0.085);
        list.forEach(function(a){
          var p = P(a.x,a.y,a.z), ren = a.k === 'k' ? cyan : (a.k === 'y' ? mag : yel);
          var r = a.k === 'g' ? rr * 1.1 : rr;
          c.beginPath(); c.arc(p[0], p[1], r, 0, Math.PI*2);
          c.fillStyle = dark; c.fill();
          c.globalAlpha = 0.18; c.fillStyle = ren; c.fill(); c.globalAlpha = 1;
          c.lineWidth = 2; c.strokeStyle = ren; c.stroke();
          dilim(c, p[0], p[1], r, a.pay);
          c.fillStyle = ren; c.fill();
          c.lineWidth = 1.5; c.strokeStyle = dark; c.stroke();
        });
        var lx = W * 0.6, ly = H * 0.16, lh = Math.max(24, H * 0.12);
        c.font = '700 16px ' + col('--font-b','Nunito, sans-serif'); c.textBaseline = 'middle'; c.textAlign = 'left';
        var rows = [['k', cyan, 'Corner (köşe): 1/8', 0.125], ['y', mag, 'Face (yüz): 1/2', 0.5], ['g', yel, 'Body (iç): 1', 1]];
        var has = {}; atomlar(tur).forEach(function(a){ has[a.k] = true; });
        var n = 0;
        rows.forEach(function(r){
          if (!has[r[0]]) return;
          var yy = ly + n * lh, cx = lx + 10; n++;
          c.beginPath(); c.arc(cx, yy, 8, 0, Math.PI*2); c.globalAlpha = 0.2; c.fillStyle = r[1]; c.fill(); c.globalAlpha = 1;
          c.strokeStyle = r[1]; c.lineWidth = 2; c.stroke();
          dilim(c, cx, yy, 8, r[3]); c.fillStyle = r[1]; c.fill();
          c.fillStyle = ink; c.fillText(r[2], cx + 18, yy);
        });
        c.fillStyle = yel;
        var fs = Math.round(Math.min(44, H * 0.18));
        c.font = '400 ' + fs + 'px ' + col('--font-d','Impact, sans-serif');
        c.fillText((sayModu ? '?' : String(DOGRU[tur])) + ' atoms', lx, Math.min(H - fs * 0.6, ly + 3 * lh + fs * 0.6));
      }

      if (typeof ResizeObserver !== 'undefined') {
        ro = new ResizeObserver(boyutla);
        ro.observe(cv);
      } else {
        onWin = boyutla;
        window.addEventListener('resize', onWin);
      }
      if (api.hint) { try { api.hint('Corner (köşe), face (yüz) ve body (iç) atom (atom) paylarını topla.'); } catch (e) {} }
      boyutla(); guncelle();

      return {
        destroy: function(){
          destroyed = true;
          if (ro) { try { ro.disconnect(); } catch (e) {} ro = null; }
          if (onWin) { window.removeEventListener('resize', onWin); onWin = null; }
          host.innerHTML = '';
        },
        getState: function(){ return { tur: tur, say: sayModu, tahmin: tahmin, atom: DOGRU[tur], komsu: KOMSU[tur] }; },
        set: function(p){ if (p && TURLER.indexOf(p.tur) >= 0) sec(p.tur); }
      };
    }
  };
  if (typeof Q !== 'undefined' && Q.sim && Q.sim.register) Q.sim.register('kafes', impl);
})();
