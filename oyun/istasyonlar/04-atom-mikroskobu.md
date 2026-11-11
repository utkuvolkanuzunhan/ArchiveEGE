# İstasyon 04 · Atom mikroskobu (`s04`)

> **Ajan E4:** Bu dosyayı `oyun/src/js/90-data-s04.js` dosyasına, `01-veri-semalari.md` şemasına uygun JavaScript verisine çevir. Metinleri **aynen** kullan. Kontrol: `node oyun/test/veri-dogrula.js`.
> Okunacaklar: `00`, `01` (§3), `06` (`bohr` parametreleri), bu dosya.

| Alan | Değer |
|---|---|
| `id` / `sira` | `s04` / 4 |
| `ad` / `makine` | Atom mikroskobu / Atom mikroskobu |
| `renk` | `#7cf5a0` |
| `konu` | H atomu kararlılığı, ayrık seviyeler, madde dalgası |
| `sinavSorulari` | `["S4"]` |
| `sureHedefDk` | 22 |
| `patronId` | `bohr` |
| `kavramlar` | `atom_kararlilik`, `ayrik_spektrum`, `debroglie_dalga`, `bohr_seviye`, `sifir_noktasi_sicaklik` |

## Engeller

### o01 · hikaye · "Zaman kapısı"
- `yer`: Kopenhag · `yil`: 1913 · `rivayet`: false · `kavram`: null
- satır 1 · `selin`: "Atom mikroskobu bir elektron arıyor. O neden çekirdeğe düşmüyor?"
- satır 2 · `bohr`: "Elektron yalnızca belirli seviyelerde durabilir. Seviyeler arası atlarken ışık yayar."
- satır 3 · `anlatici`: "On bir yıl sonra de Broglie ekledi: elektron da dalga, yörüngeye tam sayı dalga sığar."

### o02 · kavram · "Kavram kapısı" · kavram `bohr_seviye`
- `gorev`: "n=3'ten n=2'ye geçişin rengini bul."
- `sim`: modul `bohr`, params `{n:3, m:2}`, basari `{gecis:[3,2]}`
- `ogrenilen`: "Seviyeler ayrık; geçişte seviye farkı kadar enerjili foton çıkar."

### o03 · dusman · "Kusur düşmanı" · kavram `ayrik_spektrum` · `kusurSkin` `vakans`
- `soru`: "Hidrojen atomu neden yalnızca belirli renklerde ışır?"
- seçenekler:
  1. "Enerji seviyeleri ayrık, geçiş farkı kadar foton çıkar" · **DOĞRU** · neden: "Doğru. Her renk bir seviye farkına karşılık gelir."
  2. "Atom sıcaklığa göre renk seçer" · yanlış · neden: "Hayır. Renkler seviye farklarından gelir, sıcaklıktan değil."
  3. "Elektron her enerjide dolaşabilir" · yanlış · neden: "Hayır. Yalnızca belirli seviyeler izinlidir."

### o04 · dusman · "Kusur düşmanı" · kavram `debroglie_dalga` · `kusurSkin` `safsizlik`
- `soru`: "Bilardo topu neden dalga gibi davranmıyor?"
- seçenekler:
  1. "Dalga boyu (h/p) çok küçük kalıyor" · **DOĞRU** · neden: "Doğru. Büyük momentum, ihmal edilecek kadar küçük dalga boyu."
  2. "Top atomlardan oluşmadığı için" · yanlış · neden: "Hayır. Top da atomdan oluşur; dalga boyu ölçülemeyecek kadar küçük."
  3. "Dalga özelliği yalnızca ışıkta var" · yanlış · neden: "Hayır. Elektron kırınımı maddenin de dalga olduğunu gösterir."

### o05 · tahmin · "Tahmin çukuru" · kavram `atom_kararlilik` · agirlik 1.5
- `soru`: "Hidrojende elektron, n=1 seviyesinin (−13,6 eV) altına inebilir mi?"
- seçenekler:
  1. "Hayır, n=1 en alt seviye" · **DOĞRU** · neden: "Doğru. Altında izinli seviye yok, atom kararlı."
  2. "Evet, ışıma yaparak çekirdeğe düşer" · yanlış · neden: "Yanlış. Klasik tahmin buydu; kuantumda alt seviye var."
  3. "Evet, sıcaklık düşerse" · yanlış · neden: "Yanlış. Sebep sıcaklık değil, dalga doğasıdır."
