# İstasyon 09 · Bant testi (`s09`)

> **Ajan E9:** Bu dosya `oyun/src/js/90-data-s09.js` dosyasına çevrilmiştir (terim dili DIL-1: kod dosyasında `English (Türkçe)`). Kontrol: `node oyun/test/veri-dogrula.js`.
> Okunacaklar: `00`, `01` (§3), `06` (S12 `bant`: `N`, `malzeme`), bu dosya.

| Alan | Değer |
|---|---|
| `id` / `sira` | `s09` / 9 |
| `ad` / `makine` | Bant testi / Bant |
| `renk` | `#ffb02e` |
| `konu` | Periyodik yapı, enerji bantları (energy bands) |
| `sinavSorulari` | `["S7"]` |
| `sureHedefDk` | 22 |
| `patronId` | `pauli` |
| `kavramlar` | `bant_yarilma`, `pauli_dislama`, `bant_aralik`, `bant_sonsuz_kuyu`, `iletken_olasilik`, `kristal_pahali` |

Fizik özeti: N atom bir araya gelince her atomik energy level N yakın seviyeye yarılır; N büyüdükçe seviyeler energy band (enerji bandı) olur. Pauli exclusion principle (Pauli dışlama ilkesi): seviye başına 2 electron (zıt spin). Periyodik potansiyelde (Bloch teoremi) izinli bantlar ve bandgap (yasak enerji aralığı) çıkar. Yarı dolu bant = metal; dolu valence band + büyük bandgap = insulator; dolu valence band + küçük bandgap = semiconductor.

## Engeller

### o01 · hikaye · "Zaman kapısı" · Zürih · 1928 · `rivayet`: false
1. `selin`: "Bant testi: bir atomun seviyeleri var, katıda ne olur?"
2. `pauli`: "Atomlar yan yana gelince energy level yarılır. Yeter ki electron sığsın."
3. `pauli`: "Her seviyede en çok iki electron. Dolu band akım taşımaz."

### o02 · kavram · "Kavram kapısı" · `bant_yarilma`
- `gorev`: "N atom sayısını 32 yap, üç malzemeyi gez."
- `sim`: modul `bant`, params `{N:2, malzeme:"yariiletken"}`, basari `{N:32, malzemeler:3}` (sim `api.done` çıktısı: `{basari:true, olcum:{N, malzemeler}}`)
- `ogrenilen`: "N atom N seviye verir; bandgap ve doluluk malzemeyi belirler."

### o03 · dusman · `pauli_dislama` · skin `vakans`
- Soru: Pauli exclusion principle: bir energy level en çok kaç electron alır?
- **İki electron, zıt spin** (doğru) · Sınırsız electron · Yalnızca bir electron

### o04 · dusman · `bant_aralik` · skin `tane_siniri`
- Soru: Insulator neden akım taşımaz?
- **Valence band dolu, bandgap büyük** (doğru) · Atom hiç electron içermez · Conduction band yarı doludur

### o05 · tahmin · `bant_yarilma` · ağırlık 1.5
- Soru: N atom yaklaşınca her atomic energy level ne olur?
- **N yakın energy level'a yarılır** (doğru) · Tek seviye kalır · Seviye sayısı N kat azalır
- `sim`: `bant`, önceki `{N:1}`, sonraki `{N:32}`
- `acik`: "N 1'den 32'ye çıkınca tek seviye 32 çizgiye yarıldı; çizgiler band oluşturdu."

### o06 · tuzak · `bant_sonsuz_kuyu`
- `iddia`: "Tek infinite well içinde energy bands oluşur." Yanlış parça: 0.
- `duzeltme`: "Bands çok atomlu solid içinde oluşur; tek kuyuda discrete levels vardır."

### o07 · kopru · `bant_yarilma`
Doğru sıra: N atom bir araya gelir → Her energy level N seviyeye yarılır → Seviyeler birleşip energy band olur → Bandgap bantları ayırır.

### o08 · patron · "Dışlama Canavarı" · `pauli`
- `giris`: "Aynı yere iki kişi sığmaz! Elektronlar da öyle!"
- **Faz 1 · secmeli** (`bant_aralik`): metal / insulator / semiconductor farkı → **Band doluluğu ve bandgap** (yanlışlar: olasılık farkı, atom sayısı farkı). Alt soru: Bandgap nedir?
- **Faz 2 · acik · S7**: pdfSoru "Explain how energy bands form in a crystal and why materials differ as metals, insulators and semiconductors." Anahtar fikirler: N atom → N seviye → band; Pauli (seviye başına 2 electron); periyodik potansiyel/Bloch → izinli ve yasak enerji; doluluk + bandgap malzemeyi ayırır. Yanlış kavramlar: `bant_sonsuz_kuyu`, `iletken_olasilik`. Yedek seçmeli: Energy band neden oluşur?
- **Faz 3 · acik**: Pauli exclusion principle nedir, band doluluğuna etkisi. Yanlış kavramlar: `pauli_dislama`, `iletken_olasilik`. Yedek seçmeli: Pauli ne der?

### o09 · sandik
- Kart `pauli` (1925): "İki electron aynı quantum state içinde olamaz."
- Özet: N atom, N seviye, band · Seviye başına iki electron · Doluluk ve bandgap malzemeyi belirler. `kontrolNoktasi`: true.

## Temel tur
Kartlar: Level splitting · Pauli · Bandgap. Sim: `bant` `{N:8, malzeme:"yariiletken"}`.

## Tekrar havuzu
o03, o04, o05 (dusman'a çevrilmiş) ve ek sorular: `iletken_olasilik` (iletken/yalıtkan farkı), `kristal_pahali` (periodiklik öngörülebilir bant verir), `bant_sonsuz_kuyu` (bantlar nerede oluşur).
