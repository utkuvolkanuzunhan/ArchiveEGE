# ICERIK-s09 · İstasyon 09 (Bant testi) kapsamlı içerik denetimi

Kapsam: `90-data-s09.js`, `87-data-hesap.js` (bant-si, bant-gaas), `93-data-sinav-3.js` (sv-s09-m1..m10, k1..k4), `89-data-kartlar.js` (pauli, bloch, kronig), `88-data-fabrika.js` (s09), `istasyonlar/09-bant-testi.md`, `kuantum-calisma-plani.md` (S7 cevabı).

Hesap Python ile yeniden hesaplandı: bant-si λ = 1239,84/1,12 = 1107 nm, bant-gaas λ = 873,1 nm, 1000 nm foton = 1,24 eV < 1,42 eV. Sınav k4: 5 eV / 5e22 = 1e-22 eV, kT'ye oranı ~2,6e20 (metin "~10^20" tutarlı). Sınav m1..m10, k1..k4 doğru şıkları tekil ve doğru. Oyun içi o03-o08 şıklarında yanlış/çoklu doğru yok. Tarihçe (Pauli 1925, Bloch 1928, Wilson 1931, Kronig-Penney 1931, Bardeen-Brattain 1947, Pauli Nobel 1945) doğru.
Odak testi: Playwright 1366x768, hikayeAtla kapalı; hikaye, kavram kapısı (gerçek sim: N=32, üç malzeme, Fill electrons), o03-o07, patron 3 faz, hesap görevi (2 adım), sandık oynandı. Takılma, yatay taşma, konsol hatası yok; köprüde dock'ta geçici 10-70 px dikey kaydırma payı var, görünür taşma yok.

## Düzeltilenler
- Kavram kapısı: sınav m9 (atomlar yaklaşınca band genişler) ve k4 (seviye aralığı ≪ kT) s09'da hiç anlatılmıyordu. Sayfa 1 madde 1 ve 2'ye eklendi (örtüşme artınca band genişler; N≈10^22 için aralık kT'den çok küçük).
- Sınav sv-s09-m3: çeldirici "Two full bands with no gap between them" örtüşen bantlarla (iki değerlikli metal) karışabiliyordu; "Two completely full bands separated by a large gap" yapıldı.
- Hesap bant-si adım 2 ve bant-gaas adım 1'de sayısal adimSoru yoktu (öğrenci hesabı hiç yapmıyor, sonuç gösteriliyordu). N(...) eklendi (1107 nm, 873,1 nm; tolerans %2); `test/hesap-dogrula.py` beklenenleri güncellendi, 98 kontrol 0 hata.

## Açık bırakılanlar
| sorun | konum | önerilen düzeltme | kesinlik |
|---|---|---|---|
| Terim tutarsızlığı: bandgap "(yasak enerji aralığı)" / "(bant aralığı)" / "(yasak aralık)" karışık | `88-data-fabrika.js` s09, `89-data-kartlar.js` kronig | Hepsini "bandgap (yasak enerji aralığı)" yap | düşük (kozmetik) |
| Sınav k4 (seviye aralığı tahmini) ve m10 (her elektrona −v'li eş) kapıda yalnız özet düzeyinde; sayısal tahmin alıştırması yok | `93-data-sinav-3.js` | İstenirse s09'a küçük bir seviye aralığı alıştırması | orta |
| Hikaye satır 2 ("seviyeye en çok iki electron sığar") o03 cevabını önceden veriyor | `90-data-s09.js` o01 | Pedagojik tercih; istenirse satırdan çıkar | düşük |
| o04 çeldiricisi "Atom hiç electron içermez" zayıf | `90-data-s09.js` | "Elektronlar atoma sıkı bağlıdır, valence band boştur" gibi gerçek yanılgı | düşük |
| "ilk transistor'u Bardeen ve Brattain yaptı" Shockley'siz kısmi anlatım (nokta temaslı transistör) | `90-data-s09.js` o01 | "Bardeen ve Brattain (Shockley ekibi) ilk transistor'u yaptı" | düşük |
| Sim'de band genişliği N ve atom aralığına bağlı değil (m9 yalnız metinde) | `70-sim-bant.js` | Sim'e atom aralığı kaydırıcısı (kapsam dışı) | düşük |
