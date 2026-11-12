#!/usr/bin/env node
/* veri-dogrula.js (A9) — 90-data-*.js istasyon verilerini 08 §4'e göre doğrular.
 * Kullanım: node oyun/test/veri-dogrula.js [--var-olanlar]   (varsayılan: var olan dosyaları doğrular, eksikleri uyarır)
 * Çıkış kodu: hata varsa 1. Hata satırı biçimi: dosya:alan: sorun */
'use strict';
var fs = require('fs');
var path = require('path');
var vm = require('vm');

var JS = path.join(__dirname, '..', 'src', 'js');
var SIRA = ['hikaye', 'kavram', 'dusman', 'dusman', 'tahmin', 'tuzak', 'kopru', 'patron', 'sandik'];
var MODULLER = ['kristal_tur', 'czochralski', 'kafes', 'miller', 'karacisim', 'fotoelektrik', 'bohr', 'kuyu',
  'basamak', 'olcum', 'belirsizlik', 'bant', 'fermi'];

var hatalar = [];
var uyarilar = [];
function hata(dosya, alan, sorun) { hatalar.push(dosya + ':' + alan + ': ' + sorun); }

function kelime(s) { return String(s).replace(/\([^)]*\)/g, ' ').trim().split(/\s+/).filter(Boolean).length; }
function sinir(dosya, alan, metin, max) {
  if (typeof metin !== 'string' || !metin.trim()) { hata(dosya, alan, 'boş veya metin değil'); return; }
  var n = kelime(metin);
  if (n > max) hata(dosya, alan, n + ' kelime (en çok ' + max + ')');
}
function secenekler(dosya, alan, arr, adet, tNeden) {
  if (!Array.isArray(arr) || arr.length !== adet) { hata(dosya, alan, 'seçenek sayısı ' + (arr && arr.length) + ' (beklenen ' + adet + ')'); return; }
  var d = arr.filter(function (s) { return s && s.dogru === true; }).length;
  if (d !== 1) hata(dosya, alan, 'doğru seçenek sayısı ' + d + ' (beklenen 1)');
  arr.forEach(function (s, i) {
    sinir(dosya, alan + '[' + i + '].t', s && s.t, 10);
    if (tNeden && s && s.neden !== undefined) sinir(dosya, alan + '[' + i + '].neden', s.neden, 18);
  });
}

function yukle(dosya) {
  var Q = { data: { stations: {}, chars: {} } };
  var ctx = vm.createContext({ Q: Q, window: { Q: Q } });
  ctx.window.Q = Q;
  vm.runInContext(fs.readFileSync(path.join(JS, dosya), 'utf8'), ctx, { filename: dosya });
  return Q.data;
}

function acikSoru(d, a, k) {
  if (!k) { hata(d, a, 'yok'); return; }
  if (k.pdfSoru !== null && k.pdfSoru !== undefined && typeof k.pdfSoru !== 'string') hata(d, a + '.pdfSoru', 'string veya null olmalı');
  sinir(d, a + '.soru', k.soru, 25);
  if (!Array.isArray(k.anahtarFikirler) || k.anahtarFikirler.length !== 4) hata(d, a + '.anahtarFikirler', 'tam 4 olmalı');
  else k.anahtarFikirler.forEach(function (x, i) { sinir(d, a + '.anahtarFikirler[' + i + ']', x, 15); });
  if (!Array.isArray(k.yanlisKavramlar) || k.yanlisKavramlar.length < 2) hata(d, a + '.yanlisKavramlar', 'en az 2 olmalı');
  else k.yanlisKavramlar.forEach(function (x, i) { sinir(d, a + '.yanlisKavramlar[' + i + ']', x, 15); });
  if (k.yanlisKavramIds && k.yanlisKavramlar && k.yanlisKavramIds.length !== k.yanlisKavramlar.length) hata(d, a + '.yanlisKavramIds', 'yanlisKavramlar ile aynı uzunlukta olmalı');
  sinir(d, a + '.idealCevap', k.idealCevap, 60);
  var y = k.yedekSecmeli;
  if (!y) hata(d, a + '.yedekSecmeli', 'yok');
  else { sinir(d, a + '.yedekSecmeli.soru', y.soru, 25); secenekler(d, a + '.yedekSecmeli.secenekler', y.secenekler, 4, true); }
  if (!k.alt || !k.alt.soru) hata(d, a + '.alt.soru', 'boş'); else sinir(d, a + '.alt.soru', k.alt.soru, 25);
}

