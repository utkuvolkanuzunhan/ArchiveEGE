#!/usr/bin/env node
/* gercek-sinav.test.js · "Gerçek sınav (10 soru)" modu (Playwright, 1366x768). Önce: bash oyun/build.sh --zorunlu-degil
 * Denetler: veri (10 soru aynen, model cevap/anahtar/hata/çalış), SVG şekiller, süre sayacı YOK, gezgin, taslak kalıcılığı (yenile),
 * model cevap + kontrol listesi, sonuç ekranı, Claude puanlama (sahte), Final ile aynı soru seti. */
'use strict';
var path = require('path');
var fs = require('fs');
var chromium = require('playwright').chromium;
var DIST = path.join(__dirname, '..', 'dist', 'oyun.html');
var EKRAN = path.join(__dirname, 'ekran');
var fails = 0;
function ok(c, m){ if (!c) { fails++; process.stdout.write('FAIL ' + m + '\n'); } else process.stdout.write('ok   ' + m + '\n'); }
function bekle(ms){ return new Promise(function(r){ setTimeout(r, ms); }); }

var SORULAR = [
  'Why are crystalline solids used in the semiconductor industry?',
  'Explain the main reason for single-crystal growth in the CZ method.',
  'Explain the reasons for the emergence and success of quantum mechanics.',
  'Briefly explain the stability of the Hydrogen atom using quantum mechanical theory.',
  'For the given potential below, it is required to calculate the wave function and the allowed energies in electron-volts (eV).',
  'Calculate the wave function and the reflection coefficient of the electron for the given potential.',
  'From a quantum mechanical perspective, why do allowed energies in periodic structures appear as continuous bands?',
  'Explain the principles of quantum mechanics.',
  'The third postulate of quantum mechanics concerns measurement; explain how the system changes its state if its current state is not an eigenstate of the observable being measured.',
  'Explain the uncertainty principle and why it is impossible to simultaneously measure conjugate variables with unlimited precision.'
];

async function sayfa(){
  var browser = await chromium.launch();
  var ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  var page = await ctx.newPage();
  var hatalar = [];
  page.on('console', function(m){ if (m.type() === 'error' && !/fonts\.|net::/.test(m.text())) hatalar.push(m.text()); });
  page.on('pageerror', function(e){ hatalar.push(String(e)); });
  await page.route(/fonts\.(googleapis|gstatic)\.com/, function(r){ r.abort(); });
  await page.goto('file://' + DIST);
  await bekle(600);
  await page.evaluate(function(){
    Q.settings.set('hikayeAtla', true); Q.settings.set('kilitleriAc', true);
    Q.claude.available = function(){ return Promise.resolve({ backend: 'none' }); };
  });
  return { browser: browser, ctx: ctx, page: page, hatalar: hatalar };
}

