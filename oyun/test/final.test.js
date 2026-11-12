#!/usr/bin/env node
/* final.test.js (A7) Final "Sınav Günü" uçtan uca (Playwright, 1366x768). Önce: bash oyun/build.sh --zorunlu-degil
 * Kullanım: node oyun/test/final.test.js [claude|mcq|karma|esc]  (varsayılan: hepsi)
 * claude: sahte Claude, hep iyi cevap. mcq: Claude yok, çoktan seçmeli yedek (çiftte doğru, tekte yanlış).
 * karma: sahte Claude, tek sorular kötü cevap. esc: Esc menüsü (atla/önceki/başa dön/çık). */
'use strict';
var path = require('path');
var fs = require('fs');
var chromium = require('playwright').chromium;
var DIST = path.join(__dirname, '..', 'dist', 'oyun.html');
var EKRAN = path.join(__dirname, 'ekran');
var fails = 0;
function ok(c, m){ if (!c) { fails++; process.stdout.write('FAIL ' + m + '\n'); } else process.stdout.write('ok   ' + m + '\n'); }
function bekle(ms){ return new Promise(function(r){ setTimeout(r, ms); }); }

async function ac(mod){
  var browser = await chromium.launch();
  var page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  var hatalar = [];
  page.on('console', function(m){ if (m.type() === 'error' && !/fonts\.|net::/.test(m.text())) hatalar.push(m.text()); });
  page.on('pageerror', function(e){ hatalar.push(String(e)); });
  await page.route(/fonts\.(googleapis|gstatic)\.com/, function(r){ r.abort(); });
  await page.goto('file://' + DIST);
  await bekle(600);
  await page.evaluate(function(mod){
    Q.settings.closeMap(); try { Q.ui.modal.close(); } catch (e) {}
    Q.settings.set('hikayeAtla', true); Q.settings.set('kilitleriAc', true); Q.settings.set('hiz', 3);
    Q.claude.available = function(){ return Promise.resolve({ backend: mod === 'mcq' || mod === 'esc' ? 'none' : 'sample' }); };
    Q.claude.grade = function(g){
      var iyi = /good/.test(g.cevap);
      return Promise.resolve({ dogruluk: iyi ? 95 : 20, fikirler: g.anahtarFikirler.map(function(f, i){ return { fikir: f, 'var': iyi || i === 0 }; }),
        yanlisKavram: null, geriBildirim: [iyi ? 'Nice.' : 'Missing ideas.'], ipucu: '', backend: 'sample' });
    };
    window.__ilerlemeOnce = JSON.stringify(Q.state.ilerleme);
    window.__bitti = null;
    Q.final.start().then(function(r){ window.__bitti = r; });
  }, mod);
  return { browser: browser, page: page, hatalar: hatalar };
}

async function kos(mod){
  var o = await ac(mod), page = o.page, sorular = 0;
  for (var guard = 0; guard < 600 && sorular < 10; guard++) {
    await bekle(250);
    var ta = page.locator('textarea').first();
    if (!(await ta.count()) || !(await ta.isVisible())) continue;
    sorular++;
    var iyi = mod === 'claude' || (mod === 'karma' && sorular % 2 === 0) || mod === 'mcq';
    await ta.fill(iyi ? 'good answer ' + sorular : 'wrong guess');
    if (sorular === 1) await page.screenshot({ path: path.join(EKRAN, 'final-soru.png') });
    await page.locator('button', { hasText: 'Gönder' }).first().click();
    await page.locator('button.cbtn').nth(2).click({ timeout: 5000 });
    if (mod === 'mcq') {
      await page.locator('button.opt').first().waitFor({ timeout: 8000 });
      var dogruMetin = await page.evaluate(function(){
        var t = document.querySelector('.fn-mcq').textContent;
        var m = Q.data.sinav.mcq.filter(function(x){ return x.q === t; })[0];
        return { d: m.options[m.answer], t: m.options.filter(function(x, i){ return i !== m.answer; })[0] };
      });
      await page.evaluate(function(t){ var b = Array.prototype.filter.call(document.querySelectorAll('button.opt'), function(x){ return x.querySelector('.t').textContent === t; })[0]; b.click(); }, sorular % 2 === 0 ? dogruMetin.d : dogruMetin.t);
      await page.locator('button', { hasText: 'Onayla' }).click();
    }
    await page.locator('.fn-area button', { hasText: 'Devam' }).first().click({ timeout: 8000 });
  }
  ok(sorular === 10, mod + ': 10 soru soruldu (' + sorular + ')');
  try { await page.locator('.fn-rapor').waitFor({ timeout: 20000 }); } catch (e) { await page.screenshot({ path: '/tmp/claude-0/-home-user-ArchiveEGE/b16f30a3-8095-5197-ba7e-cfcb84bd94e4/scratchpad/f.png' }); throw e; }
  await page.screenshot({ path: path.join(EKRAN, 'final-rapor-' + mod + '.png') });
  var rap = await page.evaluate(function(){
    var s = Q.final.son();
    return { n: s.sorular.length, ort: s.sorular.map(function(r){ return r.dogruluk; }), modlar: s.sorular.map(function(r){ return r.mod; }),
      cubuk: document.querySelectorAll('.fn-cubuk').length, istFinal: !!Q.data.stations.final, ilFinal: !!Q.state.ilerleme.final };
  });
  ok(rap.n === 10 && rap.cubuk === 10, mod + ': rapor 10 çubuk');
  ok(!rap.istFinal && !rap.ilFinal, mod + ': final istasyonu/ilerleme kaydı temizlendi');
  if (mod === 'claude') ok(rap.ort.every(function(x){ return x === 95; }), mod + ': hep %95');
  if (mod === 'karma') ok(rap.ort.filter(function(x){ return x === 95; }).length === 5 && rap.ort.filter(function(x){ return x === 20; }).length === 6, mod + ': 5 iyi 6 kötü');
  if (mod === 'mcq') ok(rap.modlar.every(function(x){ return x === 'mcq'; }) && rap.ort.filter(function(x){ return x === 100; }).length === 5, mod + ': yedek MCQ, 5 doğru');
  var tt = page.locator('button', { hasText: 'Temel tura git' }).first();
  if (await tt.count()) {
    await tt.click(); await bekle(300);
    ok(await page.locator('.fn-temel').count() === 1, mod + ': Temel tura git açıldı');
    await page.screenshot({ path: path.join(EKRAN, 'final-temel.png') });
    for (var k = 0; k < 8; k++) { var nx = page.locator('.fn-temel button', { hasText: /Sonraki|Dene bakalım/ }).first(); if (!(await nx.count())) break; await nx.click(); }
    await page.locator('.fn-temel button', { hasText: 'Raporuma dön' }).click();
    await page.locator('.fn-rapor').waitFor({ timeout: 5000 });
    ok(true, mod + ': temel turdan rapora dönüldü');
  }
  await page.locator('.fn-rapor button', { hasText: 'Haritaya dön' }).click();
  await bekle(500);
  var s = await page.evaluate(function(){ return { ilerleme: JSON.stringify(Q.state.ilerleme), onceki: window.__ilerlemeOnce, kayit: Object.keys(localStorage), harita: !!document.querySelector('#a10-tekrar'), bitti: window.__bitti }; });
  ok(s.ilerleme === s.onceki, mod + ': ilerleme değişmedi');
  ok(s.kayit.indexOf('cip-hatti-v1') >= 0, mod + ': cip-hatti-v1 duruyor');
  ok(s.harita && s.bitti === 'tamam', mod + ': harita açıldı, start() tamam döndü');
  ok(o.hatalar.length === 0, mod + ': konsol hatası yok ' + o.hatalar.slice(0, 2).join(' | '));
  await o.browser.close();
}

