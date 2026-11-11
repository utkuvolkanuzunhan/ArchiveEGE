# BUG-s03 (İstasyon 3, kısmi denetim)
Kapsam: Playwright ile hikaye(atlandı), kavram, dusman x2, tahmin (doğru yol, Eminim) oynandı; tuzağa girildi. Süre dolduğu için kopru/patron/sandık, yanlış yol ve istasyon sonu kaydı DENENMEDİ.
## Bulunan
- Konsol: yalnızca font isteği ERR_FAILED (route ile abort, beklenen). Sayfa hatası yok.
- Kavram kapısında İpucu/Geç düğmeleri bir ölçümde ekran dışı (bottom>innerHeight) göründü; sim görünürken ölçüldü, doğrulanmadı.
- Tahmin sonucu satırı ("Doğrulayalım...", "Doğru tahmin...") sonuç sırasında ekran altına taşıyor görünüyor (clipped); sim açılıyor (fotoelektrik) ve Devam ile ilerliyor.
- Veri (90-data-s03.js) ile akış uyumlu; seçenekler karışık sırayla geliyor, doğru yönlendirme çalışıyor.
## Düzeltilen
- Yok (kod değiştirilmedi).
## Kalan
- Yukarıdaki iki taşma şüphesi; tuzak sonrası tüm engeller, yanlış/emin-yanlış yol, karacisim sim gerçek oynanışı, harita dönüşü/kayıt.