function engel(d, st, e, i) {
  var a = 'engeller[' + i + '](' + e.tip + ')';
  if (e.baslik) { if (kelime(e.baslik) > 4) hata(d, a + '.baslik', kelime(e.baslik) + ' kelime (en çok 4)'); } else hata(d, a + '.baslik', 'boş');
  if (e.kavram && st.kavramlar && st.kavramlar.indexOf(e.kavram) < 0) hata(d, a + '.kavram', '"' + e.kavram + '" istasyonun kavramlar listesinde yok');
  var sim = e.sim;
  if (sim && sim.modul && MODULLER.indexOf(sim.modul) < 0) hata(d, a + '.sim.modul', 'bilinmeyen modül "' + sim.modul + '"');
  if (e.onBilgi !== undefined) {
    if (['hikaye', 'kavram'].indexOf(e.tip) < 0) hata(d, a + '.onBilgi', 'yalnızca hikaye/kavram engelinde olur');
    else if (!Array.isArray(e.onBilgi) || e.onBilgi.length < 1 || e.onBilgi.length > 3) hata(d, a + '.onBilgi', '1-3 sayfa olmalı');
    else e.onBilgi.forEach(function (p, j) {
      var b = a + '.onBilgi[' + j + ']';
      sinir(d, b + '.baslik', p && p.baslik, 6);
      if (!p || !Array.isArray(p.madde) || p.madde.length < 1 || p.madde.length > 4) hata(d, b + '.madde', '1-4 madde olmalı');
      else p.madde.forEach(function (m, k) { sinir(d, b + '.madde[' + k + ']', m, 25); });
    });
  }
  switch (e.tip) {
    case 'hikaye':
      if (!Array.isArray(e.satirlar) || e.satirlar.length !== 3) hata(d, a + '.satirlar', 'tam 3 satır olmalı');
      else e.satirlar.forEach(function (s, j) { sinir(d, a + '.satirlar[' + j + '].metin', s.metin, 20); });
      break;
    case 'kavram':
      sinir(d, a + '.gorev', e.gorev, 12);
      sinir(d, a + '.ogrenilen', e.ogrenilen, 20);
      if (!sim) hata(d, a + '.sim', 'yok');
      break;
    case 'dusman':
      sinir(d, a + '.soru', e.soru, 22);
      secenekler(d, a + '.secenekler', e.secenekler, 3, true);
      break;
    case 'tahmin':
      sinir(d, a + '.soru', e.soru, 22);
      secenekler(d, a + '.secenekler', e.secenekler, 3, true);
      sinir(d, a + '.acik', e.acik, 25);
      if (!sim) hata(d, a + '.sim', 'yok');
      break;
    case 'tuzak':
      if (!Array.isArray(e.parcalar) || e.parcalar.length !== 3) hata(d, a + '.parcalar', 'tam 3 olmalı');
      else if (e.iddia !== e.parcalar.join(' ')) hata(d, a + '.iddia', 'parcalar.join(" ") ile aynı değil');
      if ([0, 1, 2].indexOf(e.yanlisParca) < 0) hata(d, a + '.yanlisParca', '0,1,2 dışında');
      sinir(d, a + '.duzeltme', e.duzeltme, 25);
      break;
    case 'kopru':
      sinir(d, a + '.soru', e.soru, 15);
      if (!Array.isArray(e.bloklar) || [4, 5].indexOf(e.bloklar.length) < 0) hata(d, a + '.bloklar', 'uzunluk 4 veya 5 olmalı');
      else e.bloklar.forEach(function (b, j) { sinir(d, a + '.bloklar[' + j + ']', b, 8); });
      sinir(d, a + '.sonuc', e.sonuc, 25);
      break;
    case 'patron':
      sinir(d, a + '.giris', e.giris, 14);
      if (!Array.isArray(e.fazlar) || e.fazlar.length < 2) { hata(d, a + '.fazlar', 'en az 2 faz'); break; }
      e.fazlar.forEach(function (f, j) {
        var b = a + '.fazlar[' + j + ']';
        if (f.tip === 'secmeli') {
          sinir(d, b + '.soru', f.soru, 25);
          secenekler(d, b + '.secenekler', f.secenekler, 3, true);
          if (f.alt) { sinir(d, b + '.alt.soru', f.alt.soru, 25); }
        } else if (f.tip === 'acik') acikSoru(d, b, f);
        else hata(d, b + '.tip', 'secmeli|acik olmalı: ' + f.tip);
      });
      break;
    case 'sandik':
      if (!e.kart || !e.kart.id) hata(d, a + '.kart.id', 'boş'); else sinir(d, a + '.kart.tekCumle', e.kart.tekCumle, 16);
      if (!Array.isArray(e.ozet) || e.ozet.length !== 3) hata(d, a + '.ozet', 'tam 3 madde olmalı');
      else e.ozet.forEach(function (o, j) { sinir(d, a + '.ozet[' + j + ']', o, 12); });
      break;
    default: hata(d, a + '.tip', 'bilinmeyen tip');
  }
}

