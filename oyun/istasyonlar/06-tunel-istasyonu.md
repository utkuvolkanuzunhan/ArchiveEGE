# İstasyon 06 · Tünel istasyonu (`s06`)

> **Ajan E6:** Bu dosyayı `oyun/src/js/90-data-s06.js` dosyasına, `01-veri-semalari.md` şemasına uygun JavaScript verisine çevir. Metinleri **aynen** kullan. Kontrol: `node oyun/test/veri-dogrula.js`.
> Okunacaklar: `00`, `01` (§3), `06` (`basamak` parametreleri: `mod`, `E`, `V0`, `a`), bu dosya.

| Alan | Değer |
|---|---|
| `id` / `sira` | `s06` / 6 |
| `ad` / `makine` | Tünel istasyonu / Tünel istasyonu |
| `renk` | `#7a5cff` |
| `konu` | Basamak potansiyeli, yansıma, bariyer, tünelleme |
| `sinavSorulari` | `["S5","S6"]` |
| `sureHedefDk` | 22 |
| `patronId` | `broglie` |
| `kavramlar` | `basamak_yansima`, `bariyer_sonumlenme`, `tunelleme_kalinlik`, `dalga_surekli` |

## Engeller

### o01 · hikaye · "Zaman kapısı"
- `yer`: Paris · `yil`: 1924 · `rivayet`: false · `kavram`: null
- satır 1 · `selin`: "Tünel istasyonunda elektron bir duvarla karşılaşıyor. Geçer mi?"
- satır 2 · `broglie`: "Madde dalgaysa ışık gibi davranır: engelde hem yansır hem geçebilir."
- satır 3 · `selin`: "Önce basamak, sonra bariyer. Dalga davranışı hep aynı."

### o02 · kavram · "Kavram kapısı" · kavram `basamak_yansima`
- `gorev`: "Enerjiyi basamaktan yüksek tut, R'yi 0,1-0,2 yap."
- `sim`: modul `basamak`, params `{mod:"basamak", V0:1.0, E:3.0}`, basari `{R:[0.1,0.2]}`
- `ogrenilen`: "E > V₀ iken bile dalga kısmen yansır; klasikte yansıma olmazdı."

### o03 · dusman · "Kusur düşmanı" · kavram `basamak_yansima` · `kusurSkin` `vakans`
- `soru`: "E > V₀ iken parçacığın basamaktan yansıma olasılığı nedir?"
- seçenekler:
  1. "Sıfırdan büyük, dalga kısmen yansır" · **DOĞRU** · neden: "Doğru. k₁ ≠ k₂ olduğundan yansıma vardır."
  2. "Sıfır, klasik fizik gibi" · yanlış · neden: "Hayır. Klasikte sıfır, dalga mekaniğinde değil."
  3. "Yüzde yüz" · yanlış · neden: "Hayır. E > V₀ ise bir kısmı geçer."

### o04 · dusman · "Kusur düşmanı" · kavram `bariyer_sonumlenme` · `kusurSkin` `tane_siniri`
- `soru`: "E < V₀ iken ψ bariyerin içinde ne yapar?"
- seçenekler:
  1. "Üstel olarak sönümlenir ama sıfır olmaz" · **DOĞRU** · neden: "Doğru. Yasak bölgede dalga salınmaz, sönümlenir."
  2. "Aniden sıfır olur" · yanlış · neden: "Hayır. ψ ve türevi süreklidir, aniden sıfır olamaz."
  3. "Salınmaya devam eder" · yanlış · neden: "Hayır. Yasak bölgede dalga salınmaz."

### o05 · tahmin · "Tahmin çukuru" · kavram `tunelleme_kalinlik` · agirlik 1.5
- `soru`: "Bariyeri kalınlaştırırsan geçiş olasılığı ne olur?"
- seçenekler:
  1. "Üstel olarak azalır" · **DOĞRU** · neden: "Doğru. T ∝ e^(−2κa)."
  2. "Doğrusal azalır" · yanlış · neden: "Yanlış. Azalma üsteldir, çok hızlıdır."
  3. "Değişmez" · yanlış · neden: "Yanlış. Kalınlık arttıkça sönümlenme büyür."
