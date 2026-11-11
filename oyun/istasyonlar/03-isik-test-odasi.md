# İstasyon 03 · Işık-test odası (`s03`)

> **Ajan E3:** Bu dosyayı `oyun/src/js/90-data-s03.js` dosyasına, `01-veri-semalari.md` şemasına uygun JavaScript verisine çevir. Metinleri **aynen** kullan. Ek: `Q.data.chars.planck` tanımı gerekmez (A5 yapar). Kontrol: `node oyun/test/veri-dogrula.js`.
> Okunacaklar: `00`, `01` (§3), `06` (`karacisim` ve `fotoelektrik` parametreleri), bu dosya.

| Alan | Değer |
|---|---|
| `id` / `sira` | `s03` / 3 |
| `ad` / `makine` | Işık-test odası / Işık-test odası |
| `renk` | `#ffd23f` |
| `konu` | Neden kuantum mekaniği? Kara cisim, fotoelektrik |
| `sinavSorulari` | `["S3"]` |
| `sureHedefDk` | 22 |
| `patronId` | `einstein` |
| `kavramlar` | `karacisim_felaket`, `planck_paket`, `fotoelektrik_siddet`, `kuantum_rastgele_sanisi` |

## Engeller

### o01 · hikaye · "Zaman kapısı"
- `yer`: Berlin · `yil`: 1900 · `rivayet`: false · `kavram`: null
- satır 1 · `selin`: "Işık-test odası ışığı ölçüyor. Klasik fizik burada tökezledi."
- satır 2 · `planck`: "Enerjiyi paket paket verince sonsuzluk kayboldu. Çaresizlikten attığım bir adımdı."
- satır 3 · `einstein`: "Ben ışığı paketlere böldüm: fotonlar. Fotoelektrik olayı böyle açıkladım."

### o02 · kavram · "Kavram kapısı" · kavram `karacisim_felaket`
- `gorev`: "Sıcaklığı 5000 K yap, klasik eğriyi açık tut."
- `sim`: modul `karacisim`, params `{T:3000}`, basari `{T:[4900,5100], klasikGoster:true}`
- `ogrenilen`: "Klasik eğri kısa dalga boyunda patlıyor; Planck eğrisi patlamıyor."

### o03 · dusman · "Kusur düşmanı" · kavram `karacisim_felaket` · `kusurSkin` `vakans`
- `soru`: "Mor ötesi felaketi, klasik teorinin neyi yanlış öngörmesidir?"
- seçenekler:
  1. "Kısa dalga boyunda sonsuz enerji" · **DOĞRU** · neden: "Doğru. Klasik teori yüksek frekansta enerjiyi sonsuz buluyordu."
  2. "Işığın hiç yayılmaması" · yanlış · neden: "Hayır. Sorun sonsuz enerji öngörüsüydü."
  3. "Sıcaklığın hep sabit kalması" · yanlış · neden: "Hayır. Sıcaklıkla ilgili bir sorun değildi."

### o04 · dusman · "Kusur düşmanı" · kavram `planck_paket` · `kusurSkin` `tane_siniri`
- `soru`: "Planck'a göre bir ışık paketinin enerjisi neye bağlıdır?"
- seçenekler:
  1. "Frekansına (E = hf)" · **DOĞRU** · neden: "Doğru. Yüksek frekans, büyük paket."
  2. "Şiddetine" · yanlış · neden: "Hayır. Şiddet paket sayısını belirler."
  3. "Hızına" · yanlış · neden: "Hayır. Işığın hızı sabit; enerji frekansla değişir."

### o05 · tahmin · "Tahmin çukuru" · kavram `fotoelektrik_siddet` · agirlik 1.5
- `soru`: "Eşik frekansın altındaki ışığı 10 kat parlatırsan kaç elektron kopar?"
- seçenekler:
  1. "Çok sayıda" · yanlış · neden: "Yanlış. Tek foton yetmezse kaç foton olursa olsun elektron kopmaz."
  2. "Hiç" · **DOĞRU** · neden: "Doğru. Şiddet foton sayısını artırır, foton başına enerjiyi değil."
  3. "Gecikmeyle kopar" · yanlış · neden: "Yanlış. Enerji birikmez, gecikme gözlenmez."
