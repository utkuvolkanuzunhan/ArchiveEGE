# BUG-FINAL-s06 (Tünel istasyonu, son sürüm öncesi oyuncu denetimi)

Yöntem: Playwright 1366x768, hikayeAtla kapalı, kilitler açık. Doğru yol baştan sona oynandı: hikaye (3 satır), 5 bilgi kartı, kavram sim'i (E slider ile R 0,1-0,2 aralığı gerçekten ulaşılıyor), 2 düşman, tahmin+sim, tuzak, köprü, patron 3 faz (Claude kapalı, yedek çoktan seçmeli), hesap engeli (örnek paneli, yanlış sonra doğru adım, sonuç), sandık, istasyon sonu, haritaya dönüş. Yanlış yol: düşman, tahmin, tuzak, köprü, patron yanlışları ve 3x eminlikle kısa devre ("Temelden bir daha" kartları, istasyon baştan başlıyor). Yenileme sonrası kayıt: ilerleme.s06 tamam, fabrika.kurulu ["s06"] korunuyor. Konsol/sayfa hatası: yok. Yatay/dikey taşma: yok.

| sorun | konum | önem | düzeltildi mi |
|---|---|---|---|
| Hesap çözüm formüllerinde iç içe işaretler (`e^{ik_{1}x}`) üst/alt simgeye çevrilmiyor, ekranda ham `e^{ik₁x} + r e^{−ik₁x}` görünüyordu (yanlış/doğru adım sonrası çözüm kutusu) | oyun/src/js/98-tekrar-hesap.js `yaz()` | orta | evet (yaz() dengeli parantezle özyinelemeli; hesap ve hesap-engel testleri geçti, ekranla doğrulandı) |
| Sim yazısında R/T ondalık nokta ile ("R = 0.29", "T = 0.050"), metinlerin geri kalanı virgül kullanıyor ("0,1-0,2") | oyun/src/js/70-sim-basamak.js | düşük | hayır (kozmetik, sim genelinde ortak biçim) |
| Hesap görev metni ve örnek başlığında `V_0`, `E > V_0` ham yazılıyor (sınav metninin birebir alıntısı olduğu için bilerek bırakıldı); aynı panelde "Verilenler" listesi V₀ alt simgeli | oyun/src/js/87-data-hesap.js q6-e-gt | düşük | hayır (sınav ifadesi, kullanıcı karar versin) |
| Kavram sim'inde E çizgisinin "E" etiketi ve sağ üstteki "R" göstergesi kutunun kenarına çok yakın (üstten kırpılmış görünüyor) | oyun/src/js/70-sim-basamak.js | düşük | hayır |
| Bitiş kartında "Broglie · 1924" (diğer yerlerde "Louis de Broglie") ve "Zero (sıfır) değerinden büyük" gibi biraz yapay Türkçe seçenek ifadesi | 90-data-s06.js | düşük | hayır (kozmetik) |

## Gözlemler (hata değil)
- Soru/balon cevap bitene kadar ekranda; şık → eminlik → Onayla akışı çalışıyor (Onayla eminlik seçilmeden pasif).
- Yanlış cevap geri bildirimi tüm engellerde "Cevabın yanlış. Doğru seçenek: ..." (hesapta "Cevabın yanlış. Doğru: ..."); tuzakta yanlış parça vurgulanıyor, köprüde doğru sıra listeleniyor.
- Kavramlar sorulmadan önce öğretiliyor (basamak, süreklilik, yasak bölge, sönümlenme, tünelleme, R/T, κ ve T ∝ e^(−2κa), iki "Nasıl yapılır" kartı). Öğretilmemiş terim bulunmadı, kart eklenmedi.
- Fizik kontrolü: kartlardaki sayılar (k₁=2,k₂=1 → R=1/9; E=2,V₀=1 → R≈0,029; V₀−E=1 eV için e^(−2κa) 0,13 / 0,0021, 60 kat; 0,3→1,5 nm için ≈35 milyon kat; hesap adımları k₁=16,20, k₂=11,456, R=0,0294) elle doğrulandı, tutarlı. Kullanıcı teyit etsin gerektiren bir değişiklik yapılmadı.
- Patron yedek (Claude yok) soruları 4 seçenekli ve doğru; patron yanlışında yüksek eminlikle voltaj hızla 0'a iniyor (tasarım gereği).
- Yenileme sonrası açılış kartı "Çip Hattı / Devam" çıkıyor, ilerleme kaybolmuyor.
