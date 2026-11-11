# 06 · Simülasyon Modülleri (Paketler S1-S12)

> Her simülasyon **ayrı bir ajanın ayrı bir dosyasıdır**: `src/js/70-sim-<modul>.js`.
> Önce oku: `00`, `01` (özellikle §5.2), `05` (renk tokenları). Referans: `oyun/referans/common.js` (kuyu simülasyonu ve çizim yöntemleri).
> Her modül `Q.sim.register("<modul>", { mount(host, params, api){...} })` çağırır. **Başka şey yapmaz.**

## `params` anahtarları (istasyon verisi bu adları kullanır; aynen uygula)

| Modül | `params` anahtarları |
|---|---|
| `kristal_tur` | `mod` (`"tur"` / `"serbest_yol"`), `gonder` (bool: açılışta elektronları otomatik gönder) |
| `czochralski` | `v` (mm/dk), `rpm` |
| `kafes` | `tur` (`"sc"` / `"bcc"` / `"fcc"` / `"elmas"`) |
| `miller` | `c` (`[a,b,c]`, her biri `1`, `2`, `3` veya `"inf"`; varsayılan `[1,1,1]`), `mod` (`"duzlem"` varsayılan / `"yon"`), `hedef` |
| `karacisim` | `T` (K) |
| `fotoelektrik` | `f` (×10¹⁴ Hz), `I` (1-10), `metal` (`"Cs"` / `"Na"` / `"Zn"`) |
| `bohr` | `n`, `m` (1-6), `altinaDene` (bool: n=1'in altına inmeyi dene animasyonu) |
| `kuyu` | `L` (nm), `n` (1-4), `mod` (`"kuyu"` / `"tel"`) |
| `basamak` | `mod` (`"basamak"` / `"bariyer"`), `E` (eV), `V0` (eV), `a` (nm) |
| `olcum` | `c1sq` (0-1), `olcTekrar` (bool: açılışta ölç + tekrar ölç göster) |
| `belirsizlik` | `sx` (0.5-5 nm) |
| `bant` | `N`, `malzeme` (`"iletken"` / `"yalitkan"` / `"yariiletken"`) |
| `fermi` | `T` (K), `EF`, `E` (elektrik alanı) |

Tahmin engelinde `sim.sonraki` verildiğinde modül `set(params)` ile bu anahtarları **animasyonla** (≈1 sn) yeni değerlere getirir.

## Ortak kurallar (hepsi için)

1. `host` boş bir `div`. İçine **tek bir canvas** ve altına en fazla **3 kontrol** (slider/düğme) koyarsın. Kontrol etiketleri ≤ 3 kelime. Açıklama metni yok; yalnızca `api.hint()` ile tek satır ipucu.
2. Canvas genişliği `host` genişliği, yüksekliği `clamp(180px, 22vh, 260px)`. `ResizeObserver` ile yeniden çizer.
3. Renkler `05` tokenlarından `getComputedStyle` ile okunur (`--sky --cyan --magenta --yellow --lime --ink --muted`).
4. Kontroller büyük (min 40 px yükseklik), klavyeyle kullanılabilir (`input type=range` + `button`).
5. `params.basari` doğruysa `api.done({basari:true, olcum})` **bir kez** çağrılır, sonrası kontroller açık kalır. `basari` tanımsızsa (temel tur gibi) `done` çağrılmaz.
6. Başlangıç durumu `params.baslangic` ile gelir, yoksa her modülün varsayılanı kullanılır. Yüklenir yüklenmez grafik **dolu** görünür.
7. `destroy()` dinleyicileri, `ResizeObserver`'ı, `requestAnimationFrame` ve `setTimeout`'ları temizler.
8. Fiziksel formüller **doğru** olmalı. Basitleştirme varsa kontrol altına küçük "oyun modeli" yazısı konur (≤ 3 kelime).
9. Her modül için `oyun/test/sim-<modul>.html` basit bir test sayfası yazılır (modülü tek başına açar). Playwright ile ekran görüntüsü alıp kontrol edilir.
10. Ses yok, harici kütüphane yok.

---

## S1 · `kristal_tur` — Katı türleri ve saçılma

**Amaç:** Tek kristal, çok kristalli, amorf farkını ve elektronun serbest yolunu görmek.
**Çizim:** Üç yan yana kutu (veya mod ile tek kutu): (a) tek kristal: düzgün atom ızgarası; (b) çok kristalli: 4-5 farklı yönde dönmüş ızgara parçası ve aralarında **tane sınırı** çizgileri; (c) amorf: düzensiz noktalar.
**Parametreler:** `params.mod = "tur" | "serbest_yol"`. Başlangıç `tur`.
**Kontroller:** `tur` modunda üç düğme: `Tek`, `Çok`, `Amorf`: seçilen kutuya bir **elektron** (parlak top) soldan girer, sağa gider; atomlarla (tane sınırı ve amorf yerlerde daha sık) saçılır (yön değişimi). `serbest_yol` modunda 2 kutu yan yana (tek/çok), "Gönder" düğmesi, 30 elektron aynı anda.
**Model:** her adımda saçılma olasılığı `p_tek = 0.01`, `p_tane_sinir_gecisi = 0.5`, `p_amorf = 0.12`. Ölçülen "ortalama serbest yol" (iki saçılma arası ortalama adım) ekranda sayı olarak gösterilir: tek ≫ çok > amorf (oyun modeli, nicel değil).
**Başarı (`params.basari`):** `{ "hepsiniDene": true }` → üç türü de en az bir kez denediyse; veya `{ "kiyas": true }` → `serbest_yol` modunda gönderip tek kristalin serbest yolu çok kristalliden büyük görüldüyse.
**Dönen `olcum`:** `{tek, cok, amorf}` serbest yol değerleri.

## S2 · `czochralski` — Kristal çekme

**Amaç:** CZ'de tohumun eriyikten yavaşça çekilip döndürülmesi.
**Çizim:** Kroze (turuncu eriyik), üstte tohum kristal ve yükselen külçe (silindir), yan kesit.
**Kontroller:** `Çekme hızı` slider (0.2-2.0 mm/dk), `Dönme` slider (0-30 devir/dk), `Çek` düğmesi (animasyon başlatır).
**Model (oyun modeli, etiket göster):** külçenin kalitesi `Q = 1 − 0.6·max(0, v−1.0) − 0.3·|dönme−15|/15`. `Q ≥ 0.9` → külçe düz, tek renk (tek kristal). `Q < 0.9` → külçede tane sınırı çizgileri ve çatlaklar görünür (çok kristalli). Sonuç kutusu: `Tek kristal ✓` veya `Tane sınırı ✗`.
**Başarı:** `{ "tekKristal": true }` → `Q ≥ 0.9` ile bir külçe tamamlandı.
**Dönen `olcum`:** `{v, rpm, Q}`.

## S3 · `kafes` — Kafes türleri ve atom sayımı

**Amaç:** sc / bcc / fcc / elmas hücresi ve hücre başına atom.
**Çizim:** İzometrik küp, atomlar renkli toplar; köşe atomu %12.5, yüz atomu %50, gövde içi %100 görünür (yarı saydam dilim).
**Kontroller:** 4 düğme: `sc`, `bcc`, `fcc`, `elmas`. Altında "Hücre başına atom: __" sayacı (her tür için doğru sayı) ve `Say` modu: kullanıcı sayıyı `−/+` ile girer, `Kontrol` düğmesi.
**Doğrular:** sc 1, bcc 2, fcc 4, elmas **8** (fcc + 4 gövde içi atom). Elmasta her atomun **4 komşusu** (tetrahedral) ayrıca belirtilir. Doluluk (bilgi etiketi): sc %52, bcc %68, fcc %74, elmas %34.
**Başarı:** `{ "say": {"tur":"fcc","atom":4} }` → kullanıcı doğru sayıyı girince.

## S4 · `miller` — Miller indisleri (düzlem ve yön)

**Amaç:** Kesişimden (hkl) bulmak, yönü [uvw] yazmak.
**Çizim:** `oyun/referans/common.js`'teki izometrik küp ve düzlem çizimini **olduğu gibi al** ve genişlet (bölüm Miller önizlemesi: `drawCell`, `hkl`).
**Kontroller:** 3 eksen için `1 / 2 / 3 / ∞` düğmeleri (referanstaki gibi). `mod:"yon"` ise vektör (u,v,w) için üç `−2..2` seçici ve çizimde başlangıçtan vektöre bir ok.
**Gösterge:** 4 adım şeridi: `Kesişim → Ters → Tam sayı → Sonuç` (referanstaki gibi). `d = a / √(h²+k²+l²)` küçük satırda.
**Başarı:** `{ "hedef": "(110)" }` → seçimler hedefe eşit olunca `done`. `mod:"yon"` için `{ "hedefYon": "[111]" }`.
**Formüller:** kesişimler için `1/c`, kesirleri EKOK ile temizle, ortak bölenleri sadeleştir; ∞ → 0.

## S5 · `karacisim` — Kara cisim ışıması

**Amaç:** Klasik teori (Rayleigh-Jeans) sonsuza gider, Planck gitmez.
**Çizim:** x ekseni dalga boyu (100-3000 nm), y yoğunluk (normalize). İki eğri: `Klasik (RJ)` kırmızı kesik çizgi (patlar), `Planck` cyan düz çizgi. Sağ üstte seçilen sıcaklığın **renk örneği**.
**Kontroller:** `Sıcaklık` slider (2000-7000 K, adım 100), `Klasik eğriyi göster` anahtarı.
**Formüller:** Planck `B(λ,T) = (2hc²/λ⁵) / (exp(hc/(λ k T)) − 1)`; RJ `B = 2ckT/λ⁴`. Sabitler SI. Normalize et: Planck tepe değeri 1. Wien: `λmax = 2.898×10⁻³ m·K / T`; ekranda `λmax = ___ nm` göster.
**Başarı:** `{ "T": [4900, 5100], "klasikGoster": true }` → sıcaklık aralıkta ve klasik eğri açıkken (yani karşılaştırıp görmüş).

## S6 · `fotoelektrik` — Fotoelektrik olay

**Amaç:** Eşik frekans; şiddet foton sayısıdır, enerji değil.
**Çizim:** Solda ışık kaynağı, ortada metal plaka, sağda toplanan elektronlar; fotonlar küçük sarı noktalar, elektronlar cyan toplar. Altında iki gösterge: `Elektron sayısı/sn` ve `Kinetik enerji (eV)`.
**Kontroller:** `Frekans` slider (1.0-10.0 ×10¹⁴ Hz), `Şiddet` slider (1-10), `Metal` seçici (`Cs 2.1 eV`, `Na 2.3 eV`, `Zn 4.3 eV`).
**Formüller:** `E_foton = h f` (h = 4.136×10⁻¹⁵ eV·s). Eşik `f0 = φ / h`. `hf < φ` → elektron yok (sayı 0). `hf ≥ φ` → `K = hf − φ`, elektron sayısı ∝ şiddet.
**Başarı:** `{ "esikAlti": true, "siddet": 10 }` → `hf<φ` iken şiddet 10'a getirilince ve sayı 0 görününce. Alternatif `{ "kinetik": [0.5, 0.7] }` → K aralıkta.

## S7 · `bohr` — Hidrojen seviyeleri ve madde dalgası

**Amaç:** Ayrık seviyeler, en alt seviye (n=1) altı yok, durağan dalga.
**Çizim:** Sol yarı: enerji merdiveni `En = −13.6/n² eV` (n=1..6), seçili geçiş oku. Sağ yarı: çekirdek çevresinde çember yörünge, üzerinde sinüs dalgası; dalga tam sayı sığıyorsa parlak, sığmıyorsa kesik.
**Kontroller:** `Başlangıç n` ve `Bitiş m` seçicileri (1-6), `Foton` düğmesi. "Altına in" denemesi: `m=0` yok, düğme "n=1: en alt" uyarısı (toast).
**Formüller:** `ΔE = 13.6·|1/m² − 1/n²|`, `λ = 1240/ΔE nm`, renge çevir. Yörünge koşulu `2πr = nλ` (görsel: n tam sayı dalga).
**Başarı:** `{ "gecis": [3,2] }` → n=3→2 seçilince (656 nm, kırmızı) veya `{ "enAlt": true }` → kullanıcı n=1'in altına inmeyi denedi.

## S8 · `kuyu` — Sonsuz potansiyel kuyusu

**Amaç:** Sınır koşulu → duran dalga → kuantalaşma → sıfır noktası enerjisi.
**Çizim:** `oyun/referans/common.js` `drawWell` temel alınır: iki duvar, ψ (cyan), |ψ|² (macenta dolgu), L kaydırıldıkça kuyu genişliği görsel olarak değişir. **Ek:** sağ yan şerit enerji merdiveni (n=1..4), seçili n parlak. **Ek mod `tel`:** aynı çizim "gitar teli" olarak (iki ucu sabit tel, aynı n dalgası).
**Kontroller:** `Kuyu genişliği L` (1-10 nm, adım 0.5), `Seviye n` (1-4), `Tel ↔ Kuyu` anahtarı. `n=0` düğmesi yok ama bir "n = 0 dene" düğmesi var: basınca dalga **düz çizgiye** iner ve "Dalga yok → parçacık yok" yazar (≤ 5 kelime).
**Formüller:** `ψn = √(2/L) sin(nπx/L)`, `En = n²π²ħ²/(2mL²) ≈ 0.376·n²/L² eV` (L nm). Ekranda `E₁ = ... meV/eV`.
**Başarı seçenekleri:** `{ "L": 1, "n": 1 }` ; `{ "n0Dene": true }` ; `{ "yariya": true }` → kullanıcı L'yi 2'den 1'e indirip E₁'in 4 katına çıktığını gördü.

## S9 · `basamak` — Basamak potansiyeli ve tünelleme

**Amaç:** E>V₀ iken bile yansıma var; E<V₀ iken ψ sönümlenir; ince bariyerde tünelleme.
**Çizim:** Üstte potansiyel profili (basamak veya bariyer), altta |ψ|² veya Re(ψ). `mod:"basamak"` veya `mod:"bariyer"`.
**Kontroller:** `Enerji E` (eV), `Basamak/Bariyer V₀` (sabit veya slider), `Bariyer kalınlığı a` (nm, yalnızca `bariyer` modunda).
**Formüller (basamak):** `k1 = √(2mE)/ħ`, `E>V₀`: `k2 = √(2m(E−V₀))/ħ`, `R = ((k1−k2)/(k1+k2))²`, `T = 1−R`. `E<V₀`: `R = 1`, bölge 2'de `ψ ∝ e^(−κx)`, `κ = √(2m(V₀−E))/ħ`.
**Formül (bariyer):** `T ≈ 16·(E/V₀)(1−E/V₀)·e^(−2κa)` (κa ≫ 1). Ekranda `T = ...` ve `R = 1−T`; logaritmik küçük çubuk.
**Başarı:** `{ "R": [0.1, 0.2] }` ; `{ "tunel": true, "T": [1e-3, 1] }` ; `{ "kalinlasti": true }` → kalınlığı artırınca T'nin azaldığı görüldü.

## S10 · `olcum` — Süperpozisyon, ölçüm, çökme

**Amaç:** Ölçüm olasılıkla bir özdeğer verir; ölçümden sonra ψ o özdurumdadır; tekrar ölçüm aynı sonucu verir; ölçümler arasında evrim belirlenimcidir.
**Çizim:** İki çubuk (özdurum 1 ve 2) yükseklikleri `|c₁|²` ve `|c₂|²`; yanlarında dönen faz okları (Schrödinger evrimi, `e^(−iEt/ħ)`). Altta sonuç şeridi: son 20 ölçüm sonucu (renkli kareler) ve yığılma histogramı.
**Kontroller:** `c₁²` slider (0..1, `c₂² = 1 − c₁²`), `Ölç` düğmesi, `Tekrar ölç` düğmesi, `100 kez` düğmesi (yeni hazırlanmış durumla 100 ölçüm).
**Model:** `Ölç` → rastgele `r<c₁²` ise sonuç 1 (çubuk 1 = 1, diğeri 0, "ÇÖKTÜ" etiketi). Çökmüş durumda `Tekrar ölç` aynı sonucu verir. `Yeniden hazırla` ψ'yi başlangıç süperpozisyonuna döndürür. Evrim animasyonunda faz okları yumuşakça döner (belirlenimci), **çubuklar sabit**.
**Başarı:** `{ "tekrarAyni": true }` → çöktükten sonra tekrar ölçtü ve aynı sonuçları gördü; veya `{ "yuz": true }` → 100 ölçüm yaptı.

## S11 · `belirsizlik` — Dalga paketi ve belirsizlik

**Amaç:** Konum keskinleşirse momentum yayılır (dalga doğası).
**Çizim:** Üst grafik: konum uzayında Gauss dalga paketi `|ψ(x)|²`, `σx`. Alt grafik: momentum uzayında `|φ(p)|²`, `σp = ħ/(2σx)`. Her iki genişlik çubukla işaretli.
**Kontroller:** `Konum genişliği σx` (0.5-5, birim nm), `Eşlenik göster` anahtarı.
**Formül:** `σp = ħ/(2σx)`, `σx·σp = ħ/2` (en küçük). Çarpım göstergesi her zaman **ħ/2'ye eşit** (Gauss için). Not: "Alet kusuru değil" etiketi (≤ 5 kelime) alt köşede.
**Başarı:** `{ "dar": true }` → σx ≤ 1.0 yapınca ve σp genişlemesini gördü.

## S12 · `bant` — Atomdan banda

**Amaç:** N atom, her seviyeden N yakın seviye; Pauli; iletken/yalıtkan/yarıiletken.
**Çizim:** Sol: tek atomun 2 seviyesi (3s benzeri ve 3p benzeri iki çizgi). Atom sayısı N arttıkça (slider) her seviye N çizgiye yarılır (yelpaze), sağda N büyüyünce çizgiler sürekli **banda** birleşir. Altta iki bant arası **bant aralığı**.
**Kontroller:** `Atom sayısı N` (1, 2, 4, 8, 16, 32, 64), `Elektron doldur` düğmesi (Pauli: her seviyeye 2 elektron, enerji sırasıyla), `Malzeme` seçici (`İletken` bant yarı dolu, `Yalıtkan` büyük aralık, `Yarıiletken` küçük aralık).
**Model:** Seviye genişliği N'den bağımsız sabit `W`; çizgi sayısı N; aralık `Eg` (İletken 0, Yarıiletken 1.1 eV, Yalıtkan 5 eV).
**Başarı:** `{ "N": 32, "malzemeler": 3 }` → N≥32 yapıp üç malzemeyi de gezdi. 

---

## S13 (bonus) · `fermi` — Fermi fonksiyonu, taşıyıcı ve drift
Yalnızca istasyon 10 için.
**Çizim:** Üstte `f(E) = 1/(1+e^((E−E_F)/kT))` eğrisi (E_F dikey çizgisi), altta enerji bant diyagramı ve elektron/delik sayıları. **Kontroller:** `Sıcaklık T` (50-600 K), `E_F konumu` (bant aralığı içinde), `Elektrik alanı E` (drift, `v_d = μE`). **Gösterge:** `f(E_F)=½`, `n`, `p`, `np = nᵢ²` (log ölçek). **Başarı:** `{ "T0": true }` → T=50 K'de basamak biçimi görüldü.