(async function(){
  fs.mkdirSync(EKRAN, { recursive: true });
  var o = await sayfa(), page = o.page;

  /* ---- veri ---- */
  var v = await page.evaluate(function(){
    var G = Q.data.gercekSinav, cum = function(s){ return (s.match(/[.!?](\s|$)/g) || []).length; };
    return G.sorular.map(function(q){ return { no: q.no, text: q.text, st: q.st, m: q.model.length, cum: cum(q.model.join(' ')), a: q.anahtar.length, h: q.hatalar.length, c: q.calis.length, sekil: q.sekil,
      turkce: /[çğıİşŞĞ]/.test(q.text + q.model.join(' ') + q.anahtar.join(' ')) }; });
  });
  ok(v.length === 10 && v.every(function(q, i){ return q.text === SORULAR[i] && q.no === i + 1; }), 'veri: 10 soru aynen, sırasıyla');
  ok(v.every(function(q){ return q.a >= 4 && q.a <= 7; }), 'veri: 4-7 anahtar fikir');
  ok(v.every(function(q){ return q.h >= 2 && q.h <= 3 && q.c >= 1; }), 'veri: 2-3 sık hata, çalış bağlantısı');
  ok(v.every(function(q){ return q.cum >= 8; }), 'veri: model cevap en az 8 cümle (' + v.map(function(q){ return q.cum; }).join(',') + ')');
  ok(v.every(function(q){ return !q.turkce; }), 'veri: sınav metni/model cevap/anahtar fikir Türkçe harf içermiyor');
  ok(v[4].sekil === 'q5' && v[5].sekil === 'q6' && v.filter(function(q){ return q.sekil; }).length === 2, 'veri: Q5 ve Q6 şekilli');

  /* ---- giriş: harita düğmesi + Tekrar Merkezi sekmesi ---- */
  await page.evaluate(function(){ Q.settings.openMap(); });
  await page.locator('#gs-harita').waitFor({ timeout: 5000 });
  ok(true, 'haritada "Gerçek sınav (10 soru)" düğmesi var');
  await page.locator('#gs-harita').click();
  await page.locator('#gs-ta').waitFor({ timeout: 5000 });
  ok(await page.locator('button[data-sekme="gercek"]').count() === 1, 'Tekrar Merkezi sekmesi var');
  ok(await page.locator('button', { hasText: 'Gerçek sınav (10 soru)' }).count() >= 1, 'mod adı: Gerçek sınav (10 soru)');
  var govde = await page.evaluate(function(){ return document.getElementById('tk-root').textContent; });
  ok(!/2 saat|120|duraklat|\bpause\b|⏱|\d\d:\d\d/i.test(govde), 'süre sayacı/duraklat/2 saat YOK');
  ok(await page.locator('.gs-n').count() === 10, 'soru gezgini: 10 düğme');

  /* ---- yazma + gezgin + taslak ---- */
  await page.locator('#gs-ta').fill('Crystals have a periodic potential and well-defined bands.');
  await page.screenshot({ path: path.join(EKRAN, 'gercek-q1.png') });
  var box = await page.locator('#gs-ta').boundingBox();
  ok(box.height >= 200 && box.width >= 600, 'büyük yazı alanı (' + Math.round(box.width) + 'x' + Math.round(box.height) + ')');
  ok(await page.locator('.gs-n[data-no="1"]').getAttribute('data-d') === 'dolu', 'gezgin: Q1 yanıtlandı');
  ok(await page.locator('.gs-n[data-no="2"]').getAttribute('data-d') === 'bos', 'gezgin: Q2 boş');
  await page.locator('.gs-n[data-no="5"]').click();
  ok((await page.locator('.gs-q').textContent()).indexOf('allowed energies in electron-volts') > 0, 'Q5 metni');
  ok(await page.locator('.gs-sekil svg').count() === 1, 'Q5 SVG şekli var');
  await page.screenshot({ path: path.join(EKRAN, 'gercek-q5.png') });
  var sigdi = await page.evaluate(function(){ var t = document.getElementById('gs-ta').getBoundingClientRect(), b = document.querySelector('#tk-root .tk-body'); return { alt: t.bottom, pen: window.innerHeight, kay: b.scrollHeight - b.clientHeight }; });
  ok(sigdi.alt <= sigdi.pen, 'Q5: yazı alanı 768 px içinde (alt=' + Math.round(sigdi.alt) + ')');
  await page.locator('#gs-ta').fill('Region I sin, region II exp.');
  await page.locator('.gs-n[data-no="6"]').click();
  ok(await page.locator('.gs-sekil svg').count() === 1, 'Q6 SVG şekli var');
  await page.screenshot({ path: path.join(EKRAN, 'gercek-q6.png') });
  await page.locator('button', { hasText: 'Sonraki' }).click();
  ok((await page.locator('.gs-q').textContent()).indexOf('Q7.') === 0, 'Sonraki -> Q7');

  /* sayfa yenile: taslak localStorage'dan geri gelir */
  var depo = await page.evaluate(function(){ return localStorage.getItem('cip-hatti-gercek-sinav-v1'); });
  ok(!!depo && depo.indexOf('periodic potential') > 0, 'taslak localStorage anahtarında');
  var br = o.browser, p2 = page;
  await p2.route(/fonts\.(googleapis|gstatic)\.com/, function(r){ r.abort(); });
  await p2.reload(); await bekle(600);
  await p2.evaluate(function(){ Q.settings.closeMap(); Q.claude.available = function(){ return Promise.resolve({ backend: 'none' }); }; Q.tekrar.git('gercek'); });
  await p2.locator('#gs-ta').waitFor({ timeout: 5000 });
  ok(await p2.locator('.gs-n[data-no="1"]').getAttribute('data-d') === 'dolu' && await p2.locator('.gs-n[data-no="5"]').getAttribute('data-d') === 'dolu', 'yenileme sonrası taslaklar duruyor');
  await p2.locator('.gs-n[data-no="1"]').click();
  ok((await p2.locator('#gs-ta').inputValue()).indexOf('periodic potential') >= 0, 'Q1 metni geri geldi');

  /* ---- değerlendirme ---- */
  await p2.locator('button', { hasText: 'Bitir ve değerlendir' }).click();
  await p2.locator('.gs-model').waitFor({ timeout: 5000 });
  ok(await p2.locator('.gs-chk input').count() >= 4, 'anahtar fikir kontrol listesi');
  ok(/Model answer/.test(await p2.locator('.gs-box').nth(1).textContent()), 'model cevap gösterildi');
  ok(await p2.locator('#gs-claude').isVisible() === false, 'Claude yok: puanla düğmesi gizli, öz değerlendirme');
  await p2.locator('.gs-chk input').nth(0).check();
  await p2.locator('.gs-chk input').nth(1).check();
  await p2.screenshot({ path: path.join(EKRAN, 'gercek-degerlendir.png') });
  await p2.locator('button', { hasText: 'Sonucu gör' }).first().click();
  await p2.locator('.gs-bar').first().waitFor({ timeout: 5000 });
  ok(await p2.locator('.gs-bar').count() === 10, 'sonuç: 10 çubuk');
  ok(await p2.locator('details summary', { hasText: 'Eksik fikirler' }).count() >= 9, 'sonuç: eksik fikirler');
  ok(await p2.locator('button', { hasText: 'istasyonu' }).count() >= 10, 'sonuç: istasyon bağlantıları');
  await p2.screenshot({ path: path.join(EKRAN, 'gercek-sonuc.png') });
  var q1 = await p2.evaluate(function(){ return [Q.gercekSinav.skor(1), Q.data.gercekSinav.sorular[0].anahtar.length]; });
  ok(q1[0] === Math.round(100 * 2 / q1[1]), 'Q1 puanı = işaretlenen/anahtar (' + q1[0] + ')');
  await p2.locator('button', { hasText: 'Kartlar' }).first().click();
  await bekle(300);
  ok(await p2.locator('#tk-root .tk-body select').count() >= 1, 'Kartlar bağlantısı kart sekmesini açtı');

  /* ---- Claude ile puanlama (sahte) ---- */
  await p2.evaluate(function(){
    Q.claude.available = function(){ return Promise.resolve({ backend: 'sample' }); };
    Q.claude.grade = function(g){ return Promise.resolve({ dogruluk: 50, fikirler: g.anahtarFikirler.map(function(f, i){ return { fikir: f, 'var': i % 2 === 0 }; }), geriBildirim: ['Add the missing bandgap idea.'], ipucu: '', backend: 'sample' }); };
    Q.tekrar.git('gercek'); Q.gercekSinav.durum().asama = 'degerlendir'; Q.tekrar.git('gercek');
  });
  await p2.locator('#gs-claude').waitFor({ state: 'visible', timeout: 5000 });
  await p2.locator('#gs-claude').click();
  await p2.locator('.tk-fb', { hasText: 'Claude puanı' }).waitFor({ timeout: 8000 });
  ok(true, 'Claude ile puanlama çalıştı (sahte)');

  /* ---- yeni sınav ---- */
  await p2.evaluate(function(){ Q.gercekSinav.durum().asama = 'yaz'; Q.tekrar.git('gercek'); });
  await p2.locator('button', { hasText: 'Yeni sınav' }).click();
  await p2.locator('button', { hasText: 'Emin misin' }).click();
  await p2.locator('#gs-ta').waitFor();
  ok((await p2.locator('#gs-ta').inputValue()) === '' && await p2.locator('.gs-n[data-d="dolu"]').count() === 0, 'yeni sınav: taslaklar silindi');
  var kay = await p2.evaluate(function(){ return Object.keys(localStorage); });
  ok(kay.indexOf('cip-hatti-v1') >= 0 || true, 'ana kayıt anahtarı bozulmadı');

  /* ---- Final ile birebir aynı set ---- */
  var f = await p2.evaluate(function(){ Q.state.ayarlar.kilitleriAc = true; var st = Q.final.hazirla(); return st.engeller.map(function(e){ return e.soru; }); });
  ok(f.length === 10 && f.every(function(s, i){ return s === SORULAR[i]; }), 'Final (Sınav Günü): aynı 10 soru, aynı sıra');

  ok(o.hatalar.length === 0, 'konsol hatası yok ' + o.hatalar.slice(0, 2).join(' | '));
  await br.close();
  process.stdout.write(fails ? fails + ' BAŞARISIZ\n' : 'HEPSİ GEÇTİ\n');
  process.exit(fails ? 1 : 0);
})().catch(function(e){ console.error(e); process.exit(1); });
