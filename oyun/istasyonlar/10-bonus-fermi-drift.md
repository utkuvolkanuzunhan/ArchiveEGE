# İstasyon 10 · Paketleme (bonus) (`s10`)

> **Yalnızca derste işlendiyse** (Ayarlar → "Ders bu konuyu işledi"). Varsayılan gizli.
> **Ajan E10:** Bu dosyayı `oyun/src/js/90-data-s10.js` dosyasına, `01-veri-semalari.md` şemasına uygun JavaScript verisine çevir. Metinleri **aynen** kullan. Kontrol: `node oyun/test/veri-dogrula.js`.
> Okunacaklar: `00`, `01` (§3), `06` (`fermi` parametreleri: `T`, `EF`, `E`), bu dosya.

| Alan | Değer |
|---|---|
| `id` / `sira` | `s10` / 10 |
| `ad` / `makine` | Paketleme / Paketleme |
| `renk` | `#f4f0ff` |
| `konu` | Fermi fonksiyonu, Fermi seviyesi, taşıyıcı sayısı, drift |
| `sinavSorulari` | `[]` (Konu 3-4; örnek sınavda doğrudan yok) |
| `sureHedefDk` | 20 |
| `patronId` | `fermi` |
| `kavramlar` | `fermi_dagilim`, `fermi_seviye`, `tasiyici_kons`, `drift_hiz` |

## Engeller

### o01 · hikaye · "Zaman kapısı"
- `yer`: Roma · `yil`: 1926 · `rivayet`: false · `kavram`: null
- satır 1 · `selin`: "Paketleme hattı: çipe giren elektron sayısını ayarlıyoruz."
- satır 2 · `fermi`: "Elektronlar Pauli'ye uyarak seviyeleri doldurur. Dağılımını buldum."
- satır 3 · `selin`: "Sıcaklık yükselince basamak yumuşar, taşıyıcı sayısı değişir."

### o02 · kavram · "Kavram kapısı" · kavram `fermi_dagilim`
- `gorev`: "Sıcaklığı 50 K'e indir, basamağa bak."
- `sim`: modul `fermi`, params `{T:300}`, basari `{T0:true}`
- `ogrenilen`: "T = 0'da Fermi seviyesi altı dolu, üstü boş; sıcaklıkla basamak yumuşar."

### o03 · dusman · "Kusur düşmanı" · kavram `fermi_dagilim` · `kusurSkin` `vakans`
- `soru`: "E = E_F iken doluluk olasılığı f(E) kaçtır?"
- seçenekler:
  1. "½" · **DOĞRU** · neden: "Doğru. Üstel terim 1 olur: f = 1/(1+1)."
  2. "1" · yanlış · neden: "Hayır. 1 yalnızca E ≪ E_F için geçerli."
  3. "0" · yanlış · neden: "Hayır. 0 yalnızca E ≫ E_F için geçerli."

### o04 · dusman · "Kusur düşmanı" · kavram `fermi_seviye` · `kusurSkin` `tane_siniri`
- `soru`: "n-tipi yarıiletkende Fermi seviyesi nereye kayar?"
- seçenekler:
  1. "İletim bandına yaklaşır" · **DOĞRU** · neden: "Doğru. Fazla elektron E_F'yi yukarı iter."
  2. "Değerlik bandına yaklaşır" · yanlış · neden: "Hayır. Bu p-tipinde olur."
  3. "Aralığın tam ortasında kalır" · yanlış · neden: "Hayır. Katkı E_F'yi kaydırır."

### o05 · tahmin · "Tahmin çukuru" · kavram `drift_hiz` · agirlik 1.5
- `soru`: "Elektrik alanı iki katına çıkarsa (μ sabit) drift hızı ne olur?"
- seçenekler:
  1. "İki katına çıkar" · **DOĞRU** · neden: "Doğru. v_d = μE."
  2. "Aynı kalır" · yanlış · neden: "Yanlış. Drift hızı alanla orantılıdır."
  3. "Yarıya iner" · yanlış · neden: "Yanlış. Alan arttıkça hız artar."
