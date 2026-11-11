# İstasyon 05 · Dalga odası (`s05`)

> **Ajan E5:** Bu dosyayı `oyun/src/js/90-data-s05.js` dosyasına, `01-veri-semalari.md` şemasına uygun JavaScript verisine çevir. Metinleri **aynen** kullan. Kontrol: `node oyun/test/veri-dogrula.js`.
> Okunacaklar: `00`, `01` (§3), `06` (`kuyu` parametreleri), bu dosya.

| Alan | Değer |
|---|---|
| `id` / `sira` | `s05` / 5 |
| `ad` / `makine` | Dalga odası / Dalga odası |
| `renk` | `#00e5ff` |
| `konu` | Schrödinger denklemi, ψ, sonsuz kuyu, kuantalaşma |
| `sinavSorulari` | `["S5"]` |
| `sureHedefDk` | 24 |
| `patronId` | `schro` |
| `kavramlar` | `psi_olasilik`, `schrodinger_girdi_cikti`, `kuantalasma_sinir`, `sifir_noktasi_sicaklik`, `schrodinger_cokme`, `kuantalasma_olcum` |

## Engeller

### o01 · hikaye · "Zaman kapısı"
- `yer`: Zürih · `yil`: 1926 · `rivayet`: false · `kavram`: null
- satır 1 · `selin`: "Dalga odası: burada her şey tek bir denkleme bağlı."
- satır 2 · `schro`: "Dalga fonksiyonu ψ için bir denklem yazdım. Atomun enerjileri denklemden çıktı."
- satır 3 · `schro`: "Enerjileri ben eklemedim. Sınır koşullarından kendiliğinden ortaya çıktılar."

### o02 · kavram · "Kavram kapısı" · kavram `kuantalasma_sinir`
- `gorev`: "Kuyu genişliğini 2'den 1 nm'ye indir."
- `sim`: modul `kuyu`, params `{L:2, n:1}`, basari `{yariya:true}`
- `ogrenilen`: "Duvarda ψ = 0 olduğundan yalnızca belirli dalga boyları sığar; enerji kuantalanır."

### o03 · dusman · "Kusur düşmanı" · kavram `psi_olasilik` · `kusurSkin` `vakans`
- `soru`: "Dalga fonksiyonu ψ(x) fiziksel olarak neyi anlatır?"
- seçenekler:
  1. "|ψ(x)|² bulunma olasılık yoğunluğunu verir" · **DOĞRU** · neden: "Doğru. ψ'nin kendisi ölçülemez, karesi olasılıktır."
  2. "Parçacığın gerçek konumunu" · yanlış · neden: "Hayır. ψ konum vermez, olasılık dağılımı verir."
  3. "Parçacığın enerjisini" · yanlış · neden: "Hayır. Enerji denklemin özdeğeridir."

### o04 · dusman · "Kusur düşmanı" · kavram `schrodinger_girdi_cikti` · `kusurSkin` `tane_siniri`
- `soru`: "Schrödinger denklemine ne verirsin, ne alırsın?"
- seçenekler:
  1. "Potansiyel V(x) ve sınır koşulu ver; ψ ve izinli E'leri al" · **DOĞRU** · neden: "Doğru. Girdi V(x) ve sınır koşulu, çıktı ψ ile E."
  2. "ψ ver, potansiyeli al" · yanlış · neden: "Hayır. Potansiyel girdidir, ψ çıktıdır."
  3. "Enerji ver, konumu al" · yanlış · neden: "Hayır. Enerjiler denklemin çıktısıdır."

### o05 · tahmin · "Tahmin çukuru" · kavram `kuantalasma_sinir` · agirlik 1.5
- `soru`: "Kuyu genişliği L yarıya inerse E₁ ne olur?"
- seçenekler:
  1. "4 katına çıkar" · **DOĞRU** · neden: "Doğru. E ∝ 1/L²."
  2. "2 katına çıkar" · yanlış · neden: "Yanlış. Enerji L²'ye ters orantılıdır: 4 kat."
  3. "Değişmez" · yanlış · neden: "Yanlış. Dar kuyuda dalga boyu kısalır, enerji artar."
