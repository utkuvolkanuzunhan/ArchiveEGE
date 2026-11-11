# BUG-s04-B (Istasyon 4, engel 4-6: tahmin o05, tuzak o06, kopru o07)
Playwright/Chromium ile oynandi (dist derlendi). Konsol/sayfa hatasi yok, takilma yok.

## Oynanan yollar
- Tahmin o05: dogru secenek (Onayla, "Eminim", sim, "Doğru tahmin", Devam) ve yanlis secenek ("Yanlış. Doğrusu: ...", Devam). Secenekler karisik sirada, secim once yapiliyor, Onayla ile gidiyor.
- Tuzak o06: dogru parca (3. parca) ve yanlis parca (1.). Iddia ve parcalar cevap bitene kadar ekranda; guven paneli cevaptan sonra gizleniyor (s03-B'deki kozmetik sorun burada yok). Dogru/yanlis geri bildirim + Devam calisiyor.
- Kopru o07: DOGRU SIRALAMA yolu denendi (4 kart sirayla yuvalara tiklandi, Kontrol, "Confined wave ... stable atom" sonucu, Devam). Yanlis sira onceki denetimde (s03-B) denenmisti, ayni kod.

## Yerlesim (Kontrol dugmesi)
- 1366x768: kartlar yuvalara dizilince Kontrol y=671-717 (ekran 768), tam gorunur; Kontrol sonrasi panel kayiyor, Kontrol ve Devam (y=703-749) gorunur, ust yuva/soru ust kisimdan kismen kesilip kaydirilabilir.
- 1440x900: Kontrol y=799-845 (ekran 900), Devam y=831-877; tam gorunur.
- Panel ici scroll yok (scrollHeight=clientHeight) dolu halde.

## Kalan / kucuk
- Tahmin simulasyonu etiketleri "Initial n (başlangıç n) / Final m (bitiş m)" dogru bicimde; yanlis geri bildirim "Yanlış. Doğrusu: ..." (ortak kuraldaki "Cevabın yanlış. Doğru seçenek: ..." kalibindan farkli, kozmetik).
- Tuzak yanlis mesaji "Seçtiğin parça hatalı değil. Hatalı olan vurgulanan parça." net; iddia cumlesi anlatici balonunda ve panelde iki kez gorunuyor (zararsiz).
- Kod degisikligi yapilmadi.
