# PROMPTLAR · Ajan Paketleri

> Orkestratör her ajanı başlatırken şu iki şeyi söyler: (1) **ORTAK ÖN TALİMAT** bölümünü uygula, (2) `## PAKET <ID>` bölümünü yap.
> Efor sütunu: **low** = iyi tanımlı, referansı veya tam içeriği var. **medium** = tasarım kararı veya entegrasyon gerektirir.

## Paket tablosu

| ID | Ad | Efor | Dosyalar (yalnızca bunları yazar) | Aşama |
|---|---|---|---|---|
| A1 | Çekirdek (Q, bus, state, save, util, test harness) | low | `src/js/00-q.js`, `10-state.js`, `test/harness.js` | M1 |
| A2 | Koşu motoru | medium | `src/js/95-runner.js` (+`95-runner-b.js`) | M1 |
| A3 | Savaş/voltaj/hata defteri | low | `src/js/60-battle.js`, `test/battle.test.js` | M1 |
| A4 | Arayüz, CSS, HTML iskeleti | medium | `src/styles/*.css`, `src/html/shell.html`, `src/js/50-ui.js` | M1 |
| A5a | Karakter/canavar çizimi | low | `src/js/40-art-chars.js`, `test/sanat-chars.html` | M1 |
| A5b | Koşucu, engel sprite, dünya çizimi | medium | `src/js/41-art-runner.js`, `42-art-world.js`, `test/sanat.html` | M1 |
| A6 | Claude istemcisi | medium | `src/js/30-claude.js`, `test/claude.test.js` | M1 |
| A8 | Ayarlar, harita, kayıt arayüzü | medium | `src/js/20-settings.js` | M1 |
| A9 | Ana akış, derleme, test, final | medium | `src/js/99-main.js`, `build.sh`, `test/smoke.js`, `test/veri-dogrula.js` | M1 (+final M3) |
| H1 | `hikaye` + `sandik` | low | `src/js/80-obs-hikaye.js`, `80-obs-sandik.js` | M1 |
| H2 | `dusman` + `tuzak` | low | `src/js/80-obs-dusman.js`, `80-obs-tuzak.js` | M1 |
| H3 | `kavram` + `tahmin` | medium | `src/js/80-obs-kavram.js`, `80-obs-tahmin.js` | M1 |
| H4 | `kopru` | medium | `src/js/80-obs-kopru.js` | M1 |
| H5 | `patron` | medium | `src/js/85-obs-patron.js` | M1 |
| S1 | sim `kristal_tur` | medium | `src/js/70-sim-kristal_tur.js` | M1 |
| S2 | sim `czochralski` | medium | `src/js/70-sim-czochralski.js` | M2 |
| S3 | sim `kafes` | low | `src/js/70-sim-kafes.js` | M1 |
| S4 | sim `miller` | low | `src/js/70-sim-miller.js` | M1 |
| S5 | sim `karacisim` | medium | `src/js/70-sim-karacisim.js` | M1 |
| S6 | sim `fotoelektrik` | low | `src/js/70-sim-fotoelektrik.js` | M1 |
| S7 | sim `bohr` | medium | `src/js/70-sim-bohr.js` | M2 |
| S8 | sim `kuyu` | low | `src/js/70-sim-kuyu.js` | M2 |
| S9 | sim `basamak` | medium | `src/js/70-sim-basamak.js` | M2 |
| S10 | sim `olcum` | medium | `src/js/70-sim-olcum.js` | M2 |
| S11 | sim `belirsizlik` | low | `src/js/70-sim-belirsizlik.js` | M2 |
| S12 | sim `bant` | medium | `src/js/70-sim-bant.js` | M2 |
| S13 | sim `fermi` | low | `src/js/70-sim-fermi.js` | M3 |
| E1-E3 | istasyon verisi s01-s03 | low | `src/js/90-data-s01.js` ... `s03.js` | M1 |
| E4-E8 | istasyon verisi s04-s08 | low | `src/js/90-data-s04.js` ... `s08.js` | M2 |
| E9, E10 | istasyon verisi s09, s10 | low | `src/js/90-data-s09.js`, `s10.js` | M3 |
| A7 | Final "Sınav Günü" + rapor | medium | `src/js/96-final.js` | M3 |
| A5c | Ses (isteğe bağlı) | low | `src/js/43-art-sound.js` | M3 |
| D1 | **Hata denetçisi** | low | `denetim/BUG-<n>.md` | her aşama sonu |
| D2 | **Dil ve anlatım denetçisi** | low | `denetim/DIL-<n>.md` (+ veri metinlerinde küçük düzeltme) | M2, M3 |

