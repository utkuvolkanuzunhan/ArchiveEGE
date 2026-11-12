# S10-DUZELTME (BUG-s10-A/B düzeltmeleri + Final'e s10)

Düzeltilen
- Tahmin sim aşaması (80-obs-tahmin.js): soru metni `position:sticky; top:0` yapıldı; panel kaydırılsa da ilk satır kırpılmıyor (1366x768 Playwright ile doğrulandı).
- Fermi sim (70-sim-fermi.js): n/p/nᵢ² için 1 cm⁻³ altı değerler "≈ 0 (10^−36.0)" biçiminde gösteriliyor.
- Kavram kapısı: başarı koşuluna E>0 eklendi (T<=60 K ve alan E kaydırıcısı kullanılmalı); görev metni güncellendi (90-data-s10.js).
- o03 düşmanı: ilgisiz `bant_bosluk` skin'i kaldırıldı (varsayılan düşman skin'i).
- Başlık metni "9 istasyon" zaten düzeltilmişti (99-main.js).

Final "Sınav Günü": 10 -> 11 kapı
- s10 patronunda pdfSoru yok; 96-final.js içinde s10 için İngilizce klasik soru tanımlandı (Fermi-Dirac f(E), E_F'de 1/2, T->0'da basamak; anahtar fikirler, yanlış kavramlar, ideal cevap). Yalnızca ilk açık faz kapı yapıldı (drift/np sorusu eklenmedi).
- Yedek MCQ: sınav havuzundaki s10 maddeleri. final.test.js ve test/final.html 11 kapıya göre güncellendi.

Doğrulama: veri-dogrula temiz, sinav-dogrula OK, final.test.js (claude/mcq/karma/esc) HEPSİ GEÇTİ, final.html ok, smoke 9/9.

Düzeltilmedi (düşük): hikayede np=nᵢ², μ tanıtılmıyor; köprüde "Hareketli n ve p yük taşır" bloğunun sırası; soru metninin balonda+panelde iki kez görünmesi (ortak tasarım).
