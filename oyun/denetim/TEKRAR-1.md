# TEKRAR-1 · A10 Tekrar Merkezi

- Dosya: `oyun/src/js/97-tekrar.js` (Q.tekrar.open/close/terimler/havuz). build.sh dosyaları alfabetik birleştirdiği için ekleme gerekmedi. Harita düğmesi: `20-settings.js` renderMap içinde `#a10-tekrar` (tek satır).
- Bölümler: Terimler (arama, istasyon filtresi, Türkçeyi gizle), Test (10/20/hepsi, Onayla, anında geri bildirim, skor, yanlışları tekrar et, kayıtlı yanlışlar), Açıklama kartları, Sınav tarzı (Claude varsa puanlar, yoksa ideal cevap + kendini işaretle).
- Kilitten bağımsız: yüklü tüm istasyonlar (şu an s01-s08) açık. Kayıt: yalnızca `cip-hatti-tekrar-v1`; ana kayıta dokunmaz.
- Test (1366x768): sayfa taşmaz, liste/kart alanı kendi içinde kayar. Konsol hatası yok (yalnızca abort edilen font isteği). 189 terim (120 otomatik + 69 elle), 66 soru.
- Bilinen sınır: regex terimleri heuristikle temizler; bazı çok sözcüklü terimler kısalabilir (ör. "mean free path" -> "free path") ve ters sıralı ("Türkçe (English)") örnekler atlanır. Oyun sonu için ayrı düğme yok; final sonrası harita açıldığında düğme orada.
