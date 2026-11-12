/* test/runner.test.js (A2) Koşu motoru kabul testleri (Playwright). Çalıştır: node oyun/test/runner.test.js */
'use strict';
var path = require('path');
var pw = require('playwright');
var H = require('./harness.js');
var SRC = H.SRC;
var fails = 0;
function ok(c, m){ if (!c) { fails++; process.stdout.write('FAIL ' + m + '\n'); } else process.stdout.write('ok   ' + m + '\n'); }

var HTML = '<!doctype html><html><head><style>html,body{margin:0;height:100%}#runway{width:100vw;height:60vh;position:relative;overflow:hidden}</style></head><body><main id="runway"></main></body></html>';

async function setup(browser, opts){
  opts = opts || {};
  var ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: opts.reduce ? 'reduce' : 'no-preference' });
  var page = await ctx.newPage();
  var errs = [];
  page.on('pageerror', function(e){ errs.push(String(e)); });
  page.on('console', function(m){ if (m.type() === 'error') errs.push(m.text()); });
  await page.setContent(HTML);
  await H.injectTokens(page);
  for (var f of ['00-q.js', '10-state.js', '95-runner-b.js', '95-runner.js']) await page.addScriptTag({ path: path.join(SRC, f) });
  await page.evaluate(function(){
    Q.state.ayarlar.hiz = 3;
    var tips = ['hikaye','kavram','dusman','dusman','tahmin','tuzak','kopru','patron','hesap','sandik'];
    Q.data.stations.t1 = { id: 't1', sira: 1, ad: 'Test', renk: '#ffd23f', engeller: tips.map(function(t, i){ return { id: 't1-o' + (i + 1), tip: t, baslik: t }; }) };
    window.__log = [];
    tips.filter(function(t, i, a){ return a.indexOf(t) === i; }).forEach(function(t){
      Q.obs.register(t, { tip: t, enter: async function(ob, ctx){
        window.__log.push(ctx.index);
        if (window.__hook) await window.__hook(ob, ctx);
        await Q.util.sleep(60);
        return { dogru: true, eminlik: 1, agirlik: 1 };
      } });
    });
    Q.battle.apply = function(){}; Q.battle.kisaDevre = async function(){}; Q.battle.reviewPick = function(){ return []; };
  });
  return { page: page, errs: errs, ctx: ctx };
}

