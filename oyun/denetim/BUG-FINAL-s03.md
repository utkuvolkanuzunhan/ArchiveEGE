# BUG-FINAL-s03 (Işık-test odası, son sürüm öncesi oyuncu denetimi)

Yöntem: Playwright 1366x768, hikayeAtla kapalı, kilitler kapalı, s01+s02 tamam yapılıp s03 baştan sona oynandı.
Yollar: doğru yol (hikaye, 3 bilgi kartı, kavram sim'i gerçekten oynandı: 5000 K + Classical curve, 2 düşman, tahmin+sim, tuzak, köprü, patron 3 faz, hesap engeli yanlış+doğru adım, sandık, istasyon sonu, harita, yenileme) ve sürekli yanlış yol (Eminim ile yanlış, voltaj düşüşü, KISA DEVRE, Temelden bir daha 3 kart + sim, istasyon yeniden başlar). Konsol hatası: yok.

| sorun | konum | önem | düzeltildi mi |
|---|---|---|---|
| Hesap engelinde bir adımda yanlış cevap sonrası "Devam" ile açıklama açılınca eski yardım satırı (Adımı göster / Örnekteki adıma bak / Devam) ekranda kalıyor, altında "Sonraki adım" ile iki devam düğmesi oluşuyor (s02'de yalnız doğru dal düzeltilmişti) | oyun/src/js/86-obs-hesap.js (yanlış dalındaki Devam tıklaması) | orta | evet (Devam'da yardım satırı kaldırılıyor; hesap-engel testi 151/151 geçti) |
| Tahmin sonucu ve patron faz 1-3 dock'ta 12-37px dikey kaydırma (369>332 vb.); içerik erişilebilir, Devam görünür | 80-obs-tahmin.js, 85-obs-patron.js | düşük | hayır |
| Yenilemeden sonra karşılama ekranı üst çubuğu "Voltaj 100" (kayıtta 94); haritaya girince doğru | üst çubuk ilk çizim | düşük | hayır |
| Dusman engellerinde balon başlığı "Vacancy (Boşluk) Kusuru" / "Grain Boundary (Tane Sınırı) Kusuru" (kristal kusur kaplaması foton sorularında); soru metni doğru, yalnız tema uyumsuz | 90-data-s03.js kusurSkin | düşük | hayır (tasarım/kozmetik) |
| Tahmin sim'inde Nasıl yapılır? düğmesinin üst kenarı dock kaydırması nedeniyle kısmen kesik görünüyor; kavram sim'i kaydırıcı odak çerçevesinin alt kenarı kesik | tahmin/kavram dock yerleşimi | düşük | hayır |

## Gözlemler (hata değil)
- Hikaye balonları, 3 bilgi kartı (E=hf/1240/λ, eşik kıyası K=E−φ, mantık zinciri), kavram öncesi 4 kart: terimler (blackbody, quantum, photon, work function, threshold, stopping potential, Wien) kavram sorulmadan önce öğretiliyor; öğretilmemiş terim bulunmadı, kart eklenmedi.
- Seçenek→Onayla→eminlik akışı çalışıyor; yanlış geri bildirim "Cevabın yanlış. Doğru seçenek: ..." (hesapta "Cevabın yanlış. Doğru: ..."), soru/balon ekranda kalıyor.
- Tuzak, köprü, patron 3 faz (Claude yok: yedek çoktan seçmeli), hesap (foto-cu: 4,959 eV, hf>φ, K_max=0,259 eV doğru) ve sandık çalışıyor; kayıt (tamam, hesap tamam, kart, hata defteri 4) yenileme sonrası korunuyor; s04 "Sıradaki".
- Fizik: değişiklik yapılmadı; sayılar tutarlı (hf=1,24 eV @3,0×10¹⁴ Hz, 620 nm=2,0 eV, 310 nm=4,0 eV).
