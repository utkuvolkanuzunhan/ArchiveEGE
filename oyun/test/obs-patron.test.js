/* obs-patron.test.js (H5) Playwright ile obs-patron.html senaryoları. Çalıştır: node oyun/test/obs-patron.test.js */
'use strict';
var path = require('path');
var assert = require('assert');
var chromium = require('playwright').chromium;

function applies(log){
  return log.filter(function(l){ return l.indexOf('apply:') === 0; }).map(function(l){ return JSON.parse(l.slice(6)); });
}
var T = [], fails = 0;
function test(ad, fn){ T.push([ad, fn]); }

/* secmeli faz 1: doğru index 1; açık fazlarda metin gider */
var OK1 = { opt: [1], conf: [2] };

test('dogruluk 85 -> dogru true, 3 faz, HP 0, zafer', async function(run){
  var r = await run({ opt: [1], conf: [2, 1, 1], text: ['a', 'b'], grade: [{ dogruluk: 85, fikirler: [{ fikir: 'eşik', var: true }, { fikir: 'anlık', var: false }], yanlisKavram: null, geriBildirim: ['İyi.'] }, { dogruluk: 85, fikirler: [], geriBildirim: [] }] });
  var a = applies(r.log);
  assert.strictEqual(a.length, 3);
  assert.strictEqual(a[1].dogru, true); assert.strictEqual(a[1].dogruluk, 85);
  assert.strictEqual(r.hp, 0);
  assert.strictEqual(r.sonuc.dogru, true); assert.strictEqual(r.sonuc.notlar, 'patron');
  assert(r.log.indexOf('anim:zafer') >= 0 && r.log.indexOf('hideBoss') >= 0);
});
test('dogruluk 55 -> kismen (ikinci sans yok)', async function(run){
  var r = await run({ opt: [1], conf: [2, 1, 1], text: ['a', 'b'], grade: [{ dogruluk: 55, fikirler: [], geriBildirim: [] }, { dogruluk: 85, fikirler: [], geriBildirim: [] }] });
  var a = applies(r.log);
  assert.strictEqual(a.length, 3); assert.strictEqual(a[1].dogru, 'kismen');
  assert.strictEqual(r.hp, 0);
});
test('dogruluk 10 -> false, alt soru, ikinci de false: faz kapanir HP yine 40 duser', async function(run){
  var r = await run({ opt: [1], conf: [2, 1, 1, 1, 1], text: ['a', 'b', 'c', 'd'], grade: [{ dogruluk: 10, fikirler: [], geriBildirim: [] }, { dogruluk: 10, fikirler: [], geriBildirim: [] }, { dogruluk: 85, fikirler: [], geriBildirim: [] }] });
  var a = applies(r.log);
  assert.strictEqual(a.length, 4, 'faz1 + faz2 iki deneme + faz3');
  assert.strictEqual(a[1].dogru, false); assert.strictEqual(a[2].dogru, false);
  assert(r.log.some(function(l){ return l.indexOf('say:Işık yoğunluğu artınca') === 0; }), 'alt soru balonda');
  assert.strictEqual(r.log.filter(function(l){ return l === 'bossHit:40'; }).length, 3);
  assert.strictEqual(r.hp, 0);
});
test('ikinci sans: ilk yanlis, alt dogru', async function(run){
  var r = await run({ opt: [0, 1, 1, 1], conf: [1, 1, 1, 1], text: ['a', 'b'], grade: [{ dogruluk: 85, fikirler: [], geriBildirim: [] }, { dogruluk: 85, fikirler: [], geriBildirim: [] }] });
  var a = applies(r.log);
  assert.strictEqual(a[0].dogru, false); assert.strictEqual(a[1].dogru, true);
  assert(r.log.some(function(l){ return l.indexOf('say:Kırmızı lambayı') === 0; }));
  assert.strictEqual(r.hp, 0);
});
test('Claude none -> acik faz yedekSecmeli (4 secenek)', async function(run){
  var r = await run({ backend: 'none', opt: [1, 0, 0, 0], conf: [2, 1, 1, 1], text: ['a', 'b', 'c'] });
  var a = applies(r.log);
  assert(r.log.every(function(l){ return l.indexOf('grade:') !== 0; }), 'grade cagrilmadi');
  assert.strictEqual(a[1].dogru, true); assert.strictEqual(a[1].dogruluk, null); assert.strictEqual(a[1].eminlik, 1);
  assert.strictEqual(a[2].dogru, false);
  assert(r.log.indexOf('say:Hangisi dalga modelinin çelişkisidir?') >= 0);
});
test('Bilmiyorum (null) -> dogru false, eminlik 0', async function(run){
  var r = await run({ opt: [1, 0, 0], conf: [2], text: [null, null, null, null] });
  var a = applies(r.log);
  assert.strictEqual(a[1].dogru, false); assert.strictEqual(a[1].eminlik, 0); assert.strictEqual(a[1].dogruluk, 0);
});
test('Claude beklerken Dur -> cevap kutusuna don, metin korunur', async function(run){
  var r = await run({ opt: [1], conf: [2, 1, 1, 1], text: ['yarim cevap', 'yarim cevap', 'b'], click: ['Dur'], grade: ['hang', { dogruluk: 85, fikirler: [], geriBildirim: [] }, { dogruluk: 85, fikirler: [], geriBildirim: [] }] });
  assert(r.log.indexOf('textbox deger=yarim cevap') >= 0, 'metin korundu');
  assert.strictEqual(applies(r.log)[1].dogru, true);
});
test('hata sinir -> Tekrar dene; gecici -> Yedek soruya gec', async function(run){
  var r = await run({ opt: [1, 1], conf: [2, 1, 1], text: ['a', 'b'], click: ['Tekrar dene', 'Yedek soruya geç'], grade: [{ err: 'sinir' }, { dogruluk: 85, fikirler: [], geriBildirim: [] }, { err: 'gecici' }] });
  var a = applies(r.log);
  assert.strictEqual(a[1].dogru, true, 'tekrar sonrasi puan');
  assert.strictEqual(a[2].dogruluk, null, 'yedek soruya gecildi');
});
test('izin_yok -> toast + yedek', async function(run){
  var r = await run({ opt: [1, 0, 1], conf: [2, 1, 1], text: ['a', 'b'], grade: [{ err: 'izin_yok' }, { err: 'izin_yok' }] });
  assert(r.log.some(function(l){ return l.indexOf('toast:Claude kapalı') === 0; }));
  assert.strictEqual(applies(r.log)[1].dogruluk, null);
});
test('Voltaj 0 -> kisaDevre:true', async function(run){
  var r = await run({ opt: [0], conf: [2], voltaj: 30 });
  assert.strictEqual(r.sonuc.kisaDevre, true); assert.strictEqual(r.sonuc.dogru, false);
  assert(r.log.indexOf('hideBoss') >= 0); assert.strictEqual(r.voltaj, 0);
});
test('Tamir modu: ipucu satiri', async function(run){
  await run({ opt: [1], conf: [2], tamir: true, text: [null, null, null, null] });
  await run({ manual: true, tamir: true, auto: false });
  await new Promise(function(r){ setTimeout(r, 100); });
  var t = await run.page.textContent('#dock');
  assert(t.indexOf('Tamir modu') >= 0 && t.indexOf('Soruyu yeniden oku') >= 0, t);
});

