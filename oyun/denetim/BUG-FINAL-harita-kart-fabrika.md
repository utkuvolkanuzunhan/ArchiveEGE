# BUG-FINAL-harita-kart-fabrika (harita, kartlar, sağ panel, üst çubuk, mini sorular; son sürüm öncesi)

Yöntem: Playwright, 1366x768 / 1440x900 / 1920x1080 / 700x800. Taze kayıt ve tüm istasyon/kart açık kayıt. Üst çubuk (Ana menü, Kartlar, Hata defteri, Tekrar Merkezi, Gerçek sınav, Ayarlar, Sınav Günü), 23 kartın portreleri (kilitliyken ortak silüt, açılınca 23 portre birbirinden farklı), taşma/kırpma, kilitli ve açık istasyon paneli, mini soru (yanlış -> Doğru seçenek + Tekrar dene -> doğru), "Her yere eriş", "İstediğin engele atla" (10 engel, hikayeAtla'da doğru indekse atlıyor), sayfa/konsol hatası yok. test/fabrika.test.js ve test/kartlar.test.js geçti.

| sorun | konum | önem | düzeltildi mi |
|---|---|---|---|
| Kart koleksiyonunda grup başlığı uzun istasyon adlarını "7. Measurement (öl…" diye kesiyordu (700 ve dar sütun) | src/styles/25-kartlar.css (.kk-grup-ad) | düşük | evet (satır kaydırma) |
| 700x800'de açılan istasyon paneli üst çubuk düğmelerinin bir kısmını örtüyor (panel kapanınca düzeliyor, Kapat (Esc) var) | src/styles (fb panel) | düşük | hayır (tasarım: alt sayfa paneli) |
| Mini soruda doğru seçenek her zaman en uzun/en ayrıntılı; sıra karışıyor ama uzunluk ipucu veriyor | src/js/88-data-fabrika.js | düşük | hayır (içerik, kullanıcı teyit etsin) |
| Harita başlığındaki "Üretim: 0 wafer/saat" yalnızca fabrika.kurulu'ya bağlı; ilerleme elle tamam yapılınca 0 kalır (normal oyunda sandık makine kurar) | src/js/20-settings.js | düşük | hayır (normal akışta sorun yok) |