- `sim`: modul `basamak`, onceki `{mod:"bariyer", E:2, V0:4, a:0.3}`, sonraki `{mod:"bariyer", E:2, V0:4, a:1.5}`
- `acik`: "Kalınlık 0,3'ten 1,5 nm'ye çıkınca geçiş olasılığı milyarlarca kat düşüyor."

### o06 · tuzak · "Yanılgı tuzağı" · kavram `bariyer_sonumlenme`
- `iddia`: "Enerjisi bariyerden düşük parçacık, kuantumda da kesinlikle geçemez."
- `parcalar`: ["Enerjisi bariyerden düşük parçacık,", "kuantumda da", "kesinlikle geçemez."]
- `yanlisParca`: 1
- `duzeltme`: "Kuantumda ψ bariyerde sönümlenir ama sıfır olmaz; ince bariyerden geçiş olasılığı vardır."

### o07 · kopru · "Mantık köprüsü" · kavram `dalga_surekli`
- `soru`: "Basamak çözümünü sıraya diz"
- `bloklar` (doğru sırada): ["ψ iki bölgede de yazılır", "x = 0'da ψ ve ψ' sürekli olmalı", "Süreklilik katsayıları (r, t) belirler", "R = |r|² ve T = 1 − R"]
- `sonuc`: "Her bölgede ψ, sınırda süreklilik, katsayılar, R ve T."

### o08 · patron · "Dalga Canavarı"
- `canavar`: `broglie` · `canavarAd`: "Dalga Canavarı"
- `giris`: "Ben dalgayım! Duvarlara çarparım, bazen içinden geçerim."

**Faz 1 · secmeli** · kavram `basamak_yansima`
- `soru`: "E < V₀ olan basamakta yansıma katsayısı R kaçtır?"
- seçenekler:
  1. "R = 1" · **DOĞRU** · neden: "Doğru. Hepsi yansır; bölge 2'de yalnızca sönümlü ψ var."
  2. "R = 0" · yanlış · neden: "Hayır. R = 0 hiç yansıma olmaması demek; E < V₀ iken hepsi yansır."
  3. "R = 0,5" · yanlış · neden: "Hayır. E < V₀ iken bölge 2'ye akı gitmez, yani R = 1."
- `alt`: soru "Tünelleme hangi dalga özelliğinin sonucudur?"; seçenekler: 1. "ψ'nin bariyerde sönümlenip sıfır olmaması" **DOĞRU** (neden: "Doğru. Öbür yanda ψ sıfırdan farklı kalır.") · 2. "Parçacığın bariyerden zıplaması" yanlış (neden: "Hayır. Zıplama klasik bir fikir.") · 3. "Bariyerin erimesi" yanlış (neden: "Hayır. Bariyer değişmez.")

**Faz 2 · acik · S6**
- `pdfSoru`: "Calculate the wave function and the reflection coefficient of the electron for the given potential."
- `soru`: "Basamak potansiyelinde ψ ve yansıma katsayısı nasıl bulunur? Mantığı anlat."
- `anahtarFikirler`:
  1. "İki bölgede ψ yazılır: gelen, yansıyan ve geçen dalga."
  2. "x = 0'da ψ ve ψ' sürekli olmalı."
  3. "k₁=√(2mE)/ħ, k₂=√(2m(E−V₀))/ħ ile r=(k₁−k₂)/(k₁+k₂)."
  4. "R = |r|², T = 1 − R; E < V₀ ise R = 1."
- `yanlisKavramlar`: ["E > V₀ ise hiç yansıma olmaz", "ψ bariyerde aniden sıfır olur"] · `yanlisKavramIds`: ["basamak_yansima", "bariyer_sonumlenme"]
- `idealCevap`: "Her iki bölgede ψ yazılır: solda gelen ve yansıyan, sağda geçen dalga. x = 0'da ψ ve ψ' sürekli olmalıdır. Buradan r = (k₁−k₂)/(k₁+k₂) çıkar, yansıma katsayısı R = |r|², geçiş T = 1 − R'dir. E < V₀ ise bölge 2'de ψ sönümlenir ve R = 1'dir."
- `yedekSecmeli`: soru "R = |r|² nasıl bulunur?"; seçenekler: 1. "ψ ve ψ' sürekliliğinden r bulunur" **DOĞRU** (neden: "Doğru. Sınırda süreklilik katsayıları belirler.") · 2. "E'yi V₀'a bölerek" yanlış (neden: "Yanlış. Bu doğrudan R vermez.") · 3. "Sıcaklıkla" yanlış (neden: "Yanlış. Sıcaklık gerekmez.") · 4. "ψ'nin karesini alarak" yanlış (neden: "Yanlış. Önce r bulunur.")
- `alt`: soru "Basamakta ψ sürekliliği neden gerekir ve neyi belirler?"

