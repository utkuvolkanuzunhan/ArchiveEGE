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
