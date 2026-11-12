# UX-2 · Yanlış cevap yolu, kayıt, Esc menüsü, Hata defteri / Tekrar Merkezi, konsol (1366x768)

Yöntem: Playwright (dist/oyun.html, Google Fonts abort). Betikler scratchpad'de; konsol/pageerror her koşuda izlendi: HİÇ hata yok (yalnızca engellenen font isteği).

## 1. Yanlış cevap yolu (s03, s05, s08, s10; dusman / tahmin / tuzak / köprü)
- Hepsi: yanlış seçim + "Eminim" -> hata defterine `emin-yanlis` (köprüde eminlik yok -> `yanlis`), `engel` alanı doğru id (ör. `s03-o03`, `s05-o06`, `s08-o07`, `s10-o05`), istasyon doğru, voltaj düşüyor (dusman -40 ... köprü -12), soru ekranda kalıyor, Devam ile ilerliyor. 1366x768'de taşma yok.
- DÜZELTİLDİ (geri bildirim dili tek tip): tahmin "Yanlış. Doğrusu:" -> "Cevabın yanlış. Doğru seçenek: ..."; tuzak "Yanlış. Seçtiğin parça hatalı değil..." -> "Cevabın yanlış. Hatalı olan, vurgulanan parça. Doğru hali: ..."; köprü "Yanlış. Doğru sıra:" -> "Cevabın yanlış. Doğru sıra:"; patron "bilmiyorum" -> "Cevabın yanlış. ..."; Deneme sınavı MCQ Türkçe satırı "Cevabın yanlış. Doğru seçenek: ...".
- Not: tuzak parça seçimi tek dokunuşla gidiyor (Onayla yok); tasarım gereği, değiştirilmedi.

## 2. Kayıt (`cip-hatti-v1`)
Anahtar korunuyor. Bulgular ve düzeltmeler (src/js/10-state.js):
- BUG: Kayıt 400 ms gecikmeli yazılıyordu; hızlı sayfa yenilemede (cevap sonrası) veri kaybolabiliyordu. DÜZELTİLDİ: pagehide/beforeunload'da bekleyen kayıt flush; içe aktarma (Yapıştır) artık hemen flush.
- BUG: eski sürüm kaydı `kartlar` veya `fabrika` alanı olmadan ya da `v` olmadan geçersiz sayılıyor, oyun varsayılana düşüp bir sonraki yazmada eski kaydın ÜZERİNE YAZIYORDU (ilerleme kaybı). DÜZELTİLDİ: gevşek doğrulama (eksik alanlar varsayılanla doldurulur, ilerleme korunur).
- BUG: bozuk JSON'da kayıt sessizce silinecekti. DÜZELTİLDİ: geçersiz ham kayıt `cip-hatti-v1-bozuk` anahtarına yedeklenir.
- BUG: `hataDefteri` içinde null/sayı öğesi varsa harita/hata defteri `Cannot read properties of null (cozuldu)` ile çöküyordu. DÜZELTİLDİ: nesne olmayan öğeler elenir.
- localStorage dolu (setItem QuotaExceeded) / getItem fırlatıyor / localStorage erişimi reddedilmiş: oyun çökmüyor (bellekte devam). EKLENDİ: kayıt yazılamazsa bir kez "İlerleme kaydedilemedi ... İlerlemeyi kopyala ile yedekle" uyarısı.
- Doğrulandı: yenileme sonrası ilerleme/hata defteri korunuyor; Ayarlar "İlerlemeyi kopyala" -> sıfırla -> "Yapıştır" -> yenile ile geri geliyor; bozuk metin yapıştırınca "Metin okunamadı" ve mevcut kayıt bozulmuyor.
- Q.state.aktif.index koşu ilerledikçe güncellenmiyordu (başlangıç değerinde kalıyordu); hudPath içinde güncelleniyor.

## 3. Esc menüsü (s03 tüm engel tipleri, s05 sandık)
- Bu engeli atla / Önceki engele dön / İstasyonun başına dön: hikaye, kavram+sim, düşman x2, tahmin, tuzak, köprü, patron, sandık için takılmadan çalıştı (cur sırasıyla +1, -1, 0). Not: ara/intro animasyonu sürerken (özellikle patron girişi ~13 sn) geri/başa komutu intro bitince uygulanır; takılma değil, gecikme.
- BUG: Engel atlanınca/geri dönülünce eski engelin klavye dinleyicileri (Enter/rakam) document'te kalıyordu; eski dusman/tuzak "Devam" Enter'ı `preventDefault` yapıp sonraki textarea'da Enter'ı engelleyebiliyor, tuzak rakam tuşu eski düğmeyi tetikleyebiliyordu. DÜZELTİLDİ: ui.options, ui.confidence, dusman, tuzak, hikaye, sandık, kavram, tahmin, köprü, patron dinleyicileri sahipsiz (DOM'dan çıkmış) kalınca kendini kaldırıyor. Doğrulandı (dinleyici sayımı).
- BUG: Bir koşu iptal edilip hemen yenisi başlatılınca (Q.runner.start) eski koşunun `then`'i haritayı yeni koşunun üstüne açıyordu; ayrıca start haritayı kapatmıyordu. DÜZELTİLDİ (99-main.js): yeni koşu aktifse harita açılmaz, start `Q.settings.closeMap()` çağırır.
- Not: Son engel (sandık) "Bu engeli atla" ile geçilirse istasyon tamam sayılır (tasarım gereği "atla" serbest).

## 4. Hata defteri ve Tekrar Merkezi (1366x768)
- Hata defteri: tür ham kod gösteriyordu (`emin-yanlis`). DÜZELTİLDİ: "Emindin, yanlış / Yanlış / Bilmiyordun / Şans eseri doğru", yanında istasyon (S05). Taşma yok.
- Tekrar Merkezi (Terimler, Test, Açıklama kartları, Sınav tarzı, Deneme sınavı): hiçbir sekmede yatay/dikey sayfa taşması yok (içerik `tk-body` içinde kayıyor), düğmeler görünür. Test: yanlışta "Cevabın yanlış. Doğru seçenek: ... Nedeni: ...", skor ekranı doğru (3/10), "Yanlışları tekrar et" çalışıyor. Deneme sınavı seçki (50 MCQ + 20 klasik, havuz 94+41) ve tüm havuz: 50 MCQ + 20 klasik sorunsuz, sonuç ekranı (MCQ/klasik puan, süre, zayıf konular, yanlış listesi, terim listesi) doğru, "Yeni deneme" seçimi hatırlıyor. Konsol hatası yok.
- Küçük (düzeltilmedi): harita ekranında istasyon düğmelerinin altında boş bir çerçeve (istasyon paneli) görünüyor; harita dar bir sütunda (1366 genişlikte ~560px).

## 5. Konsol / istisna
Tüm koşularda (yanlış yol, Esc, Tekrar Merkezi, 9 bozuk kayıt senaryosu) `pageerror` yok; yalnızca "hataDefteri null öğe" çökmesi bulundu ve düzeltildi.

## Testler
core, battle, claude, runner, ui, obs-kopru, veri-dogrula geçti. test/ui.test.js "options" adımı Onayla'ya uyarlandı (eskiden takılıyordu).
