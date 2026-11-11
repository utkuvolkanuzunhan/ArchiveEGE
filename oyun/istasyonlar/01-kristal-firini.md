# İstasyon 01 · Kristal fırını (`s01`)

> **Ajan E1:** Bu dosyayı `oyun/src/js/90-data-s01.js` dosyasına, `01-veri-semalari.md` şemasına uygun JavaScript verisine çevir. Metinleri **aynen** kullan, kısaltma/yeniden yazma. Alan adları şemadaki gibi. Kontrol: `node oyun/test/veri-dogrula.js`.
> Okunacaklar: `00`, `01` (§3), `06` (hangi `sim.modul` ve `params` var), bu dosya.

| Alan | Değer |
|---|---|
| `id` / `sira` | `s01` / 1 |
| `ad` / `makine` | Kristal fırını / Kristal fırını |
| `renk` | `#ff9f1c` |
| `konu` | Katı türleri, neden kristal, CZ ile tek kristal |
| `sinavSorulari` | `["S1","S2"]` |
| `sureHedefDk` | 22 |
| `patronId` | `czoch` |
| `kavramlar` | `kati_turleri`, `tane_siniri`, `cz_tohum`, `kristal_neden`, `kristal_pahali` |

## Engeller (bu sırada)

### o01 · hikaye · "Zaman kapısı"
- `yer`: Polonya · `yil`: 1916 · `rivayet`: true · `kavram`: null
- satır 1 · `selin`: "Sipariş: 10.000 çip. Hammadde kum, ama kum önce kristal olmalı."
- satır 2 · `selin`: "Zaman makinesi hazır. 1916'ya, kristal çekmenin doğduğu yere gidiyoruz."
- satır 3 · `czoch`: "Rivayete göre kalemi mürekkep yerine eriyik kalaya batırdım. Tel tek kristal çıktı."

### o02 · kavram · "Kavram kapısı" · kavram `kati_turleri`
- `gorev`: "Elektronu üç malzemeden de geçir."
- `sim`: modul `kristal_tur`, params `{mod:"tur"}`, basari `{hepsiniDene:true}`
- `ogrenilen`: "Düzen bozuldukça elektron daha çok saçılır; tek kristalde yolu en açıktır."

### o03 · dusman · "Kusur düşmanı" · kavram `kati_turleri` · `kusurSkin` `vakans`
- `soru`: "Amorf katıda atomlar uzun menzilde düzenli dizilir mi?"
- seçenekler:
  1. "Evet, kristal gibi" · yanlış · neden: "Hayır. Uzun menzilli düzen yalnızca kristalde vardır."
  2. "Hayır, düzen yalnızca yakın komşuluktadır" · **DOĞRU** · neden: "Doğru. Amorfta yalnızca yakın komşular düzenlidir."
  3. "Yalnızca soğuyunca düzenlenir" · yanlış · neden: "Yanlış. Amorf kalan katıda uzun menzilli düzen hiç oluşmaz."

### o04 · dusman · "Kusur düşmanı" · kavram `tane_siniri` · `kusurSkin` `tane_siniri`
- `soru`: "Çok kristalli malzemede 'tane sınırı' nedir?"
- seçenekler:
  1. "İki kristal tanesi arasındaki düzensiz ara bölge" · **DOĞRU** · neden: "Doğru. Kristal yönünün değiştiği ara yüzdür."
  2. "Kristalin dış yüzeyi" · yanlış · neden: "Hayır. Tane sınırı malzemenin içinde, tanelerin buluştuğu yerdir."
  3. "Katkı atomlarının toplandığı yer" · yanlış · neden: "Hayır. Tane sınırı, kristal yönünün değiştiği ara yüzdür."

### o05 · tahmin · "Tahmin çukuru" · kavram `tane_siniri` · agirlik 1.5
- `soru`: "Tek kristal yerine çok kristalli malzeme kullanırsan elektronun serbest yolu ne olur?"
- seçenekler:
  1. "Artar" · yanlış · neden: "Yanlış. Tane sınırları elektronu saçar, serbest yol kısalır."
  2. "Azalır" · **DOĞRU** · neden: "Doğru. Her tane sınırı bir engeldir."
  3. "Değişmez" · yanlış · neden: "Yanlış. Tane sınırı ek saçılma getirir."
