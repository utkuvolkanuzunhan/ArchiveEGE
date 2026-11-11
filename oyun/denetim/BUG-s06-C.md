# BUG s06 grup C (o07-o09: patron, sandık, istasyon sonu, kayıt) - oynanış notu

Oynandı: 1366x768 (yanlış-önce yolu) ve 1440x900 (doğru yol), Playwright, Claude yok (yedekSecmeli).
- Patron faz 1: yanlış seçim -> "Cevabın yanlış. Doğru seçenek: R = 1..." -> Devam -> "İkinci şans" alt soru -> doğru. Faz 2 ve 3 (açık; Claude yok -> yedekSecmeli) doğru geçti. Soru/baloncuk görev bitene kadar ekranda; şık önce seçilir, Onayla ile gider; eminlik adımı çalışıyor. Hata yok.
- Sandık/istasyon sonu: kart "Broglie · 1924", "Yeni makine kuruldu: Tünel istasyonu", özet maddeleri, Devam; ilerleme.s06.tamam=true, fabrika.kurulu'na eklendi; koşu bitince fabrika haritası açılıyor (s06 "çalışıyor", s07 "sıradaki"), Louis de Broglie kartı açık.
- Kayıt kalıcılığı: reload sonrası localStorage "cip-hatti-v1" içinde ilerleme.s06 {tamam:true, enSon:8, kontrol:1} korunuyor.
- Konsol: yalnızca engellenen Google Fonts. 1366x768 ve 1440x900'de yerleşim taşmasız (patron paneli ay/arka planı kısmen örtüyor, sorun değil).
- (o07 köprü bu grupta değil; BUG-s06-B kapsamı.)

## Ek hata (DÜZELTİLDİ): balonda iç anahtar görünüyordu
Kaynak: `src/js/50-ui.js` ui.bubble.say içindeki ad tablosu (AD) yalnız anlatıcı/selin/koşucu biliyordu; düşman engellerinde `runway.say(ob.kusurSkin, ...)` (80-obs-dusman.js) kim olarak "vakans", "safsizlik", "tane_siniri", "dislokasyon", "dusman" iç anahtarını geçiriyor ve ad olarak aynen basılıyordu (tüm istasyonların düşmanları). AD tablosuna bu anahtarların okunur karşılıkları eklendi (ör. "Vacancy (Boşluk) Kusuru"). Tüm istasyonlar için geçerli.