async function esc(){
  var o = await ac('esc'), page = o.page;
  await page.locator('textarea').first().waitFor({ timeout: 25000 });
  await page.keyboard.press('Escape');
  await bekle(300);
  await page.screenshot({ path: path.join(EKRAN, 'final-esc.png') });
  var menu = await page.locator('button', { hasText: /atla/i }).count();
  ok(menu > 0, 'esc menüsü açıldı');
  await page.locator('button', { hasText: /atla/i }).first().click();
  await page.locator('textarea').first().waitFor({ timeout: 25000 });
  var cur = await page.evaluate(function(){ return Q.runner.info().cur; });
  ok(cur === 1, 'engeli atla -> soru 2 (cur=' + cur + ')');
  await page.keyboard.press('Escape'); await bekle(300);
  await page.locator('button', { hasText: /önceki/i }).first().click();
  await page.locator('textarea').first().waitFor({ timeout: 25000 });
  cur = await page.evaluate(function(){ return Q.runner.info().cur; });
  ok(cur === 0, 'önceki -> soru 1 (cur=' + cur + ')');
  await page.locator('textarea').first().fill('x'); await page.locator('button', { hasText: 'Gönder' }).first().click();
  await page.locator('button.cbtn').nth(1).click();
  await page.locator('button.opt').first().waitFor({ timeout: 8000 });
  await page.keyboard.press('Escape'); await bekle(300);
  await page.locator('button', { hasText: /atla/i }).first().click();
  await page.locator('textarea').first().waitFor({ timeout: 25000 });
  await page.keyboard.press('Escape'); await bekle(300);
  await page.locator('button', { hasText: /başına/i }).first().click();
  await page.locator('textarea').first().waitFor({ timeout: 25000 });
  cur = await page.evaluate(function(){ return Q.runner.info().cur; });
  ok(cur === 0, 'başa dön (cur=' + cur + ')');
  await page.keyboard.press('Escape'); await bekle(300);
  await page.locator('button', { hasText: /Haritaya dön/ }).first().click();
  await bekle(1500);
  var son = await page.evaluate(function(){ return { f: !!Q.data.stations.final, il: !!Q.state.ilerleme.final, cal: Q.final.calisiyor(), tekrar: !!document.querySelector('#a10-tekrar') }; });
  ok(!son.f && !son.il && !son.cal && son.tekrar, 'çıkışta final temizlendi, harita açık ' + JSON.stringify(son));
  ok(o.hatalar.length === 0, 'esc: konsol hatası yok ' + o.hatalar.slice(0, 2).join(' | '));
  await o.browser.close();
}

(async function(){
  fs.mkdirSync(EKRAN, { recursive: true });
  var hedef = process.argv[2];
  var liste = hedef ? [hedef] : ['claude', 'mcq', 'karma', 'esc'];
  for (var i = 0; i < liste.length; i++) { if (liste[i] === 'esc') await esc(); else await kos(liste[i]); }
  process.stdout.write(fails ? fails + ' BAŞARISIZ\n' : 'HEPSİ GEÇTİ\n');
  process.exit(fails ? 1 : 0);
})().catch(function(e){ console.error(e); process.exit(1); });