- `sim`: modul `kristal_tur`, onceki `{mod:"serbest_yol"}`, sonraki `{mod:"serbest_yol", gonder:true}`
- `acik`: "Tane sınırında elektron sekiyor; tek kristalde yol açık, serbest yol uzun."

### o06 · tuzak · "Yanılgı tuzağı" · kavram `kristal_pahali`
- `iddia`: "Kristal pahalı olduğu için yarıiletken endüstrisinde tercih edilir."
- `parcalar`: ["Kristal pahalı olduğu için", "yarıiletken endüstrisinde", "tercih edilir."]
- `yanlisParca`: 0
- `duzeltme`: "Kristal periyodik olduğu için bantları öngörülebilir ve özellikleri kontrol edilebilir."

### o07 · kopru · "Mantık köprüsü" · kavram `kristal_neden`
- `soru`: "Zinciri sıraya diz"
- `bloklar` (doğru sırada): ["Kafes periyodik tekrar eder", "Elektron periyodik potansiyel görür", "Enerji bantları net oluşur", "Özellikler öngörülebilir ve tekrarlanabilir"]
- `sonuc`: "Periyodik kafes, periyodik potansiyel, net bantlar, öngörülebilir aygıt."

### o08 · patron · "Tane Sınırı Canavarı"
- `canavar`: `czoch` · `canavarAd`: "Tane Sınırı Canavarı"
- `giris`: "Ben tane sınırıyım! Elektronlarını sektiririm. Beni nasıl yenersin?"

**Faz 1 · secmeli** · kavram `cz_tohum`
- `soru`: "CZ yönteminde tohum kristalin görevi nedir?"
- seçenekler:
  1. "Eriyiği ısıtır" · yanlış · neden: "Hayır. Isıtmayı fırın yapar."
  2. "Katılaşan atomlara kristal düzenini tarif eder" · **DOĞRU** · neden: "Doğru. Atomlar tohumun düzenini sürdürür."
  3. "Eriyiği karıştırır" · yanlış · neden: "Hayır. Karıştırma tohumun işi değil."
- `alt`: soru "CZ'de külçe neden yavaşça döndürülerek çekilir?"; seçenekler: 1. "Tohumun düzeni homojen sürsün diye" **DOĞRU** (neden: "Doğru. Yavaş ve düzgün çekme tek kristali korur.") · 2. "Daha hızlı soğusun diye" yanlış (neden: "Hayır. Hızlı soğuma kusur yapar.") · 3. "Eriyik atılsın diye" yanlış (neden: "Hayır. Amaç eriyik atmak değil.")

**Faz 2 · acik · S1**
- `pdfSoru`: "Why are crystalline solids used in the semiconductor industry?"
- `soru`: "Kristal katılar yarıiletken endüstrisinde neden kullanılır?"
- `anahtarFikirler`:
  1. "Kristalde atomlar periyodik dizilir, potansiyel periyodiktir."
  2. "Periyodiklik iyi tanımlı enerji bantları ve bant aralığı verir."
  3. "Özellikler öngörülebilir ve tekrarlanabilir, katkıyla kontrol edilir."
  4. "Çok kristalli veya amorfta taşıyıcılar tane sınırlarında saçılır."
- `yanlisKavramlar`: ["Kristal pahalı olduğu için tercih edilir", "Kristal sadece daha parlak olduğu için kullanılır"] · `yanlisKavramIds`: ["kristal_pahali", "kristal_pahali"]
- `idealCevap`: "Kristalde atomlar periyodik dizilir. Bu periyodik potansiyel iyi tanımlı enerji bantları ve bant aralığı doğurur. Böylece iletkenlik öngörülebilir, katkılamayla kontrol edilir ve her aygıtta tekrarlanır. Çok kristalli veya amorf malzemede tane sınırları taşıyıcıları saçar."
- `yedekSecmeli`: soru "Kristal neden yarıiletkende tercih edilir?"; seçenekler: 1. "Periyodik yapı öngörülebilir enerji bantları verir" **DOĞRU** (neden: "Doğru. Periyodik potansiyel net bantlar ve tekrarlanabilirlik sağlar.") · 2. "Kristal en ucuz malzemedir" yanlış (neden: "Yanlış. Maliyet sebep değil, tam tersine kristal büyütmek pahalıdır.") · 3. "Kristal ışığı daha çok yansıtır" yanlış (neden: "Yanlış. Yansıma elektriksel özelliklerle ilgisizdir.") · 4. "Kristalde elektron hiç saçılmaz" yanlış (neden: "Yanlış. Titreşim ve kusurlarda saçılır, ama çok daha az.")
- `alt`: soru "Amorf silisyum yerine tek kristal silisyum neden tercih edilir?"

