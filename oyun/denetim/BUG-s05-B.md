# BUG-s05-B (İstasyon 5, engel o05 tahmin, o06 tuzak, o07 köprü)
Kapsam: Playwright 1366x768 ve 1440x900; tahmin (yanlış cevap + eminlik + sim + açıklama), tuzak (yanlış parça + eminlik + düzeltme), köprü (doğru sıralama + Kontrol + Devam) oynandı. Konsol hatası yok.
## Düzeltilen
- KÖPRÜ: Kontrol düğmesi başlangıçta (boş yuvalar) dock dışında kalıyordu (1366x768: alt 778>768; 1440x900: alt 906>900). DÜZELTİLDİ (80-obs-kopru.js): kart/yuva yükseklikleri sıkıştırıldı, bar `position:sticky;bottom:0`. Şimdi 1366x768 alt 742, 1440x900 alt 870; dolu ve sonuç durumlarında da görünür. obs-kopru.test.js geçti.
- TAHMİN: kuyu sim'inde "Wire⇄Well" düğmesi 1366x768'de dock altından taşıyordu (alt 781). DÜZELTİLDİ (70-sim-kuyu.js canvas yüksekliği 0.22->0.20 vh, min 150).
## Doğrulandı
- Tahmin doğru cevap 4 katına çıkar; yanlışta "Yanlış. Doğrusu: ..." + açıklama + Devam; seçenekler karışık sırada.
- Tuzak: parça seç -> eminlik -> yanlışsa vurgulu hatalı parça + düzeltme; voltaj yanlışta 30 düşüyor.
- Köprü doğru sıra (Walls, Well, Wavelength, Energy) kabul edilir, sonuç metni + Devam çıkar.
## Kalan / not
- Tuzak iddiası dock'ta iki kez görünüyor (anlatıcı balonu + panel); bilinçli mi belirsiz.
- Köprü yanlış sıra yolu ve sürükle-bırak denenmedi; 5 bloklu köprüler (s03,s04,s06-s09) sticky ile kaydırılabilir ama ayrı ayrı denenmedi.
