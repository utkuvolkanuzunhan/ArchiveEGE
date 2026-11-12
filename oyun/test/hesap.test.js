#!/usr/bin/env node
/* hesap.test.js: Tekrar Merkezi > Hesap çalıştayı (Playwright, 1366x768 ve 1440x900).
 * Kullanım: bash oyun/build.sh && node oyun/test/hesap.test.js */
'use strict';
var path = require('path'), assert = require('assert');
var chromium = require('playwright').chromium;
var DIST = path.join(__dirname, '..', 'dist', 'oyun.html');
var n = 0;
function ok(c, m){ assert.ok(c, m); n++; process.stdout.write('GEÇTİ ' + m + '\n'); }
function bekle(ms){ return new Promise(function(r){ setTimeout(r, ms); }); }

(async function(){
  var br = await chromium.launch(), ctx = await br.newContext({ viewport: { width: 1366, height: 768 } });
  var page = await ctx.newPage(), hatalar = [];
  page.on('pageerror', function(e){ hatalar.push(String(e)); });
  await page.route(/fonts\.(googleapis|gstatic)\.com/, function(r){ r.abort(); });
  await page.goto('file://' + DIST); await bekle(700);
  async function ev(f, a){ return page.evaluate(f, a); }
  await ev(function(){ if (Q.settings.closeMap) Q.settings.closeMap(); });

  /* veri / API */
  var v = await ev(function(){
    var L = Q.data.hesap, st = {}, hatalar = [];
    L.forEach(function(g){
      if (!/^s(0[1-9]|10)$/.test(g.istasyon)) hatalar.push(g.id + ' istasyon');
      if (!(g.adimlar.length >= 2 && g.adimlar.length <= 4)) hatalar.push(g.id + ' adım sayısı ' + g.adimlar.length);
      if (!g.sonuc || !isFinite(g.sonuc.deger) || !g.sonuc.birim || !g.sinavNotu || !g.soru || !g.baslik) hatalar.push(g.id + ' eksik alan');
      if (['sinav', 'alistirma'].indexOf(g.tip) < 0) hatalar.push(g.id + ' tip');
      if (!g.ornek || !g.ornek.yontem || g.ornek.yontem.length < 3 || g.ornek.yontem.length > 5 || g.ornek.adimlar.length !== g.adimlar.length || !g.ornek.soru || !g.ornek.sonuc || !isFinite(g.ornek.sonuc.deger)) hatalar.push(g.id + ' ornek');
      if (!Q.hesap.konular[g.konu]) hatalar.push(g.id + ' konu');
      if (g.istasyonSonu) st[g.istasyon] = (st[g.istasyon] || 0) + 1;
    });
    var ids = L.map(function(g){ return g.id; });
    if (ids.length !== new Set(ids).size) hatalar.push('yinelenen id');
    return { n: L.length, st: st, hatalar: hatalar, q5: !!Q.hesap.gorev('q5-bolgeler'), q6: Q.hesap.istasyonSonu('s06').length, yok: Q.hesap.gorev('yok') };
  });
  ok(v.hatalar.length === 0, 'görev şeması geçerli ' + JSON.stringify(v.hatalar));
  ok(v.n >= 30, 'görev sayısı ' + v.n);
  ok(['s01', 's02', 's03', 's04', 's05', 's06', 's07', 's08', 's09', 's10'].every(function(s){ return v.st[s] >= 1; }), 'her istasyonda istasyonSonu görevi var');
  ok(v.q5 && v.q6 >= 1 && v.yok === null, 'Q.hesap.gorev / istasyonSonu API');
  var s = await ev(function(){ var f = Q.tekrarHesap.sayiOku; return [f('1,5'), f('1.5e-4'), f('1,96×10^-8'), f('2e4 cm'), f('abc')]; });
  ok(s[0] === 1.5 && s[1] === 1.5e-4 && Math.abs(s[2] - 1.96e-8) < 1e-12 && s[3] === 2e4 && isNaN(s[4]), 'sayı ayrıştırma (virgül, e-gösterim, ×10^)');
  var k = await ev(function(){ var c = Q.tekrarHesap.kontrol; return [c('0.0295', 0.02944).ok, c('0.04', 0.02944).ok, c('x', 1).gecersiz, c('0.00294', 0.02944).ters]; });
  ok(k[0] && !k[1] && k[2] && k[3], '±%2 tolerans kontrolü ve mertebe uyarısı');

  for (var vp of [[1366, 768], [1440, 900]]) {
    await page.setViewportSize({ width: vp[0], height: vp[1] });
    await ev(function(){ Q.state.hesapCalisma = {}; Q.tekrar.open(); });
    await page.locator('.tk-tabs button', { hasText: 'Hesap çalıştayı' }).click(); await bekle(200);
    await page.locator('select[aria-label="Konu filtresi"]').selectOption('hepsi'); await page.locator('select[aria-label="İstasyon filtresi"]').last().selectOption('hepsi'); await bekle(100);
    ok(await page.locator('.hc-it').count() === v.n, vp[0] + ': tüm görevler listelendi');
    /* filtre */
    await page.locator('select[aria-label="İstasyon filtresi"]').last().selectOption('s06'); await bekle(100);
    var c6 = await page.locator('.hc-it').count();
    ok(c6 >= 3 && c6 < v.n, vp[0] + ': istasyon filtresi (' + c6 + ')');
    await page.locator('select[aria-label="Konu filtresi"]').selectOption('basamak'); await bekle(100);
    ok(await page.locator('.hc-it').count() === 2, vp[0] + ': konu filtresi (basamak = 2)');
    /* Soru 6, E > V0 */
    await page.locator('.hc-it[data-id="q6-e-gt"]').click(); await bekle(150);
    /* görev seçilince önce örnek çözüm paneli */
    ok(await page.locator('.hc-sag .ho-panel').count() === 1 && await page.locator('.hc-soru').count() === 0 && /Yöntem: kural/.test(await page.locator('.ho-yontem').innerText()), vp[0] + ': görev seçilince önce "Önce bir örnek" paneli (Yöntem + örnek)');
    await page.locator('.ho-ileri').click(); await page.locator('.ho-ileri').click(); await bekle(80);
    ok(await page.locator('.ho-adim').count() === 2, vp[0] + ': örnek adım adım açılır');
    var tasO = await ev(function(){ var sg = document.querySelector('.hc-sag'), b = document.querySelector('.ho-hazir').getBoundingClientRect(), r = document.getElementById('tk-root').getBoundingClientRect(); return sg.scrollWidth > sg.clientWidth + 1 || b.bottom > r.bottom + 1; });
    ok(!tasO, vp[0] + ': örnek panelinde taşma yok, "Hazırım" düğmesi görünür');
    if (vp[0] === 1366) await page.screenshot({ path: path.join(__dirname, 'ciktilar', 'hesap-ornek-tekrar-1366.png') });
    await page.locator('.ho-hazir').click(); await bekle(120);
    ok(await page.locator('.hc-ornek-tekrar').count() === 1 && await page.locator('.hc-soru').count() === 1, vp[0] + ': "Hazırım" ile görev gelir; "Örneği tekrar göster" bağlantısı var');
    ok(/potential step/.test(await page.locator('.hc-soru').innerText()), vp[0] + ': soru İngilizce gösterildi');
    await page.fill('#hc-cevap', '0.5'); await page.locator('button', { hasText: 'Kontrol et' }).click();
    ok(/Henüz olmadı/.test(await page.locator('#hc-fb').innerText()), vp[0] + ': yanlış cevap reddedildi');
    await page.fill('#hc-cevap', '0,0294'); await page.locator('button', { hasText: 'Kontrol et' }).click();
    ok(/Doğru/.test(await page.locator('#hc-fb').innerText()), vp[0] + ': doğru cevap (virgüllü) kabul edildi');
    /* adım adım: ilk adımda ara soru */
    await page.locator('#hc-adim-goster').click(); await bekle(100);
    await page.fill('.hc-adim-giris', '999'); await page.locator('.hc-adim button', { hasText: 'Kontrol' }).click(); await bekle(80);
    ok(await page.locator('.ho-adim-link').count() === 1 && /Örnekteki 1\. adıma bak/.test(await page.locator('.ho-adim-link').innerText()), vp[0] + ': yanlış ara cevapta "Örnekteki 1. adıma bak"');
    await page.locator('.ho-adim-link').click(); await bekle(100);
    ok(await page.locator('.hc-ovl .ho-adim.vurgu').count() === 1, vp[0] + ': bağlantı örneğin ilgili adımını vurgular');
    await page.locator('.hc-ovl .ho-hazir').click(); await bekle(80);
    ok(await page.locator('.hc-ovl').count() === 0 && await page.locator('.hc-adim-giris').count() === 1, vp[0] + ': "Göreve dön" ilerlemeyi korur');
    ok(await page.locator('.hc-adim-giris').count() === 1 && await page.locator('#hc-adim-goster').isDisabled(), vp[0] + ': adım ara cevap ister, sonraki kilitli');
    ok(!/e\^\{ik/.test(await page.locator('.hc-adim').first().innerText()), vp[0] + ': çözüm ara cevaptan önce gizli');
    await page.fill('.hc-adim-giris', '16.2'); await page.locator('.hc-adim button', { hasText: 'Kontrol' }).click(); await bekle(100);
    ok(await page.locator('.hc-adim .hc-formul').count() === 1 && await page.locator('#hc-adim-goster').isEnabled(), vp[0] + ': doğru ara cevap formülü açtı');
    await page.locator('#hc-adim-goster').click(); await bekle(50);
    await page.locator('.hc-adim').nth(1).locator('button', { hasText: 'Çözümü göster' }).click(); await bekle(50);
    ok(await page.locator('.hc-adim').nth(1).locator('.hc-formul').count() === 1, vp[0] + ': "Çözümü göster" ile adım açılır');
    await page.locator('#hc-tumu').click(); await bekle(100);
    ok(await page.locator('#hc-sonuc').isVisible() && await page.locator('#hc-not').isVisible() && /Sınavda dikkat/.test(await page.locator('#hc-not').innerText()), vp[0] + ': sonuç, formül özeti, sınavda dikkat');
    ok(await page.locator('.hc-formul sub').count() > 0, vp[0] + ': alt indis sub olarak çizildi');
    /* taşma: sayfa ve sağ panel */
    var tas = await ev(function(){
      var r = document.getElementById('tk-root'), sag = document.querySelector('.hc-sag');
      return { yatay: document.documentElement.scrollWidth > innerWidth + 1 || r.scrollWidth > r.clientWidth + 1, sagYatay: sag.scrollWidth > sag.clientWidth + 1, sagUst: r.getBoundingClientRect().bottom <= innerHeight + 1 };
    });
    ok(!tas.yatay && !tas.sagYatay && tas.sagUst, vp[0] + ': yatay taşma yok, kök pencere ekrana sığıyor');
    /* işaret + kayıt */
    await page.locator('#hc-cozdum').click(); await bekle(80);
    ok(await ev(function(){ return Q.state.hesapCalisma['q6-e-gt'] === 'cozdum'; }), vp[0] + ': Çözdüm işareti Q.state.hesapCalisma\'ya yazıldı');
    await page.locator('#hc-tekrar').click(); await bekle(80);
    ok(await ev(function(){ return Q.state.hesapCalisma['q6-e-gt'] === 'tekrar'; }), vp[0] + ': Tekrar çalış işareti');
    var kay = await ev(function(){ Q.save.flush && Q.save.flush(); return localStorage.getItem('cip-hatti-v1'); });
    ok(kay && JSON.parse(kay).hesapCalisma['q6-e-gt'] === 'tekrar' && JSON.parse(kay).v === 1, vp[0] + ': kayıt cip-hatti-v1 içinde, v=1 korunuyor');
    /* Soru 5 görevi uzun içerik taşması */
    await page.locator('select[aria-label="İstasyon filtresi"]').last().selectOption('hepsi');
    await page.locator('select[aria-label="Konu filtresi"]').selectOption('kuyu'); await bekle(100);
    await page.locator('.hc-it[data-id="q5-sayisal"]').click(); await bekle(100);
    await page.locator('.ho-gec').click(); await bekle(100);
    await page.locator('#hc-tumu').click(); await bekle(100);
    ok(/brentq/.test(await page.locator('.hc-kod').innerText()), vp[0] + ': Python kodu gösterildi');
    var tas2 = await ev(function(){ var sag = document.querySelector('.hc-sag'), r = document.getElementById('tk-root'); return sag.scrollWidth > sag.clientWidth + 1 || r.scrollWidth > r.clientWidth + 1; });
    ok(!tas2, vp[0] + ': Soru 5 çözümünde yatay taşma yok');
    if (vp[0] === 1366) await page.screenshot({ path: path.join(__dirname, 'ciktilar', 'hesap-1366.png') });
    await ev(function(){ Q.tekrar.close(); });
  }
  /* eski kayıt (hesapCalisma yok) bozulmaz */
  var eski = await ev(function(){ delete Q.state.hesapCalisma; Q.tekrar.open(); return true; });
  await page.locator('.tk-tabs button', { hasText: 'Hesap çalıştayı' }).click(); await bekle(150);
  ok(await page.locator('.hc-it').count() > 0, 'hesapCalisma alanı olmayan eski kayıtla açılır');
  ok(hatalar.length === 0, 'sayfa hatası yok ' + hatalar.join(' | '));
  await br.close();
  process.stdout.write('\n' + n + ' kontrol geçti\n');
})().catch(function(e){ console.error('BAŞARISIZ:', e && e.stack || e); process.exit(1); });
