# SINAV-1 · A11 Deneme Sınavı (Mock exam)

- Dosyalar: `oyun/src/js/91-data-sinav-1.js` (s01-s04: 32 MCQ + 12 klasik, tamamı İngilizce), `oyun/test/sinav-dogrula.js` (id benzersiz, 4 şık, answer 0..3, modelAnswer, keyPoints 3-5, istasyon başına >=8 MCQ / >=3 klasik), `97-tekrar.js` beşinci sekme `deneme`.
- `97-tekrar.js` `Q.data.sinav`ı okur; A12'nin `92-data-sinav-2.js` dosyası aynı diziye ekleyince otomatik havuza girer (alfabetik yükleme). Hedef 50 MCQ + 20 klasik; havuz azsa kurulum ekranı kaç soru olduğunu yazar (şu an 32 + 12).
- Akış: kurulum (süre sayacı açık/kapalı, MCQ geri bildirimi anında/sonda) -> MCQ (Q.ui.options.ask, Onayla) -> klasik (büyük textarea, İngilizce; Türkçe görünürse uyarı) -> sonuç. Claude varsa `Q.claude.grade` (idealCevap=modelAnswer, anahtarFikirler=keyPoints), yoksa model answer + key points + kendini işaretle (✓/Kısmen/✗).
- Sonuç: MCQ ve klasik skor, süre, zayıf istasyonlar/kavramlar, yanlış MCQ listesi (İngilizce açıklamalı), "Sınav sonrası terim listesi" (Q.tekrar.terimler ile sınavda geçen terimler, yanlış konulardakiler önde).
- Kayıt: yalnızca `cip-hatti-tekrar-v1` içinde `sinav.son` (try/catch); `cip-hatti-v1` değişmedi (E2E ile doğrulandı).
- Test: Playwright 1366x768, fontlar abort, sınav uçtan uca (44 adım) tamamlandı; konsol/sayfa hatası yok, yatay/dikey sayfa taşması yok. node --check, core/battle/claude testleri geçti.
- Sınır: Q.ui.textbox 400 karakterle sınırlı olduğu için klasikte kendi textarea (3000 karakter) kullanıldı. Süre sayacı yalnızca geçen süreyi gösterir (geri sayım yok). MCQ'da `concept` alanı yok; zayıf konu MCQ için istasyon bazlı.
