# BUG-s06-B (Istasyon 6, engel 4-6: tahmin o05, tuzak o06, kopru o07)
Playwright/Chromium ile oynandi (dist derlendi). Konsol/sayfa hatasi yok, takilma yok. Kod degisikligi yapilmadi.

## Oynanan yollar
- Tahmin o05: secenekler karisik, once secilir, Onayla ile gider; guven (Eminim) sonrasi sim (T=1.7e-9, a=1.5 nm) ve "Doğru tahmin..." + Devam calisiyor.
- Tuzak o06: iddia + 3 parca ekranda; parca secilince guven paneli, sonra geri bildirim akisi calisiyor.
- Kopru o07: dogru sira ("Her region ... R ve T." sonucu) ve yanlis sira ("Yanlış. Doğru sıra:" listesi + sonuc) denendi; ikisinde de Devam calisiyor.

## Yerlesim (Kontrol dugmesi)
- 1366x768: kartlar yuvalara dizilince Kontrol y=671-717 (tam gorunur). Kartlar havuzdayken (bos yuvalar) Kontrol y=732-778 ekranin altina tasiyor ama disabled; dolunca yukari geliyor. Kontrol sonrasi Devam y=703-749 gorunur; panel ici kaydirma var (533/332), ust kisim kayabilir.
- 1440x900: Kontrol y=799-845, Devam y=831-877; tam gorunur.

## Kucuk
- Kopru yanlis sonuc mesaji "Yanlış. Doğru sıra:" ortak kalibdan farkli (kozmetik, s04-B ile ayni).