- `sim`: modul `bohr`, onceki `{n:2, m:1}`, sonraki `{n:1, m:1, altinaDene:true}`
- `acik`: "n=1'in altında izinli seviye yok; elektron daha aşağı inemez."

### o06 · tuzak · "Yanılgı tuzağı" · kavram `atom_kararlilik`
- `iddia`: "Klasik fiziğe göre elektron çekirdek çevresinde sonsuza kadar kararlı döner."
- `parcalar`: ["Klasik fiziğe göre", "elektron çekirdek çevresinde", "sonsuza kadar kararlı döner."]
- `yanlisParca`: 2
- `duzeltme`: "Klasikte ivmeli elektron ışıma yapar, enerji kaybeder ve çekirdeğe düşer; kuantum bunu önler."

### o07 · kopru · "Mantık köprüsü" · kavram `atom_kararlilik`
- `soru`: "Kararlılık zincirini sıraya diz"
- `bloklar` (doğru sırada): ["Elektron hapsolmuş bir dalgadır", "Yalnızca belirli dalga boyları sığar", "En alt seviyenin enerjisi sıfır değildir", "Elektron daha aşağı düşemez, atom kararlıdır"]
- `sonuc`: "Hapsolmuş dalga, ayrık seviyeler, alt sınır, kararlı atom."

### o08 · patron · "Yörünge Canavarı"
- `canavar`: `bohr` · `canavarAd`: "Yörünge Canavarı"
- `giris`: "Elektronunu çekirdeğime düşüreceğim! Düşemez diyorsan kanıtla."

**Faz 1 · secmeli** · kavram `atom_kararlilik`
- `soru`: "Atomun en düşük enerji seviyesi neden vardır?"
- seçenekler:
  1. "Elektron dalgası çekirdek çevresinde sınırlı sığar, alt sınır oluşur" · **DOĞRU** · neden: "Doğru. Hapsolmuş dalganın enerjisi sıfır olamaz."
  2. "Çekirdek elektronu iter" · yanlış · neden: "Hayır. Çekirdek elektronu çeker."
  3. "Sıcaklık sıfıra inemez" · yanlış · neden: "Hayır. Sebep sıcaklık değil, dalga doğasıdır."
- `alt`: soru "Elektronu çekirdeğe daha çok sıkıştırırsan kinetik enerjisi ne olur?"; seçenekler: 1. "Artar" **DOĞRU** (neden: "Doğru. Konum daralır, momentum ve kinetik enerji büyür.") · 2. "Azalır" yanlış (neden: "Hayır. Dar alanda dalga boyu kısalır, enerji artar.") · 3. "Değişmez" yanlış (neden: "Hayır. Belirsizlik ilkesi sıkıştırmayı sınırlar.")

**Faz 2 · acik · S4**
- `pdfSoru`: "Briefly explain the stability of the Hydrogen atom using quantum mechanical theory."
- `soru`: "Hidrojen atomunun kararlılığını kuantum teorisiyle kısaca açıkla."
- `anahtarFikirler`:
  1. "Klasikte ışıma yapan elektron çekirdeğe düşmeliydi."
  2. "Kuantumda elektron hapsolmuş dalgadır, enerji seviyeleri ayrıktır."
  3. "En düşük seviyenin enerjisi sıfır değildir, altına inilemez."
  4. "Çekirdeğe sıkışmak kinetik enerjiyi artırır (belirsizlik), denge oluşur."
