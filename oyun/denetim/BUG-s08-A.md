# BUG s08 grup A (o02 kavram, o03 dusman, o04 dusman) - 1366x768 / 1440x900

Gercek oyuncu gibi oynandi (kavram sim'i slider ile gercekten bitirildi; o03 yanlis + Emin degilim, o04 dogru + Eminim). Konsolda yalnizca Google Fonts istegi hatasi (beklenen).

- o02 kavram: sim (slider + Conjugate dugmesi) dock'a sigiyor; slider en saga/sola cekilince ogrenilen metni + Devam geliyor. Sorun yok.
- o03/o04: soru, secenekler, Onayla (1366x768'de y=637-683, tam gorunur), eminlik paneli (y<=757) ve "Cevabin yanlis. Dogru secenek: ..." geri bildirimi dogru. Dogru cevap (Buyur / hbar cok kucuk) dogru isaretli. Voltaj hasari Devam sonrasi uygulaniyor (100->80 yanlis+orta, 80->88 dogru+Eminim).
- Dil: sinav terimleri English (Turkce) bicimli, sorun gorulmedi.

1. DUZELTILDI: Hata defterine yazilan `engel` alani, hikaye atlaninca (hikayeAtla) bir onceki engeli gosteriyordu (o03 yanlisi "s08-o02" yaziliyordu). Runner artik sonuc.engel = ob.id atiyor. Dosya: src/js/95-runner.js.
2. Not (duzeltilmedi): yanlis geri bildiriminde parantez icinde yanlis secenegin nedeni ("Senin sectigin: X (neden)") okunurlugu biraz agir; islevsel sorun yok.