(async function(){
  var browser = await chromium.launch();
  var page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  var errs = [];
  page.on('pageerror', function(e){ errs.push(String(e)); });
  page.on('console', function(m){ if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file://' + path.join(__dirname, 'obs-patron.html'));
  function run(c){ return Promise.race([page.evaluate(function(c){ return window.runCase(c); }, c), new Promise(function(_, rej){ setTimeout(function(){ rej(new Error('zaman asimi (senaryo takildi)')); }, 8000); })]); }
  run.page = page;
  for (var i = 0; i < T.length; i++) {
    try { await T[i][1](run); console.log('OK   ' + T[i][0]); }
    catch (e) { fails++; console.log('FAIL ' + T[i][0] + '\n     ' + e.message); }
  }
  /* manuel akış: gerçek tıklamalarla seçenek -> eminlik -> açıklama, ekran görüntüsü */
  await page.evaluate(function(){ window.runCase({ manual: true, auto: false, grade: [{ dogruluk: 85, fikirler: [{ fikir: 'eşik frekansı', var: true }, { fikir: 'anlık yanıt', var: false }], yanlisKavram: 'Şiddet enerjiyi belirlemez.', geriBildirim: ['Eşik fikrini iyi yakaladın.'] }] }); });
  await page.waitForSelector('.opt');
  await page.screenshot({ path: path.join(__dirname, 'obs-patron-1.png') });
  await page.click('.opt:nth-of-type(2)');
  await page.click('.cbtn:nth-of-type(3)');
  await page.waitForSelector('.devam');
  await page.screenshot({ path: path.join(__dirname, 'obs-patron-2.png') });
  await page.click('.devam');
  await page.waitForSelector('textarea');
  await page.fill('textarea', 'Eşik frekansı yüzünden.');
  await page.click('text=Gönder');
  await page.click('.cbtn:nth-of-type(2)');
  await page.waitForSelector('.p5-puan');
  await page.screenshot({ path: path.join(__dirname, 'obs-patron-3.png') });
  assert(await page.textContent('.p5-fikirler').then(function(t){ return t.indexOf('✓ eşik frekansı') >= 0 && t.indexOf('✗ anlık yanıt') >= 0; }));
  console.log('OK   manuel akis + ekran goruntuleri');
  /* Enter ile Devam */
  await page.keyboard.press('Enter');
  await page.waitForSelector('textarea');
  console.log('OK   Enter ile Devam');
  if (errs.length) { fails++; console.log('SAYFA HATALARI', errs); }
  await browser.close();
  console.log(fails ? fails + ' hata' : 'hepsi gecti');
  process.exit(fails ? 1 : 0);
})();
