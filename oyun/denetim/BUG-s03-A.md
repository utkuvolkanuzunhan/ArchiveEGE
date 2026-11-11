# BUG-s03-A (İstasyon 3, engel 1-3: kavram, düşman, düşman)
Oynandı: karacisim kavram kapısı (kaydırıcı 5000 K + Classical düğmesi -> Devam), fotoelektrik sim (1366x768, 1440x900), s03-o03 yanlış, s03-o04 doğru cevap. Konsol hatası yok.
## Bulunan ve düzeltilen
- Kavram kapısında sim kutusu (max-height - 150px, overflow hidden) kaydırıcıyı ve Classical düğmesini kesiyordu (768px). max-height -96px, overflow auto (20-components.css).
- Düşman geri bildirimi: Onayla düğmesi yer kaplayıp soruyu dock üstünden kaydırıyordu (768px). Cevap sonrası Onayla gizlendi (80-obs-dusman.js).
- Fotoelektrik: "Electrons/s", "Kinetic energy (eV)", "Frequency", "Intensity" yalnız İngilizceydi -> English (Türkçe); kutu etiketi dar kutuda otomatik küçülür; "Na" etiketi üstten kesiliyordu.
- Karacisim: "Wavelength (nm)", "Classical" etiketleri Türkçe karşılıklı yapıldı.
- s03-o04 sorusu "light paketinin (photon, foton)" -> "photon (foton)".
## Kalan / not
- "Claude yok, çoktan seçmeli soru:" yalnız patron (85-obs-patron.js); düşmanda yok, dokunulmadı.
- Geri bildirim metni sade: "Cevabın yanlış. Doğru seçenek: ..." çalışıyor; soru dock ve balonda cevap sonuna kadar kalıyor.