**Faz 3 · acik · S2**
- `pdfSoru`: "Explain the main reason for single-crystal growth in the CZ method"
- `soru`: "CZ yönteminde tek kristal büyütmenin ana nedeni nedir?"
- `anahtarFikirler`:
  1. "Tek kristalde tane sınırı yoktur."
  2. "Tane sınırları taşıyıcıları saçar ve tuzaklar."
  3. "Hareketlilik ve taşıyıcı ömrü böylece yüksek kalır."
  4. "Tüm wafer boyunca aynı özellik, tekrarlanabilir aygıt."
- `yanlisKavramlar`: ["Tek kristal sadece daha güzel görünür", "Tane sınırı elektriği daha iyi iletir"] · `yanlisKavramIds`: ["kristal_pahali", "tane_siniri"]
- `idealCevap`: "Tek kristalde tane sınırı yoktur. Tane sınırları taşıyıcıları saçar ve tuzaklar, hareketliliği ve ömrü düşürür. Tek kristal, wafer boyunca aynı bant yapısını ve tekrarlanabilir aygıt özelliklerini sağlar."
- `yedekSecmeli`: soru "CZ'de tek kristal neden istenir?"; seçenekler: 1. "Tane sınırı yok, taşıyıcılar saçılmaz" **DOĞRU** (neden: "Doğru. Hareketlilik ve ömür yüksek kalır.") · 2. "Tek kristal daha hızlı büyür" yanlış (neden: "Yanlış. Tek kristal yavaş büyütülür.") · 3. "Tane sınırı akımı artırır" yanlış (neden: "Yanlış. Tane sınırı taşıyıcıları saçar.") · 4. "Kristal rengi daha homojen olur" yanlış (neden: "Yanlış. Renk sebep değil.")
- `alt`: soru "Tane sınırı aygıt performansını nasıl bozar?"

### o09 · sandik · "Sandık"
- `kart`: `{id:"czoch", yil:1916, tekCumle:"Eriyikten tohumla tek kristal çekmenin yolunu buldu."}`
- `ozet`: ["Kristal: tekrar eden periyodik düzen", "Tane sınırı elektronu saçar", "CZ: tohumu eriyikten yavaşça çek"]
- `kontrolNoktasi`: true

## Temel tur (`temelTur`)
- kart 1: baslik "Kristal nedir?" · metin "Atomlar uzun menzilde tekrar eden düzenle dizilir."
- kart 2: baslik "Neden saçılma?" · metin "Düzen bozuldukça elektron daha sık sekiyor."
- kart 3: baslik "CZ nedir?" · metin "Tohum kristal eriyikten yavaşça çekilir, düzen sürer."
- `sim`: modul `kristal_tur`, params `{mod:"tur"}`

## Tekrar havuzu (`tekrarHavuzu`, hepsi `tip:"dusman"`)
1. o03'ü kopyala (kavram `kati_turleri`).
2. o04'ü kopyala (kavram `tane_siniri`).
3. o05'i `dusman`a çevir: aynı `soru` ve `secenekler`, `sim` ve `acik` alanlarını at, `tip:"dusman"`, `kusurSkin:"tane_siniri"`.
4. **Ek soru** (kavram `cz_tohum`, `kusurSkin` `dislokasyon`): soru "CZ'de tohum kristal ne işe yarar?"; seçenekler: 1. "Düzeni atomlara aktarır" **DOĞRU** (neden: "Doğru. Katılaşan atomlar tohumun düzenini sürdürür.") · 2. "Eriyiği soğutur" yanlış (neden: "Hayır. Soğutma tohumun işi değil.") · 3. "Eriyiği temizler" yanlış (neden: "Hayır. Temizlik başka süreç.").
