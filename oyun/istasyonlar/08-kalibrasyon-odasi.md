# İstasyon 08 · Kalibrasyon odası (`s08`)

> **Ajan E8:** Bu dosyayı `oyun/src/js/90-data-s08.js` dosyasına, `01-veri-semalari.md` şemasına uygun JavaScript verisine çevir. Metinleri **aynen** kullan. Kontrol: `node oyun/test/veri-dogrula.js`.
> Okunacaklar: `00`, `01` (§3), `06` (`belirsizlik` parametreleri: `sx`), bu dosya.

| Alan | Değer |
|---|---|
| `id` / `sira` | `s08` / 8 |
| `ad` / `makine` | Kalibrasyon odası / Kalibrasyon |
| `renk` | `#39ff88` |
| `konu` | Belirsizlik ilkesi, eşlenik değişkenler |
| `sinavSorulari` | `["S10"]` |
| `sureHedefDk` | 22 |
| `patronId` | `heis` |
| `kavramlar` | `belirsizlik_dalga`, `belirsizlik_alet`, `eslenik_degisken`, `belirsizlik_makro` |

## Engeller

### o01 · hikaye · "Zaman kapısı"
- `yer`: Kopenhag · `yil`: 1927 · `rivayet`: false · `kavram`: null
- satır 1 · `selin`: "Kalibrasyon odası: ölçümü mükemmelleştirmek istiyoruz."
- satır 2 · `heis`: "Konum ve momentumu aynı anda keyfi hassas ölçemezsin. Alet yüzünden değil."
- satır 3 · `heis`: "Doğa böyle: dalgaysan, keskin konum ve keskin momentum aynı anda olmaz."

### o02 · kavram · "Kavram kapısı" · kavram `belirsizlik_dalga`
- `gorev`: "Konum genişliğini daralt, momentuma bak."
- `sim`: modul `belirsizlik`, params `{sx:3}`, basari `{dar:true}`
- `ogrenilen`: "Konum daraldıkça momentum yayılır; çarpım hep en az ħ/2."

### o03 · dusman · "Kusur düşmanı" · kavram `belirsizlik_dalga` · `kusurSkin` `vakans`
- `soru`: "Δx küçülürse Δp ne olur?"
- seçenekler:
  1. "Büyür" · **DOĞRU** · neden: "Doğru. ΔxΔp ≥ ħ/2 çarpımı en az sabit kalır."
  2. "Küçülür" · yanlış · neden: "Yanlış. Çarpım sınırlı olduğundan biri küçülünce öbürü büyür."
  3. "Değişmez" · yanlış · neden: "Yanlış. ΔxΔp ≥ ħ/2 koşulu bunu zorunlu kılar."

### o04 · dusman · "Kusur düşmanı" · kavram `belirsizlik_makro` · `kusurSkin` `tane_siniri`
- `soru`: "Bilardo topunda belirsizlik neden fark edilmez?"
- seçenekler:
  1. "ħ çok küçük, ΔxΔp sınırı ihmal edilebilir" · **DOĞRU** · neden: "Doğru. İlke her cisimde geçerli, etkisi görünmez."
  2. "Top belirsizliğe tabi değildir" · yanlış · neden: "Hayır. İlke her cisim için geçerlidir."
  3. "Top bir dalga değildir" · yanlış · neden: "Hayır. Dalga boyu yalnızca ihmal edilecek kadar küçüktür."

### o05 · tahmin · "Tahmin çukuru" · kavram `belirsizlik_dalga` · agirlik 1.5
- `soru`: "Dalga paketinin konum genişliğini yarıya indirirsen momentum yayılması ne olur?"
- seçenekler:
  1. "İki katına çıkar" · **DOĞRU** · neden: "Doğru. σp = ħ/(2σx)."
  2. "Yarıya iner" · yanlış · neden: "Yanlış. Konum daralınca momentum genişler."
  3. "Aynı kalır" · yanlış · neden: "Yanlış. İkisi bağlıdır."