- `sim`: modul `fermi`, onceki `{T:300, E:1}`, sonraki `{T:300, E:2}`
- `acik`: "E 1'den 2'ye çıkınca v_d iki katına çıktı: v_d = μE."

### o06 · tuzak · "Yanılgı tuzağı" · kavram `fermi_dagilim`
- `iddia`: "Mutlak sıfırda Fermi seviyesinin üstündeki seviyeler doludur."
- `parcalar`: ["Mutlak sıfırda", "Fermi seviyesinin üstündeki seviyeler", "doludur."]
- `yanlisParca`: 2
- `duzeltme`: "T = 0'da E_F üstündeki seviyeler boştur, altındakiler doludur."

### o07 · kopru · "Mantık köprüsü" · kavram `tasiyici_kons`
- `soru`: "Taşıyıcı sayısı zincirini sıraya diz"
- `bloklar` (doğru sırada): ["Fermi-Dirac f(E) doluluk olasılığını verir", "E = E_F'de f = ½", "Yüksek sıcaklık basamağı yumuşatır", "Taşıyıcı sayısı f ve durum yoğunluğundan çıkar"]
- `sonuc`: "Doluluk olasılığı, yumuşayan basamak, durum yoğunluğuyla çarpım: taşıyıcı sayısı."

### o08 · patron · "Fermi Canavarı"
- `canavar`: `fermi` · `canavarAd`: "Fermi Canavarı"
- `giris`: "Basamak benim! Sıcaklık yükselince yumuşarım."

**Faz 1 · secmeli** · kavram `fermi_dagilim`
- `soru`: "T = 0 K'de Fermi seviyesinin altındaki seviyeler nasıldır?"
- seçenekler:
  1. "Hepsi dolu" · **DOĞRU** · neden: "Doğru. Elektronlar en düşük seviyelerden doldurur."
  2. "Hepsi boş" · yanlış · neden: "Hayır. Boş olanlar E_F'nin üstündedir."
  3. "Yarı dolu" · yanlış · neden: "Hayır. Yarı doluluk E_F'de f = ½ olduğu içindir."
- `alt`: soru "Sıcaklık artınca f(E) basamağı ne olur?"; seçenekler: 1. "Yumuşar" **DOĞRU** (neden: "Doğru. kT büyüdükçe geçiş genişler.") · 2. "Daha keskin olur" yanlış (neden: "Hayır. Sıcaklık arttıkça basamak yayılır.") · 3. "Kaybolur" yanlış (neden: "Hayır. Basamak yumuşar, kaybolmaz.")

**Faz 2 · acik**
- `pdfSoru`: null
- `soru`: "Fermi fonksiyonu ve Fermi seviyesi neyi anlatır?"
- `anahtarFikirler`:
  1. "f(E), E enerjili durumun elektronla dolu olma olasılığıdır."
  2. "E = E_F'de f = ½."
  3. "T = 0'da basamaktır; sıcaklıkla yumuşar."
  4. "Katkılama E_F'yi bant aralığı içinde kaydırır."
- `yanlisKavramlar`: ["Fermi seviyesi her zaman bant aralığının ortasındadır", "f(E) elektron sayısıdır"] · `yanlisKavramIds`: ["fermi_seviye", "fermi_dagilim"]
- `idealCevap`: "Fermi fonksiyonu f(E), E enerjili bir durumun elektronla dolu olma olasılığıdır. E = E_F'de f = ½'dir. T = 0'da basamak biçimindedir, sıcaklık arttıkça yumuşar. Katkılama Fermi seviyesini bant aralığı içinde kaydırır."
- `yedekSecmeli`: soru "Fermi fonksiyonu neyi verir?"; seçenekler: 1. "Bir durumun dolu olma olasılığını" **DOĞRU** (neden: "Doğru. 0 ile 1 arasında bir olasılık.") · 2. "Elektron sayısını" yanlış (neden: "Yanlış. f bir olasılıktır, sayı değil.") · 3. "Enerji aralığını" yanlış (neden: "Yanlış. Aralık bant yapısından gelir.") · 4. "Hızı" yanlış (neden: "Yanlış. Hızla ilgisi yok.")
- `alt`: soru "E_F'de doluluk olasılığı neden ½'dir?"

