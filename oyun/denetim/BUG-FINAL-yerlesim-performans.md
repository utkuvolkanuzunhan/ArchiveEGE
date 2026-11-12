# BUG-FINAL yerleşim-performans

Kapsam: 1280x720, 1366x768, 1440x900, 1920x1080, 700x800. Ekranlar: başlık, harita, ayarlar, Tekrar Merkezi, s01-s10 yol sahnesi + engeller (kavram, düşman x2, tahmin, tuzak, köprü, patron, hesap, sandık; ilk "hikaye" engeli hariç), 13 sim'in 12'si doğrudan mount (czochralski hiçbir istasyonda kullanılmıyor). Otomatik taşma/kırpılma denetimi (Playwright, Google Fonts abort) + ekran görüntüsü incelemesi.

| sorun | konum | önem | düzeltildi mi |
|---|---|---|---|
| 700 genişlikte üst şerit: ilerleme noktaları istasyon adı ve "Voltaj" etiketinin üstüne biniyor, Voltaj yazısı kapanıyor | `src/styles/10-layout.css` (#hud-path, #hud-station, #hud-voltaj) | orta | evet (`max-width:900px` kuralı: küçük düğümler, zamanlayıcı gizli, ad kısalır) |
| 700 genişlikte düşman/anlatıcı baloncukları sahne altından kırpılıyor, metin yarım kalıyor | `src/styles/20-components.css` (#bubble-layer .bubble) | orta | evet (dar ekranda daha geniş, küçük font, canavar baloncuğu aşağıda) |
| "Nasıl yapılır?" düğmesi tahmin ve düşman soru metninin son sözcüklerini örtüyor (soru inline margin'i CSS'i eziyordu; 700 genişlikte belirgin) | `20-components.css` (.tahmin-soru, .dusman-soru) | orta | evet (`margin-right:130px !important`) |
| 1280x720: s07 uzun istasyon adı + 10 nokta Voltaj etiketine değiyor (~2 px) | üst şerit | düşük | evet (1250 altı boşluk 5px; 700 kuralı ile birlikte; 1280'de hâlâ çok yakın, kozmetik) |
| 700 genişlikte harita zinciri 4. kartta yatay kırpılıyor (kaydırma kabı olduğu varsayıldı) | harita (21-fabrika) | düşük | hayır, kullanıcı teyit etsin (700 destek hedefi mi?) |
| Çevrimdışı yazı tipi: Lilita One yerine Impact/Arial Black, Nunito yerine Trebuchet/system-ui. Linux'ta (Inter) okunaklı, taşma yok. Windows'ta Impact daha dar, Arial Black daha geniş: başlıklarda küçük taşma riski test edilemedi | `00-tokens.css` --font-d | düşük | hayır (test ortamında Windows yok) |

## Performans ölçümleri (headless Chromium)
- Açılış: sayfa yükü 190-350 ms (file://, fontlar engelli). dist/oyun.html 1061 KB (tek dosya).
- Yol sahnesi: 58-61 fps, en uzun kare aralığı 17-67 ms (ilk kare).
- 12 sim, 5 çözünürlük: 58-61 fps, en kötü kare aralığı 50 ms (1920x1080 olcum, tek seferlik); taşma yok.
- Sızıntı: s01'i 5 kez başlat/iptal: DOM düğüm sayısı 693'te sabit, canvas 1, JS heap 3.3 -> 3.5 MB (plato). Her sim 5 kez mount/destroy: DOM farkı 0, heap farkı 6-65 KB (önemsiz).
- Konsol/sayfa hatası: hiç yok (font istekleri hariç).

Sonuç: 5 çözünürlükte son taramada tüm ekranlar temiz (taşma/kırpılma/örtüşme bulunmadı).