- `yanlisKavramlar`: ["Elektron çekirdekten itildiği için düşmez", "Atom sıcaklık yüzünden kararlıdır"] · `yanlisKavramIds`: ["atom_kararlilik", "sifir_noktasi_sicaklik"]
- `idealCevap`: "Klasik fizikte yörüngedeki elektron ışıma yapıp enerji kaybeder ve çekirdeğe düşerdi. Kuantumda elektron hapsolmuş bir dalgadır, enerjisi ayrık seviyelerdir ve en düşük seviyenin enerjisi sıfır değildir. Çekirdeğe daha çok sıkışmak kinetik enerjiyi artırdığından elektron bir denge durumunda kalır."
- `yedekSecmeli`: soru "H atomu neden kararlıdır?"; seçenekler: 1. "En alt seviyenin altı yok, elektron düşemez" **DOĞRU** (neden: "Doğru. Hapsolmuş dalganın alt enerji sınırı var.") · 2. "Elektron çekirdekten itilir" yanlış (neden: "Yanlış. Çekirdek elektronu çeker.") · 3. "Atom çok soğuk olduğu için" yanlış (neden: "Yanlış. Sıcaklık sebep değil.") · 4. "Elektron aslında durur" yanlış (neden: "Yanlış. Elektron durmaz, en düşük enerjili dalga durumundadır.")
- `alt`: soru "Klasik atom modeli neden çöküyordu, kuantum bunu nasıl çözdü?"

**Faz 3 · acik**
- `pdfSoru`: null
- `soru`: "Madde dalgası nedir? Günlük hayatta neden dalga davranışı görmeyiz?"
- `anahtarFikirler`:
  1. "de Broglie: parçacığın dalga boyu λ = h/p."
  2. "Elektron kırınımı maddenin dalga davrandığını gösterir."
  3. "Büyük cisimde momentum büyük, λ ihmal edilebilir."
  4. "Atom ölçeğinde λ boyutla kıyaslanabilir, dalga etkisi görünür."
- `yanlisKavramlar`: ["Dalga yalnızca ışığa özgüdür", "Büyük cisimler rastgele davranır"] · `yanlisKavramIds`: ["debroglie_dalga", "kuantum_rastgele_sanisi"]
- `idealCevap`: "de Broglie'ye göre momentumlu her parçacığın dalga boyu λ = h/p'dir; elektron kırınımı bunu doğrular. Günlük cisimlerde momentum çok büyük olduğundan λ ihmal edilecek kadar küçüktür. Atom boyutunda λ boyutla kıyaslanabilir olduğundan dalga etkisi görünür."
- `yedekSecmeli`: soru "Madde dalga boyu neye bağlıdır?"; seçenekler: 1. "Momentuma, λ = h/p" **DOĞRU** (neden: "Doğru. Momentum büyüdükçe λ küçülür.") · 2. "Rengine" yanlış (neden: "Yanlış. Renk bu kavramla ilgisiz.") · 3. "Hacmine" yanlış (neden: "Yanlış. Hacim λ'yı belirlemez.") · 4. "Sıcaklığa yalnızca" yanlış (neden: "Yanlış. Doğrudan momentuma bağlıdır.")
- `alt`: soru "Elektron kırınımı deneyi neyi kanıtlar?"

### o09 · sandik · "Sandık"
- `kart`: `{id:"bohr", yil:1913, tekCumle:"Atomda elektronun yalnızca belirli seviyelerde durabileceğini gösterdi."}`
- `ozet`: ["Seviyeler ayrık, geçişte foton çıkar", "n=1 en alt seviye, atom kararlı", "λ = h/p: madde de dalga"]
- `kontrolNoktasi`: true

## Temel tur
- kart 1: "Ayrık seviyeler" · "Elektron yalnızca belirli enerjilerde durur."
- kart 2: "En alt seviye" · "n=1'in altı yok; elektron çekirdeğe düşmez."
- kart 3: "Madde dalgası" · "Her parçacığın λ = h/p dalga boyu vardır."
- `sim`: modul `bohr`, params `{n:3, m:2}`

## Tekrar havuzu
1. o03'ü kopyala (`ayrik_spektrum`).
2. o04'ü kopyala (`debroglie_dalga`).
3. o05'i `dusman`a çevir (sim ve acik at, `kusurSkin:"vakans"`).
4. **Ek soru** (kavram `sifir_noktasi_sicaklik`, skin `tane_siniri`): soru "Hapsolmuş parçacığın en düşük enerjisi neden sıfır değildir?"; seçenekler: 1. "Sınır koşulu dalganın sığmasını gerektirir" **DOĞRU** (neden: "Doğru. Sıcaklık değil, sınır koşulu sebep.") · 2. "Sıcaklık sıfıra inemez" yanlış (neden: "Hayır. Mutlak sıfırda da E₁ > 0.") · 3. "Ölçüm enerjiyi ekler" yanlış (neden: "Hayır. Ölçüm olmasa da alt enerji vardır.").