function istasyon(d, id, st) {
  if (!st) { hata(d, id, 'Q.data.stations.' + id + ' tanımlı değil'); return; }
  var tipler = (st.engeller || []).map(function (e) { return e.tip; });
  if (tipler.join(',') !== SIRA.join(',')) hata(d, 'engeller', 'sıra "' + tipler.join(',') + '" (beklenen ' + SIRA.join(',') + ')');
  (st.engeller || []).forEach(function (e, i) { engel(d, st, e, i); });
  var h = st.tekrarHavuzu;
  if (!Array.isArray(h) || h.length < 4) hata(d, 'tekrarHavuzu', 'en az 4 öğe olmalı');
  else {
    var kv = {};
    h.forEach(function (e, i) {
      if (e.tip !== 'dusman') hata(d, 'tekrarHavuzu[' + i + '].tip', 'dusman olmalı: ' + e.tip);
      if (!e.kavram) hata(d, 'tekrarHavuzu[' + i + '].kavram', 'boş'); else kv[e.kavram] = 1;
      if (e.kavram && st.kavramlar && st.kavramlar.indexOf(e.kavram) < 0) hata(d, 'tekrarHavuzu[' + i + '].kavram', '"' + e.kavram + '" kavramlar listesinde yok');
      sinir(d, 'tekrarHavuzu[' + i + '].soru', e.soru, 22);
      secenekler(d, 'tekrarHavuzu[' + i + '].secenekler', e.secenekler, 3, true);
    });
    if (Object.keys(kv).length < 4) hata(d, 'tekrarHavuzu', 'en az 4 farklı kavram kapsanmalı (' + Object.keys(kv).length + ')');
  }
  var tt = st.temelTur;
  if (!tt || !Array.isArray(tt.kartlar) || tt.kartlar.length !== 3) hata(d, 'temelTur.kartlar', 'tam 3 kart olmalı');
  else if (tt.sim && tt.sim.modul && MODULLER.indexOf(tt.sim.modul) < 0) hata(d, 'temelTur.sim.modul', 'bilinmeyen modül "' + tt.sim.modul + '"');
}

var toplam = 0;
for (var n = 1; n <= 10; n++) {
  var id = 's' + (n < 10 ? '0' : '') + n;
  var dosya = '90-data-' + id + '.js';
  if (!fs.existsSync(path.join(JS, dosya))) { uyarilar.push(dosya + ': dosya yok (atlandı)'); continue; }
  toplam++;
  try { istasyon(dosya, id, yukle(dosya).stations[id]); }
  catch (e) { hata(dosya, 'yükleme', e.message); }
}

uyarilar.forEach(function (u) { process.stdout.write('\x1b[33mUYARI ' + u + '\x1b[0m\n'); });
if (hatalar.length) {
  hatalar.forEach(function (h) { process.stdout.write('\x1b[31mHATA ' + h + '\x1b[0m\n'); });
  process.stdout.write(hatalar.length + ' hata, ' + toplam + ' dosya denetlendi\n');
  process.exit(1);
}
process.stdout.write('\x1b[32mVeri doğrulama temiz: ' + toplam + ' istasyon dosyası denetlendi\x1b[0m\n');
