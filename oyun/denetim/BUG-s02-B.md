# BUG-s02-B (İstasyon 2: tahmin o05, tuzak o06, köprü o07)
## Düzeltildi
- 90-data-s02.js o06 düzeltme metni bozuktu ("plane (düzlem) the axis (eksen) at ∞ keser"); sade Türkçeye çevrildi.
## Oynandı (1366x768, doğru + yanlış)
- Köprü: Kontrol düğmesi y=671, görünür; yanlışta doğru sıra + açıklama + Devam; konsol hatası yok.
- Tuzak: parça seçilir, eminlik, geri bildirim + Devam; konsol hatası yok.
- Tahmin: şık seçilir, Onayla ile gider, eminlik sonra sim.
## Kalan (düzeltilmedi)
- Tuzak: geri bildirim çıkınca eminlik düğmeleri (cbtn) ekranda kalıyor (80-obs-tuzak.js confHost temizlenmeli).
- Tahmin: eminlikten sonra soru metni dock'tan kalkıyor (sim sırasında); sim 1366x768'de alt kenara taşıyor olabilir.
- Tahmin geri bildirim metni sim bitince gelir; tam doğrulanmadı.
