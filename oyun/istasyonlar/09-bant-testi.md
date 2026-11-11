# İstasyon 09 · Bant testi (`s09`)

> **Ajan E9:** Bu dosyayı `oyun/src/js/90-data-s09.js` dosyasına, `01-veri-semalari.md` şemasına uygun JavaScript verisine çevir. Metinleri **aynen** kullan. Kontrol: `node oyun/test/veri-dogrula.js`.
> Okunacaklar: `00`, `01` (§3), `06` (`bant` parametreleri: `N`, `malzeme`), bu dosya.

| Alan | Değer |
|---|---|
| `id` / `sira` | `s09` / 9 |
| `ad` / `makine` | Bant testi / Bant testi |
| `renk` | `#4aa8ff` |
| `konu` | Periyodik yapı, enerji bantları, iletken/yalıtkan/yarıiletken |
| `sinavSorulari` | `["S7"]` |
| `sureHedefDk` | 23 |
| `patronId` | `pauli` |
| `kavramlar` | `bant_olusum`, `pauli_ilkesi`, `iletken_yalitkan`, `bant_sonsuz_kuyu`, `iletken_olasilik`, `bant_sicaklik` |

## Engeller

### o01 · hikaye · "Zaman kapısı"
- `yer`: Hamburg · `yil`: 1925 · `rivayet`: false · `kavram`: null
- satır 1 · `selin`: "Son istasyon: çip. Çipin kalbi enerji bantları."
- satır 2 · `pauli`: "İki elektron aynı kuantum durumunda olamaz. Buna dışlama ilkesi dediler."
- satır 3 · `anlatici`: "Üç yıl sonra Bloch, kristalde enerji bantlarının neden oluştuğunu gösterdi."

### o02 · kavram · "Kavram kapısı" · kavram `bant_olusum`
- `gorev`: "Atom sayısını 32 yap, üç malzemeyi gez."
- `sim`: modul `bant`, params `{N:1, malzeme:"iletken"}`, basari `{N:32, malzemeler:3}`
- `ogrenilen`: "N atom her seviyeden N yakın seviye üretir; yakın seviyeler bandı oluşturur."

### o03 · dusman · "Kusur düşmanı" · kavram `pauli_ilkesi` · `kusurSkin` `vakans`
- `soru`: "Aynı enerji seviyesine, spin dahil, en çok kaç elektron girer?"
- seçenekler:
  1. "2" · **DOĞRU** · neden: "Doğru. Zıt spinli iki elektron."
  2. "1" · yanlış · neden: "Hayır. Zıt spinli ikinci elektron girebilir."
  3. "Sınırsız" · yanlış · neden: "Hayır. Pauli aynı durumu yasaklar."

### o04 · dusman · "Kusur düşmanı" · kavram `iletken_yalitkan` · `kusurSkin` `tane_siniri`
- `soru`: "Yalıtkanı iletkenden ayıran nedir?"
- seçenekler:
  1. "Bant doluluğu ve bant aralığı" · **DOĞRU** · neden: "Doğru. Bant yapısı elektriksel davranışı belirler."
  2. "Elektronların olasılık farkı" · yanlış · neden: "Hayır. Olasılık değil, bant yapısı belirler."
  3. "Atomun rengi" · yanlış · neden: "Hayır. Renk elektriksel davranışı belirlemez."

### o05 · tahmin · "Tahmin çukuru" · kavram `bant_olusum` · agirlik 1.5
- `soru`: "N atom bir araya gelince her enerji seviyesi ne olur?"
- seçenekler:
  1. "N yakın seviyeye yarılır" · **DOĞRU** · neden: "Doğru. Pauli aynı durumu yasakladığından seviyeler ayrılır."
  2. "Aynı kalır" · yanlış · neden: "Yanlış. ψ'ler örtüşünce seviyeler yarılır."
  3. "Hepsi birleşip tek seviye olur" · yanlış · neden: "Yanlış. Pauli aynı durumu yasaklar, tek seviye olamaz."