- `sim`: modul `fotoelektrik`, onceki `{f:3.0, I:1, metal:"Na"}`, sonraki `{f:3.0, I:10, metal:"Na"}`
- `acik`: "hf < φ: foton başına enerji yetmiyor, parlaklık işe yaramaz."

### o06 · tuzak · "Yanılgı tuzağı" · kavram `fotoelektrik_siddet`
- `iddia`: "Işığı yeterince parlatırsan eşik altında da elektron koparabilirsin."
- `parcalar`: ["Işığı yeterince parlatırsan", "eşik altında da", "elektron koparabilirsin."]
- `yanlisParca`: 0
- `duzeltme`: "Eşik altında parlaklık işe yaramaz; elektron için foton başına yeterli enerji gerekir."

### o07 · kopru · "Mantık köprüsü" · kavram `fotoelektrik_siddet`
- `soru`: "Fotoelektrik mantığını sıraya diz"
- `bloklar` (doğru sırada): ["Işık foton paketlerinden oluşur", "Foton enerjisi E = hf", "hf iş fonksiyonunu aşarsa elektron kopar", "Şiddet yalnızca elektron sayısını artırır"]
- `sonuc`: "Foton enerjisi frekansla belirlenir, eşik aşılırsa elektron kopar, şiddet sayıyı artırır."

### o08 · patron · "Foton Canavarı"
- `canavar`: `einstein` · `canavarAd`: "Foton Canavarı"
- `giris`: "Ben fotonum! Parlaklığımı artırsam da seni eşikten geçirmem."

**Faz 1 · secmeli** · kavram `fotoelektrik_siddet`
- `soru`: "Fotoelektrik olayda elektronun kinetik enerjisi neye bağlıdır?"
- seçenekler:
  1. "Işığın frekansına (K = hf − φ)" · **DOĞRU** · neden: "Doğru. Frekans arttıkça kinetik enerji artar."
  2. "Işığın şiddetine" · yanlış · neden: "Hayır. Şiddet elektron sayısını etkiler."
  3. "Metalin kalınlığına" · yanlış · neden: "Hayır. Kalınlık enerjiyi belirlemez."
- `alt`: soru "Frekansı ikiye katlarsan foton enerjisi ne olur?"; seçenekler: 1. "İki katına çıkar" **DOĞRU** (neden: "Doğru. E = hf, frekansla orantılı.") · 2. "Aynı kalır" yanlış (neden: "Hayır. Enerji frekansla artar.") · 3. "Yarıya iner" yanlış (neden: "Hayır. Frekans artınca enerji düşmez.")

**Faz 2 · acik · S3**
- `pdfSoru`: "Explain the reasons for the emergence and success of quantum mechanics."
- `soru`: "Kuantum mekaniği neden doğdu ve neden başarılı oldu?"
- `anahtarFikirler`:
  1. "Klasik fizik kara cisim ışımasını (mor ötesi felaketi) açıklayamadı."
  2. "Fotoelektrik olay ve ayrık atom spektrumları da açıklanamadı."
  3. "Çözüm: enerji paketli (E = hf), madde ve ışık ikiliği."
  4. "Başarı: bu gözlemleri ve atom ile katı özelliklerini doğru öngördü."
- `yanlisKavramlar`: ["Işığın şiddeti artarsa eşik altında da elektron kopar", "Kuantum, küçük cisimlerde bilgi eksikliğinden doğan rastgelelik demektir"] · `yanlisKavramIds`: ["fotoelektrik_siddet", "kuantum_rastgele_sanisi"]
- `idealCevap`: "Klasik fizik kara cisim ışımasını (mor ötesi felaketi), fotoelektrik olayı ve atomların ayrık spektrumunu açıklayamadı. Planck enerjiyi paketli (E = hf) kabul etti, Einstein ışığı foton olarak aldı, madde dalga davranışı gösterdi. Kuantum mekaniği bu gözlemleri ve atom ile katıların özelliklerini doğru öngördüğü için başarılıdır."
- `yedekSecmeli`: soru "Kuantum mekaniği neden doğdu?"; seçenekler: 1. "Klasik fizik kara cisim, fotoelektrik ve atom spektrumunu açıklayamadı" **DOĞRU** (neden: "Doğru. Üç temel başarısızlık.") · 2. "Bilgisayarlar icat edildiği için" yanlış (neden: "Yanlış. Kuantum bilgisayardan öncedir.") · 3. "Newton yanıldığı için her şey değişti" yanlış (neden: "Yanlış. Klasik fizik büyük ölçekte hâlâ geçerli.") · 4. "Işık hiç dalga olmadığı için" yanlış (neden: "Yanlış. Işık hem dalga hem parçacık gibi davranır.")
- `alt`: soru "Klasik fiziğin açıklayamadığı üç gözlemi say."