- `sim`: modul `belirsizlik`, onceki `{sx:2}`, sonraki `{sx:1}`
- `acik`: "σx 2'den 1'e inince σp iki katına çıktı; çarpım ħ/2'de kaldı."

### o06 · tuzak · "Yanılgı tuzağı" · kavram `belirsizlik_alet`
- `iddia`: "Belirsizlik, ölçüm aletimizin yeterince hassas olmamasından kaynaklanır."
- `parcalar`: ["Belirsizlik,", "ölçüm aletimizin yeterince", "hassas olmamasından kaynaklanır."]
- `yanlisParca`: 1
- `duzeltme`: "Belirsizlik alet kusuru değil, dalga doğasının temel sonucudur."

### o07 · kopru · "Mantık köprüsü" · kavram `belirsizlik_dalga`
- `soru`: "Belirsizlik zincirini sıraya diz"
- `bloklar` (doğru sırada): ["Parçacık bir dalga paketidir", "Keskin konum çok dalga boyunun toplamıdır", "Çok dalga boyu geniş momentum demektir", "ΔxΔp ≥ ħ/2"]
- `sonuc`: "Dalga paketi, keskin konum, geniş momentum, ΔxΔp ≥ ħ/2."

### o08 · patron · "Belirsizlik Canavarı"
- `canavar`: `heis` · `canavarAd`: "Belirsizlik Canavarı"
- `giris`: "Neredeyim? Ne kadar hızlıyım? İkisini birden bilemezsin!"

**Faz 1 · secmeli** · kavram `eslenik_degisken`
- `soru`: "Konum ve momentum neden aynı anda keyfi hassas ölçülemez?"
- seçenekler:
  1. "Operatörleri değişmez, ortak özdurumları yoktur" · **DOĞRU** · neden: "Doğru. [x,p] = iħ ≠ 0."
  2. "Aletlerimiz yetersizdir" · yanlış · neden: "Hayır. Alet kusuru değil, doğanın yapısı."
  3. "Ölçüm parçacığı bozar, tek sebep bu" · yanlış · neden: "Hayır. Ölçüm olmasa da ilke geçerlidir."
- `alt`: soru "[x, p] = iħ ne anlama gelir?"; seçenekler: 1. "x ve p operatörleri değişmez" **DOĞRU** (neden: "Doğru. Bu yüzden ortak özdurumları yok.") · 2. "x ve p eşittir" yanlış (neden: "Hayır. Bu bir eşitlik değil, değişme bağıntısı.") · 3. "p sıfırdır" yanlış (neden: "Hayır. p sıfır olmak zorunda değil.")

**Faz 2 · acik · S10**
- `pdfSoru`: "Explain the uncertainty principle and why it is impossible to simultaneously measure conjugate variables with unlimited precision."
- `soru`: "Belirsizlik ilkesini açıkla. Eşlenik değişkenler neden aynı anda keyfi hassas ölçülemez?"
- `anahtarFikirler`:
  1. "ΔxΔp ≥ ħ/2: biri keskinleşince öbürü yayılır."
  2. "Dalga paketi: keskin konum çok dalga boyu gerektirir."
  3. "Konum ve momentum operatörleri değişmez ([x,p] = iħ)."
  4. "Alet kusuru değil, doğanın (dalga doğasının) temel sınırı."
- `yanlisKavramlar`: ["Belirsizlik ölçüm aletinin kusurudur", "Ölçüm parçacığı bozduğu için olur, tek sebep bu"] · `yanlisKavramIds`: ["belirsizlik_alet", "belirsizlik_alet"]
- `idealCevap`: "Belirsizlik ilkesi ΔxΔp ≥ ħ/2 der: biri keskinleşince öbürü yayılır. Sebep dalga doğasıdır; keskin bir konum çok sayıda dalga boyunun toplamını gerektirir, bu da geniş bir momentum dağılımıdır. Konum ve momentum operatörleri değişmediği için ortak özdurumları yoktur. Bu alet kusuru değil, doğanın temel sınırıdır."
- `yedekSecmeli`: soru "Belirsizlik ilkesi neden vardır?"; seçenekler: 1. "Parçacığın dalga doğasından" **DOĞRU** (neden: "Doğru. Keskin konum geniş momentum demektir.") · 2. "Aletler yetersiz olduğundan" yanlış (neden: "Yanlış. İdeal alette de geçerli.") · 3. "Sıcaklık yüzünden" yanlış (neden: "Yanlış. Sıcaklıktan bağımsız.") · 4. "Sadece elektronda" yanlış (neden: "Yanlış. Her cisimde geçerli, büyükte ihmal edilir.")
- `alt`: soru "ΔxΔp ≥ ħ/2 neden dalga doğasından kaynaklanır?"