- `sim`: modul `bant`, onceki `{N:1, malzeme:"iletken"}`, sonraki `{N:16, malzeme:"iletken"}`
- `acik`: "N = 16 atomda her seviye 16 yakın seviyeye yarıldı; bant şekilleniyor."

### o06 · tuzak · "Yanılgı tuzağı" · kavram `bant_sonsuz_kuyu`
- `iddia`: "Sonsuz kuyudaki tek bir elektronun enerji bantları vardır."
- `parcalar`: ["Sonsuz kuyudaki tek", "bir elektronun", "enerji bantları vardır."]
- `yanlisParca`: 2
- `duzeltme`: "Bantlar çok atomlu katıda oluşur; tek kuyuda ayrık seviyeler vardır."

### o07 · kopru · "Mantık köprüsü" · kavram `bant_olusum`
- `soru`: "Bant zincirini sıraya diz"
- `bloklar` (doğru sırada): ["Atomlar yaklaşır, ψ'ler örtüşür", "Pauli aynı durumu yasaklar", "Her seviye N yakın seviyeye yarılır", "N ≈ 10²² olunca seviyeler sürekli bant gibi görünür"]
- `sonuc`: "Örtüşme, Pauli, yarılma, çok sık seviyeler: bant."

### o08 · patron · "Dışlama Canavarı"
- `canavar`: `pauli` · `canavarAd`: "Dışlama Canavarı"
- `giris`: "Bu kutuya yalnızca iki elektron girer. Üçüncüyü sokamazsın!"

**Faz 1 · secmeli** · kavram `iletken_yalitkan`
- `soru`: "Dolu bant ile boş bant arasında büyük aralık olan malzeme nedir?"
- seçenekler:
  1. "Yalıtkan" · **DOĞRU** · neden: "Doğru. Elektron üst banda atlayamaz."
  2. "İletken" · yanlış · neden: "Hayır. İletkende bant yarı doludur."
  3. "Süperiletken" · yanlış · neden: "Hayır. Süperiletkenlik başka bir olay."
- `alt`: soru "Yarıiletkende bant aralığı nasıldır?"; seçenekler: 1. "Küçük; ısı veya ışık taşıyıcı üretir" **DOĞRU** (neden: "Doğru. Aralık küçük olduğundan elektron üst banda çıkabilir.") · 2. "Hiç yoktur" yanlış (neden: "Hayır. Aralık sıfır olsaydı iletken olurdu.") · 3. "Çok büyüktür" yanlış (neden: "Hayır. Çok büyük aralık yalıtkandır.")

**Faz 2 · acik · S7**
- `pdfSoru`: "From a quantum mechanical perspective, why do allowed energies in periodic structures appear as continuous bands?"
- `soru`: "Periyodik yapılarda izinli enerjiler kuantum açısından neden sürekli bant gibi görünür?"
- `anahtarFikirler`:
  1. "Atomlar yaklaşınca dalga fonksiyonları örtüşür."
  2. "Pauli aynı durumu yasakladığından her seviye N yakın seviyeye yarılır."
  3. "N ≈ 10²² olunca seviyeler o kadar sık ki sürekli banda benzer."
  4. "Bantlar arasında izinli olmayan bant aralığı kalır."
- `yanlisKavramlar`: ["Bantlar sıcaklık yüzünden genişler", "Sonsuz kuyuda da bantlar oluşur"] · `yanlisKavramIds`: ["bant_sicaklik", "bant_sonsuz_kuyu"]
- `idealCevap`: "Atomlar bir araya gelince dalga fonksiyonları örtüşür. Pauli ilkesi aynı durumu yasakladığından her atomik seviye N yakın seviyeye yarılır. N yaklaşık 10²² olduğunda seviyeler o kadar sıktır ki sürekli bant gibi görünür. Bantlar arasında izinli olmayan enerjiler, yani bant aralığı kalır."
- `yedekSecmeli`: soru "Periyodik yapıda bant nasıl oluşur?"; seçenekler: 1. "Seviyeler Pauli nedeniyle yarılır, çok sık olur" **DOĞRU** (neden: "Doğru. N atom, her seviyeden N yakın seviye üretir.") · 2. "Sıcaklık seviyeleri genişletir" yanlış (neden: "Yanlış. Sıcaklık bant oluşumunun sebebi değil.") · 3. "Elektronlar serbest kalır, kuantalaşma biter" yanlış (neden: "Yanlış. Kuantalaşma sürer, seviyeler bant olur.") · 4. "Çekirdekler birbirini iter" yanlış (neden: "Yanlış. Sebep dalga fonksiyonlarının örtüşmesi.")
- `alt`: soru "İki atom yaklaşınca tek bir enerji seviyesine ne olur?"