**Faz 3 · acik**
- `pdfSoru`: null
- `soru`: "Fotoelektrik olayı klasik dalga teorisi neden açıklayamaz?"
- `anahtarFikirler`:
  1. "Klasik dalgada şiddet arttıkça enerji artar, eşik beklenmez."
  2. "Deneyde eşik frekansın altında elektron hiç kopmaz."
  3. "Elektron tek bir fotondan enerji alır, enerji birikmez."
  4. "Kinetik enerji frekansla artar, şiddetle değil."
- `yanlisKavramlar`: ["Elektronlar enerjiyi biriktirip gecikmeyle çıkar", "Parlaklık elektronun enerjisini artırır"] · `yanlisKavramIds`: ["fotoelektrik_siddet", "fotoelektrik_siddet"]
- `idealCevap`: "Klasik dalga teorisinde şiddet arttıkça enerji artar, yani yeterince parlak ışık her frekansta elektron koparmalıydı. Deneyde eşik frekansın altında hiç elektron kopmaz, üstünde ise gecikmesiz kopar. Einstein: elektron tek bir fotondan enerji alır, kinetik enerji frekansla artar, şiddet yalnızca sayıyı artırır."
- `yedekSecmeli`: soru "Klasik teori fotoelektrikte neyi yanlış bekler?"; seçenekler: 1. "Yeterince parlak ışığın her frekansta elektron koparmasını" **DOĞRU** (neden: "Doğru. Deneyde eşik altında hiç kopmaz.") · 2. "Elektronun hiç kopmamasını" yanlış (neden: "Yanlış. Klasik teori kopacağını söyler.") · 3. "Işığın hızının değişmesini" yanlış (neden: "Yanlış. Hız konusu değil.") · 4. "Metalin erimesini" yanlış (neden: "Yanlış. Erime konusu değil.")
- `alt`: soru "Eşik frekans deneyi dalga teorisini nasıl çürütür?"

### o09 · sandik · "Sandık"
- `kart`: `{id:"einstein", yil:1905, tekCumle:"Işığı foton paketlerine bölüp fotoelektrik olayı açıkladı."}`
- `ozet`: ["Klasik fizik üç yerde tökezledi", "E = hf: enerji paket paket", "Eşik altı: şiddet işe yaramaz"]
- `kontrolNoktasi`: true

## Temel tur
- kart 1: "Mor ötesi felaketi" · "Klasik teori kısa dalga boyunda sonsuz enerji buluyordu."
- kart 2: "Paket enerji" · "Planck: ışık paket paket yayılır, E = hf."
- kart 3: "Eşik" · "Tek foton yetmezse parlaklık işe yaramaz."
- `sim`: modul `fotoelektrik`, params `{f:3.0, I:1, metal:"Na"}`

## Tekrar havuzu
1. o03'ü kopyala (`karacisim_felaket`).
2. o04'ü kopyala (`planck_paket`).
3. o05'i `dusman`a çevir (sim ve acik at, `kusurSkin:"vakans"`).
4. **Ek soru** (kavram `kuantum_rastgele_sanisi`, skin `safsizlik`): soru "Kuantum rastgeleliği neden bilgi eksikliği değildir?"; seçenekler: 1. "Doğanın temel yapısıdır, daha çok bilgiyle ortadan kalkmaz" **DOĞRU** (neden: "Doğru. Standart yorumda olasılık temeldir.") · 2. "Aletler yetersiz olduğu için" yanlış (neden: "Hayır. Daha iyi alet rastgeleliği gidermez.") · 3. "Yalnızca sıcaklıkla oluşur" yanlış (neden: "Hayır. Sıcaklıktan bağımsızdır.").
