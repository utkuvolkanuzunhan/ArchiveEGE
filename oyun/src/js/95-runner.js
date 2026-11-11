/* 95-runner.js (A2) Koşu motoru: canvas yolu, engel dizilimi, yavaşça durma, engel akışı, kontrol noktası,
 * kısa devre dönüşü, duraklatma. Ekler: Q.runner.start/pause/resume/jumpTo/canvas/info.
 * Bağımlılık (çalışma anında): Q.state, Q.save, Q.bus, Q.obs, Q.ui, Q.battle, Q.art (yoksa 95-runner-b.js sahte çizimi). */
(function(){
  'use strict';
  var R = Q.runner;
  var H = 720, GY = 600, TRIG = 420, STOPD = 160, DECEL = 1.4, INTRO = 1.2, ACCEL = 0.8, BASE_V = 260;
  var GAP = { hikaye: 1000, kavram: 1000, dusman: 900, tahmin: 1000, tuzak: 900, kopru: 1000, patron: 1200, sandik: 1000 };
  var ANIM = { saldir: 0.7, atla: 0.9, dus: 1.6, sendele: 0.8, zafer: 1.2, 'kapi-ac': 0.9, 'kopru-kur': 1.0, 'tuzak-boz': 0.8 };
  var RUNNER_DURUM = { saldir: 'saldir', atla: 'atla', dus: 'dus', sendele: 'sendele', zafer: 'zafer' };
  var OK_ANIM = { hikaye: 'kapi-ac', kavram: 'kapi-ac', dusman: 'saldir', tahmin: 'atla', tuzak: 'tuzak-boz', kopru: 'kopru-kur', patron: 'zafer', sandik: 'zafer' };
  var BAD_ANIM = { dusman: 'sendele', tahmin: 'dus', tuzak: 'sendele', kopru: 'sendele' };

  var container = null, canvas = null, cctx = null, ro = null, W = 1280, scale = 1, rafId = 0, last = null;
  var run = null, paused = false, closeMenu = null;
  var decelLog = [];

  function B(){ return R._b; }
  function ease3(p){ return 1 - Math.pow(1 - p, 3); }
  function rmotion(){ return Q.util.reduceMotion(); }
  function rx(){ return 0.26 * W; }
  function speed(){ var h = Q.state && Q.state.ayarlar && Q.state.ayarlar.hiz; return BASE_V * (typeof h === 'number' && h > 0 ? h : 1); }
  function toast(m, tur){ try { if (Q.ui && Q.ui.toast) Q.ui.toast(m, { tur: tur || 'bilgi' }); } catch (e) { console.error(e); } }
  function save(){ try { Q.save.write(); } catch (e) { console.error(e); } }

  /* ---------- canvas ---------- */
  function findContainer(){
    return document.getElementById('runway') || document.querySelector('.runway');
  }
  function resize(){
    if (!container || !canvas) return;
    var w = container.clientWidth || 800, h = container.clientHeight || 450;
    var dpr = window.devicePixelRatio || 1;
    W = Math.round(H * w / h);
    scale = h / H * dpr;
    canvas.width = Math.max(1, Math.round(W * scale));
    canvas.height = Math.max(1, Math.round(H * scale));
    canvas.style.width = '100%'; canvas.style.height = '100%';
  }
  function ensureCanvas(){
    var c = findContainer();
    if (!c) throw new Error('runway yok');
    if (c !== container || !canvas) {
      if (ro) ro.disconnect();
      container = c;
      canvas = document.createElement('canvas');
      canvas.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;display:block;';
      if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
      container.insertBefore(canvas, container.firstChild);
      cctx = canvas.getContext('2d');
      R.canvas = canvas;
      if (typeof ResizeObserver !== 'undefined') { ro = new ResizeObserver(resize); ro.observe(container); }
    } else if (!canvas.parentNode) { container.insertBefore(canvas, container.firstChild); }
    resize();
  }

  /* ---------- oyun zamanı ---------- */
  function wait(sec){
    if (rmotion() || !run) return Promise.resolve();
    return new Promise(function(res){ run.timers.push({ at: run.gt + sec, res: res }); });
  }
  function alive(r){ return run === r && !r.aborted; }

  function beginDecel(target){
    var r = run;
    return new Promise(function(res){
      r.camA = r.camX; r.camB = Math.max(r.camX, target);
      r.decelT = 0; r.t0wall = performance.now(); r.tg0 = r.gt;
      if (rmotion()) { r.camX = r.camB; r.mode = 'stopped'; logDecel(r); res(); return; }
      r.mode = 'decel'; r.decelRes = res;
    });
  }
  function logDecel(r){
    var it = r.items[r.cur];
    decelLog.push({ index: r.cur, gameSn: r.gt - r.tg0, duvarSn: (performance.now() - r.t0wall) / 1000,
      mesafe: it ? it.x - (r.camX + rx()) : null });
  }
  function stopTarget(r){
    var it = r.items[r.cur];
    return it ? it.x - rx() - STOPD : r.camX;
  }
  function doResume(){
    var r = run;
    if (!r || r.mode === 'run') return Promise.resolve();
    return new Promise(function(res){
      if (rmotion()) { r.mode = 'run'; res(); return; }
      r.mode = 'accel'; r.accelT = 0; r.accelRes = res;
    });
  }

  function update(dt){
    var r = run; if (!r) return;
    r.gt += dt;
    var due = [];
    r.timers = r.timers.filter(function(t){ if (r.gt >= t.at) { due.push(t); return false; } return true; });
    due.forEach(function(t){ t.res(); });
    r.parts = r.parts.filter(function(p){ return r.gt - p.t0 < p.sure; });
    if (r.tween) {
      r.tween.t += dt; var p = Math.min(1, r.tween.t / r.tween.dur);
      r.camX = r.tween.a + (r.tween.b - r.tween.a) * (p * p * (3 - 2 * p));
      if (p >= 1) r.tween = null;
    }
    if (r.mode === 'run' || r.mode === 'accel') {
      var v = speed();
      if (r.mode === 'accel') {
        r.accelT += dt; var k = Math.min(1, r.accelT / ACCEL); v *= k;
        if (k >= 1) { r.mode = 'run'; var ar = r.accelRes; r.accelRes = null; if (ar) ar(); }
      }
      r.camX += v * dt;
      var w = r.watch;
      if (w && r.mode === 'run') {
        var hit = false;
        if (w.tip === 'dist') { var it = r.items[r.cur]; hit = !it || (it.x - (r.camX + rx()) <= TRIG); }
        else hit = r.camX + rx() >= w.x;
        if (hit) { r.watch = null; w.res(); }
      }
    } else if (r.mode === 'decel') {
      r.decelT += dt; var q = Math.min(1, r.decelT / DECEL);
      r.camX = r.camA + (r.camB - r.camA) * ease3(q);
      if (q >= 1) { r.mode = 'stopped'; logDecel(r); var dr = r.decelRes; r.decelRes = null; if (dr) dr(); }
    }
    if (r.runnerAnim && r.gt >= r.runnerAnim.until) r.runnerAnim = null;
  }

  /* ---------- çizim ---------- */
  function render(){
    var r = run; if (!r || !cctx) return;
    var c = cctx, t = r.gt, ist = r.ist, art = Q.art || {}, b = B();
    c.setTransform(scale, 0, 0, scale, 0, 0);
    var sx = 0, sy = 0;
    if (r.shake && r.gt < r.shake) { sx = Math.sin(r.gt * 90) * 8; sy = Math.cos(r.gt * 70) * 5; }
    c.save(); c.translate(sx, sy);
    if (art.drawWorld) art.drawWorld(c, r.camX, t, ist.renk); else b.fakeWorld(c, r.camX, t, ist.renk, W, H, GY);
    r.items.forEach(function(it){
      var x = it.x - r.camX;
      if (x < -300 || x > W + 300) return;
      var introP = it.durum === 'intro' ? Math.min(1, (r.gt - it.stT) / INTRO) : 1;
      var o = { skin: it.ob.kusurSkin, renk: ist.renk, introT: introP, anim: it.anim, animT: it.anim ? Math.min(1, (r.gt - it.animT0) / (ANIM[it.anim] || 1)) : 0 };
      c.save();
      if (!art.drawObstacle && it.durum === 'intro') { c.translate(x, GY); c.scale(0.5 + 0.5 * introP, 0.5 + 0.5 * introP); c.translate(-x, -GY); }
      if (art.drawObstacle) art.drawObstacle(c, it.ob.tip, x, GY, it.durum, t, o); else b.fakeObstacle(c, it.ob.tip, x, GY, it.durum, t, o);
      c.restore();
    });
    var rd = r.runnerAnim ? r.runnerAnim.durum : (r.mode === 'run' || r.mode === 'accel' ? 'kos' : r.mode === 'decel' ? 'kos' : 'dur');
    if (art.drawRunner) art.drawRunner(c, rx(), GY, rd, t); else b.fakeRunner(c, rx(), GY, rd, t);
    b.drawParticles(c, r.parts, r.gt);
    c.restore();
  }
  function tick(now){
    rafId = requestAnimationFrame(tick);
    var dt = last == null ? 0 : Math.min(0.05, Math.max(0, (now - last) / 1000));
    last = now;
    if (!run) return;
    try { if (!paused) update(dt); render(); } catch (e) { console.error('runner', e); }
  }

  /* ---------- yol API (ctx.runway) ---------- */
  function makeRunwayApi(r, it){
    return {
      stop: function(){ if (!alive(r) || r.mode === 'stopped' || r.mode === 'decel') return Promise.resolve(); return beginDecel(stopTarget(r)); },
      resume: function(){ return doResume(); },
      anim: function(isim, opts){
        if (!alive(r)) return Promise.resolve();
        var sure = (opts && opts.sure) || ANIM[isim] || 0.8;
        if (RUNNER_DURUM[isim]) r.runnerAnim = { durum: RUNNER_DURUM[isim], until: r.gt + sure };
        if (it) { it.anim = isim; it.animT0 = r.gt; }
        if (isim === 'atla' && !rmotion()) r.tween = { a: r.camX, b: r.camX + 300, t: 0, dur: sure };
        if (isim === 'saldir' && it) r.parts.push({ tur: 'bam', x: it.x - r.camX, y: GY - 120, t0: r.gt, sure: 0.9 });
        if (isim === 'tuzak-boz' && it) r.parts.push({ tur: 'kivilcim', x: it.x - r.camX, y: GY - 60, t0: r.gt, sure: 0.8 });
        if (isim === 'sendele') r.shake = r.gt + 0.4;
        return wait(sure);
      },
      setObstacleState: function(d){ if (it) { it.durum = d; it.stT = r.gt; } },
      showBoss: function(id, o){ return B().showBoss(container, id, o); },
      hideBoss: function(){ return B().hideBoss(); },
      say: function(kim, metin, o){ return B().say(container, kim, metin, o); },
      damageNumber: function(n, tur){ B().damage(container, n, tur, rx() * (container.clientWidth / W)); }
    };
  }

  /* ---------- liste kurulumu ---------- */
  function buildList(st){
    var ay = (Q.state && Q.state.ayarlar) || {};
    var src = (st.engeller || []).slice(), list;
    if (ay.sadecePatron) {
      list = [];
      var h = src.filter(function(o){ return o.tip === 'hikaye'; })[0];
      if (h && !ay.hikayeAtla) list.push(Object.assign({}, h, { satirlar: (h.satirlar || []).slice(0, 1) }));
      src.forEach(function(o){ if (o.tip === 'patron' || o.tip === 'sandik') list.push(o); });
      return list;
    }
    list = src.filter(function(o){ return !(ay.hikayeAtla && o.tip === 'hikaye'); });
    var extra = [];
    try { if (Q.battle && Q.battle.reviewPick) extra = Q.battle.reviewPick(st.sira || 1, 2) || []; } catch (e) { console.error(e); }
    var pi = -1;
    list.forEach(function(o, i){ if (pi < 0 && o.tip === 'patron') pi = i; });
    if (pi < 0) pi = list.length;
    return list.slice(0, pi).concat(extra, list.slice(pi));
  }
  function layout(list){
    var x = 1200, out = [];
    list.forEach(function(ob, i){
      if (i > 0) x += GAP[list[i - 1].tip] || 1000;
      out.push({ ob: ob, x: x, durum: 'idle', stT: 0, anim: null, animT0: 0 });
    });
    return out;
  }
  function checkpoints(list){
    var cp = { 0: true }, firstD = -1;
    list.forEach(function(o, i){
      if (o.tip === 'dusman' && firstD < 0) firstD = i;
      if (o.tip === 'sandik' && i + 1 < list.length) cp[i + 1] = true;
    });
    if (firstD >= 0) cp[firstD] = true;
    return cp;
  }
  function pathNodes(r){
    return r.items.map(function(it, i){
      var d = i === r.cur ? 'simdi' : it.durum === 'cozuldu' ? 'tamam' : it.durum === 'basarisiz' ? 'hata' : 'bekliyor';
      if (i < r.cur && d === 'bekliyor') d = 'tamam';
      return { tip: it.ob.tip, durum: d };
    });
  }
  function hudPath(r){ try { if (Q.ui && Q.ui.hud && Q.ui.hud.setPath) Q.ui.hud.setPath(pathNodes(r)); } catch (e) { console.error(e); } }
  function prog(r){
    var s = Q.state; s.ilerleme = s.ilerleme || {};
    return (s.ilerleme[r.id] = s.ilerleme[r.id] || { tamam: false, enSon: 0, kontrol: 0, kisaDevre: 0, denendi: true });
  }

  /* ---------- engel akışı ---------- */
  async function doObstacle(r){
    var it = r.items[r.cur], ob = it.ob, i = r.cur;
    var rw = makeRunwayApi(r, it);
    r.watch = null;
    await beginDecel(stopTarget(r));                       // 1
    if (!alive(r)) return;
    rw.setObstacleState('intro'); hudPath(r); await wait(INTRO);   // 2
    if (!alive(r)) return;
    Q.bus.emit('obstacle:enter', { stationId: r.id, index: i, ob: ob });  // 3
    var host = document.createElement('div');              // 4
    try { if (Q.ui && Q.ui.dock) { Q.ui.dock.clear(); host = Q.ui.dock.mount(host) || host; } } catch (e) { console.error(e); }
    var ctx = { stationId: r.id, index: i, istasyon: r.ist, host: host, runway: rw, ui: Q.ui, claude: Q.claude, sim: Q.sim, battle: Q.battle, art: Q.art, state: Q.state };
    rw.setObstacleState('aktif');                          // 5
    var h = Q.obs.handlers && Q.obs.handlers[ob.tip], sonuc = null;
    if (!h || typeof h.enter !== 'function') { toast('Engel yüklenemedi: ' + ob.tip, 'kotu'); sonuc = { dogru: true, eminlik: 1, dogruluk: null, kavram: null, agirlik: 0, notlar: '' }; r.skipApply = true; }
    else {
      try {
        var skipP = new Promise(function(res){ r.skipRes = res; if (r.skipReq) res('atla'); });
        var hp = Promise.resolve(h.enter(ob, ctx));
        sonuc = await Promise.race([hp, skipP]);
        r.skipRes = null; r.skipReq = false;
        if (sonuc === 'atla') { try { B().hideBoss(); } catch (e) {} sonuc = { dogru: true, eminlik: 1, dogruluk: null, kavram: null, agirlik: 0, notlar: 'atlandi' }; r.skipApply = true; toast('Engel atlandı', 'iyi'); }
      } catch (e) { console.error('obs:' + ob.tip, e); toast('Engel yüklenemedi: ' + ob.tip, 'kotu'); sonuc = { dogru: true, eminlik: 1, agirlik: 0, notlar: '' }; r.skipApply = true; }  // 6
    }
    if (!alive(r)) return;
    sonuc = sonuc || { dogru: true, eminlik: 1, agirlik: 1 };
    if (ob.tip !== 'patron' && !r.skipApply) { try { if (Q.battle && Q.battle.apply) Q.battle.apply(sonuc); } catch (e) { console.error(e); } }  // 7
    r.skipApply = false;
    try { if (Q.ui && Q.ui.dock) Q.ui.dock.clear(); if (Q.ui && Q.ui.bubble && Q.ui.bubble.clear) Q.ui.bubble.clear(); } catch (e) { console.error(e); }  // 8
    if (Q.state.voltaj <= 0) { await kisaDevre(r); return; }  // 9
    var ok = ob.tip === 'patron' || sonuc.dogru !== false;
    var an = ok ? OK_ANIM[ob.tip] : BAD_ANIM[ob.tip];
    if (an) await rw.anim(an);                              // 10
    if (!alive(r)) return;
    rw.setObstacleState(ok ? 'cozuldu' : 'basarisiz');
    Q.bus.emit('obstacle:done', { stationId: r.id, index: i, ob: ob, result: sonuc });  // 11
    var p = prog(r);
    p.enSon = Math.max(p.enSon || 0, i + 1);
    if (r.cp[i + 1]) p.kontrol = i + 1;
    if (ob.tip === 'sandik' && i === r.items.length - 1) {
      p.tamam = true;
      var ku = Q.state.fabrika.kurulu; if (ku.indexOf(r.id) < 0) ku.push(r.id);
      r.finished = true;
    }
    r.cur = i + 1; hudPath(r); save();
  }

  async function kisaDevre(r){
    try { if (Q.battle && Q.battle.kisaDevre) await Q.battle.kisaDevre(r.id); } catch (e) { console.error(e); }
    if (!alive(r)) return;
    try { if (Q.battle && Q.battle.reset) Q.battle.reset(70); } catch (e) { console.error(e); }
    Q.state.voltaj = 70;
    try { if (Q.ui && Q.ui.hud && Q.ui.hud.setVoltaj) Q.ui.hud.setVoltaj(70); } catch (e) { console.error(e); }
    var k = Math.min(prog(r).kontrol || 0, r.items.length - 1);
    r.items.forEach(function(it, j){ if (j >= k) { it.durum = 'idle'; it.anim = null; } });
    r.cur = k; r.camX = Math.max(0, r.items[k].x - 1000 - rx()); r.tween = null; r.runnerAnim = null;
    r.mode = 'stopped'; hudPath(r); save();
  }

  async function orchestrate(r){
    while (alive(r)) {
      if (r.cur >= r.items.length || r.finished) break;
      await new Promise(function(res){ r.watch = { tip: 'dist', res: res }; if (r.mode === 'stopped') doResume(); });
      if (!alive(r)) return 'cikis';
      if (r.cur >= r.items.length) break;
      try { await doObstacle(r); } catch (e) { console.error('runner', e); toast('Bir şey takıldı, devam ediyoruz', 'kotu'); r.cur++; }
      if (alive(r) && r.mode === 'stopped' && !r.finished && r.cur < r.items.length) await doResume();
      else if (alive(r) && r.finished) await doResume();
    }
    if (!alive(r)) return 'cikis';
    var endX = r.items.length ? r.items[r.items.length - 1].x + 1200 : r.camX;
    await new Promise(function(res){ r.watch = { tip: 'x', x: endX, res: res }; if (r.mode === 'stopped') doResume(); });
    return alive(r) ? 'tamam' : 'cikis';
  }

  /* ---------- menü ve giriş ---------- */
  function openPauseMenu(){
    if (!run || closeMenu) return;
    paused = true; last = null;
    closeMenu = B().openMenu(container, {
      devam: function(){ R.resume(); },
      ayarlar: function(){ try { if (Q.settings && Q.settings.open) Q.settings.open(); } catch (e) { console.error(e); } },
      atla: function(){ R.skip(); },
      cik: function(){ R.resume(); abort('cikis'); }
    });
  }
  function onKey(e){
    if (e.key !== 'Escape' || !run) return;
    if (closeMenu) R.resume(); else openPauseMenu();
  }
  function onVis(){ if (document.hidden && run && !closeMenu) openPauseMenu(); }

  var endRun = null;
  function abort(sonuc){
    var r = run; if (!r || r.aborted) return;
    r.aborted = true;
    var p = prog(r); p.enSon = Math.max(0, Math.min(r.cur, r.items.length));
    save();
    r.timers.forEach(function(t){ t.res(); }); r.timers = [];
    ['watch', 'decelRes', 'accelRes'].forEach(function(k){ var x = r[k]; r[k] = null; if (x) (x.res || x)(); });
    try { if (Q.ui && Q.ui.dock) Q.ui.dock.clear(); } catch (e) { console.error(e); }
    if (endRun) endRun(sonuc);
  }

  /* ---------- genel API ---------- */
  R.start = function(stationId, fromIndex){
    if (run) abort('cikis');
    return new Promise(function(resolve){
      var st = Q.data.stations[stationId];
      if (!st) { toast('İstasyon bulunamadı', 'kotu'); resolve('cikis'); return; }
      try { ensureCanvas(); } catch (e) { console.error(e); toast('Yol bulunamadı', 'kotu'); resolve('cikis'); return; }
      var list = buildList(st), items = layout(list), cp = checkpoints(list);
      var from = Math.max(0, Math.min(fromIndex | 0, Math.max(0, items.length - 1)));
      var r = run = { id: stationId, ist: st, items: items, cp: cp, cur: from, mode: 'stopped', camX: 0, gt: 0, timers: [], parts: [],
        watch: null, decelRes: null, accelRes: null, runnerAnim: null, tween: null, aborted: false, finished: false, shake: 0 };
      var kc = 0; Object.keys(cp).forEach(function(k){ if (+k <= from && +k > kc) kc = +k; });
      var p = prog(r); p.kontrol = kc; p.denendi = true;
      r.camX = Math.max(0, items.length ? items[from].x - 1200 : 0);
      if (from > 0) { items.forEach(function(it, j){ if (j < from) it.durum = 'cozuldu'; }); r.camX = Math.max(0, items[from].x - 1000 - rx()); }
      Q.state.aktif = { stationId: stationId, index: from };
      r.mode = 'run';
      paused = false; last = null;
      if (!rafId) rafId = requestAnimationFrame(tick);
      try {
        if (Q.ui && Q.ui.hud) {
          if (Q.ui.hud.setStation) Q.ui.hud.setStation(st.ad, st.sira, Object.keys(Q.data.stations).length || 10);
        }
      } catch (e) { console.error(e); }
      hudPath(r);
      Q.bus.emit('station:start', { stationId: stationId, fromIndex: from });
      endRun = function(sonuc){
        endRun = null;
        if (closeMenu) { closeMenu(); closeMenu = null; }
        paused = false;
        try { B().hideBoss(); } catch (e) { console.error(e); }
        Q.bus.emit('station:end', { stationId: stationId, sonuc: sonuc });
        if (run === r) run = null;
        resolve(sonuc);
      };
      orchestrate(r).then(function(s){
        if (r.aborted) return;
        if (s === 'tamam') { save(); }
        if (endRun) endRun(s);
      }, function(e){ console.error('runner', e); toast('Koşu durdu', 'kotu'); if (endRun) endRun('cikis'); });
    });
  };
  R.indexOf = function(stationId, obId){
    var st = Q.data.stations[stationId]; if (!st) return 0;
    var list = buildList(st), src = st.engeller || [], k = -1;
    src.forEach(function(o, j){ if (o.id === obId) k = j; });
    for (var j = Math.max(k, 0); j < src.length; j++) {
      for (var i = 0; i < list.length; i++) if (list[i].id && list[i].id === src[j].id) return i;
    }
    return 0;
  };
  R.hold = function(){
    if (!run) return;
    if (closeMenu) { closeMenu(); closeMenu = null; }
    paused = true; last = null;
  };
  R.skip = function(){
    var r = run; if (!r) return false;
    if (closeMenu) { closeMenu(); closeMenu = null; }
    paused = false; last = null;
    r.skipReq = true; if (r.skipRes) r.skipRes('atla');
    return true;
  };
  R.abort = function(){ if (run) abort('cikis'); };
  R.pause = function(){ if (run && !closeMenu) openPauseMenu(); };
  R.resume = function(){
    if (closeMenu) { closeMenu(); closeMenu = null; }
    paused = false; last = null;
  };
  R.jumpTo = function(index){
    var r = run;
    if (!r || r.mode !== 'run' || index < 0 || index >= r.items.length) return false;
    r.items.forEach(function(it, j){ it.durum = j < index ? 'cozuldu' : 'idle'; it.anim = null; });
    r.cur = index; r.camX = Math.max(0, r.items[index].x - 1000 - rx()); hudPath(r);
    return true;
  };
  R.info = function(){
    var r = run;
    return { aktif: !!r, mode: r && r.mode, camX: r && r.camX, cur: r && r.cur, W: W, runnerX: rx(), paused: paused,
      gt: r && r.gt, durumlar: r && r.items.map(function(i){ return i.durum; }), decelLog: decelLog.slice() };
  };
  R.canvas = null;

  document.addEventListener('keydown', onKey);
  document.addEventListener('visibilitychange', onVis);
})();