**Faz 3 · acik**
- `pdfSoru`: null
- `soru`: "Bakır iletken, elmas yalıtkan, silisyum yarıiletken. Bunu bant yapısıyla açıkla."
- `anahtarFikirler`:
  1. "İletkende son bant yarı dolu, boş seviyeler hemen yanında."
  2. "Yalıtkanda dolu bant ile boş bant arasında büyük aralık var."
  3. "Yarıiletkende aralık küçük, ısı veya ışık elektronu üst banda atar."
  4. "Fark olasılık değil, bant doluluğu ve aralığıdır."
- `yanlisKavramlar`: ["Fark elektronların olasılık farkıdır", "Yalıtkanda elektron hiç yoktur"] · `yanlisKavramIds`: ["iletken_olasilik", "iletken_yalitkan"]
- `idealCevap`: "İletkende son bant yarı doludur, boş seviyeler hemen yanındadır, elektron kolay hareket eder. Yalıtkanda dolu bant ile boş bant arasında büyük aralık vardır. Yarıiletkende aralık küçüktür, ısı veya ışık elektronu üst banda çıkarabilir. Fark olasılık değil, bant doluluğu ve bant aralığıdır."
- `yedekSecmeli`: soru "Silisyum neden yarıiletkendir?"; seçenekler: 1. "Bant aralığı küçük; ısıyla taşıyıcı üretilir" **DOĞRU** (neden: "Doğru. Aralık yaklaşık 1,1 eV.") · 2. "Bandı yarı dolu olduğu için" yanlış (neden: "Yanlış. Bu iletken için geçerli.") · 3. "Bant aralığı çok büyük olduğu için" yanlış (neden: "Yanlış. Çok büyük aralık yalıtkandır.") · 4. "Atomları olasılıkla iletir" yanlış (neden: "Yanlış. Olasılık fark değil.")
- `alt`: soru "Elmasın neden yalıtkan olduğunu bant yapısıyla anlat."

### o09 · sandik · "Sandık"
- `kart`: `{id:"pauli", yil:1925, tekCumle:"Aynı kuantum durumunda iki elektron olamaz: dışlama ilkesi."}`
- `ozet`: ["N atom, her seviyeden N yakın seviye", "Pauli: aynı duruma 2 elektron", "İletken/yalıtkan: doluluk ve aralık"]
- `kontrolNoktasi`: true

## Temel tur
- kart 1: "Seviye yarılması" · "Atomlar yaklaşınca seviyeler N yakın seviyeye yarılır."
- kart 2: "Bant" · "N çok büyükse yakın seviyeler sürekli bant gibi görünür."
- kart 3: "İletken ve yalıtkan" · "Fark bant doluluğu ve bant aralığıdır, olasılık değil."
- `sim`: modul `bant`, params `{N:8, malzeme:"iletken"}`

## Tekrar havuzu
1. o03'ü kopyala (`pauli_ilkesi`).
2. o04'ü kopyala (`iletken_yalitkan`).
3. o05'i `dusman`a çevir (sim ve acik at, `kusurSkin:"vakans"`).
4. **Ek soru** (kavram `bant_sonsuz_kuyu`, skin `safsizlik`): soru "Bantlar nerede oluşur?"; seçenekler: 1. "Çok atomlu katıda" **DOĞRU** (neden: "Doğru. Örtüşen ψ'ler seviyeleri banda çevirir.") · 2. "Tek bir sonsuz kuyuda" yanlış (neden: "Hayır. Tek kuyuda ayrık seviyeler var.") · 3. "Yalnızca gazlarda" yanlış (neden: "Hayır. Bant katıya özgüdür.").
