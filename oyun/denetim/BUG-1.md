# BUG-1 · D1 hata denetimi (istasyon 1 uçtan uca, Playwright)

Ortam: `bash oyun/build.sh --zorunlu-degil` (7 sim dosyası eksik uyarısı; bohr, kuyu, basamak, olcum, belirsizlik, bant, fermi yok), 1280x800.
Mevcut testler: battle, claude, core, obs-kopru, obs-patron, runner, veri-dogrula, smoke (9/9) hepsi geçti.
Konsol: yalnızca font isteği `net::ERR_FAILED` (route ile abort edilen Google Fonts). Başka hata/uyarı yok.
Özet: kritik 0, orta 3, düşük 4.

Doğru çalışanlar: hikâye, kavram (sim sarmalı + api.done + Devam), düşman, tahmin, tuzak, köprü, patron, sandık; doğru/yanlış/emin-yanlış akışları (voltaj 100->60->20->0); voltaj 0 -> KISA DEVRE -> "Temelden bir daha" kartları -> voltaj 70 -> ilk düşman kontrol noktasından devam; 3. kısa devrede hasar yarıya iner; istasyon bitince harita, s01 tamam, s02 açılır; kayıt `localStorage['cip-hatti-v1']`, yeniden yüklemede korunur; 'İstediğin engele atla' listesi (hikâye atla kapalıyken) s01-s03 için 9 engelde doğru engeli başlatır.

## ORTA

### O1 · "İstediğin engele atla" hikayeAtla açıkken bir sonraki engele atlar (kaydırma)
- Nerede: `src/js/20-settings.js:252-276` (startStation(s, i), i = `s.engeller` indeksi) ile `src/js/95-runner.js:192` (`buildList` hikâyeyi çıkarır) ve `:188-190` (sadecePatron listesi tamamen farklı).
- Tekrar: Ayarlar > "Hikâye sahnelerini atla" Açık > harita > Kristal fırını > "4. Kusur düşmanı".
- Beklenen: o04 (tane sınırı sorusu). Gerçek: o05 (tahmin çukuru) açılır. "7. Mantık köprüsü" patronu, "8. Patron" sandığı açar. "Hızlı mod" açıkken indeks anlamsızdır. `Q.battle.reviewPick` ekstraları patrondan önce eklenirse patron sonrası indeksler de kayar.
- Sorumlu: A8 / A2. Öneri: `from` değerini engel id'siyle geçir, runner id'yi `buildList` çıktısında arasın.

### O2 · Çalışırken ⚙ düğmesi Ayarlar ve Duraklatma menüsünü üst üste açar; "Haritaya dön / engele atla" Ayarlar'ı açık bırakır
- Tekrar: istasyonda bir engelde dururken üstteki ⚙ > iki panel birden açılır (Duraklatıldı kutusu Ayarlar'ın üstünde). "Haritaya dön / engele atla" > harita açılır ama Ayarlar paneli kapanmaz; engele atlayınca oyun Ayarlar'ın arkasında devam eder (`set3.png` benzeri görünüm), "Kapat" ile elle kapatmak gerekir.
- Nerede: `src/js/95-runner.js:305-307` (menü `ayarlar`/harita), `src/js/20-settings.js:174` (`S.close(); S.openMap()`), `#btn-settings` tıklama işleyicisi.
- Beklenen: tek panel; harita/atla Ayarlar'ı kapatır. Sorumlu: A8 / A2.

### O3 · Yol (canvas) sağ kısmı farklı çiziliyor
- Tekrar: istasyon başlat ya da engele atla, ekran görüntüsü: x≈780'den sağda zemin ızgarası yok, düz mor/magenta eğik bir şerit ve kesik bir arka plan (iki ayrı sahne dikişi). Sürekli görünür (stuck.png, jump.png).
- Nerede: `src/js/42-art-world.js` (zemin/paralaks çizimi, kamera X ofseti), `95-runner.js` çizim döngüsü. Sorumlu: A5b. Öneri: zemin ve arka planı canvas genişliği boyunca çiz, dikişi kontrol et.

## DÜŞÜK

### D1 · Karşılama kutusu `Q.runner.start` ile arkada oynar
- `Q.settings.closeMap(); Q.runner.start()` karşılama ("Çip Hattı / Başla") kutusunu kapatmaz; oyun kutunun arkasında akar. Normal akışta (Başla > harita) olmaz; yalnızca doğrudan API çağrısında. Sorumlu: A9 (`99-main.js:70`).

### D2 · Kısa devre sonrası geri dönülen engel zaten çözülmüş düşman olabilir
- Boss'ta voltaj 0 olunca oyuncu ilk düşmana (kontrol noktası) döner; tasarım gereği, ama kavram ve hikâyeyi atlar. Not olarak: ilerleme `enSon` kısa devrede 0 kalır, "Devam et" bir sonraki oturumda başa döner. Sorumlu: A2.

### D3 · `Q.save.importText` alan türü/aralığı doğrulamıyor
- `valid()` yalnızca şekle bakar: `ayarlar.hiz=99`, `voltaj=-50`, `ilerleme.s01.tamam:'x'` kabul edilir (`10-state.js:91-98`). Oyunu bozmaz ama sınır/tür denetimi yok. Ayrıca bitmiş bir koşudan sonra `exportText` -> `importText` -> `exportText` çıktısı 473 yerine 445 karakter verdi (bir alan normalize ediliyor); ayrıntısı doğrulanamadı. Sorumlu: A1.

### D4 · Tahmin engelinde sim "Gönder" düğmesi Devam'dan sonra da görünür kalır
- Düşman/tahmin akışında (`80-obs-tahmin.js:90`) Devam ile birlikte "Gönder" aynı anda listede. Sorumlu: H3.

## Statik/diğer notlar
- Eksik sim modülleri (bohr, kuyu, basamak, olcum, belirsizlik, bant, fermi) ve s04-s10 verisi henüz yok; harita bu istasyonları "kilitli" gösterir.
- Sıkışma yok: 3 politika (doğru, yanlış, emin-yanlış) ile tam akış tamamlandı.
