# BUG-FINAL-s02 (Kesim testeresi, son sürüm öncesi oyuncu denetimi)

Yöntem: Playwright 1366x768, hikayeAtla kapalı, kilitler kapalı, s01 tamam yapılıp s02 baştan sona oynandı.
Yollar: doğru yol, yanlış/"Bilmiyorum" yolu (voltaj 0, KISA DEVRE, Temelden bir daha, istasyon yeniden başlar), hesap engelinde yanlış+doğru adım, sandık, istasyon sonu, harita, sayfa yenileme.
Konsol hatası: yok (yalnızca Google Fonts isteği, engellendi).

| sorun | konum | önem | düzeltildi mi |
|---|---|---|---|
| Hesap engelinde bir adımda yanlış cevaptan sonra doğru cevap girilince eski yardım satırı (Adımı göster / Örnekteki adıma bak / Devam) ekranda kalıyor; "Devam" ile "Sonraki adım" yan yana iki devam düğmesi oluşuyor, eski "Devam" açıklamayı ikinci kez yazıyor | oyun/src/js/86-obs-hesap.js (kontrol tıklaması, doğru dalı) | orta | evet (doğruda yardım satırı kaldırılıyor) |
| Hesap engelinde 2. ve 3. adım açılınca yeni adımın giriş kutusu alt paneldeki kaydırma alanında görünmüyor (önceki adımlar yer kaplıyor, yalnızca başlığın kenarı görünüyor; oyuncu elle kaydırmak zorunda) | oyun/src/js/86-obs-hesap.js (adım döngüsü) | orta | evet (yeni adım eklenince panel en alta kayıyor) |
| Tahmin engelinde cevap sonrası miller sim'i dock içinde 485px, dock 332px: sim yukarı kayıp Devam düğmesi görünür oluyor, ama sim görseli kısmen kesik, x/y/z satırlarında düğmeler yok | 80-obs-tahmin.js + 70-sim-miller.js yerleşimi | düşük | hayır (görsel; akış kırık değil, Devam görünür) |
| Köprü (343>332), patron faz 1 ve açık uç fazları (344-353>332) dock'ta 11-21px dikey kaydırma | 80-obs-kopru.js, 85-obs-patron.js | düşük | hayır (içerik erişilebilir; eminlik satırı alta kayıyor) |
| Yenilemeden sonra karşılama ekranında üst çubuk "Voltaj 100" gösteriyor, kayıtta voltaj 94 (haritaya girince Q.state doğru) | üst çubuk ilk çizim | düşük | hayır |

## Oynanış gözlemleri (hata değil)
- Hikaye, ek bilgi kartları, "Nasıl yapılır" kartları (Miller adımları, çözülmüş örnek, d/atom/yön, sim kullanımı) kavram sim'inden ÖNCE gösteriliyor; öğretilmemiş terim bulunmadı (diamond, nearest neighbor, ∞/0 indis, {hkl}, [uvw] onBilgi/kartlarda var).
- Kafes sim'i: açılışta fcc için 4 atom değeri gösteriliyor, "Say (Count)" ile sayma moduna geçiliyor (tasarım). Doğru sayı sonrası Devam.
- Şık seçilip Onayla ile gidiyor; eminlik satırı Onayla sonrası; yanlış geri bildirim sade ("Cevabın yanlış. Doğru seçenek: ...", eminlik "Bilmiyorum" ise "Bilmiyorum dedin, sorun değil. Doğru seçenek: ...").
- Tuzak, köprü (doğru ve ters sıra), patron 3 faz (seçmeli, ikinci şans, açık uç Claude yokken yedek çoktan seçmeli) çalışıyor; soru/balon ekranda kalıyor.
- Kısa devre: Temelden bir daha (3 kart + sim) sonra istasyon yeniden başlıyor; takılma yok.
- Hesap (miller-326): ters/ortak payda 6, h²+k²+l²=49, d=0,0776 nm; veriler doğru. Örnek paneli (adım adım / geç / hazırım) çalışıyor.
- Sandık: kart + özet + "Kayıt alındı"; istasyon sonunda ilerleme (tamam, hesap tamam, kart, hata defteri) kaydediliyor; yenilemeden sonra Devam ile harita: s02 tamam, s03 "Sıradaki".
- Fizik içeriği: değişiklik yapılmadı; kontrol edilen sayılar tutarlı (bcc 2, fcc 4, elmas 4 komşu, (100), (326), d=a/7).
