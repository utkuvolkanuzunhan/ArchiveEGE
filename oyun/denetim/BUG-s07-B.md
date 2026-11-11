# BUG-s07-B (Istasyon 7, engel 4-6: tahmin o05, tuzak o06, kopru o07)
Playwright/Chromium, dist derlendi, 1366x768 (dogru yol) ve 1440x900 (yanlis yol). Konsol/sayfa hatasi yok, takilma yok.

## Oynanan yollar
- Tahmin o05: sik once secilir, Onayla ile gider; guven (Eminim) sonrasi olcum sim'i (Measure / Tekrar measure / 100 times) acilir, "Tekrar: yine 2..." ve "Doğru tahmin..." geri bildirimi + Devam calisiyor.
- Tuzak o06: iddia + 3 parca; hatali parca (Schrödinger equation) secilince guven paneli, sonra "Doğru. Düzeltilmiş hali..." + Devam; yanlis parca yolu da denendi (1440).
- Kopru o07: dogru sira ("Superposition ..., collapse, deterministic evolution." sonucu) ve ters/yanlis sira ("Yanlış. Doğru sıra:" + liste) -> ikisinde Devam calisiyor, bir sonraki engele geciyor.

## Duzeltilen: Kontrol dugmesi (80-obs-kopru.js)
- Eski: Kontrol kartlarin/yuvalarin altindaydi; 1366x768'de kartlar havuzdayken y=778-823 (ekran disi), yuvalar dolunca 671-717.
- Yeni: Kontrol soru basliginin hemen altina tasindi. 1366x768: y=464-510 (bos ve dolu durumda), kontrol sonrasi 392-438; Devam 703-749. 1440x900: Kontrol y=592-638, Devam 831-877. Hepsi tam gorunur.

## Kalan / kucuk
- Bos yuvalarla 1366x768'de son yuva(lar) (y>768) ve 1440x900'de son yuva (906) kismen ekran disinda; kartlar yerlesince sigiyor (ekran disi kismi islevi engellemiyor).
- Tuzak iddiasi ekranda iki kez gorunuyor (Anlatici balonu + panel) - bilinçli olabilir.
- Kopru yanlis mesaji "Yanlış. Doğru sıra:" ortak kalibdan farkli (kozmetik).
