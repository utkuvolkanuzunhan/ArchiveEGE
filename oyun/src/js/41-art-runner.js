/* 41-art-runner.js (A5b) Koşucu "Çırak" ve 8 engel sprite'ı (canvas 2D yolları, dış görsel yok).
 * Ekler: Q.art.drawRunner(ctx,x,y,durum,t[,opts]), Q.art.drawObstacle(ctx,tip,x,y,durum,t,opts), Q.art.OBSTACLE_SIZE.
 * Koordinat: x = yatay MERKEZ, y = zemin çizgisi (ayak/taban). Sprite [x-w/2,x+w/2] x [y-h,y] aralığına çizilir.
 * opts.p (0..1, isteğe bağlı) = geçerli durumun ilerlemesi (cozuldu animasyonu, intro büyümesi). Verilmezse
 * cozuldu = bitmiş hal, intro = t'ye göre döngü. Bağımlılık: 00-q.js; renkler CSS değişkenlerinden okunur. */
(function(){
  'use strict';
  var root = (typeof window !== 'undefined') ? window : globalThis;
  var Q = root.Q = root.Q || {};
  Q.art = Q.art || {};

  var TAU = Math.PI * 2;
  var FB = { '--ink-dark':'#0b0620', '--cyan':'#00e5ff', '--magenta':'#ff3df0', '--yellow':'#ffd23f',
             '--lime':'#39ff88', '--red':'#ff4d6d', '--blue':'#3a5bff', '--panel2':'#25164f', '--panel':'#1a0f3d',
             '--ink':'#ffffff', '--bg':'#0e0724', '--runner':'#ffd23f', '--font-d':"'Lilita One','Impact','Arial Black',sans-serif" };
  var cache = null;
  function tok(n){
    if (!cache) {
      cache = {};
      var cs = null;
      try { if (typeof document !== 'undefined') cs = getComputedStyle(document.documentElement); } catch (e) { cs = null; }
      Object.keys(FB).forEach(function(k){
        var v = cs ? cs.getPropertyValue(k) : '';
        cache[k] = (v && v.trim()) || FB[k];
      });
    }
    return cache[n];
  }
  function lw(){ return 5; }
  function clamp(v, a, b){ return v < a ? a : (v > b ? b : v); }
  function ease(p){ p = clamp(p, 0, 1); return 1 - Math.pow(1 - p, 3); }

  /* ink: dolgu + 5 birim koyu kontur (aktifse cyan parıltı konturu) */
  function inkFill(ctx, fill, glow){
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    ctx.lineWidth = lw(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    if (glow) { ctx.save(); ctx.shadowColor = tok('--cyan'); ctx.shadowBlur = 14; ctx.strokeStyle = tok('--cyan'); ctx.stroke(); ctx.restore(); }
    ctx.strokeStyle = tok('--ink-dark'); ctx.stroke();
  }
  function rrect(ctx, x, y, w, h, r){
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r); ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r); ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r); ctx.closePath();
  }
  function poly(ctx, pts){
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.closePath();
  }
  function circle(ctx, x, y, r){ ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); }

  /* ================= KOŞUCU ================= */
  var SUIT = '#3a5bff', SKIN = '#ffc99b';

  /* uzuv: iki parça, kalın konturlu */
  function limb(ctx, x0, y0, a1, l1, a2, l2, w, col){
    var x1 = x0 + Math.sin(a1) * l1, y1 = y0 + Math.cos(a1) * l1;
    var x2 = x1 + Math.sin(a2) * l2, y2 = y1 + Math.cos(a2) * l2;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = tok('--ink-dark'); ctx.lineWidth = w + 2 * lw();
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.strokeStyle = col; ctx.lineWidth = w;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    return [x2, y2];
  }

  /* Poz: {lean, bx, by, sq, lf:[a1,a2], lb:[a1,a2], af:[a1,a2], ab:[a1,a2], eyes, sword} */
  function runPose(durum, f, t, p){
    var P = { lean: 0, bx: 0, by: 0, sq: 1, lf: [0, 0], lb: [0, 0], af: [0.15, 0.1], ab: [-0.15, -0.1], mouth: 0 };
    var i, ph;
    switch (durum) {
      case 'dur':
        P.by = (f % 2) ? 2.5 : 0; P.sq = (f % 2) ? 0.985 : 1.0;
        P.lf = [0.08, 0.05]; P.lb = [-0.08, -0.05]; P.af = [0.12, 0.05]; P.ab = [-0.12, -0.05];
        break;
      case 'atla':
        if (f === 0) { P.sq = 0.86; P.by = 0; P.lean = 0.12; P.lf = [0.9, -0.5]; P.lb = [-0.5, 0.6]; P.af = [-0.9, -0.5]; P.ab = [-1.3, -0.4]; }
        else if (f === 1) { P.by = -52; P.lean = 0.05; P.lf = [1.0, 0.3]; P.lb = [0.5, 0.2]; P.af = [2.6, 2.4]; P.ab = [2.2, 2.3]; P.mouth = 1; }
        else { P.sq = 0.9; P.by = 0; P.lean = 0.1; P.lf = [0.7, -0.3]; P.lb = [-0.4, 0.4]; P.af = [0.7, 0.2]; P.ab = [-0.6, 0.2]; }
        break;
      case 'saldir': {
        var sw = [ { s: -2.5, l: -0.15, bx: -6 }, { s: -0.4, l: 0.25, bx: 10 }, { s: 0.9, l: 0.3, bx: 14 }, { s: 0.3, l: 0.05, bx: 4 } ][f % 4];
        P.lean = sw.l; P.bx = sw.bx; P.lf = [0.7, -0.2]; P.lb = [-0.7, 0.3];
        P.af = [sw.s + 1.57, 0]; P.ab = [-0.5, 0.2]; P.sword = sw.s; P.arc = f === 1 || f === 2 ? f : 0; P.mouth = 1;
        break; }
      case 'sendele':
        P.bx = [-8, -20, -10][f % 3]; P.lean = [-0.22, -0.4, -0.2][f % 3];
        P.lf = [[0.5, 0.3], [0.9, 0.5], [0.3, 0.2]][f % 3]; P.lb = [[-0.4, 0.2], [-0.2, 0.5], [-0.4, 0.1]][f % 3];
        P.af = [[-1.2, -0.6], [-2.0, -0.8], [-0.8, -0.3]][f % 3]; P.ab = [[-1.6, -0.8], [-2.4, -1.0], [-1.0, -0.4]][f % 3]; P.mouth = 1;
        break;
      case 'dus':
        P.by = [26, 70, 130][f % 3]; P.lean = [-0.1, 0.3, 0.6][f % 3]; P.sq = [0.95, 0.85, 0.7][f % 3];
        P.lf = [0.6, 0.9]; P.lb = [-0.3, 0.8]; P.af = [2.4, 2.8]; P.ab = [-2.4, -2.8]; P.mouth = 1; P.alpha = [1, 0.7, 0.3][f % 3];
        break;
      case 'zafer':
        P.by = (f % 2) ? -14 : 0; P.lf = [0.25, 0.05]; P.lb = [-0.25, -0.05];
        P.af = [(f % 2) ? 2.9 : 2.6, 2.9]; P.ab = [(f % 2) ? -2.9 : -2.6, -2.9]; P.mouth = 2;
        break;
      default: /* kos: 6 kare */
        ph = f / 6 * TAU;
        P.by = -Math.abs(Math.sin(ph)) * 7; P.lean = 0.14;
        P.lf = [Math.sin(ph) * 0.95 + 0.1, Math.sin(ph) * 0.95 - 0.7 * Math.max(0, Math.cos(ph))];
        P.lb = [-Math.sin(ph) * 0.95 + 0.1, -Math.sin(ph) * 0.95 - 0.7 * Math.max(0, -Math.cos(ph))];
        P.af = [-Math.sin(ph) * 0.9 + 0.2, -Math.sin(ph) * 0.9 + 1.0];
        P.ab = [Math.sin(ph) * 0.9 + 0.2, Math.sin(ph) * 0.9 + 1.0];
        break;
    }
    return P;
  }

  function frameOf(durum, t, p){
    var n = { kos: 6, dur: 2, atla: 3, saldir: 4, sendele: 3, dus: 3, zafer: 2 }[durum] || 6;
    var rate = { kos: 11, dur: 2.2, atla: 5, saldir: 8, sendele: 6, dus: 4, zafer: 4 }[durum] || 8;
    if (p != null) return Math.min(n - 1, Math.floor(clamp(p, 0, 0.999) * n));
    if (durum === 'atla' || durum === 'saldir' || durum === 'sendele' || durum === 'dus') return Math.floor(t * rate) % n;
    return Math.floor(t * rate) % n;
  }

  /* Boyu mantıksal 150 birim: ayak y=0, kask tepesi y≈-150 */
  Q.art.drawRunner = function(ctx, x, y, durum, t, opts){
    durum = durum || 'kos'; t = t || 0;
    var f = frameOf(durum, t, opts && opts.p);
    var P = runPose(durum, f, t, opts && opts.p);
    var ink = tok('--ink-dark');
    ctx.save();
    ctx.translate(x + P.bx, y + P.by);
    if (P.alpha != null) ctx.globalAlpha = P.alpha;
    /* gölge (zeminde) */
    if (durum !== 'dus') {
      ctx.save(); ctx.translate(-P.bx, -P.by); ctx.globalAlpha = 0.3 * (ctx.globalAlpha);
      ctx.fillStyle = ink; ctx.beginPath(); ctx.ellipse(0, 2, 34 - Math.min(14, -P.by * 0.2), 6, 0, 0, TAU); ctx.fill(); ctx.restore();
    }
    ctx.rotate(P.lean);
    ctx.scale(1, P.sq);
    var hipY = -52, shY = -92;
    /* arka kol ve bacak */
    limb(ctx, -4, shY, P.ab[0], 20, P.ab[1], 20, 11, '#2744c9');
    limb(ctx, -4, hipY, P.lb[0], 25, P.lb[1], 25, 14, '#2744c9');
    /* gövde: tulum */
    rrect(ctx, -21, shY - 6, 42, 50, 12); inkFill(ctx, SUIT);
    ctx.beginPath(); ctx.rect(-12, shY + 18, 24, 14); inkFill(ctx, '#2744c9');   /* cep */
    ctx.fillStyle = tok('--yellow'); circle(ctx, -10, shY + 4, 3.4); ctx.fill(); circle(ctx, 10, shY + 4, 3.4); ctx.fill(); /* düğmeler */
    /* ön bacak (ayakkabıyla) */
    var fe = limb(ctx, 5, hipY, P.lf[0], 25, P.lf[1], 25, 14, SUIT);
    ctx.beginPath(); ctx.ellipse(fe[0] + 5, fe[1] + 1, 12, 6, 0, 0, TAU); inkFill(ctx, tok('--red'));
    var be = limb(ctx, -4, hipY, P.lb[0], 25, P.lb[1], 25, 0.01, 'rgba(0,0,0,0)');
    ctx.beginPath(); ctx.ellipse(be[0] + 5, be[1] + 1, 12, 6, 0, 0, TAU); inkFill(ctx, tok('--red'));
    /* kılıç ve ön kol */
    var hand = limb(ctx, 4, shY, P.af[0], 20, P.af[1], 20, 11, SUIT);
    ctx.fillStyle = SKIN; circle(ctx, hand[0], hand[1], 8); ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = ink; ctx.stroke();
    if (P.sword != null) {
      ctx.save(); ctx.translate(hand[0], hand[1]); ctx.rotate(P.sword);
      if (P.arc) { /* parlak cyan yay */
        ctx.save(); ctx.shadowColor = tok('--cyan'); ctx.shadowBlur = 16; ctx.strokeStyle = tok('--cyan'); ctx.lineWidth = 7; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(-8, 0, 70, -2.4 + P.arc * 0.4, -0.2 + P.arc * 0.4); ctx.stroke(); ctx.restore();
      }
      ctx.rotate(Math.PI / 2 - 0.2);
      ctx.beginPath(); ctx.rect(-4, -4, 8, 12); inkFill(ctx, '#7a4a1e');          /* kabza */
      ctx.beginPath(); ctx.rect(-12, -8, 24, 6); inkFill(ctx, tok('--yellow'));   /* siper */
      poly(ctx, [[-5, -8], [5, -8], [3, -62], [0, -70], [-3, -62]]); inkFill(ctx, tok('--cyan'));
      ctx.restore();
    }
    /* baş */
    var hy = -112;
    circle(ctx, 0, hy, 27); inkFill(ctx, SKIN);
    /* gözler: büyük */
    [-10, 10].forEach(function(ex){
      ctx.beginPath(); ctx.ellipse(ex, hy - 1, 8, 10, 0, 0, TAU); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = ink; ctx.stroke();
      ctx.fillStyle = ink; circle(ctx, ex + 2, hy, 4.2); ctx.fill();
      ctx.fillStyle = '#fff'; circle(ctx, ex + 3.4, hy - 1.6, 1.4); ctx.fill();
    });
    /* ağız */
    ctx.strokeStyle = ink; ctx.lineWidth = 3; ctx.lineCap = 'round';
    if (P.mouth) { ctx.beginPath(); ctx.ellipse(2, hy + 15, 6, P.mouth === 2 ? 6 : 4, 0, 0, TAU); ctx.fillStyle = '#b3122a'; ctx.fill(); ctx.stroke(); }
    else { ctx.beginPath(); ctx.arc(2, hy + 11, 6, 0.2, Math.PI - 0.2); ctx.stroke(); }
    /* sarı baret */
    ctx.beginPath(); ctx.moveTo(-29, hy - 6); ctx.arc(0, hy - 6, 29, Math.PI, 0); ctx.lineTo(29, hy - 6); ctx.closePath();
    inkFill(ctx, tok('--yellow'));
    ctx.beginPath(); ctx.rect(-34, hy - 9, 68, 8); inkFill(ctx, '#e0b21c');                 /* siper */
    ctx.beginPath(); ctx.rect(-6, hy - 38, 12, 30); inkFill(ctx, '#e0b21c');                /* orta nervür */
    ctx.fillStyle = tok('--cyan'); circle(ctx, 0, hy - 24, 4); ctx.fill();                  /* lamba */
    ctx.restore();
  };

  /* ================= ENGELLER ================= */
  var SIZE = {
    hikaye: { w: 200, h: 300 }, kavram: { w: 200, h: 280 }, dusman: { w: 120, h: 140 }, tahmin: { w: 260, h: 60 },
    tuzak: { w: 180, h: 60 }, kopru: { w: 420, h: 90 }, patron: { w: 600, h: 140 }, sandik: { w: 140, h: 120 }
  };
  Q.art.OBSTACLE_SIZE = SIZE;

  function label(ctx, txt, x, y, size){
    ctx.save(); ctx.font = size + 'px ' + tok('--font-d'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round'; ctx.lineWidth = Math.max(3, size / 6); ctx.strokeStyle = tok('--ink-dark'); ctx.strokeText(txt, x, y);
    ctx.fillStyle = '#fff'; ctx.fillText(txt, x, y); ctx.restore();
  }
  function starburst(ctx, x, y, r1, r2, n, rot){
    ctx.beginPath();
    for (var i = 0; i < n * 2; i++) { var r = i % 2 ? r1 : r2, a = rot + i * Math.PI / n; ctx[i ? 'lineTo' : 'moveTo'](x + Math.cos(a) * r, y + Math.sin(a) * r); }
    ctx.closePath();
  }

  var DRAW = {};

  DRAW.hikaye = function(ctx, durum, t, p, o){
    var act = durum === 'aktif' || durum === 'intro', done = durum === 'cozuldu';
    var inner = function(){
      ctx.beginPath(); ctx.moveTo(-74, 0); ctx.lineTo(-74, -200); ctx.arc(0, -200, 74, Math.PI, 0); ctx.lineTo(74, 0); ctx.closePath();
    };
    ctx.beginPath(); ctx.moveTo(-100, 0); ctx.lineTo(-100, -200); ctx.arc(0, -200, 100, Math.PI, 0); ctx.lineTo(100, 0); ctx.closePath();
    inkFill(ctx, '#3b1d7a', act);
    inner(); ctx.fillStyle = '#12082e'; ctx.fill();
    /* spiral */
    var speed = durum === 'intro' ? 3.2 : 1.2;
    var fade = done ? 1 - ease(p == null ? 1 : p) : 1;
    ctx.save(); inner(); ctx.clip();
    if (done) { ctx.fillStyle = tok('--cyan'); ctx.globalAlpha = 0.5 * Math.sin(Math.PI * clamp(p == null ? 1 : p, 0, 1)); ctx.fillRect(-80, -290, 160, 290); ctx.globalAlpha = 1; }
    ctx.globalAlpha = fade; ctx.lineWidth = 7; ctx.lineCap = 'round';
    for (var k = 0; k < 4; k++) {
      ctx.strokeStyle = k % 2 ? tok('--magenta') : tok('--cyan');
      ctx.beginPath();
      for (var r = 4; r <= 92; r += 4) { var a = t * speed + r * 0.085 + k * TAU / 4; var px = Math.cos(a) * r, py = -150 + Math.sin(a) * r; ctx[r === 4 ? 'moveTo' : 'lineTo'](px, py); }
      ctx.stroke();
    }
    ctx.restore();
    inner(); ctx.lineWidth = 4; ctx.strokeStyle = tok('--ink-dark'); ctx.stroke();
    /* kilit taşı + saat */
    ctx.beginPath(); ctx.arc(0, -272, 27, 0, TAU); inkFill(ctx, tok('--yellow'), act);
    circle(ctx, 0, -272, 20); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = tok('--ink-dark'); ctx.stroke();
    var ha = t * 0.6, ma = t * 4.5;
    ctx.lineCap = 'round'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, -272); ctx.lineTo(Math.sin(ha) * 10, -272 - Math.cos(ha) * 10); ctx.stroke();
    ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, -272); ctx.lineTo(Math.sin(ma) * 16, -272 - Math.cos(ma) * 16); ctx.stroke();
    /* taban blokları */
    ctx.beginPath(); ctx.rect(-112, -14, 36, 14); inkFill(ctx, '#2a1458'); ctx.beginPath(); ctx.rect(76, -14, 36, 14); inkFill(ctx, '#2a1458');
  };

  DRAW.kavram = function(ctx, durum, t, p, o){
    var act = durum === 'aktif' || durum === 'intro', done = durum === 'cozuldu';
    var pp = done ? ease(p == null ? 1 : p) : 0;
    /* arka açıklık */
    ctx.beginPath(); ctx.rect(-55, -250, 155, 250); ctx.fillStyle = done ? '#0b3a4a' : '#0b0620'; ctx.fill();
    if (done) { ctx.fillStyle = tok('--cyan'); ctx.globalAlpha = 0.35 * pp; ctx.fillRect(-55, -250, 155, 250); ctx.globalAlpha = 1; }
    /* kapı paneli (yukarı kayar) */
    ctx.save(); ctx.beginPath(); ctx.rect(-55, -250, 155, 250); ctx.clip();
    ctx.translate(0, -pp * 232);
    ctx.beginPath(); ctx.rect(-52, -246, 149, 246); inkFill(ctx, '#7c8aa6');
    for (var i = 0; i < 5; i++) { ctx.beginPath(); ctx.rect(-40, -226 + i * 46, 125, 8); inkFill(ctx, '#56627d'); }
    ctx.restore();
    /* çerçeve: sol duvar, üst kiriş */
    ctx.beginPath(); ctx.rect(-100, -280, 45, 280); inkFill(ctx, '#3b1d7a', act);
    ctx.beginPath(); ctx.rect(-100, -280, 200, 32); inkFill(ctx, '#2a1458', act);
    ctx.beginPath(); ctx.rect(96, -250, 8, 250); inkFill(ctx, '#2a1458');
    /* küçük ekran */
    ctx.beginPath(); rrect(ctx, -93, -214, 32, 26, 4); inkFill(ctx, '#06222c');
    ctx.fillStyle = tok('--cyan'); ctx.globalAlpha = done ? 1 : 0.8;
    for (var j = 0; j < 3; j++) ctx.fillRect(-88, -208 + j * 7, 10 + ((j * 7 + Math.floor(t * 3)) % 14), 3);
    ctx.globalAlpha = 1;
    /* sarı kol */
    var lx = -78, ly = -140, blink = durum === 'aktif' && Math.floor(t * 3) % 2 === 0;
    ctx.beginPath(); circle(ctx, lx, ly, 11); inkFill(ctx, '#56627d');
    var ang = done ? -1.0 : 0.15;                       /* aşağıda; çözülünce yukarı */
    ctx.save(); ctx.translate(lx, ly); ctx.rotate(Math.PI + ang);
    ctx.lineCap = 'round'; ctx.lineWidth = 15; ctx.strokeStyle = tok('--ink-dark'); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 48); ctx.stroke();
    ctx.lineWidth = 7; ctx.strokeStyle = tok('--yellow'); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 48); ctx.stroke();
    circle(ctx, 0, 52, 9); inkFill(ctx, blink ? tok('--cyan') : tok('--red'));
    ctx.restore();
  };

  var SKINS = {
    vakans: function(ctx, t){          /* içi boş kare atom */
      rrect(ctx, -44, -112, 88, 88, 10); inkFill(ctx, '#6d4cff');
      ctx.fillStyle = '#c7b8ff';
      for (var a = 0; a < 3; a++) for (var b = 0; b < 3; b++) { if (a === 1 && b === 1) continue; circle(ctx, -26 + a * 26, -94 + b * 26, 8); ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = tok('--ink-dark'); ctx.stroke(); ctx.fillStyle = '#c7b8ff'; }
      ctx.setLineDash([5, 6]); ctx.lineWidth = 3; ctx.strokeStyle = '#ffffff'; circle(ctx, 0, -68, 9); ctx.stroke(); ctx.setLineDash([]);
    },
    tane_siniri: function(ctx, t){     /* çatlak taş */
      poly(ctx, [[-50, -22], [-56, -70], [-30, -112], [10, -120], [46, -100], [58, -52], [40, -22]]); inkFill(ctx, '#8d8aa8');
      ctx.strokeStyle = tok('--ink-dark'); ctx.lineWidth = 4; ctx.lineJoin = 'miter';
      ctx.beginPath(); ctx.moveTo(-6, -120); ctx.lineTo(4, -98); ctx.lineTo(-10, -82); ctx.lineTo(6, -64); ctx.lineTo(-4, -44); ctx.lineTo(8, -22); ctx.stroke();
      ctx.strokeStyle = tok('--magenta'); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(4, -98); ctx.lineTo(-10, -82); ctx.lineTo(6, -64); ctx.stroke();
    },
    safsizlik: function(ctx, t){       /* renkli yabancı top */
      circle(ctx, 0, -68, 46); inkFill(ctx, '#39ff88');
      circle(ctx, -12, -78, 22); inkFill(ctx, tok('--magenta'));
      ctx.fillStyle = tok('--yellow'); circle(ctx, 20, -48, 7); ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = tok('--ink-dark'); ctx.stroke();
      circle(ctx, 24, -86, 5); ctx.fill(); ctx.stroke();
    },
    pauli_cift: function(ctx, t){      /* aynı çizgide iki electron */
      rrect(ctx, -46, -112, 92, 88, 10); inkFill(ctx, '#3a5bff');
      ctx.strokeStyle = tok('--yellow'); ctx.lineWidth = 5;
      for (var q = 0; q < 3; q++) { ctx.beginPath(); ctx.moveTo(-34, -94 + q * 26); ctx.lineTo(34, -94 + q * 26); ctx.stroke(); }
      ctx.fillStyle = '#ffffff';
      [-12, 12].forEach(function(dx){ circle(ctx, dx, -68, 8); ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = tok('--ink-dark'); ctx.stroke(); });
    },
    bant_bosluk: function(ctx, t){     /* iki band, arada bandgap */
      rrect(ctx, -46, -112, 92, 30, 8); inkFill(ctx, '#ff3df0');
      rrect(ctx, -46, -54, 92, 30, 8); inkFill(ctx, '#00b8d4');
      ctx.setLineDash([5, 6]); ctx.lineWidth = 3; ctx.strokeStyle = '#39ff88';
      ctx.beginPath(); ctx.moveTo(-46, -68); ctx.lineTo(46, -68); ctx.stroke(); ctx.setLineDash([]);
    },
    dislokasyon: function(ctx, t){     /* eğri sıra */
      for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) {
        var cx = -39 + c * 26, cy = -102 + r * 26;
        if (r === 1 || r === 2) cx += Math.sin((c + r) * 1.2) * 0 + (r === 1 ? 4 : -4) + (c > 1 ? (r === 1 ? 6 : -6) : 0);
        cy += (c === 1 || c === 2) ? (c === 1 ? -4 : 6) * (r === 1 ? 1 : 0.4) : 0;
        circle(ctx, cx, cy, 11); inkFill(ctx, r === 1 || r === 2 ? tok('--yellow') : '#00b8d4');
      }
    }
  };

  DRAW.dusman = function(ctx, durum, t, p, o){
    var skin = (o && o.skin) || 'vakans', act = durum === 'aktif' || durum === 'intro';
    var pp = durum === 'cozuldu' ? clamp(p == null ? 1 : p, 0, 1) : 0;
    var hover = Math.sin(t * 3) * 4;
    if (pp >= 1) return;
    ctx.save();
    ctx.translate(0, -hover - 6);
    if (pp > 0) { ctx.globalAlpha = 1 - pp; var s = 1 - pp * 0.5; ctx.translate(0, -60); ctx.scale(s, s); ctx.translate(0, 60); }
    if (act) { ctx.save(); ctx.shadowColor = tok('--cyan'); ctx.shadowBlur = 14; ctx.fillStyle = 'rgba(0,229,255,0.01)'; circle(ctx, 0, -68, 54); ctx.fill(); ctx.restore(); }
    (SKINS[skin] || SKINS.vakans)(ctx, t);
    /* kızgın gözler (her skinde ortak) */
    [-16, 16].forEach(function(ex){
      circle(ctx, ex, -68, 11); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = tok('--ink-dark'); ctx.stroke();
      ctx.fillStyle = tok('--ink-dark'); circle(ctx, ex + (ex < 0 ? 2 : -2), -66, 4.5); ctx.fill();
    });
    ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.strokeStyle = tok('--ink-dark');
    ctx.beginPath(); ctx.moveTo(-28, -88); ctx.lineTo(-8, -80); ctx.moveTo(28, -88); ctx.lineTo(8, -80); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, -42, 9, Math.PI + 0.4, TAU - 0.4); ctx.stroke();
    ctx.restore();
    if (pp > 0) {   /* BAM */
      ctx.save(); ctx.translate(0, -70); ctx.globalAlpha = 1 - pp * 0.8; var k = 0.6 + ease(pp) * 0.9;
      ctx.scale(k, k); starburst(ctx, 0, 0, 40, 64, 10, pp * 0.6); inkFill(ctx, tok('--yellow'));
      label(ctx, 'BAM!', 0, 0, 34); ctx.restore();
    }
  };

  DRAW.tahmin = function(ctx, durum, t, p, o){
    var act = durum === 'aktif' || durum === 'intro', fail = durum === 'basarisiz', done = durum === 'cozuldu';
    /* zemin kesintisi: parlayan zemin çizgisini örter */
    ctx.beginPath(); ctx.rect(-130, -8, 260, 74); ctx.fillStyle = tok('--bg'); ctx.fill();
    var g = ctx.createLinearGradient(0, 0, 0, 60);
    g.addColorStop(0, fail ? '#ff4d6d' : '#b04cff'); g.addColorStop(1, '#1a0f3d');
    ctx.beginPath(); ctx.rect(-124, 0, 248, 60); ctx.fillStyle = g; ctx.fill();
    ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.6;
    for (var i = 0; i < 6; i++) { var sx = -110 + ((i * 47 + t * 20) % 220), sy = 54 - ((t * 30 + i * 13) % 50); ctx.fillRect(sx, sy, 3, 3); }
    ctx.globalAlpha = 1;
    /* kenar blokları */
    [[-170, -130], [130, 170]].forEach(function(e){
      ctx.beginPath(); ctx.rect(e[0], 0, e[1] - e[0], 60); inkFill(ctx, '#2a1458');
      ctx.strokeStyle = tok('--cyan'); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(e[0], 0); ctx.lineTo(e[1], 0); ctx.stroke();
    });
    ctx.beginPath(); ctx.rect(-130, 0, 260, 60); ctx.lineWidth = 5; ctx.strokeStyle = tok('--ink-dark'); ctx.stroke();
    /* tabela */
    ctx.beginPath(); ctx.rect(142, -58, 7, 58); inkFill(ctx, '#56627d');
    rrect(ctx, 118, -86, 56, 40, 8); inkFill(ctx, tok('--yellow'), act);
    label(ctx, '?', 146, -66, 34);
    if (done) {
      var pp = ease(p == null ? 1 : p);
      ctx.save(); ctx.shadowColor = tok('--cyan'); ctx.shadowBlur = 16; ctx.fillStyle = tok('--cyan'); ctx.globalAlpha = 0.85;
      ctx.fillRect(-130, -5, 260 * pp, 9); ctx.restore();
    }
  };

  DRAW.tuzak = function(ctx, durum, t, p, o){
    var act = durum === 'aktif' || durum === 'intro', done = durum === 'cozuldu';
    var pp = done ? ease(p == null ? 1 : p) : 0;
    ctx.beginPath(); rrect(ctx, -90, -14, 180, 14, 4); inkFill(ctx, '#56627d', act);
    var sh = 46 * (1 - pp);
    if (sh > 1) {
      ctx.beginPath();
      for (var i = 0; i < 7; i++) { var bx = -56 + i * 20; ctx.moveTo(bx - 10, -14); ctx.lineTo(bx, -14 - sh); ctx.lineTo(bx + 10, -14); }
      ctx.fillStyle = '#c9cfe0'; ctx.fill(); ctx.lineWidth = 4; ctx.lineJoin = 'miter'; ctx.strokeStyle = tok('--ink-dark'); ctx.stroke();
    }
    /* uyarı ışığı */
    ctx.beginPath(); rrect(ctx, -82, -34, 12, 20, 3); inkFill(ctx, '#2a1458');
    var on = !done && (durum === 'aktif' ? Math.floor(t * 4) % 2 === 0 : true);
    ctx.save(); if (on) { ctx.shadowColor = tok('--red'); ctx.shadowBlur = 14; }
    circle(ctx, -76, -42, 9); inkFill(ctx, on ? tok('--red') : '#4a2a3a'); ctx.restore();
  };

  DRAW.kopru = function(ctx, durum, t, p, o){
    var act = durum === 'aktif' || durum === 'intro', done = durum === 'cozuldu';
    var pp = done ? clamp(p == null ? 1 : p, 0, 1) : 0;
    /* iki yarı güverte */
    [[-210, -62], [62, 210]].forEach(function(e, k){
      ctx.beginPath(); ctx.rect(e[0], -44, e[1] - e[0], 18); inkFill(ctx, '#a0662c', act);
      ctx.strokeStyle = tok('--ink-dark'); ctx.lineWidth = 3;
      for (var x = e[0] + 24; x < e[1]; x += 24) { ctx.beginPath(); ctx.moveTo(x, -44); ctx.lineTo(x, -26); ctx.stroke(); }
      /* kırık uç */
      var ex = k ? e[0] : e[1], d = k ? 1 : -1;
      ctx.beginPath(); ctx.moveTo(ex, -44); ctx.lineTo(ex + d * 10, -36); ctx.lineTo(ex, -34); ctx.lineTo(ex + d * 7, -28); ctx.lineTo(ex, -26); ctx.stroke();
    });
    /* direkler ve halat */
    [[-210, -1], [210, 1]].forEach(function(s){
      ctx.beginPath(); ctx.rect(s[0] - 6, -90, 12, 90); inkFill(ctx, '#7a4a1e');
      ctx.strokeStyle = '#e8d9b5'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(s[0], -84);
      ctx.quadraticCurveTo(s[0] - s[1] * 70, -60, s[0] - s[1] * 148, -50); ctx.stroke();
    });
    /* tahtalar sırayla oturur */
    for (var i = 0; i < 5; i++) {
      var st = i / 5, k2 = clamp((pp - st) / 0.2, 0, 1);
      if (k2 <= 0) continue;
      var drop = (1 - ease(k2)) * -50;
      ctx.beginPath(); ctx.rect(-60 + i * 24.4, -44 + drop, 23, 18); inkFill(ctx, '#d8963f');
    }
    if (pp > 0) { ctx.strokeStyle = '#e8d9b5'; ctx.lineWidth = 4; ctx.globalAlpha = pp; ctx.beginPath(); ctx.moveTo(-62, -50); ctx.quadraticCurveTo(0, -36, 62, -50); ctx.stroke(); ctx.globalAlpha = 1; }
  };

  DRAW.patron = function(ctx, durum, t, p, o){
    var act = durum === 'aktif' || durum === 'intro';
    /* arena bandı: macenta zemin çizgisi + tehlike şeridi */
    ctx.save(); ctx.shadowColor = tok('--magenta'); ctx.shadowBlur = 16; ctx.fillStyle = tok('--magenta'); ctx.fillRect(-300, -6, 600, 8); ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.rect(-300, 4, 600, 12); ctx.clip();
    ctx.fillStyle = tok('--yellow'); ctx.fillRect(-300, 4, 600, 12); ctx.fillStyle = tok('--ink-dark');
    for (var x = -330 + ((t * 20) % 40); x < 300; x += 40) { ctx.beginPath(); ctx.moveTo(x, 16); ctx.lineTo(x + 14, 16); ctx.lineTo(x + 26, 4); ctx.lineTo(x + 12, 4); ctx.closePath(); ctx.fill(); }
    ctx.restore();
    ctx.beginPath(); ctx.rect(-300, 4, 600, 12); ctx.lineWidth = 3; ctx.strokeStyle = tok('--ink-dark'); ctx.stroke();
    /* afiş */
    [-250, 250].forEach(function(px){ ctx.beginPath(); ctx.rect(px - 6, -120, 12, 120); inkFill(ctx, '#56627d'); });
    rrect(ctx, -200, -134, 400, 64, 10); inkFill(ctx, '#3b1d7a', act);
    label(ctx, 'PATRON', 0, -102, 52);
  };

  DRAW.sandik = function(ctx, durum, t, p, o){
    var act = durum === 'aktif' || durum === 'intro', done = durum === 'cozuldu';
    var pp = done ? ease(p == null ? 1 : p) : 0;
    if (pp > 0) { /* ışık demeti */
      ctx.save(); ctx.globalAlpha = 0.55 * pp; ctx.fillStyle = tok('--yellow');
      ctx.beginPath(); ctx.moveTo(-50, -70); ctx.lineTo(-90, -260); ctx.lineTo(90, -260); ctx.lineTo(50, -70); ctx.closePath(); ctx.fill(); ctx.restore();
    }
    ctx.beginPath(); rrect(ctx, -60, -70, 120, 70, 6); inkFill(ctx, tok('--yellow'), act);
    ctx.beginPath(); ctx.rect(-60, -34, 120, 14); inkFill(ctx, '#e0b21c');
    [-38, 38].forEach(function(bx){ ctx.beginPath(); ctx.rect(bx - 6, -70, 12, 70); inkFill(ctx, '#e0b21c'); });
    /* kapak: sol üst köşeden menteşeli */
    ctx.save(); ctx.translate(-60, -70); ctx.rotate(-pp * 1.9);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -16); ctx.quadraticCurveTo(60, -52, 120, -16); ctx.lineTo(120, 0); ctx.closePath(); inkFill(ctx, tok('--yellow'), act);
    ctx.beginPath(); ctx.rect(32, -30, 12, 30); inkFill(ctx, '#e0b21c');
    ctx.restore();
    if (!done) { circle(ctx, 0, -56, 12); inkFill(ctx, '#8a4cff'); ctx.fillStyle = tok('--ink-dark'); circle(ctx, 0, -58, 3.5); ctx.fill(); ctx.fillRect(-1.6, -58, 3.2, 10); }
    else { ctx.fillStyle = '#fff'; ctx.globalAlpha = pp; for (var i = 0; i < 4; i++) { starburst(ctx, -30 + i * 20, -100 - ((t * 40 + i * 30) % 60), 2, 6, 4, 0); ctx.fill(); } ctx.globalAlpha = 1; }
  };

  Q.art.drawObstacle = function(ctx, tip, x, y, durum, t, opts){
    var fn = DRAW[tip];
    if (!fn) return;
    durum = durum || 'idle'; t = t || 0;
    var p = opts && opts.p != null ? opts.p : null;
    ctx.save();
    ctx.translate(x, y);
    if (durum === 'intro') {   /* belirir ve büyür (1.2 sn) */
      var ip = p != null ? ease(p) : ease((t % 1.2) / 1.2);
      ctx.globalAlpha = 0.25 + 0.75 * ip; ctx.scale(0.8 + 0.2 * ip, 0.8 + 0.2 * ip);
    }
    fn(ctx, durum, t, p, opts || {});
    ctx.restore();
  };
})();
