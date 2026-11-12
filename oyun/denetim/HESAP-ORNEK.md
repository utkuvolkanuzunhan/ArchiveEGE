# HESAP-ORNEK: hesap görevlerinde önce "Örnek çözüm"

Sorun (kullanıcı): oyun, hesabın nasıl yapılacağını öğretmeden sayısal soru soruyordu (ör. Miller indisleri: kesişim, ters, tam sayı yöntemi hiç gösterilmemişti). Çözüm: hesap isteyen her görevde önce çözülmüş örnek, sonra oyuncunun görevi.

## Veri (`src/js/87-data-hesap.js`)
- 34 görevin hepsinde `ornek: { baslik, soru (EN, kısa), yontem:[3-5 madde], veriler, adimlar:[{baslik, metin, formul, sonuc, say?}], sonuc:{metin, deger, birim}, ipucu }`.
- Örnek, görevin FARKLI SAYILARLA çözülmüş küçük kardeşi (ör. miller-326 görevinin örneği: kesişimler a, 2a, 2a -> (211), d = a/√6). Örnek adımları görevin adımlarıyla aynı sayıda ve aynı sırada (bağlantı için).
- `sonucSoru`: Soru 5 görevlerinde (q5-bolgeler, q5-bos-kuyu, q5-sayisal, q5-basit) son sonucu da soran küçük "Sonuç kontrolü" adımı (adımlardan sonra, yalnız oyun akışında).
- Sayılar `test/hesap-dogrula.py` ile bağımsız doğrulanır (örnek sonucu, `say` ara değerleri, şema: 3-5 yöntem maddesi, adım sayısı eşitliği, sonucSoru = sonuc). 190+ kontrol, 0 hata.

## Oyun içi (`src/js/86-obs-hesap.js`)
1. Görev başlamadan önce "Önce bir örnek" paneli: Yöntem kutusu + örnek soru/verilenler + adım adım (İleri/Geri) örnek, altta büyük "Hazırım, görevi göster". Panelde ceza/puan yok.
2. `hikayeAtla` açıkken ATLANMAZ; yalnız küçük "Örneği geç" düğmesi var.
3. Görev sırasında üst şeritte "Örneği tekrar göster" bağlantısı: örneği tam açan kaplama (görev ve ilerleme bozulmaz, "Göreve dön"). Kaplama açıkken Enter/sayı tuşları göreve geçmez.
4. Yanlış adımda yardım satırında "Örnekteki N. adıma bak" düğmesi: kaplama, ilgili örnek adımı vurgulu açılır.
5. Kök (`.hg-kok`) dock'un iç yüksekliğine sabitlenir; örnek paneli ve görev ızgarası içeride kayar, düğmeler hep görünür (1366x768 dock = 338 px).

## Tekrar Merkezi > Hesap çalıştayı (`src/js/98-tekrar-hesap.js`)
- Görev seçilince önce aynı örnek paneli (Hazırım / Örneği geç), sonra görev. Görev ekranında "Örneği tekrar göster". Yanlış ara cevapta (sayı/şık) "Örnekteki N. adıma bak".
- Ortak bileşen: `Q.tekrarHesap.ornekPanel(host, gorev, opts)`, `ornekKaplama(kok, gorev, adim)`, `css()`.

## Testler
`test/hesap-engel.test.js` (151 kontrol; basla artık örneği geçer, s01..s10 örnek paneli, İleri/Geri, bağlantı, Enter engeli, Örneği geç/tekrar göster), `test/hesap.test.js` (58), `test/hesap-dogrula.py`, runner, veri/sinav doğrulama, smoke 9/9 geçti. 1366x768 görüntü kontrolü: s01, s02, s05, s06 örnek paneli ve görev ekranı, taşma yok.

## Notlar
- Sonuç kontrolü (sonucSoru) yalnız Soru 5 görevlerinde; diğer görevlerin son adımı zaten kendi ara sorusuna ya da formüle sahip. İstenirse aynı alan başka görevlere de eklenebilir.
