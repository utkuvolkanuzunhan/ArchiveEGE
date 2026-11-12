# HESAP-ENGEL: istasyon sonu hesap görevi (yeni engel tipi `hesap`)

Sınavda Soru 5/6 gibi sayısal işlemler çıktığı için her istasyonun sonunda, **patrondan sonra, sandıktan önce**, sınav seviyesinde bir hesap görevi oyun akışında açılır. Her istasyon 10 engel (hikaye, kavram, dusman, dusman, tahmin, tuzak, kopru, patron, **hesap**, sandik). `final` istasyonu ayrı (yalnızca patron engelleri), etkilenmez.

## Dosyalar
- `src/js/86-obs-hesap.js`: işleyici `Q.obs.register('hesap')` + `Q.obsHesap.hataYaz`.
- `src/js/90-data-s01..s10.js`: her istasyona `{ id:'sNN-h01', tip:'hesap', baslik:'Hesap görevi', kavram:null, agirlik:0, hesapGorev:'<id>' }` (patron ile sandık arasına).
- `src/js/41-art-runner.js`: `DRAW.hesap` (ayaklı hesap makinesi, ekran çözülünce yeşil) ve boyut. `50-ui.js`: hud yol noktası şekli/adı.
- `src/js/95-runner.js`: `GAP/OK_ANIM` hesap; atlanınca `ilerleme[sNN].hesap='atlandi'`, tamamlanınca `'tamam'`.
- `src/js/99-main.js`: SIRA'ya `hesap` eklendi, `hesapGorev` verisi var mı denetlenir.
- `src/js/80-obs-sandik.js`: hesap atlandıysa sandık ekranında "Hesap atlandı" notu.
- `src/js/98-tekrar-hata.js`: hata defteri kartı hesap kaydını tanır ("Hesap çalıştayında aç" düğmesi). `98-tekrar-hesap.js`: `Q.tekrarHesap.sec(id)`.
- `test/veri-dogrula.js` (SIRA + hesap engeli ve görev verisi denetimi), `test/runner.test.js` (10 engel), `test/hesap-engel.test.js` (94 kontrol).

## Görev seçimi (`Q.hesap.istasyonSonu` içinden, sınav seviyesi)
| İst. | Görev | Not |
|---|---|---|
| s01 | si-yogunluk | 8 atom / a³ (cm birimi tuzağı) |
| s02 | miller-326 | kesişim -> ters -> (326), d = a/7 |
| s03 | foto-cu | foton enerjisi, hf > φ, K_max |
| s04 | bohr-gecis | Bohr geçiş dalga boyu |
| s05 | q5-bolgeler | Soru 5: 3 bölge, sınır koşulları, κd |
| s06 | q6-e-gt | Soru 6: basamak, k₁, k₂, r, t, R, T |
| s07 | olc-E | ölçüm, beklenen değer |
| s08 | bel-v | belirsizlik |
| s09 | bant-si | bandgap, foton |
| s10 | fd-100meV | Fermi-Dirac |

Her görevde ara cevap soruları (`adimSoru`) hazırdı; ek veri yazılmadı. (Soru yoksa o adımın çözümü doğrudan gösterilir, "Sonraki adım" ile geçilir.)

## Oyun akışı
1. Alt panelde solda görev metni (EN) ve "Verilenler (Given)" görev bitene kadar sabit; sağda adımlar ve ilerleme çubuğu (Adım n/m).
2. Her adımda `adimSoru` sorulur: sayı kutusu + Kontrol (±%2, virgül/`1.5e-4`/`×10^` kabul) ya da şık seç + Onayla (1-9 tuşları da çalışır). Adımın metni/formülü yalnızca cevaptan sonra açılır.
3. Doğru: "Doğru." + çözüm açılır + "Sonraki adım" (Enter da geçer).
4. Yanlış: "Cevabın yanlış. Doğru: ..." (mertebe hatasında ek uyarı) + **"Adımı göster"** (çözümü açar) + **"Devam"** (bu adımı geçer); tekrar denemek de serbest. **Ceza ya da can kaybı yok** (voltaj değişmez).
5. Sonunda sonuç, "Formül özeti", "Sınavda dikkat", **Çözdüm / Tekrar çalış** işaretleri ve "Tekrar Merkezi'nde aç" bağlantısı; Devam sandığa götürür.