- `sim`: modul `kuyu`, onceki `{L:2, n:1}`, sonraki `{L:1, n:1}`
- `acik`: "E ∝ 1/L²: L yarıya inince enerji dört katına çıkar."

### o06 · tuzak · "Yanılgı tuzağı" · kavram `sifir_noktasi_sicaklik`
- `iddia`: "Sonsuz kuyudaki parçacığın enerjisi, sıcaklık sıfır olmadığı için sıfırdan büyüktür."
- `parcalar`: ["Sonsuz kuyudaki parçacığın enerjisi,", "sıcaklık sıfır olmadığı için", "sıfırdan büyüktür."]
- `yanlisParca`: 1
- `duzeltme`: "Sebep sıcaklık değil: sınır koşulu dalganın sığmasını gerektirir. Mutlak sıfırda da E₁ > 0."

### o07 · kopru · "Mantık köprüsü" · kavram `kuantalasma_sinir`
- `soru`: "Kuantalaşma zincirini sıraya diz"
- `bloklar` (doğru sırada): ["Duvarlarda ψ sıfır olmak zorundadır", "Kuyuya yalnızca tam sayı yarım dalga sığar", "Dalga boyu λ = 2L/n ile sınırlanır", "Enerji E ∝ n²/L² belirli değerler alır"]
- `sonuc`: "Sınır koşulu, sığan dalgalar, kısıtlı λ, kuantalı enerji."

### o08 · patron · "Kuantum Kedisi"
- `canavar`: `schro` · `canavarAd`: "Kuantum Kedisi"
- `giris`: "Miyav! Sıfır enerjiyle kutuya sığacağımı mı sandın?"

**Faz 1 · secmeli** · kavram `schrodinger_cokme`
- `soru`: "Zamana bağlı Schrödinger denklemi ψ'yi nasıl değiştirir?"
- seçenekler:
  1. "Düzgün ve belirlenimci biçimde evriltir" · **DOĞRU** · neden: "Doğru. Çökme denklemden değil, ölçümden gelir."
  2. "Ölçüm yapınca çökertir" · yanlış · neden: "Hayır. Çökme ayrı bir postülattır, denklemin işi değil."
  3. "Rastgele değiştirir" · yanlış · neden: "Hayır. Denklem rastgele değil, belirlenimcidir."
- `alt`: soru "Ĥψ = Eψ matematiksel olarak nasıl bir problemdir?"; seçenekler: 1. "Özdeğer problemi" **DOĞRU** (neden: "Doğru. İzinli E'ler özdeğerlerdir.") · 2. "Başlangıç değer problemi" yanlış (neden: "Hayır. Bu zamana bağlı denklem için geçerli.") · 3. "Olasılık hesabı" yanlış (neden: "Hayır. Olasılık |ψ|²'dir, denklem değil.")

**Faz 2 · acik · S5 (mantık)**
- `pdfSoru`: "For the given potential below, it is required to calculate the wave function and the allowed energies in electron-volts (eV)."
- `soru`: "Sonsuz kuyuda ψ ve izinli enerjiler nasıl bulunur? Mantığı anlat."
- `anahtarFikirler`:
  1. "Duvarlarda ψ = 0 sınır koşulu uygulanır."
  2. "Çözüm sinüs dalgasıdır: ψ = √(2/L) sin(nπx/L)."
  3. "Yalnızca L = nλ/2 ile sığan dalgalar izinlidir."
  4. "Enerji E = n²π²ħ²/(2mL²), elektron için yaklaşık 0,376·n²/L² eV (L nm)."
