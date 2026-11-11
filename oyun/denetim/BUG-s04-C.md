# BUG-s04-C (Istasyon 4, engel 7-9: patron Yorunge Canavari, sandik, istasyon sonu, harita, kayit)
Kod duzeltmesi yapilmadi; kritik hata bulunmadi.
## Dogrulanan (Playwright, 1366x768 ve 1440x900, konsol hatasi yok, dock tasmasi yok)
- Patron o08 tum fazlar (hepsi dogru): Faz 1 secmeli, Faz 2 ve 3 acik uclu; Claude yokken yedekSecmeli akisi cikiyor. bossHp 120 -> 80 -> 40 -> 0. Sandik'a gecis ~11 sn sonra.
- Yanlis yol: Faz 1 yanlis -> "Cevabin yanlis. Dogru secenek: ..." + secilenin nedeni, sonra "Ikinci sans" alt sorusu; ikisi de yanlis -> kisaDevre (ilerleme.s04.kisaDevre=1), "Temelden bir daha" 1/3 kartlari "Sonraki" ile aciliyor, kontrol noktasina donus calisiyor.
- Soru/sik metni English (Turkce) bicimde; sik karistirma var (data-i ozgun indeks); Onayla secimden once kapali; eminlik sorusu sik secilince geliyor.
- Sandik o09: Bohr 1913 karti, "Yeni makine kuruldu: Atom mikroskobu", 3 ozet maddesi, "Kayit alindi" + Devam; ardindan Fabrika haritasi acilir, s04 "calisiyor", kart koleksiyonunda Niels karti acik.
- Kayit kalicligi: sandik sonrasi ve sayfa yenilemeden sonra localStorage 'cip-hatti-v1' ve Q.state ayni: ilerleme.s04 {tamam:true,enSon:8,kontrol:1}, fabrika.kurulu ["s04"], kartlar ["bohr"].
## Kucuk gozlemler (duzeltilmedi)
- Harita paneli 1366x768'de dar (yaklasik 560 px, ortada); alt kisimda bos bir cubuk (ilerleme cubugu bos gorunuyor) ve kart koleksiyonu ekran disina tasiyor (kaydirma gerekir).
- Harita istasyon adlari karisik dil: "Kesim testeresi", "Tunel istasyonu" Turkce-only; "Measurement (olcum) laboratuvari", "Band (bant) testi" Ingilizce terimli. Tutarsiz.
- HUD "Gecen 0s 05dk" bicimi belirsiz (saat/dakika sirasi).
- Patron Faz 2 acik uclu: Claude yokken "Claude yok, coktan secmeli soru" metni gorunuyor (yedek akis, beklenen).
- yedekSecmeli secenegi "Atom cok cold (soguk) olduğu icin" karisik dil (DIL-1 kuralina aykiri: Turkce cumle icinde yarim Ingilizce).
