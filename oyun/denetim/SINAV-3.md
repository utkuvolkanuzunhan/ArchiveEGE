# SINAV-3 · s09 sınav maddeleri ve seçki

- Dosya: `oyun/src/js/93-data-sinav-3.js` (tamamı İngilizce). build.sh `src/js/*.js` glob'uyla otomatik alıyor (REQ_JS listesine gerek yok); alfabetik sıra gereği 92'den sonra, 97-tekrar'dan önce yüklenir.
- Eklenenler: s09 için 10 MCQ + 4 klasik (90-data-s09.js ile tutarlı: N atom, N seviyeye yarılma, Pauli iki elektron, dolu bant, bandgap, metal/yalıtkan/yarıiletken, tek kuyuda bant olmaz). Ek olarak örnek sınav kapsamı için s01 (+2 MCQ, +1 klasik), s02 (+2 MCQ, +1 klasik), s03 (+1 klasik, kuantum neden), s04 (+1 klasik, H kararlılığı), s07 (+2 klasik, ilkeler ve özdurum olmayan ölçüm). Havuz: 86 MCQ + 38 klasik.
- Sayısal denetim: s09-k4 aralığı 5 eV / 5e22 = 1e-22 eV; kT(300 K) 0,026 eV. s02-m10 (1, -1, 0) ters değerler elle kontrol edildi.
- Seçki: bkz. `SECKI.md`. `97-tekrar.js` deneme sekmesi: "Soru kümesi" seçimi (Seçki varsayılan, Tüm havuz). Playwright 1366x768 ile ekran açıldı, iki kümede sayılar doğru, sayfa hatası yok.
- Test: `node oyun/test/sinav-dogrula.js` (seçki 50/20 ve istasyon dağılımı denetimi eklendi) OK; `node oyun/test/veri-dogrula.js` temiz.
- Not: dist derlendi ama commit'e eklenmedi (orkestratör derler).