- `yanlisKavramlar`: ["Enerji sıcaklıktan gelir", "Kuantalaşma ölçüm sonucudur"] · `yanlisKavramIds`: ["sifir_noktasi_sicaklik", "kuantalasma_olcum"]
- `idealCevap`: "Duvarlarda ψ = 0 olmalıdır. Çözüm ψ = √(2/L) sin(nπx/L) sinüs dalgasıdır; yalnızca L = nλ/2 ile sığan dalgalar izinlidir. Bu yüzden enerji E = n²π²ħ²/(2mL²) değerleriyle kuantalanır. n = 0 dalga olmadığı için yoktur, en düşük enerji E₁ > 0'dır."
- `yedekSecmeli`: soru "Sonsuz kuyuda enerji neden kuantalıdır?"; seçenekler: 1. "Duvarlarda ψ = 0 olduğundan yalnızca belirli dalga boyları sığar" **DOĞRU** (neden: "Doğru. Sınır koşulu kuantalaşmayı doğurur.") · 2. "Ölçüm enerjiyi ayrıklaştırır" yanlış (neden: "Yanlış. Kuantalaşma ölçümden önce de vardır.") · 3. "Sıcaklık seviyeleri ayırır" yanlış (neden: "Yanlış. Sıcaklık sebep değil.") · 4. "Bantlar oluşur" yanlış (neden: "Yanlış. Bantlar çok atomlu katıda oluşur.")
- `alt`: soru "Sonsuz kuyuda n = 0 neden yoktur ve bu E₁'e ne söyler?"

**Faz 3 · acik**
- `pdfSoru`: null
- `soru`: "Schrödinger denklemi çöker mi? Çökme nedir?"
- `anahtarFikirler`:
  1. "Zamana bağlı denklem ψ'yi düzgün ve belirlenimci evriltir."
  2. "Çökme ayrı bir postülattır ve ölçümle olur."
  3. "Zamandan bağımsız denklem özdeğer problemidir (Ĥψ = Eψ)."
  4. "Girdi V(x) ve sınır koşulu, çıktı ψ ve izinli E'ler."
- `yanlisKavramlar`: ["Schrödinger denklemi çöker", "Denklem yalnızca bir olasılık denklemidir"] · `yanlisKavramIds`: ["schrodinger_cokme", "schrodinger_cokme"]
- `idealCevap`: "Schrödinger denklemi çökmez; ψ'yi zamanla düzgün ve belirlenimci biçimde evriltir. Çökme ayrı bir postülattır ve yalnızca ölçümle olur. Denklemin girdisi potansiyel V(x) ve sınır koşullarıdır, çıktısı ψ ve izinli E değerleridir."
- `yedekSecmeli`: soru "Çökme ne zaman olur?"; seçenekler: 1. "Ölçüm sırasında" **DOĞRU** (neden: "Doğru. Çökme ölçüm postülatıdır.") · 2. "Denklem çözülürken" yanlış (neden: "Yanlış. Denklem çökme üretmez.") · 3. "Zaman geçtikçe" yanlış (neden: "Yanlış. Zamanla evrim düzgündür.") · 4. "Sıcaklık artınca" yanlış (neden: "Yanlış. Sıcaklıkla ilgisi yok.")
- `alt`: soru "Zamana bağlı denklemle çökme arasındaki farkı anlat."

### o09 · sandik · "Sandık"
- `kart`: `{id:"schro", yil:1926, tekCumle:"Dalga fonksiyonunun denklemini yazdı; enerjiler kendiliğinden çıktı."}`
- `ozet`: ["Girdi: V(x) ve sınır koşulu", "Sınır koşulu enerjiyi kuantalar", "En düşük enerji sıfır olamaz"]
- `kontrolNoktasi`: true

## Temel tur
- kart 1: "ψ nedir?" · "|ψ|² bulunma olasılık yoğunluğudur."
- kart 2: "Sınır koşulu" · "Duvarda ψ = 0: yalnızca sığan dalgalar izinli."
- kart 3: "E₁ > 0" · "n = 0 dalga yok demek; en düşük enerji sıfır değil."
- `sim`: modul `kuyu`, params `{L:2, n:1}`

## Tekrar havuzu
1. o03'ü kopyala (`psi_olasilik`).
2. o04'ü kopyala (`schrodinger_girdi_cikti`).
3. o05'i `dusman`a çevir (sim ve acik at, `kusurSkin:"vakans"`).
4. **Ek soru** (kavram `kuantalasma_olcum`, skin `safsizlik`): soru "Enerji kuantalaşması nereden gelir?"; seçenekler: 1. "Sınır koşullarından" **DOĞRU** (neden: "Doğru. Yalnızca sığan çözümler izinli.") · 2. "Ölçüm sonucundan" yanlış (neden: "Hayır. Ölçümden önce de enerjiler ayrıktır.") · 3. "Sıcaklıktan" yanlış (neden: "Hayır. Sıcaklık sebep değil.").