**Faz 3 · acik**
- `pdfSoru`: null
- `soru`: "Tünelleme nedir? Geçiş olasılığı neden kalınlıkla azalır?"
- `anahtarFikirler`:
  1. "E < V₀ iken klasik geçiş yok; kuantumda ψ bariyerde sönümlenir."
  2. "ψ sıfırdan farklı kaldığından öbür yanda bulunma olasılığı vardır."
  3. "Geçiş olasılığı T ∝ e^(−2κa), kalınlıkla üstel azalır."
  4. "Tünel diyodu ve flash bellek gibi aygıtlarda önemlidir."
- `yanlisKavramlar`: ["Parçacık bariyerin üstünden zıplar", "Geçerken enerjisini kaybeder"] · `yanlisKavramIds`: ["tunelleme_kalinlik", "tunelleme_kalinlik"]
- `idealCevap`: "E < V₀ iken klasik fizik geçişi yasaklar. Kuantumda ψ bariyerin içinde üstel olarak sönümlenir ama sıfır olmaz, bu yüzden öbür tarafta bulunma olasılığı vardır. Geçiş olasılığı T ∝ e^(−2κa) olduğundan bariyer kalınlaştıkça çok hızlı azalır. Tünel diyodu ve flash bellek gibi aygıtlarda kullanılır."
- `yedekSecmeli`: soru "Tünelleme neden olur?"; seçenekler: 1. "ψ bariyerde sönümlenir ama sıfır olmaz" **DOĞRU** (neden: "Doğru. Öbür yanda ψ kalır.") · 2. "Parçacık enerji kazanır" yanlış (neden: "Yanlış. Enerji aynı kalır.") · 3. "Bariyer ısınır" yanlış (neden: "Yanlış. Isı sebep değil.") · 4. "Parçacık dalga değildir" yanlış (neden: "Yanlış. Tünelleme dalga davranışıdır.")
- `alt`: soru "Tünelleme olasılığı neden kalınlıkla üstel azalır?"

### o09 · sandik · "Sandık"
- `kart`: `{id:"broglie", yil:1924, tekCumle:"Maddenin de dalga gibi davrandığını önerdi."}`
- `ozet`: ["E > V₀ iken bile kısmi yansıma", "E < V₀: ψ bariyerde sönümlenir", "Tünelleme kalınlıkla üstel azalır"]
- `kontrolNoktasi`: true

## Temel tur
- kart 1: "Basamak" · "Dalga basamakta kısmen yansır, kısmen geçer."
- kart 2: "Yasak bölge" · "E < V₀ iken ψ sönümlenir, sıfır olmaz."
- kart 3: "Tünelleme" · "İnce bariyerde geçiş olasılığı var, kalınlıkla azalır."
- `sim`: modul `basamak`, params `{mod:"bariyer", E:2, V0:4, a:0.3}`

## Tekrar havuzu
1. o03'ü kopyala (`basamak_yansima`).
2. o04'ü kopyala (`bariyer_sonumlenme`).
3. o05'i `dusman`a çevir (sim ve acik at, `kusurSkin:"vakans"`).
4. **Ek soru** (kavram `dalga_surekli`, skin `safsizlik`): soru "Sınırda neden ψ ve ψ' sürekli olmalıdır?"; seçenekler: 1. "Denklemin ikinci türev içermesi bunu gerektirir" **DOĞRU** (neden: "Doğru. Süreksizlik denklemi sağlamaz.") · 2. "Süreklilik şart değildir" yanlış (neden: "Hayır. Süreklilik katsayıları belirler.") · 3. "Yalnızca E < V₀ için gerekir" yanlış (neden: "Hayır. Her durumda gerekir.").
