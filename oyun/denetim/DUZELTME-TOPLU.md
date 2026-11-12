# DUZELTME-TOPLU: BUG-*.md acik bulgularin toplu taramasi

## Duzeltildi (1366x768 Playwright ile dogrulandi; veri-dogrula, sinav-dogrula, core, battle, obs-kopru, runner testleri ve smoke 9/9 gecti)
- Kopru yanlis mesaji "Yanlis. Dogru sira:" -> "Cevabin yanlis. Dogru sira:" (80-obs-kopru.js), ortak kalip.
- Tahmin yanlis mesaji "Yanlis. Dogrusu:" -> "Cevabin yanlis. Dogru secenek:" (80-obs-tahmin.js).
- Baslik ekrani "9 istasyon" sabiti kaldirildi (s10 acikken yanlisti) (99-main.js).
- Harita: istasyon secilmeden gorunen bos panel cubugu (kart koleksiyonu ustunde) gizlendi; istasyon secilince acilir, Esc ile kapanir (20-settings.js). Dogrulandi: baslangicta display:none, tiklayinca block.
- Istasyon tamamlaninca state.aktif sifirlaniyor (stationId:null) (95-runner.js); eski deger kalmiyordu.

## Zaten duzeltilmis bulundu (kodda dogrulandi)
- O1 "istedigin engele atla" kaymasi (Runner.indexOf id ile arar); tuzak eminlik dugmeleri (confHost gizleniyor); s04 Bohr baslangici; s09 kavram doldurma, skin ve balon cakismasi; s10 istasyon10 varsayilani.

## Duzeltilmedi (gerekce)
- Metin sayaci 288/280: yumusak sinir 400 bilincli, ui.test.js bunu bekliyor (300/280, 400'de kesilir).
- s10 tahmin sim asamasinda soru ilk satiri kirpilmasi ve 50 K'de n=10^-36 gosterimi: s10 / 96-final.js uzerinde baska ajanlar calisiyor, dokunulmadi.
- s10 kavram kapisi E>0 kosulu, s10 o03 skin'i bant_bosluk: s10 alani.
- Soru/iddia metninin balon+panelde iki kez gorunmesi: tasarim, belirsiz; dokunulmadi.
- s08 veri dilinde bozuk karisik cumleler (BUG-s08-C 3): icerik editi gerektirir, kapsam disi.
- s03 fotoelektrik sim etiketleri (Frequency/Intensity/Metal) Turkce karsiliksiz; sim dosyasi baska alan.
- Konusma balonunda ic anahtar adi (s04): s09 icin skin eklenmisti, genel eslestirme tablosu kontrol edilmedi.
- Hikaye/harita adlarinda dil karisikligi, harita paneli 560px darligi, 1366x768 sim panelinde kirpilma (s06-A), 5 bloklu kopru bos yuvalarin ekran disina tasmasi (s07-B): yerlesim/icerik degisikligi riskli, ayri tur gerekir.
- BUG-1 O2 (Ayarlar+Duraklat ust uste), O3 (canvas sag serit), D1, D2: bu turda yeniden uretilmedi / dokunulmadi.
