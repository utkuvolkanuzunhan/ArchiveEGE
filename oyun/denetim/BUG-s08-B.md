# BUG s08 grup B (o05 tahmin, o06 tuzak, o07 kopru) - 1366x768 / 1440x900

Doğru ve yanlış cevapla oynandı; konsol hatası yok, veri istasyon dosyasıyla uyumlu, baloncuk/akış sorunu yok.

1. DÜZELTİLDİ (kopru, 1366x768): 4. yuva ve Kontrol düğmesi dock dışına taşıyordu (Kontrol y=804 > 768; yalnızca dock kaydırınca görünüyordu). Kartlar/yuvalar sıkılaştırıldı (havuz min-height kaldırıldı, yuva 40px, kart 36px, boşluklar azaltıldı). Kontrol artık y=671-717'de görünür. Dosya: src/js/80-obs-kopru.js.
2. Not (düzeltilmedi): tuzak engelinde yanlış sonrası dock 1366x768'de tam dolu ama sığıyor.
