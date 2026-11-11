# İstasyon 02 · Kesim testeresi (`s02`)

> **Ajan E2:** Bu dosyayı `oyun/src/js/90-data-s02.js` dosyasına, `01-veri-semalari.md` şemasına uygun JavaScript verisine çevir. Metinleri **aynen** kullan. Kontrol: `node oyun/test/veri-dogrula.js`.
> Okunacaklar: `00`, `01` (§3), `06` (`miller` ve `kafes` parametreleri), bu dosya.
> `miller` simülasyonu `params.c` ile başlangıç kesişimlerini alır: `[a,b,c]`, her biri `1|2|3|"inf"`.

| Alan | Değer |
|---|---|
| `id` / `sira` | `s02` / 2 |
| `ad` / `makine` | Kesim testeresi / Kesim testeresi |
| `renk` | `#ff5d73` |
| `konu` | Kafes, birim hücre, Miller indisleri |
| `sinavSorulari` | `[]` (Konu 2; sınavda S1-S2'ye komşu, ayrı PDF sorusu yok) |
| `sureHedefDk` | 23 |
| `patronId` | `miller` |
| `kavramlar` | `atom_sayisi`, `birim_hucre`, `miller_duzlem`, `miller_yon`, `duzlem_neden` |

## Engeller

### o01 · hikaye · "Zaman kapısı"
- `yer`: Cambridge · `yil`: 1839 · `rivayet`: false · `kavram`: null
- satır 1 · `selin`: "Külçe hazır. Şimdi wafer kesilecek, ama hangi düzlemden?"
- satır 2 · `selin`: "Cevap 1839'da, Cambridge'de. Zaman kapısına!"
- satır 3 · `miller`: "Düzlemleri üç küçük tam sayıyla adlandırdım: (hkl). Kristalcilerin dili oldu."

### o02 · kavram · "Kavram kapısı" · kavram `atom_sayisi`
- `gorev`: "fcc hücresinde kaç atom olduğunu bul."
- `sim`: modul `kafes`, params `{tur:"fcc"}`, basari `{say:{tur:"fcc", atom:4}}`
- `ogrenilen`: "Köşe atomu 1/8, yüz atomu 1/2 sayılır: fcc hücresinde toplam 4 atom."

### o03 · dusman · "Kusur düşmanı" · kavram `atom_sayisi` · `kusurSkin` `vakans`
- `soru`: "bcc birim hücresinde hücre başına kaç atom düşer?"
- seçenekler:
  1. "1" · yanlış · neden: "Hayır. Hücre başına 1 atom basit kübikte (sc) düşer."
  2. "2" · **DOĞRU** · neden: "Doğru. 8 köşe × 1/8 + 1 merkez atomu = 2."
  3. "4" · yanlış · neden: "Hayır. Hücre başına 4 atom yüzey merkezli kübikte (fcc) düşer."

### o04 · dusman · "Kusur düşmanı" · kavram `birim_hucre` · `kusurSkin` `safsizlik`
- `soru`: "Elmas yapıda her atomun kaç en yakın komşusu vardır?"
- seçenekler:
  1. "4" · **DOĞRU** · neden: "Doğru. Elmas yapıda her atom tetrahedral, 4 komşulu."
  2. "6" · yanlış · neden: "Hayır. 6 komşu basit kübik düzende olur."
  3. "12" · yanlış · neden: "Hayır. 12 komşu fcc (sıkı paket) düzeninde olur."

### o05 · tahmin · "Tahmin çukuru" · kavram `miller_duzlem` · agirlik 1.5
- `soru`: "Eksenleri 2, ∞, ∞ noktasında kesen düzlemin Miller indisi nedir?"
- seçenekler:
  1. "(200)" · yanlış · neden: "Yanlış. Önce tersini al: ½, 0, 0. Sonra tam sayıya çevir: (100)."
  2. "(100)" · **DOĞRU** · neden: "Doğru. Ters: ½, 0, 0. İki ile çarp: (100)."
  3. "(210)" · yanlış · neden: "Yanlış. ∞ kesişim indisi 0 yapar; (210) farklı kesişimler ister."
- `sim`: modul `miller`, onceki `{c:[1,1,1]}`, sonraki `{c:[2,"inf","inf"]}`
- `acik`: "Kesişim 2, ∞, ∞. Ters ½, 0, 0. İki ile çarpınca (100)."

### o06 · tuzak · "Yanılgı tuzağı" · kavram `miller_duzlem`
- `iddia`: "Eksene paralel düzlemin indisi sonsuzdur."
- `parcalar`: ["Eksene paralel", "düzlemin indisi", "sonsuzdur."]
- `yanlisParca`: 2
- `duzeltme`: "Eksene paralel düzlem o ekseni ∞'da keser; indisi 0 olur."

### o07 · kopru · "Mantık köprüsü" · kavram `miller_duzlem`
- `soru`: "Miller adımlarını sıraya diz"
- `bloklar` (doğru sırada): ["Eksen kesişimlerini bul", "Kesişimlerin tersini al", "Kesirleri en küçük tam sayılara çevir", "Parantez içine yaz: (hkl)"]
- `sonuc`: "Kesişim, ters, tam sayı, (hkl): her düzlem için aynı dört adım."

### o08 · patron · "Düzlem Canavarı"
- `canavar`: `miller` · `canavarAd`: "Düzlem Canavarı"
- `giris`: "Hangi düzlemdeyim? Bil bakalım, yoksa seni yanlış açıdan keserim!"

**Faz 1 · secmeli** · kavram `miller_duzlem`
- `soru`: "(111) düzlemi eksenleri nerede keser?"
- seçenekler:
  1. "1, 1, 1" · **DOĞRU** · neden: "Doğru. Ters 1, 1, 1; tam sayı zaten (111)."
  2. "1, ∞, ∞" · yanlış · neden: "Hayır. Bu (100) düzlemidir."
  3. "1, 2, 3" · yanlış · neden: "Hayır. (123) kesişimleri 1, ½, ⅓'tür."
- `alt`: soru "Kübikte [111] yönü hangi düzleme diktir?"; seçenekler: 1. "(111)" **DOĞRU** (neden: "Doğru. Kübikte [hkl] yönü (hkl) düzlemine diktir.") · 2. "(100)" yanlış (neden: "Hayır. (100), [100] yönüne diktir.") · 3. "(110)" yanlış (neden: "Hayır. (110), [110] yönüne diktir.")

**Faz 2 · acik**
- `pdfSoru`: null
- `soru`: "Miller indisi nasıl bulunur? (hkl), {hkl} ve [uvw] ne anlama gelir?"
- `anahtarFikirler`:
  1. "Eksen kesişimleri bulunur, tersleri alınır."
  2. "Kesirler en küçük tam sayılara çevrilir, ∞ indisi 0 yapar."
  3. "(hkl) tek düzlemdir, {hkl} eşdeğer düzlem ailesidir."
  4. "[uvw] bir yöndür, ⟨uvw⟩ yön ailesidir."
- `yanlisKavramlar`: ["Miller indisi kesişimin kendisidir", "Paralel düzlemin indisi sonsuzdur"] · `yanlisKavramIds`: ["miller_duzlem", "miller_duzlem"]
- `idealCevap`: "Düzlemin eksenleri kestiği noktalar bulunur, tersleri alınır, kesirler en küçük tam sayılara çevrilir. Eksene paralel kesişim ∞'dur, indis 0 olur. (hkl) tek bir düzlem, {hkl} simetri ile eşdeğer düzlem ailesidir. [uvw] bir yöndür, ⟨uvw⟩ eşdeğer yönlerdir."
- `yedekSecmeli`: soru "Miller indisini bulurken ilk adım nedir?"; seçenekler: 1. "Eksen kesişimlerini bulmak" **DOĞRU** (neden: "Doğru. Sonra tersleri alınır.") · 2. "Tam sayıya çevirmek" yanlış (neden: "Yanlış. Bu üçüncü adım.") · 3. "Parantez yazmak" yanlış (neden: "Yanlış. Bu son adım.") · 4. "Hücre atom sayısını saymak" yanlış (neden: "Yanlış. Miller indisiyle ilgisiz.")
- `alt`: soru "Kesişimleri 1, 2, ∞ olan düzlemin indisini adımlarıyla bul."

**Faz 3 · acik**
- `pdfSoru`: null
- `soru`: "Silisyum wafer neden belirli bir kristal düzlemi boyunca kesilir?"
- `anahtarFikirler`:
  1. "Düzlemler farklı atom yoğunluğuna sahiptir."
  2. "Yüzey özellikleri düzleme göre değişir."
  3. "Arayüz kusur yoğunluğu aygıt performansını etkiler."
  4. "Bu yüzden (100) veya (111) gibi belirli düzlemler seçilir."
- `yanlisKavramlar`: ["Hangi düzlemden kesildiği fark etmez", "Düzlem seçimi sadece wafer şekli içindir"] · `yanlisKavramIds`: ["duzlem_neden", "duzlem_neden"]
- `idealCevap`: "Her kristal düzleminin atom yoğunluğu ve yüzey özellikleri farklıdır. Yüzeydeki arayüz kusurları aygıt performansını etkiler, bu yüzden aygıta uygun (100) veya (111) gibi belirli bir düzlem seçilir."
- `yedekSecmeli`: soru "Wafer yönü neden önemlidir?"; seçenekler: 1. "Düzleme göre yüzey ve arayüz özellikleri değişir" **DOĞRU** (neden: "Doğru. Atom yoğunluğu ve kusur yoğunluğu düzleme bağlıdır.") · 2. "Yalnızca wafer daha parlak olsun diye" yanlış (neden: "Yanlış. Parlaklık sebep değil.") · 3. "Hiç önemi yoktur" yanlış (neden: "Yanlış. Aygıt performansını etkiler.") · 4. "Atomlar düzleme göre kaybolur" yanlış (neden: "Yanlış. Atom kaybolmaz.")
- `alt`: soru "(100) ve (111) düzlemleri arasındaki fark aygıt için neden önemlidir?"

### o09 · sandik · "Sandık"
- `kart`: `{id:"miller", yil:1839, tekCumle:"Düzlemleri üç küçük tam sayıyla adlandırdı: Miller indisleri."}`
- `ozet`: ["Hücre başına atom: sc 1, bcc 2, fcc 4", "Miller: kesişim, ters, tam sayı", "(hkl) düzlem, [uvw] yön"]
- `kontrolNoktasi`: true

## Temel tur
- kart 1: "Hücre ve atom" · "Birim hücre tekrar eder. Köşe 1/8, yüz 1/2, içeri 1 sayılır."
- kart 2: "Miller adımları" · "Kesişim, ters al, tam sayı yap, (hkl) yaz."
- kart 3: "∞ ne olur?" · "Eksene paralel düzlem o ekseni ∞'da keser, indis 0."
- `sim`: modul `miller`, params `{c:[1,1,1]}`

## Tekrar havuzu
1. o03'ü kopyala (`atom_sayisi`).
2. o04'ü kopyala (`birim_hucre`).
3. o05'i `dusman`a çevir (sim ve acik at, `kusurSkin:"vakans"`).
4. **Ek soru** (kavram `miller_yon`, skin `dislokasyon`): soru "[100] yönü hangi eksene paraleldir?"; seçenekler: 1. "x ekseni" **DOĞRU** (neden: "Doğru. [100] = (1,0,0) vektörü, x yönü.") · 2. "y ekseni" yanlış (neden: "Hayır. y yönü [010].") · 3. "z ekseni" yanlış (neden: "Hayır. z yönü [001].").
