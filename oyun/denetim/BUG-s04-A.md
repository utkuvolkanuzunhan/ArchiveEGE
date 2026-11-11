# BUG-s04-A (İstasyon 4: kavram o02 Bohr, düşman o03, düşman o04)
## Düzeltildi
- Kod düzeltmesi yapılmadı (süre doldu).
## İncelendi
- 70-sim-bohr.js ve 90-data-s04.js okundu: başarı koşulu gecis [3,2]; Photon düğmesiyle erişilebilir. Terimler English (Türkçe) biçiminde, şıklar dahil.
- 1366x768 ve 1440x900: kavram ekranında tasma yok, konsolda yalnızca font engeli hatası.
## Bulgu / Kalan
- Bohr simülasyonu başlangıçta zaten n=3, m=2 ile açılıyor; Photon'a tek tıklamak görevi bitiriyor (görev çok kolay). Öneri: params başlangıcını farklı yap (örn. n:4, m:1), basari gecis [3,2] kalsın.
- Düşmanlar o03/o04 doğru/yanlış oynanmadı; dock/balon metni kalıcılığı ve Onayla akışı doğrulanmadı.
- Headless'ta koşucu engele geç yürüyor (sim ~9 sn sonra açılıyor); betik beklemeli yazılmalı.

## Tur 2: o03/o04 oynandi (Playwright, 1366x768 ve 1440x900, dogru+yanlis, 8 kosu)
- Akis sorunsuz: soru/balon cevap suresince ekranda kaliyor (3 sn sonra hala 3 sik), sik secilince Onayla acilir, Onayla -> eminlik -> aciklama + Devam. Tasma yok, konsol hatasi yok.
- Dogru cevap metni: "Dogru. <neden>"; yanlis: "Cevabin yanlis. Dogru secenek: ... Senin sectigin: ... (neden)" - dogru/yanlis esleme dogru, sik sirasi karisik olsa da data-i ile dogru sik bulundu.
- Dil: sik ve nedenler English (Turkce) kurala uygun. Eksik/yanlis terim bulunmadi.
- Onceki not guncel: s04-o02 Bohr params artik {n:4,m:1} (kolay baslangic duzeltilmis).
- Kucuk bulgu (duzeltilmedi): konusma balonunda konusan adi ic anahtar olarak gorunuyor ("vakans", "safsizlik" = kusurSkin). Oyuncuya "Kusur dusmani" gibi okunur ad gosterilmesi daha iyi (80-obs-dusman.js runway.say(skin, soru)).
- Kucuk bulgu: yanlis cevap aciklamasi uzun (dogru secenek + neden + senin sectigin + neden); 1366x768'de sigiyor ama yogun.
