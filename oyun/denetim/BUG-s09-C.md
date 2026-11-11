# BUG-s09-C (Istasyon 9 Bant testi, engel 7-9: kopru o07, patron o08, sandik o09)
Playwright/Chromium, dist derlendi, 1366x768 (+1440x900 kopru). Konsol/sayfa hatasi yok, takilma yok.

## Oynanan yollar
- Kopru o07: yanlis sira -> "Yanlis. Dogru sira:" + liste, Devam, voltaj 100->80. 1366x768'de 4 bos yuva dahil tum yuvalar ekranda (son yuva y<=724); 1440x900'de y<=840.
- Patron o08 (Pauli): Faz 1 secmeli dogru+Eminim -> "Dogru..." + Devam. Faz 2/3 acik uclu: yazi + Gonder + guven -> (Claude yok) yedekSecmeli "Claude yok, coktan secmeli soru"; dogru yol 100'de kaldi, yanlis yol (Eminim) 100->20->28->0 = KISA DEVRE ("Temelden bir daha" kartlari + Sonraki) calisti; yanlis faz2'de "Ikinci sans" alt-soru geldi.
- Sandik o09: kart (Pauli 1925), "Yeni makine kuruldu: Bant", ozet, Devam -> harita (Band testi "calisiyor"). 
- Kayit: ilerleme.s09.tamam=true, kartlar=[pauli], fabrika.kurulu=[s09]; sayfa yenilenince localStorage'dan aynen geri geldi.

## Duzeltilenler
- Patron yedekSecmeli (4 sik) 1366x768'de Onayla dugmesi y=729-775 / 752-798 ile ekran disina tasiyordu (dock kaydirma gerekiyordu). 20-components.css: max-height:800px'te #dock .opt padding/min-height ve .opts gap kucultuldu; Onayla artik y=703-749.
- BUG-s07-B: kopru bos yuvalar (yuva min-height 34->30, aralik 4->2) 1366x768'de tamami ekranda; tuzak iddiasi anlatici balonu varken panelde ikinci kez gosterilmiyor (80-obs-tuzak.js).

## Kalan / kucuk
- Metin kutusu 280 sinirini asinca sayac "288/280" gosteriyor ama Gonder calisiyor (yumusak sinir, 400'de kesilir; tasarim olabilir).
- Tamamlanan istasyondan sonra state.aktif {s09,index:7} kalıyor (zararsiz).
- Haritada kart koleksiyonu ustunde bos yuvarlak cubuk (ilerleme cubugu bos gorunuyor?) - 1/9 istasyon icin dolmamis olabilir, dogrulanmadi.
- Haritada s09 bitince "Kristal firini sirada" gorunuyor (ilk bitmemis istasyon; tasarim).
