# BUG-s03-C (Istasyon 3, engel 7-9: patron, sandik, istasyon sonu)
Yarida kesildi (koordinator durdurdu). Kod duzeltmesi yok.
## Dogrulanan
- Patron baslatma (s03-o08, indeks 7): giris ~13 sn sonra "Faz 1/3" secmeli soru dock'ta gorunuyor; 1366x768'de tasma yok; konsol hatasi yok.
- Soru ve sikklar `English (Turkce)` bicimde; veri dosyasinda (90-data-s03.js) tum fazlar, alt ve yedek sorular da bicime uygun.
- Siklar karistiriliyor (data-i ozgun indeks); Onayla secim yapilana kadar kapali.
- Kayit: patron sirasinda localStorage 'cip-hatti-v1' icinde ilerleme.s03 {tamam:false, enSon, kontrol}, aktif.bossHp, fabrika.kurulu yazili.
## Kalan (dogrulanmadi)
- Patron fazlari 2-3 (acik uclu/yedek), sandik, istasyon sonu, haritaya donus, ilerleme.s03.tamam, fabrika.kurulu, yenileme kaliciligi, yanlis yol.
- Betik notu: secenekler `.opt[data-i]`, onay `.opt-onay`; dogru secenek data-i=0. Betik: Playwright /opt/node-tools; Claude backend yok (yedek akis).

## Devam oynama (patron faz 1-3, sandik, istasyon sonu, kayit) - 1366x768
- BUG (DUZELTILDI): patron/secmeli sorularda "Ne kadar eminsin?" dugmeleri dock disina tasiyordu (ust 745, alt 812 > 768); Onayla'dan sonra dugmeler gorunmuyor, oyuncu dock'u kaydirmak zorundaydi (ilk denemede takildi sandim). Cozum: `ui.confidence.ask` eklenince `wrap.scrollIntoView({block:'nearest'})` (50-ui.js); simdi alt 757 < 768.
- Faz 1 (secmeli) -> Onayla -> eminlik (1/2/3 tusu) -> "Dogru..." aciklama + Devam: calisiyor. Faz 2-3 (acik uclu): Claude backend yok, yedekSecmeli akisi calisiyor, textarea+Gonder var; patron bitince bossHp 0.
- Sandik + istasyon sonu: ilerleme.s03 {tamam:true, enSon:8}, fabrika.kurulu ["s03"], runner sonunda Fabrika haritasi aciliyor (Isik-test odasi "calisiyor").
- Kayit kaliciligi: sayfa yenilenince localStorage 'cip-hatti-v1' icinde ilerleme.s03.tamam=true ve fabrika.kurulu korunuyor; yenilenince "Cip Hatti / Devam" menusu geliyor.
- Kucuk (duzeltilmedi): bitis sonrasi `aktif` {stationId:s03,index:6,bossHp:0,bossId:einstein} kayitta eski kaliyor (zararsiz, devam akisini etkilemiyor gozukuyor). Konsolda yalnizca font ERR_FAILED (abort edilen Google Fonts).
- Yanlis yol (yanlis cevapla patron) denenmedi.
