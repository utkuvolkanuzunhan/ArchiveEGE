# BUG-s07-C (Istasyon 7 Olcum laboratuvari, engel 7-9: patron o08, sandik o09, istasyon sonu, harita, kayit)
Playwright/Chromium, 1366x768 (dogru yol) ve 1440x900 (faz 1'de yanlis yol), Claude backend yok (yedek akis). Takilma, tasma, konsol hatasi yok (yalnizca font ERR_FAILED).

## Dogrulanan
- Patron "Olasilik Canavari" (Max Born): giris balonu, Faz 1/3 secmeli (sik once secilir, Onayla ile gider, eminlik paneli), Faz 2 ve 3 acik uclu (cevap kutusu, Bilmiyorum/Gonder, eminlik), yedek secmeli (4 sik) dogru calisiyor; her faz sonunda Devam.
- Yanlis yol (1440): faz 1'de yanlis sik -> "Cevabin yanlis. Dogru secenek: ... Senin sectigin: ..." sade Turkce, ardindan "Ikinci sans" alt sorusu (Hangi buyukluk bir measurement result olabilir?) dogru calisti; voltaj 100 -> 60.
- Sandik: kart Born 1926, "Yeni makine kuruldu: Olcum lab.", 3 maddelik ozet, Devam; ilerleme.s07 {tamam:true,enSon:8,kontrol:1}.
- Istasyon sonu -> Fabrika haritasi acilir; s07 "calisiyor", s08 "siradaki".
- Kayit: sayfa yenilenince localStorage cip-hatti-v1 ilerleme.s07 korunuyor (1366 dogrulandi).

## Kucuk gozlemler (duzeltilmedi)
- Faz 2/3 acik uclu sorularda gorunen Turkce `soru` metni cok parcali karisik dilde ("Quantum mechanics (kuantum mekanigi) postulate (postulat) ilkelerini explain (acikla)"); tarif edilen DIL-1 bicimine uygun ama okunusu agir. Yedek sik: "State (durum) olculen eigenstate (ozdurum) durumuna collapse (coker) eder" da ayni sekilde garip.
- Ust cubukta "Istasyon 7/9" (toplam 9; README 10 istasyondan soz ediyor).
- Playwright fill() maxLength'i asabiliyor (316/280 sayaci); gercek yazimda maxLength gecerli, hata degil.
