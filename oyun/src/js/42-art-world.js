/* 42-art-world.js (A5b) Paralaks dünya: gök, uzak silüet, orta katman, zemin (canvas 2D).
 * Ekler: Q.art.drawWorld(ctx, cam, t, tema). tema = istasyon rengi (string) veya {renk, n}.
 * Statik parçalar bir kez önbellek canvas'ına çizilir; her karede yalnızca kaydırma ve zemin çizgisi çizilir.
 * Mantıksal yükseklik 720, zemin y=600. Bağımlılık: 00-q.js; renkler CSS değişkenlerinden. */
(function(){
  'use strict';
  var root = (typeof window !== 'undefined') ? window : globalThis;
  var Q = root.Q = root.Q || {};
  Q.art = Q.art || {};

  var H = 720, GY = 600, TAU = Math.PI * 2;
  var FB = { '--ground':'#00e5ff', '--grid':'rgba(255,61,240,.22)', '--yellow':'#ffd23f', '--cyan':'#00e5ff',
             '--magenta':'#ff3df0', '--ink-dark':'#0b0620', '--bg':'#0e0724', '--font-d':"'Lilita One','Impact','Arial Black',sans-serif" };
  var toks = null;
  function tok(n){
    if (!toks) {
      toks = {};
      var cs = null;
      try { if (typeof document !== 'undefined') cs = getComputedStyle(document.documentElement); } catch (e) { cs = null; }
      Object.keys(FB).forEach(function(k){ var v = cs ? cs.getPropertyValue(k) : ''; toks[k] = (v && v.trim()) || FB[k]; });
    }
    return toks[n];
  }
  function rng(seed){
    var a = seed >>> 0;
    return function(){ a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function mkCanvas(w, h){
    var c;
    if (typeof OffscreenCanvas !== 'undefined') c = new OffscreenCanvas(w, h);
    else { c = document.createElement('canvas'); c.width = w; c.height = h; }
    return c;
  }

  var TILE_FAR = 1600, TILE_MID = 1400;
  var C = { key: '', sky: null, far: null, mid: null, W: 0, s: 1 };

  function buildSky(W, s, ctx2){
    var c = mkCanvas(Math.ceil(W * s), Math.ceil(H * s)), g = c.getContext('2d');
    g.scale(s, s);
    var gr = g.createLinearGradient(0, 0, 0, GY);
    gr.addColorStop(0, '#0e0724'); gr.addColorStop(1, '#2a0f5c');
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
    var r = rng(1234);
    for (var i = 0; i < 140; i++) {
      var x = r() * W, y = r() * GY * 0.85, z = r() < 0.15 ? 3 : 2;
      g.globalAlpha = 0.35 + r() * 0.6; g.fillStyle = r() < 0.2 ? tok('--cyan') : '#ffffff'; g.fillRect(x, y, z, z);
    }
    g.globalAlpha = 1;
    return c;
  }

  function buildFar(s){
    var h = 340, c = mkCanvas(Math.ceil(TILE_FAR * s), Math.ceil(h * s)), g = c.getContext('2d');
    g.scale(s, s);
    var r = rng(77), x = 0;
    while (x < TILE_FAR) {
      var w = 70 + r() * 110, bh = 90 + r() * 190;
      if (x + w > TILE_FAR) w = TILE_FAR - x;
      g.fillStyle = r() < 0.5 ? '#150a3a' : '#1b0f4a';
      g.fillRect(x, h - bh, w, bh);
      var kind = r();
      if (kind < 0.3) { g.fillRect(x + w * 0.2, h - bh - 50, 12, 50); g.fillRect(x + w * 0.2 - 4, h - bh - 56, 20, 8); }          /* baca */
      else if (kind < 0.55) { g.fillRect(x + w / 2 - 2, h - bh - 60, 4, 60); g.fillRect(x + w / 2 - 14, h - bh - 46, 28, 3); } /* anten */
      else if (kind < 0.7) { g.beginPath(); g.moveTo(x, h - bh); g.lineTo(x + w * 0.5, h - bh - 34); g.lineTo(x + w, h - bh); g.fill(); }
      for (var wy = h - bh + 14; wy < h - 12; wy += 20) for (var wx = x + 10; wx < x + w - 12; wx += 18) {
        if (r() < 0.32) { g.fillStyle = r() < 0.55 ? tok('--cyan') : tok('--magenta'); g.globalAlpha = 0.75; g.fillRect(wx, wy, 6, 8); g.globalAlpha = 1; }
      }
      x += w + 6 + r() * 10;
    }
    return c;
  }

  function buildMid(renk, n, s){
    var h = 300, c = mkCanvas(Math.ceil(TILE_MID * s), Math.ceil(h * s)), g = c.getContext('2d');
    g.scale(s, s);
    var r = rng(4242);
    /* borular */
    g.lineCap = 'butt';
    [[64, 18], [118, 12]].forEach(function(b){
      g.fillStyle = '#2a1a63'; g.fillRect(0, b[0], TILE_MID, b[1]);
      g.fillStyle = '#3b2a85'; g.fillRect(0, b[0], TILE_MID, 4);
      g.fillStyle = '#0b0620'; for (var x = 60; x < TILE_MID; x += 190) g.fillRect(x, b[0] - 2, 10, b[1] + 4);
    });
    /* ışıklı bant */
    g.save(); g.shadowColor = renk; g.shadowBlur = 10; g.fillStyle = renk; g.fillRect(0, 150, TILE_MID, 5); g.restore();
    /* dikey destekler */
    for (var px = 30; px < TILE_MID; px += 233) { g.fillStyle = '#241557'; g.fillRect(px, 70, 14, h - 70); g.fillStyle = '#0b0620'; g.fillRect(px + 14, 70, 3, h - 70); }
    /* tabela panoları */
    [140, 700, 1180].forEach(function(bx, i){
      var bw = 210, by = 176, bh = 66;
      g.fillStyle = '#0b0620'; g.fillRect(bx + 20, 150, 5, 26); g.fillRect(bx + bw - 25, 150, 5, 26);
      g.fillStyle = '#1a0f3d'; g.fillRect(bx, by, bw, bh);
      g.strokeStyle = renk; g.lineWidth = 4; g.save(); g.shadowColor = renk; g.shadowBlur = 8; g.strokeRect(bx + 2, by + 2, bw - 4, bh - 4); g.restore();
      if (false) {
        g.font = '34px ' + tok('--font-d'); g.textAlign = 'center'; g.textBaseline = 'middle';
        g.fillStyle = '#fff'; g.fillText('İSTASYON' + (n ? ' ' + n : ''), bx + bw / 2, by + bh / 2 + 2);
      } else {
        g.fillStyle = renk; g.globalAlpha = 0.55;
        for (var k = 0; k < 3; k++) g.fillRect(bx + 18, by + 14 + k * 17, 40 + r() * 110, 6);
        g.globalAlpha = 1;
      }
    });
    /* küçük sinyal lambaları */
    for (var i2 = 0; i2 < 9; i2++) { g.fillStyle = r() < 0.5 ? renk : tok('--yellow'); g.globalAlpha = 0.8; g.fillRect(40 + i2 * 150, 262 + r() * 10, 8, 8); }
    g.globalAlpha = 1;
    return c;
  }

  function blit(ctx, img, tileW, h, off, y, W){
    var x = -(((off % tileW) + tileW) % tileW);
    for (; x < W; x += tileW) ctx.drawImage(img, x, y, tileW, h);
  }

  Q.art.drawWorld = function(ctx, cam, t, tema){
    cam = cam || 0; t = t || 0;
    var renk = (tema && typeof tema === 'object') ? (tema.renk || tema.color) : tema;
    var n = (tema && typeof tema === 'object') ? tema.n : 0;
    renk = renk || tok('--magenta');
    var tr = ctx.getTransform ? ctx.getTransform() : { a: 1 };
    var s = tr.a > 0 ? tr.a : 1;
    var cw = (ctx.canvas && ctx.canvas.width) || 1280;
    var W = cw / s; if (!(W > 0)) W = 1280;
    var key = renk + '|' + n + '|' + Math.round(s * 100) + '|' + Math.round(W);
    if (C.key !== key) {
      var sameSky = C.skyKey === Math.round(s * 100) + '|' + Math.round(W);
      if (!sameSky) { C.sky = buildSky(W, s); C.far = buildFar(s); C.skyKey = Math.round(s * 100) + '|' + Math.round(W); }
      C.mid = buildMid(renk, n, s); C.key = key; C.W = W;
    }
    /* 1. gök: kamera x 0.02 (yalnızca ay kayar; hafif) */
    ctx.drawImage(C.sky, 0, 0, W, H);
    var mx = (((W * 0.74 - cam * 0.02) % (W + 300)) + (W + 300)) % (W + 300) - 150, my = 190, mr = 96;
    ctx.save(); ctx.shadowColor = tok('--yellow'); ctx.shadowBlur = 30; ctx.fillStyle = tok('--yellow');
    ctx.beginPath(); ctx.arc(mx, my, mr, 0, TAU); ctx.fill(); ctx.restore();
    ctx.fillStyle = '#1a0a45'; ctx.beginPath(); ctx.arc(mx + 38, my - 22, mr * 0.92, 0, TAU); ctx.fill();
    /* 2. uzak silüet x 0.12 */
    blit(ctx, C.far, TILE_FAR, 340, cam * 0.12, GY - 340, W);
    /* 3. orta katman x 0.4 */
    blit(ctx, C.mid, TILE_MID, 300, cam * 0.4, GY - 300, W);
    /* 4. zemin x 1.0 */
    ctx.fillStyle = tok('--bg'); ctx.fillRect(0, GY, W, H - GY);
    /* perspektif ızgara: yatay çizgiler yaklaştıkça seyrekleşir */
    ctx.strokeStyle = tok('--grid'); ctx.lineWidth = 2; ctx.beginPath();
    var depth = H - GY, vpx = W * 0.5, rowsN = 7, i, y, x;
    for (i = 1; i <= rowsN; i++) { y = GY + depth * Math.pow(i / rowsN, 1.7); ctx.moveTo(0, y); ctx.lineTo(W, y); }
    var step = 120, off = ((cam % step) + step) % step;
    for (x = -step * 6 - off; x < W + step * 6; x += step) { ctx.moveTo(vpx + (x - vpx) * 0.18, GY); ctx.lineTo(vpx + (x - vpx) * 1.6, H); }
    ctx.stroke();
    /* ana zemin çizgisi: 4 birim, parlak */
    ctx.save(); ctx.shadowColor = tok('--ground'); ctx.shadowBlur = 14; ctx.fillStyle = tok('--ground'); ctx.fillRect(0, GY - 2, W, 4); ctx.restore();
    ctx.fillStyle = renk; ctx.globalAlpha = 0.85; ctx.fillRect(0, GY + 6, W, 2); ctx.globalAlpha = 1;
    /* hareket çentikleri (kamera x 1.0 hissi) */
    ctx.fillStyle = tok('--ground'); ctx.globalAlpha = 0.55;
    var tk = 160, to = ((cam % tk) + tk) % tk;
    for (x = -to; x < W; x += tk) ctx.fillRect(x, GY + 10, 36, 3);
    ctx.globalAlpha = 1;
  };
})();
