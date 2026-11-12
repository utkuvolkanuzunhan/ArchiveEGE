# BUG-FINAL-s01 (İstasyon 1, son sürüm öncesi baştan sona oynama)

Yöntem: Playwright, 1366x768, hikayeAtla kapalı, kilitler kapalı, Claude bağlı değil. Akış: hikaye, Bilgi kartları (7 sayfa, Nasıl yapılır dahil), kavram simülasyonu (gerçek düğmelerle), 2 düşman, tahmin, tuzak, köprü, patron (3 faz; doğru, yanlış ve kısa devre yolları), hesap engeli (örnek paneli, yanlış ve doğru adım), sandık, istasyon sonu, harita, yenileme sonrası kayıt. Ekran görüntüleri gözle kontrol edildi. Konsol/sayfa hatası: yok.

| sorun | konum | önem | düzeltildi mi |
|---|---|---|---|
| Hesap adımında önce yanlış, sonra doğru yazılınca eski "Devam" (+ "Adımı göster", "Örnekteki N. adıma bak") satırı ekranda kalıyor; doğru cevaptan sonra "Devam" ve "Sonraki adım" yan yana iki devam düğmesi görünüyor | 86-obs-hesap.js (yardim satırı) | orta | evet: doğru yazılınca ya da "Devam" ile geçilince satır kaldırılıyor; hesap-engel.test.js 151 kontrol geçti |
| Kavram kapısı onBilgi kartları "dopant (katkı atomu)", "carrier (taşıyıcı)", "mobility (hareketlilik)", "lifetime (ömür)" terimlerini öğretmiyor; bunlar düşman o04 şıkkında ve patron faz 3 yedek sorusunda soruluyor | 90-data-s01.js onBilgi[2] | orta | evet: kart 3'e tek kısa madde eklendi, ilk iki madde birleştirildi (kart 4 madde, ≤25 kelime; veri-dogrula temiz) |
| Claude bağlı değilken patron faz 2/3'te öğrencinin yazdığı uzun cevap sessizce atılıyor ve çoktan seçmeli yedek soru çıkıyor (yazılan cevap boşa gidiyor; "Claude yok" notu yalnızca yedek soruda görünüyor) | 85-obs-patron.js açık uçlu faz | düşük | hayır (tasarım kararı; yazmadan önce "Claude bağlı değil, cevap çoktan seçmeli sorulacak" uyarısı eklenebilir) |
| Tahmin simülasyonunda "Mean free path" değerleri birimsiz sayı (305, 59, 85, 44) | 70-sim-kristal_tur.js | düşük | hayır (göreli birim; isterseniz "a.u." eklenir) |
| Köprü sonucu ekranında dock taşıyor (başlık yukarı kayıyor, kaydırma gerekiyor); içerik kesilmiyor | 80-obs-kopru.js | düşük | hayır |

Doğrulananlar (hata yok): soru/balon görev bitene kadar ekranda; şık önce seçilir, Onayla ile gider, sonra eminlik; yanlış geri bildirim "Cevabın yanlış. Doğru seçenek: ..." sade Türkçe; kısa devre, "Temelden bir daha" modali ve yeniden başlama; patron yanlış faz sonrası doğru akış; hesap yanlış adımda "Cevabın yanlış. Doğru: 8 atom."; hesap doğru cevapları (8, 1,601) ve Çözdüm/Tekrar çalış işareti; sandık "Kayıt alındı"; harita "1/10 bölüm onarıldı", s02 "Sıradaki"; yenileme sonrası ilerleme (tamam, hesap tamam) korunuyor.

Fizik teyidi: içerikte değişiklik yapılmadı; si-yogunluk cevapları (N=8, V=1,601×10⁻²² cm³, n≈4,997×10²² cm⁻³) hesapla doğrulandı. Eklenen onBilgi cümlesi genel tanımlardır; kullanıcı yine de gözden geçirsin.