Not: `src/`, `test/`, `denetim/`, `ilerleme/` yolları `oyun/` altındadır.

---

## ORTAK ÖN TALİMAT (her ajanın prompt'unun başı)

Sen "Çip Hattı" öğrenme oyununun bir ajanısın. Oyun: Aygıt Fiziği dersi için, bilim insanı canavarlarla dolu, yatay kayan bir koşu oyunu; tek HTML dosyası. Hedef kullanıcı 4 saatte oynayacak.

1. **Okuma sırası:** `oyun/00-genel-tasarim.md`, `oyun/01-veri-semalari.md`, ardından paketinin kendi dokümanı (aşağıda) ve paketinin satırı. Başka dokümanları yalnızca paketin gerektirirse oku. **`oyun/00`-`09` dokümanları salt okunurdur; değiştirme.**
2. **Dosya sahipliği:** Yalnızca paketinin "Dosyalar" sütunundaki dosyaları oluştur/değiştir (ve `oyun/ilerleme/<PAKET>.md`). Başkasının dosyasına dokunma. Hata bulursan `oyun/SORULAR.md` dosyasının **sonuna** tek satır ekle: `[PAKET] dosya:satır: sorun`.
3. **Belirsizlik:** Dokümanda eksik/çelişki varsa `SORULAR.md`'ye yaz, en makul varsayımla devam et, yarıda bırakma.
4. **Dil/ton:** Arayüz metinleri Türkçe, kısa, mizahlı-samimi, `00` §2'deki kurallara uyar. Kullanıcıya dair kişisel/sağlık bilgisi hiçbir yere yazılmaz.
5. **Kod kuralları:** `01` §7. Düz JS, IIFE, `Q.*`, `console.log` yok, framework yok, dış kaynak yok (Google Fonts hariç).
6. **Test:** Paketinin kabul testlerini kendin çalıştır (Node veya Playwright; Playwright ve Chromium önceden kurulu: `require('playwright')`, `chromium.launch()`; yeniden kurma). Çalışmayan şeyi "bitti" diye bildirme.
7. **GIT PROTOKOLÜ (zorunlu, sık):** Çalışma dalı `DAL` sana verilir.
   - Başlamadan: `git fetch origin $DAL && git rebase origin/$DAL` (varsa `oyun/ilerleme/<PAKET>.md` dosyasını oku ve **kaldığın yerden devam et**).
   - **Her bitmiş dosyadan veya en geç her 1 dakikada bir** commit ve push yap (yarım dosya da olsa; hesap/oturum her an kesilebilir) (yarıda kesilirsek iş kaybolmasın):
     ```
     git add oyun/<yalnızca kendi dosyaların> oyun/ilerleme/<PAKET>.md
     git commit -m "[<PAKET>] kısa açıklama"
     for i in 1 2 3 4 5; do git fetch origin $DAL && git rebase origin/$DAL && git push origin HEAD:$DAL && break; sleep $((i*3)); done
     ```
   - `git push` başarısızsa 5 denemeden sonra `ilerleme` dosyasına yaz ve işe devam et; bitirirken yine dene.
   - Başkasının dosyası rebase'te çakışırsa **onunkini olduğu gibi bırak** (`git checkout --theirs`/`--ours` ile değil, sadece kendi dosyalarını commit et).
