#!/usr/bin/env node
/* smoke.js (A9) — dist/oyun.html duman testi (08 §5). Playwright + Chromium önceden kurulu.
 * Kullanım: node oyun/test/smoke.js   (önce: bash oyun/build.sh)
 * Ekran görüntüleri: oyun/test/ekran/. Çıkış kodu: başarısız adım varsa 1. */
'use strict';
var path = require('path');
var fs = require('fs');
var chromium = require('playwright').chromium;

var DIST = path.join(__dirname, '..', 'dist', 'oyun.html');
var EKRAN = path.join(__dirname, 'ekran');
var sonuclar = [];

function adim(ad, ok, ayrinti) {
  sonuclar.push({ ad: ad, ok: !!ok });
  process.stdout.write((ok ? '\x1b[32mGEÇTİ\x1b[0m ' : '\x1b[31mKALDI\x1b[0m ') + ad + (ayrinti ? ' — ' + ayrinti : '') + '\n');
}
function bekle(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

(async function () {
  if (!fs.existsSync(DIST)) { process.stdout.write('dist/oyun.html yok; önce build.sh çalıştır\n'); process.exit(1); }
  fs.mkdirSync(EKRAN, { recursive: true });
  var browser = await chromium.launch();
  var page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  var konsol = [];
  page.on('console', function (m) { if (m.type() === 'error') konsol.push(m.text()); });
  page.on('pageerror', function (e) { konsol.push(String(e)); });
  // Google Fonts çevrimdışı olabilir; font isteklerini sustur
  await page.route(/fonts\.(googleapis|gstatic)\.com/, function (r) { r.abort(); });

  async function ev(fn, arg) { return page.evaluate(fn, arg); }
  async function tikla(metin) {
    var h = page.locator('button', { hasText: metin }).first();
    await h.click({ timeout: 4000 });
  }
  async function ekran(ad) { try { await page.screenshot({ path: path.join(EKRAN, ad + '.png') }); } catch (e) { /* yoksay */ } }

  try {
    await page.goto('file://' + DIST);
    await bekle(800);

    // 1. Konsol hatası yok (font isteği hariç)
    var gercek = konsol.filter(function (k) { return !/fonts\.|ERR_FAILED|net::/.test(k); });
    adim('1 konsol hatası yok', gercek.length === 0, gercek.slice(0, 3).join(' | '));

    // 2. Hoş geldin -> Başla -> harita; s01 açık, s02 kilitli
    var basla = page.locator('button', { hasText: /^(Başla|Devam)$/ }).first();
    var baslaVar = await basla.count();
    if (baslaVar) await basla.click();
    await bekle(500);
    var acik = await ev(function () {
      return { s1: Q.settings.istasyonAcik('s01'), s2: Q.settings.istasyonAcik('s02') };
    });
    adim('2 harita: s01 açık, s02 kilitli', baslaVar && acik.s1 === true && acik.s2 === false, JSON.stringify(acik));
    await ekran('harita');

    // 3. Ayarlar -> Her yere eriş aç/kapat
    await ev(function () { Q.settings.open(); });
    await bekle(300);
    await ekran('ayarlar');
    var anahtar = page.locator('label, .row, .ayar', { hasText: /Her yere eri/ }).locator('input[type=checkbox], button[role=switch], [role=switch]').first();
    var tiklaAnahtar = async function () { if (await anahtar.count()) await anahtar.click(); else await ev(function () { Q.settings.set('kilitleriAc', !Q.settings.get('kilitleriAc')); }); };
    await tiklaAnahtar(); await bekle(200);
    var a1 = await ev(function () { return ['s02', 's05', 's09'].every(function (i) { return Q.settings.istasyonAcik(i); }); });
    await tiklaAnahtar(); await bekle(200);
    var a2 = await ev(function () { return Q.settings.istasyonAcik('s02'); });
    adim('3 her yere eriş aç/kapat', a1 === true && a2 === false, 'açık=' + a1 + ' kapalı s02=' + a2);
    await ev(function () { Q.settings.close(); });

    await ev(function () {
      Q.settings.closeMap();
      Q.settings.set('hikayeAtla', true);
      var m = Q.sim.mount;
      Q.sim.mount = function (modul, host, params, api) { window.__simApi = api; return m.call(Q.sim, modul, host, params, api); };
    });
    // 4. s01 başlat: ilk engelde koşucu durur (<2 sn), dock dolar
    await ev(function () { window.__sonuc = null; Q.runner.start('s01', 0).then(function (r) { window.__sonuc = r; }); });
    var t0 = Date.now(), durdu = false;
    while (Date.now() - t0 < 45000) {
      var dock = await ev(function () { var d = document.getElementById('dock'); return d ? d.children.length : 0; });
      if (dock > 0) { durdu = true; break; }
      await bekle(250);
    }
    adim('4 ilk engelde duruş ve dock dolu', durdu, ((Date.now() - t0) / 1000).toFixed(1) + ' sn');
    await ekran('yol-engel');

    // 5. hikaye -> Devam; kavram simülasyonu açılır (api.done testte tetiklenir)
    var devam = page.locator('#dock button', { hasText: /Devam|İleri|Tamam/ }).first();
    var simAcildi = false;
    t0 = Date.now();
    while (Date.now() - t0 < 60000) {
      simAcildi = await ev(function () { return !!document.querySelector('#dock .sim, #dock canvas, #dock .sim-host'); });
      if (simAcildi) break;
      try { if (await devam.count()) await devam.click({ timeout: 1500 }); } catch (e) { /* sahne geçişi */ }
      await bekle(400);
    }
    adim('5 hikaye geçildi, kavram simülasyonu açıldı', simAcildi);
    await ev(function () { if (window.__simApi && window.__simApi.done) window.__simApi.done({ basari: true, olcum: {} }); });

    try { await page.locator('#dock button', { hasText: /Devam/ }).first().click({ timeout: 8000 }); } catch (e) { /* kavram sonrası Devam */ }
    // 6. dusman: seçenek -> eminlik -> açıklama -> Devam
    var opt = page.locator('#dock .opt').first();
    var optVar = false;
    try { await opt.waitFor({ timeout: 30000 }); optVar = true; await opt.click(); } catch (e) { /* yok */ }
    var emin = page.locator('#dock .cbtn').first();
    try { await emin.waitFor({ timeout: 5000 }); await emin.click(); } catch (e) { optVar = false; }
    await bekle(600);
    var aciklama = await ev(function () { var d = document.getElementById('dock'); return d ? d.textContent.trim().length : 0; });
    adim('6 düşman: seçenek, eminlik, açıklama', optVar && aciklama > 0);

    // 7. Voltaj 0 -> KISA DEVRE -> temel tur -> kontrol noktası
    var kd = await ev(function () {
      var gorulen = false;
      Q.bus.on('kisa-devre', function () { gorulen = true; window.__kd = true; });
      Q.state.voltaj = 0;
      try { Q.battle.apply({ dogru: false, eminlik: 2, dogruluk: null, kavram: null, agirlik: 1, notlar: 'smoke' }); } catch (e) { return String(e); }
      return gorulen || !!window.__kd;
    });
    await bekle(1500);
    var metin = await ev(function () { return document.body.textContent; });
    adim('7 kısa devre tetiklendi', kd === true || /KISA DEVRE/i.test(metin), String(kd));

    // 8. Yol ölçüsü
    var yol = await ev(function () { var r = document.getElementById('runway').getBoundingClientRect(); return { w: r.width, h: r.height }; });
    adim('8 yol ölçüsü ≥1380x450', yol.w >= 1380 && yol.h >= 450, Math.round(yol.w) + 'x' + Math.round(yol.h));

    // 9. Metin sınırı: dock ve balon ≤ 25 kelime
    var uzun = await ev(function () {
      var bad = [];
      document.querySelectorAll('#dock .bubble, #bubble-layer .bubble').forEach(function (e) {
        var n = e.textContent.trim().split(/\s+/).filter(Boolean).length;
        if (n > 25) bad.push(n);
      });
      return bad;
    });
    adim('9 balon metinleri ≤25 kelime', uzun.length === 0, uzun.join(','));

    // Ekran görüntüleri: patron paneli ve hata defteri (varsa)
    try {
      await ev(function () { Q.state.ayarlar.kilitleriAc = true; });
      await ekran('son-durum');
    } catch (e) { /* yoksay */ }
  } catch (e) {
    adim('beklenmeyen hata', false, String(e && e.message || e).split('\n')[0]);
    await ekran('hata');
  }
  await browser.close();
  var kalan = sonuclar.filter(function (s) { return !s.ok; }).length;
  process.stdout.write(sonuclar.length - kalan + '/' + sonuclar.length + ' adım geçti\n');
  process.exit(kalan ? 1 : 0);
})();
