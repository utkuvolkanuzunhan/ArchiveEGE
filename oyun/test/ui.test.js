/* test/ui.test.js (A4) Playwright: node oyun/test/ui.test.js
 * Düzen ölçüleri, bileşen davranışları, ekran görüntüleri (oyun/test/ekran/). */
'use strict';
var fs = require('fs'), path = require('path');
var pw = require('playwright');
var URL = 'file://' + path.join(__dirname, 'ui.html');
var OUT = path.join(__dirname, 'ekran');
var fails = 0;
function ok(c, m){ if (!c) { fails++; console.error('FAIL: ' + m); } else console.error('ok: ' + m); }

(async function(){
  fs.mkdirSync(OUT, { recursive: true });
  // shell eşitliği
  var shell = fs.readFileSync(path.join(__dirname, '..', 'src', 'html', 'shell.html'), 'utf8').trim();
  var demo = fs.readFileSync(path.join(__dirname, 'ui.html'), 'utf8');
  var m = demo.match(/SHELL-BAŞLANGIÇ[^\n]*\n([\s\S]*?)\n<!-- SHELL-BİTİŞ/);
  ok(m && m[1].trim() === shell, 'ui.html içindeki shell, shell.html ile aynı');

  var br = await pw.chromium.launch();
  async function open(w, h, demoName){
    var ctx = await br.newContext({ viewport: { width: w, height: h } });
    var page = await ctx.newPage();
    var errs = [];
    page.on('pageerror', function(e){ errs.push(String(e)); });
    page.on('console', function(x){ if (x.type() === 'error' && !/fonts|ERR_|Failed to load/.test(x.text())) errs.push(x.text()); });
    await page.goto(URL + '?demo=' + demoName);
    page._errs = errs;
    return page;
  }

  // düzen
  var p = await open(1440, 900, 'options');
  var r = await p.evaluate(function(){
    var b = document.getElementById('runway').getBoundingClientRect();
    return { w: b.width, h: b.height, sy: document.documentElement.scrollHeight - innerHeight, sx: document.documentElement.scrollWidth - innerWidth,
      ids: ['app','topbar','btn-settings','hud-station','hud-path','hud-voltaj','voltaj-bar','voltaj-n','hud-claude','hud-timer','runway','runway-overlay','boss-panel','bubble-layer','dmg-layer','stage-banner','dock','modal-layer','toast-layer'].filter(function(i){ return !document.getElementById(i); }) };
  });
  ok(r.w >= 1380 && r.h >= 450, '1440x900 runway ' + r.w + 'x' + r.h);
  ok(r.sy <= 0 && r.sx <= 0, 'sayfa kaydırması yok');
  ok(r.ids.length === 0, 'shell kimlikleri tam ' + r.ids.join(','));
  var small = await p.evaluate(function(){
    var m = 99; document.querySelectorAll('body *').forEach(function(e){
      if (e.childNodes.length && Array.prototype.some.call(e.childNodes, function(n){ return n.nodeType === 3 && n.textContent.trim(); })) {
        var f = parseFloat(getComputedStyle(e).fontSize); if (f < m) m = f; } });
    return m; });
  ok(small >= 14, 'en küçük yazı ' + small + 'px');
  await p.screenshot({ path: path.join(OUT, 'ui-options.png') });
  // options: indeks orijinal, tuş
  var idx = await p.evaluate(function(){ return window.__r = undefined; });
  await p.evaluate(function(){ window.demoRun.options().then(function(i){ window.__r = i; }); });
  var txt = await p.evaluate(function(){ var b = document.querySelectorAll('#dock .opt'); b[1].click(); document.querySelector('#dock .opt-onay').click(); return { t: b[1].querySelector('.t').textContent, i: +b[1].dataset.i }; });
  await p.waitForFunction('window.__r !== undefined');
  ok((await p.evaluate('window.__r')) === txt.i, 'options orijinal indeks döner (' + txt.t + ')');
  ok(p._errs.length === 0, 'konsol hatası yok ' + p._errs.join('|'));
  await p.context().close();

  // 1100x700
  p = await open(1100, 700, 'options');
  r = await p.evaluate(function(){ return { sy: document.documentElement.scrollHeight - innerHeight, sx: document.documentElement.scrollWidth - innerWidth,
    d: document.getElementById('dock').getBoundingClientRect().bottom - innerHeight }; });
  ok(r.sy <= 0 && r.sx <= 0 && r.d <= 0, '1100x700 sığar');
  await p.keyboard.press('Tab');
  ok(await p.evaluate(function(){ return document.activeElement && document.activeElement.tagName === 'BUTTON'; }), 'Tab ile düğmeye odaklanır');
  await p.context().close();

  // confidence (klavye)
  p = await open(1440, 900, 'confidence');
  await p.evaluate(function(){ window.__r = undefined; });
  await p.screenshot({ path: path.join(OUT, 'ui-confidence.png') });
  await p.keyboard.press('3');
  await p.waitForTimeout(400);
  await p.context().close();
  p = await open(1440, 900, 'hepsi');
  await p.evaluate(function(){ window.__r = undefined; window.demoRun.confidence().then(function(i){ window.__r = i; }); });
  await p.keyboard.press('e');
  await p.waitForFunction('window.__r !== undefined');
  ok((await p.evaluate('window.__r')) === 2, 'confidence E tuşu -> 2');
  await p.context().close();

  // textbox
  p = await open(1440, 900, 'textbox');
  await p.screenshot({ path: path.join(OUT, 'ui-textbox.png') });
  await p.fill('#dock textarea', 'a'.repeat(300));
  var cnt = await p.textContent('#dock .sayac');
  ok(cnt === '300/280', 'sayaç ' + cnt);
  await p.evaluate(function(){ var t = document.querySelector('#dock textarea'); t.value = 'x'.repeat(450); t.dispatchEvent(new Event('input')); });
  ok((await p.inputValue('#dock textarea')).length === 400, '400 karakterde kesilir');
  await p.evaluate(function(){ window.__r = undefined; });
  await p.context().close();
  p = await open(1440, 900, 'hepsi');
  await p.evaluate(function(){ window.demoRun.textbox().then(function(v){ window.__r = v === null ? 'NULL' : v; }); });
  await p.click('#dock .btn:not(.primary)');
  await p.waitForFunction('window.__r !== undefined');
  ok((await p.evaluate('window.__r')) === 'NULL', 'Bilmiyorum -> null');
  await p.context().close();

  // thinking, modal, confirm, toast, boss, kart
  var names = ['thinking', 'modal', 'confirm', 'toast', 'boss', 'kart'];
  for (var i = 0; i < names.length; i++) {
    p = await open(1440, 900, names[i]);
    await p.waitForTimeout(names[i] === 'boss' ? 2300 : 300);
    await p.screenshot({ path: path.join(OUT, 'ui-' + names[i] + '.png') });
    ok(p._errs.length === 0, names[i] + ' konsol hatası yok ' + p._errs.join('|'));
    if (names[i] === 'confirm') {
      await p.evaluate(function(){ window.__r = undefined; });
      var ctx = p.context(); await ctx.close();
      p = await open(1440, 900, 'hepsi');
      await p.evaluate(function(){ window.demoRun.confirm().then(function(v){ window.__r = v; }); });
      await p.click('#modal-layer .btn.primary');
      await p.waitForFunction('window.__r !== undefined');
      ok((await p.evaluate('window.__r')) === true, 'confirm Evet -> true');
      ok(await p.evaluate(function(){ return document.getElementById('modal-layer').hidden; }), 'confirm sonrası modal kapanır');
    }
    await p.context().close();
  }
  // hud
  p = await open(1440, 900, 'hepsi');
  var h = await p.evaluate(function(){ return { v: document.getElementById('voltaj-n').textContent, t: document.getElementById('hud-timer').textContent,
    s: document.getElementById('hud-station').textContent, n: document.querySelectorAll('#hud-path .path-node').length }; });
  ok(h.v === '72' && h.t === 'Geçen 1s 12dk' && /3\/9/.test(h.s) && h.n === 9, 'hud ' + JSON.stringify(h));
  await p.context().close();

  await br.close();
  console.error(fails ? fails + ' BAŞARISIZ' : 'TÜMÜ GEÇTİ');
  process.exit(fails ? 1 : 0);
})().catch(function(e){ console.error(e); process.exit(2); });