8. **İlerleme dosyası** `oyun/ilerleme/<PAKET>.md` (her commit'te güncelle): `## Durum` (calisiyor|bitti|engelli), `## Yapıldı`, `## Kalan`, `## Notlar`. Başka bir hesap/oturum seni bu dosyadan devam ettirecek, bu yüzden net yaz.
9. **Bitirirken rapor (en çok 12 satır):** yazılan dosyalar, çalıştırılan testler ve sonuçları, bilinen eksikler, `SORULAR.md`'ye eklenenler.

---

## PAKET A1 · Çekirdek (low)
Doküman: `oyun/01-veri-semalari.md` §1-§2, §5.2 (sim kaydı).
Yaz: `src/js/00-q.js` (Q nesnesi, `Q.bus`, `Q.util`, `Q.sim.register/mount`, `Q.obs.register` ve `Q.obs.handlers`, `Q.data.addStation`), `src/js/10-state.js` (`Q.state` varsayılanları, `Q.save.*`), `test/harness.js` (sayfaya `05` §1.1'deki `:root` token bloğunu enjekte eder; gerekirse minimal `Q` sahtesi sağlamaz, `00-q.js`'i yükler).
Kabul: Node'da `Q.bus`, `Q.util.shuffle/rng/fmtDur`, `Q.save.exportText/importText` birim testleri; bozuk `localStorage` içeriğinde varsayılan; `localStorage` yokken hata yok.
**Önce bitir, hemen push et** (diğer ajanlar buna dayanır).

## PAKET A2 · Koşu motoru (medium)
Doküman: `oyun/02-motor-kosucu.md` (tamamı), `01` §5.1, §5.7, §6.
Yaz: `src/js/95-runner.js`. `Q.art.*` yoksa dikdörtgenlerle sahte çizim kullan, varsa onu çağır.
Kabul: `02` §11'deki 6 test. Playwright ile yol boyutu ölçümü (≥ %96 genişlik, ≥ %50 yükseklik).

## PAKET A3 · Savaş (low)
Doküman: `oyun/03-savas-eminlik-voltaj.md` (tamamı), `01` §4, §5.6.
Yaz: `src/js/60-battle.js`, `test/battle.test.js`.
Kabul: `03` §8'deki 7 birim testi Node'da geçer.

## PAKET A4 · Arayüz (medium)
Doküman: `oyun/05-sanat-ui-kiti.md` §1, §2, §5 (A4), `00` §5, `01` §5.4. Referans: `oyun/referans/`.
Yaz: `src/styles/00-tokens.css`, `10-layout.css`, `20-components.css`, `30-runway-overlay.css`, `src/html/shell.html`, `src/js/50-ui.js` (tüm `Q.ui.*`).
Kabul: 1440×900'de `#runway` ≥ 1380×450 px, sayfa kaydırması yok; `confidence`, `options`, `textbox`, `thinking`, `modal`, `confirm`, `toast`, `hud` için bir demo sayfası (`test/ui.html`) ve ekran görüntüleri.

## PAKET A5a · Karakter çizimi (low)
Doküman: `oyun/05-sanat-ui-kiti.md` §3.1. Referans: `oyun/referans/common.js` (`mon`, `SCI`, parça sabitleri).
Yaz: `src/js/40-art-chars.js` (`Q.art.registerChar`, `Q.art.monster`, `Q.art.cameo`; 10 canavar + planck, bloch cameo), `test/sanat-chars.html` (hepsi yan yana).
Kabul: 12 SVG hatasız, küçük (92 px) ve büyük (340 px) boyutta okunur; ekran görüntüsü.

## PAKET A5b · Koşucu, engel, dünya (medium)
Doküman: `oyun/05-sanat-ui-kiti.md` §3.2-§3.4.
Yaz: `src/js/41-art-runner.js` (`Q.art.drawRunner`, `Q.art.drawObstacle`, `Q.art.OBSTACLE_SIZE`), `src/js/42-art-world.js` (`Q.art.drawWorld`), `test/sanat.html`.
Kabul: 7 koşucu durumu, 8 engel sprite'ı, 4 dünya katmanı test sayfasında; 60 fps'te çizim (Playwright ile 2 sn kare sayısı ≥ 100); ekran görüntüsü.

## PAKET A6 · Claude istemcisi (medium)
Doküman: `oyun/04-claude-istemcisi.md` (tamamı).
Yaz: `src/js/30-claude.js`, `test/claude.test.js`.
Kabul: `04` §7'deki 4 test. Anahtar hiçbir yere kalıcı yazılmaz. **Prompt şablonunu aynen kullan.**

## PAKET A8 · Ayarlar ve harita (medium)
Doküman: `oyun/07-ayarlar-kayit-harita.md` (tamamı), `05` §2.
Yaz: `src/js/20-settings.js`.
Kabul: `07` §8'deki 6 test. Modal ve düğmeler `05`'in sınıflarını kullanır (A4'ün CSS'i yoksa geçici stil ekleme, sınıf adlarına güven).

## PAKET A9 · Ana akış, derleme, test (medium)
Doküman: `oyun/08-entegrasyon-yayin-test.md` (tamamı).
Yaz: `build.sh`, `src/js/99-main.js`, `test/veri-dogrula.js`, `test/smoke.js`, `oyun/README.md` dosyasına **"Nasıl çalıştırılır"** bölümü (README zaten var: yalnızca bu bölümü ekle).
Kabul: `08` §5 duman testi (mevcut paketlerle çalışabildiği kadar). Eksik dosyaları `build.sh` sarı uyarıyla listeler ama `--zorunlu-degil` bayrağı ile geçirir (M1'de tüm paketler gelene kadar).
`99-main.js` içinde tüm istasyonlar bitince `Q.final && Q.final.start()` çağrısını **baştan hazırla** (final paketi A7 M3'te gelir; yoksa "Final yakında" mesajı).

## PAKET H1 · hikaye ve sandık (low)
Doküman: `oyun/09-engel-isleyicileri.md` (ortak kurallar + H1 bölümü), `01` §3.3, §3.6, §5.1, §5.4.
Yaz: `src/js/80-obs-hikaye.js`, `src/js/80-obs-sandik.js`, `test/obs-hikaye.html`, `test/obs-sandik.html`.
Kabul: sahte `ctx` ile tek başına çalışır; ekran görüntüsü.

## PAKET H2 · düşman ve tuzak (low)
Doküman: `oyun/09-engel-isleyicileri.md` (ortak + H2), `01` §3.5, §5.1, §5.4.
Yaz: `src/js/80-obs-dusman.js`, `src/js/80-obs-tuzak.js`, `test/obs-dusman.html`, `test/obs-tuzak.html`.
Kabul: seçenek → eminlik → açıklama → Devam akışı; `Sonuc` alanları `01` §5.1'e uygun.

## PAKET H3 · kavram ve tahmin (medium)
Doküman: `oyun/09-engel-isleyicileri.md` (ortak + H3), `06` (ortak kurallar), `01` §5.2.
Yaz: `src/js/80-obs-kavram.js`, `src/js/80-obs-tahmin.js`, `test/obs-kavram.html`, `test/obs-tahmin.html` (sahte bir sim modülü ile).
Kabul: `api.done` ile kapı açılır, 45 sn ipucu / 120 sn Geç davranışı (test için süreler parametre ile kısaltılabilir), tahminde sim `set()` ile geçiş.

## PAKET H4 · köprü (medium)
Doküman: `oyun/09-engel-isleyicileri.md` (ortak + H4), `01` §3.5.
Yaz: `src/js/80-obs-kopru.js`, `test/obs-kopru.html`.
Kabul: pointer ile sürükle-bırak **ve** dokun-yerleştir çalışır; yanlışta doğru sıra gösterilir.

## PAKET H5 · patron (medium)
Doküman: `oyun/09-engel-isleyicileri.md` (ortak + H5, **tamamı dikkatle**), `03` §4, `04` §6, `01` §3.6, §5.1, §5.3.
Yaz: `src/js/85-obs-patron.js`, `test/obs-patron.html` (sahte `Q.claude`, `Q.battle`, `ctx` ile).
Kabul: H5 bölümündeki 4 test hesabı; ikinci şans; yedek çoktan seçmeliye düşme; Claude beklerken "Dur".

## PAKET S1-S13 · Simülasyonlar
Doküman: `oyun/06-simulasyonlar.md` (ortak kurallar + kendi bölümü), `05` §1.1 (renkler), `01` §5.2. Referans: `oyun/referans/common.js` (kuyu, Miller çizimi).
Her ajan yalnızca **kendi modülünü** yazar: `src/js/70-sim-<modul>.js` ve `test/sim-<modul>.html` (test sayfasına `05` §1.1'deki `:root` bloğunu yapıştır ve küçük bir `Q.sim.register/mount` sahtesi ekle; `harita` veya `00-q.js` bekleme).
Kabul: test sayfasında modül yüklenir yüklenmez dolu görünür; kontroller çalışır; `params.basari` tetiklenebilir (test sayfasında düğme ile); `destroy()` sonrası dinleyici kalmaz; Playwright ekran görüntüsü; fiziksel formüller `06`'daki gibi (örnek değerlerle elle doğrula).
- **S1** `kristal_tur` · **S2** `czochralski` · **S3** `kafes` · **S4** `miller` (referanstan genişlet) · **S5** `karacisim` · **S6** `fotoelektrik` · **S7** `bohr` · **S8** `kuyu` (referanstan genişlet) · **S9** `basamak` · **S10** `olcum` · **S11** `belirsizlik` · **S12** `bant` · **S13** `fermi`.

## PAKET E1-E10 · İstasyon verileri (low)
Doküman: `oyun/istasyonlar/NN-*.md` (kendi istasyonun), `oyun/01-veri-semalari.md` §3, `oyun/06-simulasyonlar.md` (yalnızca `sim` parametre tablosu).
Yaz: `src/js/90-data-sNN.js`. İstasyon dosyasındaki **metinleri aynen** JS verisine çevir (kısaltma, yeniden yazma, "iyileştirme" yok). Tüm alanlar `01` §3 şemasına uyar. Tekrar havuzunu dosyadaki tarifle üret.
Kabul: `node oyun/test/veri-dogrula.js` (A9 yazar; henüz yoksa dosyayı `node --check` ile doğrula ve `01` §3 şemasına göre elle kontrol et, ilerleme dosyasına yaz).
E9 ve E10 için istasyon dosyaları (`09-bant-testi.md`, `10-bonus-fermi-drift.md`) M3'te yazılır; yoksa **başlama**, orkestratöre "bekliyor" bildir.

## PAKET A7 · Final "Sınav Günü" (medium, M3)
Doküman: `oyun/08-entegrasyon-yayin-test.md` §3, `09` H5 (patron akışı), `01` §3.6.
Yaz: `src/js/96-final.js` (`Q.final.start()`), `test/final.html`.
Kabul: 10 tek fazlı açık uçlu soru sırası, rapor ekranı, "Temel tura git" düğmeleri.

## PAKET A5c · Ses (low, M3, isteğe bağlı)
Doküman: `oyun/05-sanat-ui-kiti.md` §4.
Yaz: `src/js/43-art-sound.js` (`Q.art.sound.play(isim)`; `settings.ses` kapalıysa hiçbir şey çalmaz).

## PAKET D1 · Hata denetçisi (low)
Görev: Mevcut kodu **çalıştır ve incele**, hata bul. **Düzeltme yapma**, yalnızca rapor yaz: `oyun/denetim/BUG-<n>.md` (`n` = sıradaki numara).
Yap:
1. `bash oyun/build.sh --zorunlu-degil` (varsa) ile `oyun/dist/oyun.html` üret. Playwright ile aç, **konsol hatalarını** topla (kapatılan her hata için dosya:satır).
2. `oyun/test/*` testlerini çalıştır, sonuçları yaz.
3. Oynanış akışını Playwright ile dene: harita, istasyon başlat, ilk engellerde seçim/eminlik/Devam, ayarlar, ESC, kısa devre. Takılma, kilitlenme, ölü düğme, tıklanamayan öğe, taşan metin, sayfa kaydırması, **yol boyutu** (`#runway` ≥ %96 genişlik, ≥ %50 yükseklik), 1100×700'de sığma.
4. Statik tarama: `console.log`, `confirm(`, `alert(`, `prompt(`, kullanıcı girdisini `innerHTML` ile basma, `localStorage`'a anahtar yazma, `destroy()` eksikliği, tekrarlı event dinleyici, `01` §7 ihlalleri, şemadan sapan alan adları.
5. Her bulgu: `önem` (kritik/yüksek/orta/düşük), `nerede` (dosya:satır), `nasıl tekrarlanır`, `beklenen/gerçek`, `sorumlu paket`, `önerilen düzeltme` (1-2 cümle).
Bitir: rapor + ilerleme dosyası, commit + push. Üst düzey özet: kaç kritik/yüksek hata.

## PAKET D2 · Dil ve anlatım denetçisi (low)
Görev: Oyunun **Türkçe metinlerini ve açıklayıcılığını** denetle. Rapor: `oyun/denetim/DIL-<n>.md`. Dosyalar: `oyun/src/js/90-data-*.js` (istasyon verisi), `50-ui.js`, `20-settings.js`, `99-main.js` ve diğer arayüz metinleri.
Ölçütler:
1. **Kısalık:** `00` §2 ve `01` §3 sınırlarını aşan metin (kelime say).
2. **Açıklayıcılık:** Her `neden` ve `acik`/`duzeltme` **nedenini** söylüyor mu ("Yanlış çünkü …")? Sadece "Hayır" diyen açıklama var mı?
3. **Netlik ve doğrudanlık:** Yanlışlar net söyleniyor mu (nezaket için gerçeği örtmüyor mu)?
4. **Terim tutarlılığı:** aynı kavram tek adla (örn. "özdurum", "özdeğer", "sınır koşulu"); ilk geçişte parantezde İngilizcesi mi?
5. **Dil:** yazım, noktalama, ek uyumu, çeviri kokusu, aşırı resmilik; ton mizahlı-samimi mi? Gereksiz ağır cümleler?
6. **Bilimsel şüphe:** fiziksel olarak yanlış veya belirsiz görünen cümleleri **işaretle** (düzeltme, yalnızca "şüpheli" etiketi).
7. **Öğretim akışı:** Aynı istasyonda bir kavram önce öğretiliyor mu, sonra mı soruluyor? Hikaye → kavram → soru sırası anlamlı mı?
Çıktı: tablo `dosya | alan/id | sorun | önerilen metin`. Küçük **yazım/akıcılık düzeltmelerini** (anlamı, sayıları, `dogru` işaretlerini ve alan adlarını değiştirmeden) `90-data-*.js` metinlerinde **doğrudan uygula** ve ayrı commit'le (`[D2] metin düzeltme`). Başka her şeyi yalnızca raporla.
