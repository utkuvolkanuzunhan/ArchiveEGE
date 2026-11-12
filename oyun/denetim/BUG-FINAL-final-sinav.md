# BUG-FINAL-final-sinav · Final "Sınav Günü" + "Gerçek sınav (10 soru)" denetimi

Çalıştırılanlar: `final.test.js` claude / mcq / karma / esc (hepsi geçti), `gercek-sinav.test.js` (geçti), 1366x768 ve 1440x900'de Gerçek sınav Q1/Q5/Q6 yazma (taşma yok, 12000 sınırı çalışıyor, yenilemede taslak kalıyor), Final'de 10 soru oynandı (Claude'suz MCQ yedek akışı + sahte Claude route'u).

Soru metinleri: 10 soru, kuantum-calisma-plani.md haritasındaki sıra/konuyla birebir uyumlu (kristal, CZ, QM doğuşu, H kararlılığı, Q5 potansiyel, Q6 basamak, bant, ilkeler, 3. postülat, belirsizlik); Final ve Gerçek sınav aynı `Q.data.gercekSinav` kaynağını kullanıyor, test sıralamayı doğruluyor. PDF'in kendisi depoda yok, metinlerin hocanın PDF'iyle harf harf aynılığı kullanıcı teyit etsin.

| sorun | konum | önem | düzeltildi mi |
|---|---|---|---|
| Final soru ekranında (1366x768) alt panel taşıyor: "Gönder / Bilmiyorum" düğmeleri ilk sorularda ~10-30 px, Q5/Q6'da (şekilli) ~160 px ekran dışında kalıyor (panel kaydırılabiliyor ama düğme görünmüyor) | src/js/96-final.js (textbox rows:7, şekil max 420px) | orta | evet: yazı alanı 5 satır (şekilli sorularda 2), Q5/Q6 şekli en çok 125 px yükseklik; Q1-Q4 artık sığıyor, Q5/Q6'da küçük kaydırma (~30-40 px) kalıyor |
| Q5/Q6 şekillerinin sayısal değerleri (9 eV engel 20-30 nm, V0, E) PDF'ten bilinmiyor, şekil varsayım | 86-data-gercek-sinav.js not | orta | hayır: kullanıcı teyit etsin (fizik içeriği) |
| Final yedek MCQ'su soruyla birebir eşleşmiyor, istasyon düzeyinde (Q5/Q6 için de genel MCQ çıkıyor) | 96-final.js mcqOf | düşük | hayır (bilinen, tasarım) |
| Claude puanı verildikten sonra cevap düzenlenirse eski Claude puanı kalıyor (Gerçek sınav) | 98-gercek-sinav.js claudeHazir | düşük | hayır |
| Final'de Esc/"önceki" ile geri dönüldüğünde yazılan taslak siliniyor (yalnızca aynı soru içinde Tekrar dene'de korunuyor) | 96-final.js | düşük | hayır (tasarım gereği) |
