# İstasyon 10 · Paketleme (bonus) (`s10`)

> **Ajan E10:** Bu dosya `oyun/src/js/90-data-s10.js` dosyasına çevrilmiştir (terim dili DIL-1: kod dosyasında `English (Türkçe)`). Kontrol: `node oyun/test/veri-dogrula.js`.
> Yalnızca Ayarlar'da "Ders bu konuyu işledi (İstasyon 10)" açıksa ve s09 tamamsa görünür. Kaynak: `kuantum-calisma-plani.md` Blok 7. Kavramsal ağırlık, işlem az.

| Alan | Değer |
|---|---|
| `id` / `sira` | `s10` / 10 |
| `ad` / `makine` | Paketleme (bonus) / Paketleme |
| `renk` | `#7be0a4` |
| `konu` | Carriers (taşıyıcılar), Fermi level (Fermi seviyesi), drift (sürüklenme) |
| `sinavSorulari` | `[]` (PDF'te doğrudan soru yok) |
| `sureHedefDk` | 18 |
| `patronId` | `fermi` |
| `kavramlar` | `fermi_dagilim`, `fermi_seviye`, `tasiyici_np`, `drift_hiz`, `fermi_hep_dolu` (yanlış), `drift_ivme` (yanlış) |

Fizik özeti: Fermi-Dirac f(E) = 1/(1+e^((E−E_F)/kT)); f(E_F) = 1/2; T = 0 K'de basamak, T arttıkça geçiş bölgesi genişler. Dengede np = nᵢ² (katkıyla n artarsa p azalır). Drift: v_d = μE, J = q(nμₙ + pμₚ)E.

Kavram tanıtımı: o01 hikâyesi (Roma 1926 Fermi; 1947 Bardeen-Brattain transistörü) Fermi level, carrier ve drift'i soru sorulmadan önce tanıtır; o02 kapısı sim ile pekiştirir.

## Engeller

### o01 · hikaye · "Zaman kapısı" · Roma · 1926
1. `selin`: Fermi level E_F, doluluk olasılığının yarı olduğu energy değeridir.
2. `fermi`: Taşıyıcılar electron (n) ve hole (p); sıcaklıkla f(E) yumuşar, carrier artar.
3. `fermi`: Alan E altında v_d = μE ile drift; 1947'de Bardeen ve Brattain ilk transistor'u yaptı.

### o02 · kavram · `fermi_dagilim`
- `gorev`: T'yi 50 K'e indir; Fermi eğrisinin basamağa dönüşünü gör.
- `sim`: modul `fermi`, params `{T:300, E:0}`, basari `{T0:true}`.

### o03 · dusman · `fermi_seviye` · skin `bant_bosluk`
f(E_F) kaçtır? **1/2** · 1 · 0

### o04 · dusman · `tasiyici_np` · skin `safsizlik`
Dengede np = nᵢ²; n artarsa p? **p azalır, çarpım sabit** · p de artar · p değişmez

### o05 · tahmin · `fermi_dagilim` · ağırlık 1.5
300 K → 50 K: f(E) eğrisi? **Dikleşir, basamağa yaklaşır** · Daha da yumuşar · E_F kaybolur. `sim`: `fermi`, önceki `{T:300}`, sonraki `{T:50}`.

### o06 · tuzak · `fermi_hep_dolu`
`iddia`: "Fermi function için f(E_F) her sıcaklıkta 1 değerini alır." Yanlış parça: 2. Düzeltme: T > 0 için f(E_F) = 1/2; basamak yalnızca T = 0 K'de.

### o07 · kopru · `drift_hiz`
Doğru sıra: Electric field E uygulanır → Carrier ortalama v_d = μE kazanır → Hareketli n ve p yük taşır → J = q(nμₙ + pμₚ)E olur.

### o08 · patron · "Fermi (Fermi) Canavarı" · `fermi`
- `giris`: "Seviyeleri ben doldururum! Sıcaklık yükselirse sınırım bulanır!"
- **Faz 1 · secmeli** (`fermi_dagilim`): T = 0 K'de f(E)? → **E_F altında 1, üstünde 0**. Alt: Fermi level nedir?
- **Faz 2 · acik**: Fermi-Dirac dağılımını belirt, T artınca f(E) nasıl değişir. Yanlış kavramlar: `fermi_hep_dolu`, `fermi_dagilim`. Yedek seçmeli: T artınca eğri?
- **Faz 3 · acik**: v_d, J ifadeleri ve np = nᵢ². Yanlış kavramlar: `drift_ivme`, `tasiyici_np`. Yedek seçmeli: J neye bağlı?

### o09 · sandik
Kart `fermi` (1926). Özet: f(E_F) = 1/2, T = 0'da basamak · np = nᵢ² · v_d = μE, J = q(nμₙ + pμₚ)E. `kontrolNoktasi`: true.

## Temel tur
Kartlar: Fermi level · Carriers · Drift. Sim: `fermi` `{T:300}`.

## Tekrar havuzu
o03, o04, o05 (dusman'a çevrilmiş) ve ek sorular: `drift_hiz` (E ikiye katlanırsa v_d), `fermi_hep_dolu` (T > 0 iken f(E_F)), `drift_ivme` (hız neden sürekli artmaz).