## Kayıt (cip-hatti-v1, geriye uyumlu)
- `Q.state.hesapCalisma[gorevId]`: hata yapmadan bitirilirse `'cozdum'`; yanlış adım olduysa `'tekrar'` (var olan `'cozdum'` düşürülmez; oyuncu Çözdüm/Tekrar çalış ile değiştirebilir).
- `Q.state.ilerleme[sNN].hesap`: `'tamam'` ya da `'atlandi'` (isteğe bağlı alan; eski kayıtta yok).
- Hata defteri: ilk yanlış adımda `{kavram:'hesap_<konu>', istasyon:'sNN', engel:'sNN-h01', hesap:'<gorevId>', adim:n, tur:'yanlis'}` (aynı görev için açık kayıt varsa `tekrar++`). Soru kuyruğu/aralıklı tekrar bu kavramı bilmediği için ekstra soru üretmez; Hata defterini çalış sayfasında kart olarak görünür ve Hesap çalıştayını açar.
- Eski (9 engelli) kayıtlar: tamamlanmış istasyonlar `tamam` kalır; patrona kadar olan indeksler değişmez, `enSon` patrondan sonrasını (eski sandık) gösteriyorsa artık hesap engelidir (oyuncu önce hesabı görür, sonra sandığı).

## Esc menüsü ve ayarlar
- Esc (giriş kutusunda odakken de) duraklatır; Devam / "Bu engeli atla" / "Önceki engele dön" / "İstasyonun başına dön" çalışır. Hesap **atlanabilir**: istasyon tamamlanır, `ilerleme.hesap='atlandi'`, sandık ekranında "Hesap atlandı" yazar. Şart değil.
- `hikayeAtla`, `kilitleriAc`, "İstediğin engele atla" (id ile `Q.runner.indexOf`) ve "Her yere eriş" bozulmadı. "Hızlı mod: yalnızca patronlar" hesabı da atlar (yalnızca patron + sandık). Not: `hikayeAtla` açıkken liste indeksi 1 azalır (hesap 7), kapalıyken 8; bu davranış önceden de böyleydi.

## Test sonuçları
`test/hesap-engel.test.js` 94 kontrol: 10 istasyonda 10 engel, s01..s10 hepsinde hesap açılır (yatay taşma yok, 1366x768); s02, s05, s06 baştan sona (yanlış sayı/şık + Adımı göster + doğru, Esc menüsü, atla, geri, yenileme, Çözdüm, ceza yok); eski kayıt uyumu; hata defteri sayfası. Ekran görüntüleri `test/ciktilar/hesap-engel-*.png` (commit edilmez).

## Durum: tamamlandı / eksik / bilinen sorun
- Tamamlandı: engel tipi, 10 istasyonda veri, işleyici, runner/hud/çizim/harita (veri tabanlı), hata defteri, Çözdüm işareti, atlama, eski kayıt uyumu, veri-dogrula, runner/fabrika/hesap-engel testleri (94). veri-dogrula, sinav-dogrula, smoke 9/9, final, hesap, kartlar, fabrika geçer.
- Eksik: Soru 5 görevinin son adımı soru sormaz (yalnızca çözüm gösterilir); sayısal olmayan sınav gerekçeleri kapsanmadı.
- Bilinen sorun: `test/tekrar-hata.test.js` "Biliyorum terimi ana listeden çıkarır" kontrolü yukarı akıştaki (GERCEK-SINAV, 97-tekrar.js) değişiklikten beri başarısız; hesap engelinden bağımsız (b12849e üzerinde de kırık).