**Faz 3 · acik**
- `pdfSoru`: null
- `soru`: "Drift hareketi nedir? Drift hızı neye bağlıdır?"
- `anahtarFikirler`:
  1. "Elektrik alanında taşıyıcıların ortalama yönlü hareketi."
  2. "v_d = μE: alanla orantılı."
  3. "Saçılma (fonon, safsızlık) hareketliliği sınırlar."
  4. "Akım yoğunluğu J = q(nμₙ + pμₚ)E."
- `yanlisKavramlar`: ["Taşıyıcılar alanda saçılmadan sürekli hızlanır", "Drift hızı alandan bağımsızdır"] · `yanlisKavramIds`: ["drift_hiz", "drift_hiz"]
- `idealCevap`: "Drift, elektrik alanı altında taşıyıcıların ortalama yönlü hareketidir. Drift hızı alanla orantılıdır: v_d = μE. Saçılma (fonon, safsızlık) hareketliliği μ'yü sınırlar. Akım yoğunluğu J = q(nμₙ + pμₚ)E'dir."
- `yedekSecmeli`: soru "Drift hızı neye bağlıdır?"; seçenekler: 1. "Elektrik alanı ve hareketliliğe (v_d = μE)" **DOĞRU** (neden: "Doğru. Alan arttıkça hız artar.") · 2. "Yalnızca sıcaklığa" yanlış (neden: "Yanlış. Sıcaklık μ'yü etkiler ama asıl bağımlılık alandır.") · 3. "Atom kütlesine yalnızca" yanlış (neden: "Yanlış. Kütle dolaylı etki eder.") · 4. "Hiçbir şeye" yanlış (neden: "Yanlış. Alanla orantılıdır.")
- `alt`: soru "Saçılma, drift hızını nasıl sınırlar?"

### o09 · sandik · "Sandık"
- `kart`: `{id:"fermi", yil:1926, tekCumle:"Elektronların enerji seviyelerini nasıl doldurduğunu (Fermi-Dirac) buldu."}`
- `ozet`: ["f(E) doluluk olasılığıdır, E_F'de ½", "T = 0'da basamak, sıcaklıkla yumuşar", "Drift: v_d = μE"]
- `kontrolNoktasi`: true

## Temel tur
- kart 1: "Fermi fonksiyonu" · "f(E), bir durumun dolu olma olasılığıdır."
- kart 2: "Sıcaklık" · "T = 0'da basamak; sıcaklık basamağı yumuşatır."
- kart 3: "Drift" · "Elektrik alanı taşıyıcıları sürükler: v_d = μE."
- `sim`: modul `fermi`, params `{T:300}`

## Tekrar havuzu
1. o03'ü kopyala (`fermi_dagilim`).
2. o04'ü kopyala (`fermi_seviye`).
3. o05'i `dusman`a çevir (sim ve acik at, `kusurSkin:"vakans"`).
4. **Ek soru** (kavram `tasiyici_kons`, skin `safsizlik`): soru "n-tipi katkı taşıyıcı sayısını nasıl değiştirir?"; seçenekler: 1. "Elektron sayısını artırır, E_F iletim bandına yaklaşır" **DOĞRU** (neden: "Doğru. Verici atomlar elektron ekler.") · 2. "Elektron sayısını azaltır" yanlış (neden: "Hayır. n-tipi fazla elektron demektir.") · 3. "Hiçbir şeyi değiştirmez" yanlış (neden: "Hayır. Katkı taşıyıcı sayısını belirler.").
