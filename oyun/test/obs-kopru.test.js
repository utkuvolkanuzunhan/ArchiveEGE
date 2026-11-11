/* H4 Playwright testi: node oyun/test/obs-kopru.test.js (ekran görüntüleri test/ciktilar altında) */
'use strict';
var path = require('path'), fs = require('fs'), assert = require('assert');
var chromium = require('playwright').chromium;
var URL = 'file://' + path.join(__dirname, 'obs-kopru.html');
var OUT = path.join(__dirname, 'ciktilar'); if (!fs.existsSync(OUT)) fs.mkdirSync(OUT);
var ORDER = ['Kristal periyodiktir','Birim hücre tekrarlanır','Düzlemler kesişimle tanımlanır','Miller indisleri çıkar'];

async function tapCard(page, text){ await page.locator('.kopru-havuz .kopru-kart', { hasText: text }).click(); }
async function dragCard(page, text, slot){
  var c = page.locator('.kopru-kart', { hasText: text });
  var cb = await c.boundingBox();
  var sb = await page.locator('.kopru-yuva').nth(slot).boundingBox();
  await page.mouse.move(cb.x + 10, cb.y + 10);
  await page.mouse.down();
  await page.mouse.move(cb.x + 30, cb.y + 30, { steps: 3 });
  await page.mouse.move(sb.x + 20, sb.y + 15, { steps: 6 });
  await page.mouse.up();
}
async function slotTexts(page){
  return page.$$eval('.kopru-yuva', function(a){ return a.map(function(s){ return s.textContent; }); });
}

(async function(){
  var br = await chromium.launch(), page = await br.newPage({ viewport: { width: 1100, height: 800 } });
  var n = 0;
  /* 1) dokun-yerleştir, doğru sıra */
  await page.goto(URL);
  assert.strictEqual(await page.locator('.kopru-kart').count(), 4);
  assert.ok(await page.locator('.kopru-kontrol').isDisabled(), 'kontrol baştan kapalı');
  for (var i = 0; i < 4; i++) await tapCard(page, ORDER[i]);
  assert.deepStrictEqual(await slotTexts(page), ORDER); n++;
  /* geri alma: yuvaya dokun */
  await page.locator('.kopru-yuva').nth(1).click();
  assert.strictEqual((await slotTexts(page))[1], '');
  assert.ok(await page.locator('.kopru-kontrol').isDisabled());
  await tapCard(page, ORDER[1]); n++;
  await page.screenshot({ path: path.join(OUT, 'kopru-dolu.png') });
  await page.locator('.kopru-kontrol').click();
  await page.waitForSelector('.kopru-devam');
  assert.ok(await page.locator('.kopru-dogru').count() === 1);
  assert.deepStrictEqual(await page.evaluate(function(){ return window.__anims; }), ['kopru-kur']);
  await page.screenshot({ path: path.join(OUT, 'kopru-dogru.png') });
  await page.keyboard.press('Enter');
  await page.waitForFunction('window.__result');
  var r = await page.evaluate(function(){ return window.__result; });
  assert.strictEqual(r.dogru, true); assert.strictEqual(r.eminlik, 1); assert.strictEqual(r.kavram, 'miller_zincir'); n++;

  /* 2) sürükle-bırak, yanlış sıra */
  await page.goto(URL);
  var wrongOrder = [ORDER[1], ORDER[0], ORDER[2], ORDER[3]];
  for (i = 0; i < 4; i++) await dragCard(page, wrongOrder[i], i);
  assert.deepStrictEqual(await slotTexts(page), wrongOrder); n++;
  await page.locator('.kopru-kontrol').click();
  await page.waitForSelector('.kopru-devam');
  assert.strictEqual(await page.locator('.kopru-yanlis').count(), 2);
  var items = await page.$$eval('.kopru-dogru-sira li', function(a){ return a.map(function(x){ return x.textContent; }); });
  assert.deepStrictEqual(items, ORDER);
  assert.deepStrictEqual(await page.evaluate(function(){ return window.__anims; }), ['sendele']);
  await page.screenshot({ path: path.join(OUT, 'kopru-yanlis.png') });
  await page.locator('.kopru-devam').click();
  await page.waitForFunction('window.__result');
  r = await page.evaluate(function(){ return window.__result; });
  assert.strictEqual(r.dogru, false); assert.strictEqual(r.eminlik, 1); n++;

  /* 3) klavye ile ekleme + sürükleyerek yer değiştirme + tamir ipucu */
  await page.goto(URL);
  await page.evaluate(function(){ window.__tamir = true; window.runTest(); });
  assert.ok(await page.locator('.kopru-ipucu').count() === 1);
  await page.locator('.kopru-havuz .kopru-kart').first().focus();
  await page.keyboard.press('Enter');
  assert.strictEqual(await page.locator('.kopru-havuz .kopru-kart').count(), 3); n++;

  await br.close();
  console.log('obs-kopru: ' + n + ' kontrol grubu geçti');
})().catch(function(e){ console.error(e); process.exit(1); });
