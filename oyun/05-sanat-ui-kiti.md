# 05 · Sanat ve Arayüz Kiti (Paketler A4 ve A5)

> **A4** = arayüz/CSS/HTML iskeleti. **A5** = canvas/SVG çizim (karakterler, koşucu, engeller, dünya).
> Önce oku: `00`, `01`. Referans uygulama: `oyun/referans/` (önizleme kaynakları; canavar üretici `common.js` içinde, CSS değişkenleri `common.css` ve `neon.css`/`comic.css`'de). **Referansı kopyala, uyarla, genişlet. Sıfırdan yazma.**

## 1. Stil: "Neon Çizgi Roman"

Çizgi roman iskeleti + neon parıltı. Ana fikir: **koyu mor-lacivert sayfa, üzerinde mürekkep çizgili, düz renk dolgulu çizgi roman öğeleri; parıltı sadece enerji taşıyan şeylerde.**

### 1.1 CSS değişkenleri (`00-tokens.css`) — AYNEN

```css
:root{
  /* zemin ve yüzeyler */
  --bg:#0e0724;           --bg2:#1a0f3d;
  --panel:#1a0f3d;        --panel2:#25164f;
  --ink:#ffffff;          --ink-dark:#0b0620;       /* metin ve mürekkep */
  --muted:#c4b9ec;                                   /* ikincil metin (kontrast >= 4.5:1 panel üstünde) */
  --line:#f4f0ff;                                    /* panel çerçevesi (açık) */
  /* vurgu renkleri (CMYK esinli) */
  --yellow:#ffd23f; --cyan:#00e5ff; --magenta:#ff3df0; --lime:#39ff88; --red:#ff4d6d; --blue:#3a5bff;
  --accent:var(--yellow);        --accent2:var(--cyan);     --accent-ink:#0b0620;
  --good:var(--lime);            --bad:var(--red);
  /* durum */
  --sel:#0a3a52;  --sel-ink:#ffffff;
  --track:#0b0620;
  /* balon */
  --bubble:#ffffff; --bubble-ink:#0b0620; --bubble-line:#0b0620; --bubble-shadow:#00e5ff;
  /* biçim */
  --bw:3px; --r:10px; --rs:8px;
  --shadow:6px 6px 0 var(--magenta);         /* sert ofset gölge */
  --shadow-sm:4px 4px 0 var(--ink-dark);
  --glow-cyan:0 0 14px rgba(0,229,255,.65);
  --glow-magenta:0 0 14px rgba(255,61,240,.6);
  --glow-lime:0 0 12px rgba(57,255,136,.6);
  /* yazı */
  --font-d:'Lilita One','Impact','Arial Black',sans-serif;
  --font-b:'Nunito','Trebuchet MS',system-ui,sans-serif;
  --fs-body:17px; --fs-small:14px;           /* 14px altına inme */
  /* canvas/sim */
  --sky:#120a30; --ground:#00e5ff; --grid:rgba(255,61,240,.22); --runner:#ffd23f; --foe:#ff3df0;
  /* canavar çizimi */
  --m-line:#0b0620; --m-line2:#0b0620; --m-lw:5; --m-lw2:3; --m-lws:3.5;
  --m-aura:rgba(0,229,255,.10); --m-auraline:#00e5ff; --m-dash:5 7;
  --m-ray:#ffd23f; --m-rayl:#0b0620; --m-body:#3a5bff; --m-collar:#ffffff;
  --m-hair:#f4f4f4; --m-skin:#ffc99b; --m-eye:#ffffff; --m-pupil:#0b0620;
  --m-mous:#9aa0ad; --m-mouth:#b3122a; --m-acc:#00e5ff; --m-label:#ffffff;
  color-scheme:dark;
}
```
Tek bilinçli koyu görünüm (açık tema yok).

### 1.2 Yazı tipleri
`<link>` ile Google Fonts: `Lilita One` ve `Nunito:wght@600;800`. Türkçe karakterler için `font-d` yığınında `Impact, Arial Black` yedekleri kalır. Başlık metinleri en fazla 40 karakter.

### 1.3 Kurallar (neon'dan alınanlar ve çizgi romandan alınanlar)

**Çizgi romandan:**
- Çerçeveler `--bw` (3px) kalınlığında. Paneller `--line` (açık) çerçeve + `--shadow` (macenta ofset gölge). Vurgulu panel: gölge `var(--cyan)`.
- Birincil düğme: `--yellow` dolgu, `--ink-dark` metin, 3px `--ink-dark` çerçeve, `box-shadow: 4px 4px 0 var(--magenta)`. Basılınca `transform: translate(2px,2px)` ve gölge `2px 2px 0`.
- İkincil düğme: `--panel2` dolgu, `--line` çerçeve, metin `--ink`.
- Konuşma balonu: beyaz dolgu, `--ink-dark` metin ve çerçeve (3px), kuyruk, `box-shadow: 4px 4px 0 var(--cyan)`.
- Arka planda **halftone**: `body` üzerinde `radial-gradient(rgba(0,229,255,.16) 22%, transparent 24%)` 14px ızgara + ikinci katman macenta `rgba(255,61,240,.12)` 22px ızgara, 7px kaydırmalı.
- Hasar sayıları ve etiketler: `Lilita One` 64px, **beyaz dolgu, 4px koyu kontur** (`-webkit-text-stroke:4px var(--ink-dark); paint-order:stroke fill`), patlama (starburst) SVG'sinin üzerinde: "BAM!", "ZAP!", "KRİTİK!", "AUCH!".
- Başlıklar `Lilita One`, hafif eğik (`rotate(-1deg)`), koyu kontur.

**Neon'dan:**
- Zemin koyu mor-lacivert.
- **Parıltı yalnızca** şunlarda: voltaj çubuğu, canavar aurası/çevresi (`filter: drop-shadow`), seçili seçenek, aktif engelin konturu, yol zemin çizgisi, kritik vuruş. **Metinde parıltı yok.**
- Yol zemini: perspektif ızgara + parlayan cyan kenar çizgisi.
- Tarama çizgisi (scanline) overlay **yok** (okunabilirlik).

**Okunabilirlik (zorunlu):**
- Gövde metni ≥ 17px, yardımcı metin ≥ 14px. Hiçbir metin 14px altında olamaz.
- Metin/zemin kontrastı ≥ 4.5:1 (panel üstünde `--ink` ve `--muted` bunu sağlar).
- Üst üste binen metin yok. Dock'taki metin balonlarının üstüne parıltı gelmez.

## 2. Arayüz bileşenleri (A4)

Dosyalar: `src/styles/10-layout.css`, `20-components.css`, `30-runway-overlay.css`, `src/html/shell.html`, `src/js/50-ui.js`.

### 2.1 `shell.html` iskeleti (kimlikler sabit, başka ajanlar bunlara güvenir)

```html
<div id="app">
  <header id="topbar">
    <button id="btn-settings" type="button" aria-label="Ayarlar">⚙</button>
    <div id="hud-station"></div>                 <!-- "İstasyon 3/9 · Işık-test odası" -->
    <ol id="hud-path" aria-label="Engel şeridi"></ol>
    <div id="hud-voltaj"><span>Voltaj</span><div class="track"><i id="voltaj-bar"></i></div><b id="voltaj-n">100</b></div>
    <div id="hud-claude" title="Claude durumu"></div>
    <div id="hud-timer"></div>
  </header>
  <main id="runway">
    <!-- canvas buraya eklenir (A2) -->
    <div id="runway-overlay">
      <div id="boss-panel" hidden></div>         <!-- sağda, yolun %34'ü -->
      <div id="bubble-layer"></div>
      <div id="dmg-layer"></div>
      <div id="stage-banner"></div>
    </div>
  </main>
  <section id="dock" aria-live="polite"></section>
  <div id="modal-layer" hidden></div>
  <div id="toast-layer"></div>
</div>
```

### 2.2 Düzen CSS (`10-layout.css`) — ölçüler `00` §5 ile birebir
- `html,body{height:100%;margin:0;overflow:hidden}`; `#app{height:100dvh;display:flex;flex-direction:column;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:8px;gap:8px}`.
- `#topbar{height:clamp(52px,8vh,72px)}`; `#runway{flex:1 1 auto;min-height:56vh;position:relative;border:3px solid var(--line);border-radius:var(--r);box-shadow:var(--shadow);overflow:hidden}`; `#dock{height:clamp(240px,32vh,360px);overflow:auto}`.
- Patron paneli: `#boss-panel{position:absolute;right:1.5%;top:3%;width:34%;height:94%}`.

### 2.3 Bileşen listesi (sınıf adları sabit)
`.panel`, `.btn`, `.btn.primary`, `.opt` (+`[aria-pressed=true]`), `.cbtn` (eminlik düğmesi), `.bubble`, `.bubble::after` (kuyruk), `.track`/`i`, `.card` (bilim insanı kartı), `.chip`, `.toast`, `.modal`, `.path-node` (+ `.bekliyor/.simdi/.tamam/.hata`), `.dmg` (+`.verilen/.alinan/.kritik`), `.boss-plate`, `.thinking` (üç nokta animasyonu).

Bilim insanı kartı (`.card`): 160×220 px, üstte portre (`Q.art.cameo`), altta ad, yıl, tek cümle. Kilitli kart: gri silüet + "?".

### 2.4 Animasyon süreleri (tabloya uy)

| Animasyon | Süre | Eğri |
|---|---|---|
| Engel `intro` | 1.2 sn | ease-out |
| Patron girişi (sağdan kayma+büyüme) | 1.7 sn | `cubic-bezier(.16,.84,.3,1)` |
| Patron balonu pop | 0.5 sn, 1.4 sn gecikme | ease-out |
| Hasar sayısı yüzmesi | 1.2 sn | ease-out |
| Sarsıntı | 0.45 sn | linear |
| Yavaşlama (koşucu) | 1.4 sn | `cubic-bezier(.2,.7,.3,1)` |
| Voltaj çubuğu | 0.6 sn | ease |

`prefers-reduced-motion: reduce` içinde hepsi `0.01ms`.

### 2.5 `Q.ui` davranışları (ayrıntılı)
- `confidence.ask`: 3 düğme yan yana (`Bilmiyorum / Emin değilim / Eminim`), her birinin altında tek satır hasar ipucu: `Yanlışsa hasar az`, `Normal`, `Doğruysa 2× vuruş, yanlışsa 2× hasar`. Seçim `1/2/3` veya `Q/W/E` tuşuyla da yapılır. Seçilince 150 ms içinde Promise çözülür.
- `options.ask`: `secenekler` her seferinde **karıştırılır** (doğru cevap hep aynı yerde olmasın), ama dönen indeks **orijinal diziye göre** verilir. Her seçenekte numara rozeti (1/2/3).
- `textbox.ask`: `textarea`, karakter sayacı `0/280`, 400'de keser, **Gönder** (birincil) ve **Bilmiyorum** (ikincil, `null` döner) düğmeleri.
- `thinking.show`: konumu host içinde, üç nokta animasyonu, **Dur** düğmesi (`Q.claude.cancel()`).
- `hud.setPath(nodes)`: 8-11 küçük yuvarlak düğüm + tip ikonu (basit şekiller). `simdi` düğümü cyan parlar.
- `hud.setTimer(sn)`: "Geçen 1s 12dk".
- `confirm`: `#modal-layer` içinde iki düğme, **`window.confirm` yok.**

## 3. Çizim (A5)

Dosyalar: `src/js/40-art-chars.js`, `41-art-runner.js`, `42-art-world.js`.

### 3.1 Karakter ve canavar üretici (`40-art-chars.js`)
- Referans: `oyun/referans/common.js` içindeki `mon()` ve `SCI`. **7 mevcut canavarı olduğu gibi al, 3 yeni ekle**: `born`, `pauli`, `fermi`. Planck ve Bloch için `cameo` (canavar parçaları olmadan) tanımla.
- Üretici bir **SVG string** döndürür (`viewBox="-30 -10 360 360"`). Parçalar: aura, ışınlar, arka aksesuar, gövde+yaka, göğüs yazısı, saç, yüz, gözler (2 veya 3, bir göz kapalı olabilir), kaşlar, burun, ağız+dişler, bıyık, gözlük, ön aksesuar.
- **Yeni karakter tanımları (kesin):**

| id | kişi, yıl | canavar | saç | göz | bıyık | gözlük | arka/ön aksesuar | göğüs |
|---|---|---|---|---|---|---|---|---|
| `born` | Max Born, 1926 | Olasılık Canavarı | `side` | 2 | yok | evet | ön: `dice` (iki zar omuzlarda, kenarları `acc`, noktaları `pupil` rengi) | `|ψ|²` |
| `pauli` | Wolfgang Pauli, 1925 | Dışlama Canavarı | `slick` | 2 | yok | yok | ön: `boxes` (üç üst üste kutu, her birinde ↑ ve ↓ okları, "yasak" işareti) | `n,l,m,s` |
| `fermi` | Enrico Fermi, 1926 | Fermi Canavarı | `slick` | 2 | `thin` | yok | arka: `sigmoid` (S biçimli basamak eğrisi aura gibi) | `f(E)` |
| `planck` (cameo) | Max Planck, 1900 | (yok) | `bald` | 2 | `bushy` | evet | yok | `E=hf` |
| `bloch` (cameo) | Felix Bloch, 1928 | (yok) | `curly` | 2 | yok | yok | arka: `wave` | `ψk` |

- Mevcut 7: `czoch, miller, einstein, bohr, broglie, schro, heis` (önizlemedeki parça kümeleri aynen). `miller` göğüs `(hkl)`, `schro` göğüs `ψ`, `heis` göğüs `ΔxΔp`.
- Her canavar için **istasyon vurgu rengi** gövde (`--m-body`) rengini belirler (`Q.art.monster(id,{renk})`).
- Canavarın üç **duygu hali** (SVG sınıfı ile): `idle`, `konus` (ağız hafif açık), `vuruldu` (gözler X, sarsıntı), `guldu` (yanlış cevapta kaşlar yukarı). A5 bunları CSS sınıflarıyla yapar (`.mon.vuruldu .pupil{display:none}` gibi).

### 3.2 Koşucu (`41-art-runner.js`)
- **Çırak** adlı koşucu: sarı baret, mavi tulum, büyük gözler, mürekkep konturlu (5 birim). Boyu mantıksal 150 birim.
- Durumlar ve kare sayıları: `kos` (6 kare koşu döngüsü), `dur` (nefes alma 2 kare), `atla` (3 kare), `saldir` (kılıç yayı, 4 kare; kılıç parlak cyan yay), `sendele` (geri sekme, 3 kare), `dus` (aşağı kayıp kaybolma 3 kare), `zafer` (kollar havada 2 kare).
- Çizim `canvas 2D` yolları ile (dikdörtgen/yay/çokgen). Dış görsel yok.

### 3.3 Engel sprite'ları (`41-art-runner.js` içinde `drawObstacle`)

| `tip` | Boyut (w×h birim) | Görünüm | Durumlara göre |
|---|---|---|---|
| `hikaye` | 200×300 | Saatli kemer (zaman kapısı): koyu mor kemer, içinde dönen cyan-macenta spiral, üstte saat | `intro`: spiral hızlanır; `cozuldu`: parlar ve söner |
| `kavram` | 200×280 | Kollu kapı: metal kapı, yan duvarda sarı kol ve küçük ekran | `aktif`: kol aşağıda yanıp söner; `cozuldu`: kapı yukarı kayar |
| `dusman` | 120×140 | Küçük kusur yaratığı. 4 skin: `vakans` (içi boş kare atom), `tane_siniri` (çatlak taş), `safsizlik` (renkli yabancı top), `dislokasyon` (eğri sıra) | `cozuldu`: BAM patlaması, kaybolur |
| `tahmin` | 260×60 (zeminde boşluk) | Zemin kesintisi, içinde parlak mor boşluk, yan tabela "?" | `cozuldu`: üstünden köprü ışığı; `basarisiz`: koşucu düşer |
| `tuzak` | 180×60 | Dikenli plaka, kırmızı uyarı ışığı | `cozuldu`: ışık söner, dikenler gömülür |
| `kopru` | 420×90 | Kırık köprü, ortası boş, kenarlarda halat | `cozuldu`: 4-5 tahta sırayla oturur |
| `patron` | (panel, DOM) | Yolda sadece 'arena bandı' (zemin çizgisi macenta, ekranda "PATRON" afişi) | |
| `sandik` | 140×120 | Sandık: sarı gövde, mor kilit | `cozuldu`: kapak açılır, ışık çıkar |

Her sprite mürekkep konturlu (5 birim koyu çizgi), düz dolgu, aktif engelde `--cyan` parıltı konturu.

### 3.4 Dünya (`42-art-world.js`)
Katmanlar (arkadan öne), kamera hızına oranla paralaks:
1. **Gök:** dikey gradyan `#0e0724 → #2a0f5c`, rastgele yıldız noktaları (tohumlu, kaymaz), büyük yarım ay (`--yellow`), kamera × 0.02.
2. **Uzak silüet:** fabrika/çip şehri silüeti (dikdörtgenler, bacalar, anten), pencereleri neon cyan/macenta noktalar, kamera × 0.12.
3. **Orta katman:** borular, neon tabela panoları (boş ya da sadece "İSTASYON n" yazılı), ışıklı bantlar, kamera × 0.4.
4. **Zemin:** üstte `--ground` parlayan 4 birim kalınlıkta çizgi (`shadowBlur` 14), altında perspektif ızgara (`--grid`), kamera × 1.0.
- İstasyon `renk`i orta katmandaki tabela ışıklarını ve zemin çizgisinin ikinci tonunu boyar.
- `drawWorld` her karede çağrılır ve **maliyeti düşüktür**: statik parçalar bir `OffscreenCanvas` veya önbellek canvas'ına bir kez çizilir; yalnızca kayma uygulanır.

## 4. Ses (isteğe bağlı, düşük öncelik)
`ses` ayarı açıkken Web Audio ile küçük sentez sesleri (doğru: yükselen iki nota, yanlış: alçalan buzz, kritik: üç nota, patron girişi: alçak vuruş). Varsayılan **kapalı**. Ses dosyası yok. Bu iş en sona bırakılır.

## 5. Kabul testleri
- **A4:** `shell.html` kimlikleri 2.1'deki gibi; 1440×900'de `#runway` genişliği ≥ 1380 px, yüksekliği ≥ 450 px; sayfa kaydırması yok; 1100×700'de de sığar; tüm düğmeler klavyeyle odaklanır.
- **A5:** 10 canavar + 2 cameo SVG'si hata vermeden üretilir; her biri 12×12 küçük kart ve 340 px büyük boyutta okunur; koşucunun 7 durumu ve 8 engel sprite'ı bir test sayfasında (`oyun/test/sanat.html`) yan yana görünür; ekran görüntüsü alınır.