(async function(){
  var browser = await pw.chromium.launch();
  try {
    /* T6 + T2 + T3 */
    var s = await setup(browser);
    var page = s.page;
    await page.evaluate(function(){ Q.runner.start('t1', 0); });
    await page.waitForTimeout(300);
    var sz = await page.evaluate(function(){ var r = Q.runner.canvas.getBoundingClientRect(); return { w: r.width, h: r.height, iw: innerWidth, ih: innerHeight }; });
    ok(sz.w >= sz.iw * 0.96, 'T6 genişlik >= %96 (' + sz.w + '/' + sz.iw + ')');
    ok(sz.h >= sz.ih * 0.5, 'T6 yükseklik >= %50 (' + sz.h + '/' + sz.ih + ')');

    await page.setViewportSize({ width: 900, height: 700 });
    await page.waitForTimeout(300);
    var r2 = await page.evaluate(function(){
      var i = Q.runner.info(), c = Q.runner.canvas, b = c.getBoundingClientRect();
      return { W: i.W, rx: i.runnerX, cw: c.width, ch: c.height, bw: b.width, bh: b.height };
    });
    ok(Math.abs(r2.rx / r2.W - 0.26) < 0.002, 'T2 koşucu 0.26W (' + (r2.rx / r2.W).toFixed(3) + ')');
    ok(Math.abs(r2.cw / r2.ch - r2.bw / r2.bh) < 0.01, 'T2 canvas oranı korunur');
    ok(Math.abs(r2.W / 720 - r2.bw / r2.bh) < 0.01, 'T2 W = 720*oran');

    await page.evaluate(function(){
      window.__d = []; var lc = null;
      (function f(){ var c = Q.runner.info().camX; if (lc != null && c != null) window.__d.push(c - lc); lc = c; requestAnimationFrame(f); })();
    });
    await page.waitForTimeout(200);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(100);
    var c1 = await page.evaluate(function(){ return Q.runner.info(); });
    await page.waitForTimeout(700);
    var c2 = await page.evaluate(function(){ return Q.runner.info(); });
    ok(c1.paused && c1.camX === c2.camX, 'T3 Esc duraklatır, kamera donar');
    ok(await page.$('.runner-menu') !== null, 'T3 menü açık');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    var c3 = await page.evaluate(function(){ return { i: Q.runner.info(), maxd: Math.max.apply(null, window.__d.filter(function(x){ return x > 0; })) }; });
    ok(!c3.i.paused && c3.i.camX > c2.camX, 'T3 devam eder');
    ok(c3.maxd <= 260 * 3 * 0.05 + 1, 'T3 devamda dt zıplaması yok (max adım ' + c3.maxd.toFixed(1) + ')');
    await s.ctx.close();

    /* T1: 10 engelli tam akış */
    s = await setup(browser); page = s.page;
    var res = await page.evaluate(function(){ return Q.runner.start('t1', 0); });
    var info = await page.evaluate(function(){ return { log: window.__log, i: Q.runner.info(), st: Q.state.ilerleme.t1, k: Q.state.fabrika.kurulu }; });
    ok(res === 'tamam', 'T1 sonuç tamam');
    ok(info.log.length === 10 && info.log.every(function(v, i){ return v === i; }), 'T1 10 engel sırayla');
    var dl = info.i.decelLog;
    ok(dl.length === 10 && dl.every(function(d){ return Math.abs(d.gameSn - 1.0) <= 0.2 && Math.abs(d.duvarSn - 1.0) <= 0.2; }),
      'T1 yavaşlama 1.0 ±0.2 sn: ' + dl.map(function(d){ return d.gameSn.toFixed(2) + '/' + d.duvarSn.toFixed(2); }).join(' '));
    ok(dl.every(function(d){ return Math.abs(d.mesafe - 160) <= 20; }), 'T1 durma mesafesi 160±20: ' + dl.map(function(d){ return Math.round(d.mesafe); }).join(' '));
    ok(info.st.tamam === true && info.k.indexOf('t1') >= 0, 'T1 ilerleme.tamam + fabrika.kurulu');
    ok(s.errs.length === 0, 'T1 konsol hatası yok ' + s.errs.join('|'));
    await s.ctx.close();

    /* T4: kısa devre */
    s = await setup(browser); page = s.page;
    var t4 = await page.evaluate(async function(){
      var once = false;
      window.__hook = async function(ob, ctx){ if (ctx.index === 3 && !once) { once = true; Q.state.voltaj = 0; } };
      Q.battle.kisaDevre = async function(){ window.__kd = (window.__kd || 0) + 1; };
      var res = await Q.runner.start('t1', 0);
      return { res: res, log: window.__log, kd: window.__kd, v: Q.state.voltaj };
    });
    ok(t4.res === 'tamam' && t4.kd === 1, 'T4 kısa devre bir kez, istasyon yine biter');
    ok(JSON.stringify(t4.log) === JSON.stringify([0,1,2,3,2,3,4,5,6,7,8,9]), 'T4 kontrol noktasına (index 2) döner: ' + t4.log.join(','));
    ok(t4.v === 70, 'T4 voltaj 70');
    await s.ctx.close();

    /* T5: reduced motion */
    s = await setup(browser, { reduce: true }); page = s.page;
    var t0 = Date.now();
    var r5 = await page.evaluate(function(){ return Q.runner.start('t1', 0); });
    var i5 = await page.evaluate(function(){ return Q.runner.info().decelLog; });
    ok(r5 === 'tamam', 'T5 reduced-motion ilerler ve biter');
    ok(i5.length === 10 && i5.every(function(d){ return d.gameSn < 0.2 && Math.abs(d.mesafe - 160) <= 20; }), 'T5 yavaşlama anlık');
    ok(Date.now() - t0 < 40000, 'T5 hızlı bitti (' + (Date.now() - t0) + 'ms)');
    await s.ctx.close();
  } catch (e) { fails++; process.stdout.write('HATA ' + (e && e.stack || e) + '\n'); }
  await browser.close();
  process.stdout.write(fails ? fails + ' BASARISIZ\n' : 'TUMU GECTI\n');
  process.exit(fails ? 1 : 0);
})();
