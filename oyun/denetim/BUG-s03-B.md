# BUG-s03-B (Istasyon 3, engel 4-6: tahmin o05, tuzak o06, kopru o07)
Oynanan: tahmin (yanlis), tuzak (dogru+yanlis), kopru (1366x768 ve 1440x900, yanlis siralama). Konsol hatasi yok (yalniz font abort), takilma yok.
- Soru metni cevap bitene kadar kalıyor (tuzak/kopru: tum akis; tahmin: simulasyon ekranina gecince soru gizleniyor, geri bildirim gorunuyor).
- Tahmin: secenek once secilip Onayla ile gidiyor; geri bildirim sade Turkce.
- Kopru: Kontrol dugmesi iki cozunurlukte de tam gorunur (KESIK kontrolu bitmedi, arka plan cikisi okunmadi).
- Terimler English (Turkce) bicimli (veri taramasi).
## Kalan / duzeltilmedi
- Tahmin simulasyonunda etiketler "Frequency / Intensity / Metal" Turkce karsiliksiz (70-sim-fotoelektrik.js; baska ajanin alani, dokunulmadi).
- Tuzakta guven paneli ("Ne kadar eminsin?") cevaptan sonra ekranda kaliyor (kozmetik).
- Kopru dogru siralama yolu ve KESIK sayimi dogrulanmadi. Kod degisikligi yapilmadi.
