#!/usr/bin/env node
/* tekrar-hata.test.js: Tekrar Merkezi > Hata defterini çalış, AI'a sor, Biliyorum (Playwright, 1366x768, sahte AI).
 * Kullanım: bash oyun/build.sh && node oyun/test/tekrar-hata.test.js */
'use strict';
var path = require('path'), assert = require('assert');
var chromium = require('playwright').chromium;
var DIST = path.join(__dirname, '..', 'dist', 'oyun.html');
var n = 0;
function ok(c, m){ assert.ok(c, m); n++; process.stdout.write('GEÇTİ ' + m + '\n'); }
function bekle(ms){ return new Promise(function(r){ setTimeout(r, ms); }); }

(async function(){
  var br = await chromium.launch(), ctx = await br.newContext({ viewport: { width: 1366, height: 768 } });
  var page = await ctx.newPage(), hatalar = [], istekler = [];
  page.on('pageerror', function(e){ hatalar.push(String(e)); });
  await page.route(/fonts\.(googleapis|gstatic)\.com/, function(r){ r.abort(); });
  var mod = 'ok';
  await page.route('https://api.anthropic.com/**', async function(r){
    istekler.push(r.request().postData());
    if (mod === 'ag') return r.abort('failed');
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ content: [{ type: 'text', text: 'Miller indices (Miller indisleri) düzlemleri tanımlar.' }] }) });
  });
  await page.goto('file://' + DIST); await bekle(700);
  async function ev(f, a){ return page.evaluate(f, a); }
  await ev(function(){ if (Q.settings.closeMap) Q.settings.closeMap(); });
  async function sekme(ad){ await page.locator('.tk-tabs button', { hasText: ad }).click(); await bekle(150); }

  await ev(function(){ Q.state.hataDefteri.length = 0; Q.tekrar.open(); });
  await sekme('Hata defterini çalış');
  ok(await page.locator('#th-bos').isVisible(), 'boş defter ekranı');

  var kv = await ev(function(){
    return Q.data.stations.s03.engeller.filter(function(o){ return o.tip === 'dusman'; }).slice(0, 2).map(function(o){ return o.kavram; });
  });
  await ev(function(k){
    Q.state.hataDefteri.push({ id: 'hd-1', kavram: k[0], istasyon: 's03', tur: 'emin-yanlis', engel: 'x', tarih: 1, tekrar: 0, cozuldu: false });
    Q.state.hataDefteri.push({ id: 'hd-2', kavram: k[1], istasyon: 's03', tur: 'yanlis', engel: 'x', tarih: 1, tekrar: 0, cozuldu: false });
  }, kv);
  await sekme('Terimler'); await sekme('Hata defterini çalış');
  ok(await page.locator('.th-kart').count() === 2, 'iki kayıt listelendi');
  ok(/Doğru cevap:/.test(await page.locator('.th-kart').first().innerText()), 'doğru cevap + neden görünür');
  await page.locator('.th-kart button', { hasText: 'İpucu göster' }).first().click();
  ok(/İpucu:/.test(await page.locator('.th-kart').first().innerText()), 'ipucu açılır');

  var s = await ev(function(){
    var k = Q.state.hataDefteri[0], r = [];
    Q.tekrarHata.cevapla(k, false); r.push(!!k.cozuldu);
    Q.tekrarHata.cevapla(k, true); r.push(!!k.ogrenildi, !!k.cozuldu);
    Q.tekrarHata.cevapla(k, false); r.push(!!k.ogrenildi);
    Q.tekrarHata.cevapla(k, true); r.push(Q.tekrarHata.cevapla(k, true).cikti, !!k.cozuldu);
    return r;
  });
  ok(s[0] === false && s[1] === true && s[2] === false && s[3] === false && s[4] === true && s[5] === true, 'yanlış kalır, 1 doğru öğrenildi, 2 art arda doğru defterden çıkar');
  await ev(function(){ var h = Q.state.hataDefteri[0]; h.cozuldu = false; h.seri = 0; h.ogrenildi = false; });

  await sekme('Terimler'); await sekme('Hata defterini çalış');
  await page.locator('#th-hepsi').click(); await bekle(200);
  ok(await page.locator('.tk-soru').count() > 0, 'çözme modu soruyu gösterir');
  var yanlisIdx = await ev(function(){
    var k = Q.state.hataDefteri.filter(function(h){ return !h.cozuldu; });
    var qs = k.map(function(h){ return Q.tekrarHata.soruBul(h); });
    return qs[0].secenekler.map(function(s){ return !!s.dogru; });
  });
  var iy = yanlisIdx.indexOf(false);
  await page.locator('.tk-body .opt, .tk-body [role=radio], .tk-body [data-idx]').nth(iy).click().catch(function(){});
  await page.screenshot({ path: path.join(__dirname, 'ciktilar', 'hata-coz.png') }).catch(function(){});

  await ev(function(){ Q.tekrar.git('ai'); }); await bekle(300);
  ok(await page.locator('#th-anahtar-yok').isVisible(), 'anahtar yok: nazik uyarı');
  ok(await page.locator('#th-anahtar-yok button', { hasText: "Ayarlar'a git" }).isVisible(), "Ayarlar'a git düğmesi");

  await ev(function(){ Q.state.hataDefteri.forEach(function(h){ h.cozuldu = false; }); return Q.claude.setApiKey('sk-test-123'); });
  await ev(function(){ Q.tekrar.git('ai'); }); await bekle(300);
  ok(await page.locator('#th-giris').isVisible(), 'anahtar var: sohbet açılır');
  await page.locator('#th-giris').fill('Miller indisini anlat'); await page.locator('#th-gonder').click(); await bekle(500);
  ok(/Miller indices/.test(await page.locator('#th-akis').innerText()), 'yanıt ekranda');
  var g = JSON.parse(istekler[istekler.length - 1]);
  ok(/English \(Türkçe\)/.test(g.system) && /EN ÇOK YANLIŞ/.test(g.system), 'sistem istemi: terim kuralı + en çok yanlış kavramlar');
  ok(istekler.every(function(b){ return b.indexOf('sk-test') < 0; }), 'anahtar gövdede yok');
  await sekme('Terimler'); await sekme("AI'a sor");
  ok(/Miller indices/.test(await page.locator('#th-akis').innerText()), 'geçmiş sekme değişince kalır');
  await sekme('Hata defterini çalış');
  await page.locator('.th-kart button', { hasText: "AI'a sor" }).first().click(); await bekle(600);
  ok(/Hata defterimdeki/.test(await page.locator('#th-akis').innerText()), 'kayıttan sohbet o soruyla açıldı');
  mod = 'ag'; await page.locator('#th-giris').fill('deneme ag'); await page.locator('#th-gonder').click(); await bekle(500);
  ok(/Bağlantı kurulamadı/.test(await page.locator('#th-hata').innerText()), 'ağ hatası anlaşılır mesaj');
  ok(/deneme ag/.test(await page.locator('#th-akis').innerText()), 'yazılan mesaj ekranda kaldı');
  mod = 'ok'; await page.locator('#th-tekrar-dene').click(); await bekle(500);
  ok(await page.locator('#th-hata').count() === 0, 'tekrar dene çalışır');
  await page.screenshot({ path: path.join(__dirname, 'ciktilar', 'ai-sohbet.png') }).catch(function(){});

  await sekme('Terimler');
  var t0 = await page.locator('.tk-t').count();
  var ilk = await page.locator('.tk-t b').first().innerText();
  await page.locator('.tk-bil').first().click();
  ok(await page.locator('.tk-t').count() === t0 - 1, 'Biliyorum terimi ana listeden çıkarır');
  ok(/Biliyorum: 1 \//.test(await page.locator('.tk-body').first().innerText()), 'sayaç');
  await sekme('Biliyorum');
  ok((await page.locator('.tk-t b').first().innerText()) === ilk, 'Biliyorum sayfasında görünür');
  await ev(function(){ Q.save.flush(); });
  ok(await ev(function(){ return JSON.parse(localStorage.getItem('cip-hatti-v1')).biliyorum.length === 1; }), 'cip-hatti-v1 içine yazıldı');
  await page.locator('.tk-geri').first().click();
  ok(await ev(function(){ return Q.state.biliyorum.length === 0; }), 'geri al');
  await sekme('Test'); ok(await page.locator('.tk-atla').isChecked(), 'test: atla seçeneği varsayılan açık');
  await sekme('Deneme'); ok(await page.locator('.tk-atla').count() === 1, 'deneme: atla seçeneği');
  await sekme('Açıklama'); ok(await page.locator('.tk-atla').count() === 1, 'kartlar: atla seçeneği');
  ok(await ev(function(){ return document.documentElement.scrollWidth <= innerWidth; }), '1366x768 yatay taşma yok');
  ok(hatalar.length === 0, 'sayfa hatası yok ' + hatalar.join('|'));
  await br.close();
  process.stdout.write('\n' + n + ' kontrol geçti\n');
})().catch(function(e){ console.error('KALDI', e); process.exit(1); });
