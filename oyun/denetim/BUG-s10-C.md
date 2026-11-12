# BUG-s10-C (Istasyon 10 Paketleme/Fermi, engel 7-9: kopru o07, patron o08, sandik o09)
Playwright/Chromium, dist derlendi, 1366x768. Ayarlar'da istasyon10 Q.settings.set ile acildi. Konsol/sayfa hatasi yok (yalnizca font ERR_FAILED, abort edilen Google Fonts).

## Oynanan yollar
- Kopru o07: yanlis sira -> "Yanlis. Dogru sira:" + liste + sonuc, Devam; tum yuvalar ekranda (son yuva y=724), Devam y<=749.
- Patron o08 dogru yol: Faz1 secmeli dogru+Eminim -> "Dogru..." Devam; Faz2/3 acik uclu (Claude yok) -> yedekSecmeli 4 sik, Onayla y<=743; dogru -> Devam; patron biter, sandik.
- Patron yanlis yol: Faz1 yanlis+Eminim voltaj 100->20, "Ikinci sans" alt-soru dogru -> 28; Faz2 yanlis -> 0 = KISA DEVRE, "Temelden bir daha" 3 kart (Fermi level / Carriers / Drift) + Sonraki, sonra "Dene bakalim" -> fermi sim (T/E_F/E kaydiricilari, Anladim) calisti; sonra Faz 3'e donuldu, voltaj 36.
- Sandik o09: kart (Fermi 1926, f(E) portre), "Yeni makine kuruldu: Paketleme", ozet, Kayit alindi, Devam -> harita (Paketleme "calisiyor").
- Kayit: ilerleme.s10 {tamam:true,enSon:8,kisaDevre:0}, kartlar=[fermi], fabrika.kurulu=[s10], ayarlar.istasyon10=true; yenilemeden sonra aynen geri geldi, harita dogru.

## Bulgu: engelleyici hata yok
## Kucuk / dogrulanmadi
- Ana menu alt basligi "Kumdan cipe: 9 istasyon" bonusla 10 oluyor (istasyon10 aciksa).
- Tamamlanan istasyondan sonra state.aktif {s10,index:5} kaliyor (zararsiz, s09'daki gibi).
- Patron adi balonda "Enrico Fermi", baslik verisinde "Fermi (Fermi) Canavari" (tekrar; baslik arayuzde gorunmedi).
- Kopru bloklarinin bir kismi Turkce ("Hareketli n ve p yuk tasir"); sinav degil oyun metni, diger istasyonlarla tutarli.
