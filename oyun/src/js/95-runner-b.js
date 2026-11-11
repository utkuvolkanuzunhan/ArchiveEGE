/* 95-runner-b.js (A2) Koşu motoru yardımcıları: sahte çizim (Q.art yoksa), yol üstü DOM katmanları
 * (patron paneli, balon, hasar sayısı, duraklatma menüsü), parçacık çizimi.
 * Ekler: Q.runner._b. Bağımlılık: 00-q.js. 95-runner.js bunu yalnızca çalışma anında çağırır. */
(function(){
  'use strict';
  var B = Q.runner._b = {};

  function cssVar(name, fb){
    try {
      var v = getComputedStyle(document.documentElement).getPropertyValue(name);
      return (v && v.trim()) || fb;
    } catch (e) { return fb; }
  }
  B.cssVar = cssVar;

  /* ---------- sahte çizim ---------- */
  B.fakeWorld = function(ctx, camX, t, renk, W, H, groundY){
    ctx.fillStyle = cssVar('--sky', '#120a30'); ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = cssVar('--bg2', '#1a0f3d'); ctx.fillRect(0, groundY, W, H - groundY);
    ctx.strokeStyle = renk || cssVar('--ground', '#00e5ff'); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(W, groundY); ctx.stroke();
    ctx.strokeStyle = cssVar('--grid', 'rgba(255,61,240,.22)'); ctx.lineWidth = 2;
    var off = -((camX % 120) + 120) % 120;
    for (var x = off; x < W; x += 120) { ctx.beginPath(); ctx.moveTo(x, groundY); ctx.lineTo(x - 60, H); ctx.stroke(); }
  };
  B.fakeRunner = function(ctx, x, y, durum, t){
    var hop = 0;
    if (durum === 'atla') hop = Math.abs(Math.sin(t * 5)) * 120;
    if (durum === 'zafer') hop = Math.abs(Math.sin(t * 6)) * 40;
    var tilt = durum === 'sendele' ? Math.sin(t * 30) * 6 : 0;
    var dy = durum === 'dus' ? 60 : 0;
    ctx.fillStyle = cssVar('--runner', '#ffd23f');
    ctx.fillRect(x - 30 + tilt, y - 110 - hop + dy, 60, 110);
    ctx.fillStyle = cssVar('--ink-dark', '#0b0620');
    ctx.fillRect(x + 8 + tilt, y - 95 - hop + dy, 12, 12);
  };
  B.fakeObstacle = function(ctx, tip, x, y, durum, t, opts){
    var h = tip === 'patron' ? 260 : tip === 'tahmin' ? 20 : 150, w = 100;
    var col = opts && opts.renk || cssVar('--foe', '#ff3df0');
    if (durum === 'cozuldu') col = cssVar('--good', '#39ff88');
    if (durum === 'basarisiz') col = cssVar('--bad', '#ff4d6d');
    ctx.fillStyle = col;
    ctx.globalAlpha = durum === 'cozuldu' ? 0.45 : 1;
    ctx.fillRect(x - w / 2, y - h, w, h);
    ctx.globalAlpha = 1;
    ctx.fillStyle = cssVar('--ink', '#fff'); ctx.font = '22px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(tip, x, y - h - 10);
  };

  /* ---------- parçacıklar ---------- */
  B.drawParticles = function(ctx, list, gt){
    list.forEach(function(p){
      var k = Math.min(1, (gt - p.t0) / p.sure);
      ctx.save(); ctx.globalAlpha = 1 - k; ctx.translate(p.x, p.y - k * 40);
      if (p.tur === 'bam') {
        ctx.fillStyle = cssVar('--yellow', '#ffd23f'); ctx.font = 'bold ' + Math.round(48 + 30 * k) + 'px sans-serif';
        ctx.textAlign = 'center'; ctx.fillText('BAM!', 0, 0);
      } else {
        ctx.fillStyle = cssVar('--cyan', '#00e5ff');
        for (var i = 0; i < 6; i++) { var a = i * 1.05 + p.t0; ctx.fillRect(Math.cos(a) * 50 * k, Math.sin(a) * 50 * k, 8, 8); }
      }
      ctx.restore();
    });
  };

  /* ---------- DOM katmanları ---------- */
  function layer(runway, id){
    var e = document.getElementById(id);
    if (e && runway.contains(e)) return e;
    e = document.createElement('div'); e.id = id;
    e.style.cssText = 'position:absolute;inset:0;pointer-events:none;';
    runway.appendChild(e); return e;
  }
  B.showBoss = function(runway, charId, opts){
    var p = document.getElementById('boss-panel');
    if (!p || !runway.contains(p)) {
      p = document.createElement('div'); p.id = 'boss-panel';
      p.style.cssText = 'position:absolute;right:0;top:0;bottom:0;width:34%;pointer-events:none;';
      runway.appendChild(p);
    }
    var svg = '';
    try { if (Q.art && Q.art.monster) svg = Q.art.monster(charId, { cls: (opts && opts.cls) || 'boss-svg' }) || ''; } catch (e) { console.error('boss', e); }
    p.innerHTML = svg || '';   // güvenilir sanat çıktısı, kullanıcı girdisi değil
    if (!svg) p.textContent = String(charId);
    p.hidden = false;
    var rm = Q.util.reduceMotion();
    p.style.transition = rm ? 'none' : 'transform 1.7s cubic-bezier(.2,.7,.3,1)';
    p.style.transform = rm ? 'none' : 'translateX(105%)';
    void p.offsetWidth;
    p.style.transform = 'translateX(0)';
    return Q.util.sleep(1700);
  };
  B.hideBoss = function(){
    var p = document.getElementById('boss-panel');
    if (!p) return Promise.resolve();
    var rm = Q.util.reduceMotion();
    p.style.transition = rm ? 'none' : 'transform 1s ease-in';
    p.style.transform = 'translateX(105%)';
    return Q.util.sleep(1000).then(function(){ p.hidden = true; p.innerHTML = ''; });
  };
  B.say = function(runway, kim, metin, opts){
    opts = opts || {};
    var konum = opts.konum || ((kim === 'runner' || kim === 'kosucu') ? 'runner' : (kim === 'selin' || kim === 'anlatici') ? 'anlatici' : 'canavar');
    if (Q.ui && Q.ui.bubble && Q.ui.bubble.say) return Promise.resolve(Q.ui.bubble.say({ kim: kim, metin: metin, konum: konum, ms: opts.ms }));
    var d = document.createElement('div');
    d.style.cssText = 'position:absolute;left:30%;top:12%;background:#fff;color:#0b0620;padding:8px 12px;border-radius:10px;';
    d.textContent = metin; layer(runway, 'bubble-layer').appendChild(d);
    return Q.util.sleep(opts.ms || 1800).then(function(){ if (d.parentNode) d.parentNode.removeChild(d); });
  };
  B.damage = function(runway, sayi, tur, leftPx){
    var d = document.createElement('span');
    d.className = 'dmg dmg-' + (tur || 'verilen');
    d.textContent = String(sayi);
    var col = tur === 'alinan' ? '--bad' : tur === 'kritik' ? '--yellow' : '--good';
    d.style.cssText = 'position:absolute;top:38%;font:bold 44px sans-serif;color:' + cssVar(col, '#fff') + ';left:' + Math.round(leftPx) + 'px;';
    layer(runway, 'dmg-layer').appendChild(d);
    var gone = function(){ if (d.parentNode) d.parentNode.removeChild(d); };
    if (d.animate && !Q.util.reduceMotion()) {
      var a = d.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-70px)', opacity: 0 }], { duration: 1000, easing: 'ease-out' });
      a.onfinish = gone;
    } else { setTimeout(gone, 900); }
  };

  /* ---------- duraklatma menüsü ---------- */
  B.openMenu = function(runway, actions){
    var box = document.createElement('div'); box.className = 'runner-menu';
    var items = [['Devam', actions.devam], ['Ayarlar', actions.ayarlar], ['Haritaya dön', actions.cik]];
    items.forEach(function(it){
      var b = document.createElement('button'); b.type = 'button'; b.className = 'btn'; b.textContent = it[0];
      b.style.cssText = 'display:block;margin:6px 0;';
      b.addEventListener('click', function(){ it[1](); });
      box.appendChild(b);
    });
    if (Q.ui && Q.ui.modal && Q.ui.modal.open) {
      Q.ui.modal.open(box, { baslik: 'Duraklatıldı' });
      return function(){ if (Q.ui.modal.close) Q.ui.modal.close(); };
    }
    var ov = document.createElement('div'); ov.className = 'runner-menu-fallback';
    ov.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.6);z-index:20;';
    ov.appendChild(box); runway.appendChild(ov);
    return function(){ if (ov.parentNode) ov.parentNode.removeChild(ov); };
  };
})();