**Faz 3 · acik**
- `pdfSoru`: null
- `soru`: "Eşlenik değişken nedir? Örnek ver ve günlük hayatta neden görmediğimizi anlat."
- `anahtarFikirler`:
  1. "Eşlenik çift: aynı anda keyfi hassas ölçülemeyen iki büyüklük."
  2. "Örnek: konum x ve momentum p."
  3. "Operatörleri değişmediği için ortak özdurumları yoktur."
  4. "Günlük cisimde etki ihmal edilir, çünkü ħ çok küçüktür."
- `yanlisKavramlar`: ["Her büyüklük çifti belirsizlik gösterir", "Yalnızca elektron gibi küçük parçacıklarda geçerlidir"] · `yanlisKavramIds`: ["eslenik_degisken", "belirsizlik_makro"]
- `idealCevap`: "Eşlenik değişkenler, aynı anda keyfi hassas ölçülemeyen büyüklük çiftidir; örneğin konum ve momentum. Operatörleri değişmediği için ortak özdurumları yoktur. Günlük cisimlerde ħ çok küçük olduğundan sınır ihmal edilir."
- `yedekSecmeli`: soru "Hangisi bir eşlenik çifttir?"; seçenekler: 1. "Konum ve momentum" **DOĞRU** (neden: "Doğru. Operatörleri değişmez.") · 2. "Kütle ve hacim" yanlış (neden: "Yanlış. Bu çift için ilke yok.") · 3. "Sıcaklık ve renk" yanlış (neden: "Yanlış. Eşlenik çift değil.") · 4. "Hız ve ivme" yanlış (neden: "Yanlış. Bu eşlenik çift değil.")
- `alt`: soru "Konum ve momentum neden eşlenik değişken sayılır?"

### o09 · sandik · "Sandık"
- `kart`: `{id:"heis", yil:1927, tekCumle:"Konum ve momentumun aynı anda keskin olamayacağını gösterdi."}`
- `ozet`: ["ΔxΔp ≥ ħ/2", "Sebep dalga doğası, alet değil", "Günlük cisimde etki ihmal edilir"]
- `kontrolNoktasi`: true

## Temel tur
- kart 1: "Dalga paketi" · "Parçacık, dalga paketi gibi davranır."
- kart 2: "Keskin konum" · "Konum daralırsa momentum yayılır."
- kart 3: "Alet değil" · "Belirsizlik ölçüm kusuru değil, doğanın sınırı."
- `sim`: modul `belirsizlik`, params `{sx:3}`

## Tekrar havuzu
1. o03'ü kopyala (`belirsizlik_dalga`).
2. o04'ü kopyala (`belirsizlik_makro`).
3. o05'i `dusman`a çevir (sim ve acik at, `kusurSkin:"vakans"`).
4. **Ek soru** (kavram `eslenik_degisken`, skin `safsizlik`): soru "Hangi operatör çifti değişmez ve belirsizlik verir?"; seçenekler: 1. "Konum ve momentum" **DOĞRU** (neden: "Doğru. [x,p] = iħ.") · 2. "Konum ve konum" yanlış (neden: "Hayır. Aynı operatör kendisiyle değişir.") · 3. "Kütle ve yük" yanlış (neden: "Hayır. Bunlar sayıdır, operatör değil.").
