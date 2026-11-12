# onBilgi (Bilgi kartı) şema kullanımı

Opsiyonel alan; yalnızca `hikaye` ve `kavram` engellerinde. Yoksa hiçbir şey değişmez.

```js
onBilgi: [
  { baslik: 'Energy band (enerji bandı)',          // en çok 6 kelime
    madde: ['Kısa madde 1.', 'Madde 2.'] },         // 1-4 madde, her biri en çok 25 kelime
  { baslik: '...', madde: ['...'] }                 // toplam 1-3 sayfa
]
```
- Terimler `English (Türkçe)`; ilk kez görülen her terim burada tanıtılmalı (tarihçe + tanım), sorulardan ÖNCE.
- `hikaye`: üç satır bittikten sonra, Devam düğmesinden önce kartlar açılır. `kavram`: sim'den ÖNCE açılır ("Göreve geç" düğmesi).
- Oyuncu İleri/Geri düğmeleri, ←/→ veya Enter ile gezer; Esc menüsü ve "Önceki engele dön" çalışır.
- `hikayeAtla` ayarı açıksa hikaye engeli zaten listeden düşer; kavram engelinin kartları da atlanır.
- Kod: `src/js/79-onbilgi.js` (`Q.onBilgi.goster(host, kartlar)`, `Q.onBilgi.hepsi('sNN')` Tekrar Merkezi için düz kart listesi).
- Doğrulama: `node oyun/test/veri-dogrula.js` sınırları denetler. Örnekler: `90-data-s02.js` (s02-o02), `90-data-s09.js` (s09-o02).
- 1366x768'de kart alanı taşmaz (4 madde x 1 satır rahat sığar); madde başına ~110 karakterin altında kal.
- Tekrar Merkezi arayüzü henüz bağlanmadı (isteğe bağlı iş).
