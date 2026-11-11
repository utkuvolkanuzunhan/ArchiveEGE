# 00 · Genel Tasarım: "Çip Hattı" Öğrenme Oyunu

> Bu dosyayı **her ajan** okur. Diğer dosyalarla çelişirse bu dosya kazanır.
> Dil: Türkçe. Ajanlar için talimatlar Türkçe, kod değişken adları İngilizce/Türkçe karışık olabilir ama **şemalardaki alan adları aynen** kullanılır (bkz. `01-veri-semalari.md`).

## 1. Ne yapıyoruz?

Tek bir **HTML dosyası** (artifact) olarak çalışan, yaklaşık **4 saatlik** bir öğrenme oyunu. Ders: *Elektronik Malzemeler ve Aygıt Fiziği* (kristal yapı, Miller indisleri, kuantum mekaniği, Schrödinger, enerji bantları). Hedef: oyuncu sınavda **kendi cümleleriyle** açıklama yazabilecek hale gelir.

Oyun yatay kayan bir **koşu oyunudur**. Oyuncu bir fabrika hattında sağa doğru ilerler. Yolda **engeller** çıkar. **Her engel bir konu parçasını öğretir.** Engeller konu sırasıyla dizilmiştir, yani oyunu sırayla geçmek konuyu sırayla öğrenmektir. Her istasyonun sonunda bir **bilim insanı canavar** (patron) çıkar ve sınav tarzı açık uçlu soruyu sorar.

## 2. Oyuncu (kullanıcı) hakkında kurallar

1. **Metin kısa olacak.** Ekrandaki her metin kutusu en fazla **2 cümle / 25 kelime**. Düğme etiketleri en fazla 3 kelime. Uzun açıklama gerekiyorsa "Daha fazla" ile katlanır açılır. Metin yerine animasyon, çizim, slider tercih edilir.
2. **Tek ekranda tek görev.** Aynı anda iki soru, iki simülasyon, iki yan panel yok.
3. **Yazma isteği az.** Yalnızca patron fazlarında 1-3 cümlelik açık uçlu cevap istenir (en fazla 280 karakter önerilir, 400'de durdurulur). Diğer her yerde dokunma/sürükleme/slider.
4. **Hiçbir yerde** (arayüz metni, kod yorumu, dosya adı, commit mesajı) kullanıcının kişisel/sağlık durumuna, tanıya veya "dikkat" sorununa değinilmez. Kısa ve hareketli tasarımın nedeni açıklanmaz.
5. Ton: **mizahlı, samimi, kısa**. Aşağılayıcı veya kızgın ton yok. Yanlış cevapta "tuzak buydu" gibi hafif espri tamamdır. Bilimsel terimler Türkçe, ilk geçişte parantez içinde İngilizcesi: "özdeğer (eigenvalue)".
6. Kullanıcı hata yaptığında **açık ve net** düzeltilir (nazik ama gerçeği örtmeden). Örnek: "Yanlış. Sebep sıcaklık değil, sınır koşulu."
7. Oyunda **can** yoktur. **Voltaj çubuğu** vardır (bkz. `03`). Voltaj bitince oyuncu **geri düşer ve konuyu daha temelden görür** (ceza değil, onarım).
8. **Kaybetmek/gerilemek mümkündür.** Bu istenen bir özelliktir.
9. **Eminlik** oyunun parçasıdır: oyuncu cevap verirken "Bilmiyorum / Emin değilim / Eminim" der. Eminlik hasarı belirler (bkz. `03`).
10. XP, rozet, süreli görev, günlük seri **yok** (kullanıcı beğenmedi). İlerleme = istasyon geçme + bilim insanı kartı + fabrikanın büyümesi.

## 3. Konu sırası = istasyon sırası

Sınav örneği 10 soruluktur ve konuları şu sırayla kapsar. Oyun bu sırayı izler.

| # | İstasyon (fabrika makinesi) | Konu | Örnek sınav sorusu | Patron | Dosya |
|---|---|---|---|---|---|
| 1 | Kristal fırını | Katı türleri, neden kristal, CZ ile tek kristal | S1, S2 | Czochralski (Tane Sınırı Canavarı) | `istasyonlar/01-kristal-firini.md` |
| 2 | Kesim testeresi | Kafes, birim hücre, Miller indisleri | (Konu 2) | Miller (Düzlem Canavarı) | `02-kesim-testeresi.md` |
| 3 | Işık-test odası | Neden kuantum: kara cisim, fotoelektrik | S3 | Einstein (Foton Canavarı) | `03-isik-test-odasi.md` |
| 4 | Atom mikroskobu | H atomu kararlılığı, madde dalgası | S4 | Bohr (Yörünge Canavarı) | `04-atom-mikroskobu.md` |
| 5 | Dalga odası | Schrödinger, ψ, sonsuz kuyu, kuantalaşma | S5 | Schrödinger (Kuantum Kedisi) | `05-dalga-odasi.md` |
| 6 | Tünel istasyonu | Basamak, yansıma, tünelleme | S5, S6 | de Broglie (Dalga Canavarı) | `06-tunel-istasyonu.md` |
| 7 | Ölçüm laboratuvarı | Postülatlar, ölçüm, çökme | S8, S9 | Born (Olasılık Canavarı) | `07-olcum-laboratuvari.md` |
| 8 | Kalibrasyon odası | Belirsizlik ilkesi | S10 | Heisenberg (Belirsizlik Canavarı) | `08-kalibrasyon-odasi.md` |
| 9 | Bant testi | Periyodik yapı → enerji bantları | S7 | Pauli (Dışlama Canavarı) | `09-bant-testi.md` |
| 10 | Paketleme (bonus) | Taşıyıcılar, Fermi, drift (**derste işlendiyse**) | Konu 3-4 | Fermi (Fermi Canavarı) | `10-bonus-fermi-drift.md` |

İstasyon 10 varsayılan olarak **gizli/opsiyoneldir**. Ayarlarda "Ders bu konuyu işledi" açılırsa görünür.

## 4. Süre bütçesi (toplam ≈ 4 saat)

| Parça | Süre |
|---|---|
| İstasyon 1-9, her biri | 21-24 dk (toplam ≈ 3 sa 20 dk) |
| Hata defteri tekrarları (istasyonlara karışık) | dahil |
| Final: "Sınav Günü" koşusu (10 karışık soru) | 20 dk |
| Mola/menü/ayarlar tamponu | 10 dk |
| İstasyon 10 (opsiyonel) | +20 dk |

Oyun, geçen süreyi sayar ve süre azalırsa hızlı mod önerir (bkz. `07`).

## 5. Ekran düzeni (KRİTİK)

Kullanıcı özellikle istedi: **yol (koşu alanı) ekranın çoğunu kaplayacak.**

Masaüstü öncelikli (en az 1100 px genişlik). Sayfa kaydırılmaz (`html,body{height:100%;overflow:hidden}`), tüm oyun tek ekrana sığar.

```
┌─────────────────────────────────────────────────────────────┐ ← 8vh  (min 52px)  ÜST ŞERİT
│ [⚙] İstasyon 3/9 · Işık-test odası   [Voltaj ████████ 100]  │
│ [engel şeridi: ○ ○ ● ○ ○ ○ ○ ○ ○]          [Geçen 1s 12dk]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    YOL (KOŞU ALANI)                         │ ← en az 56vh
│   koşucu →      engel                    ┌────────────────┐ │   genişlik: 100vw − 2×16px
│   ═══════════════════════                │ patron paneli  │ │   (yani ekranın ≥ %97'si)
│                                          │ (sağda, %34)   │ │
│                                          └────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ DOCK (soru / seçenekler / eminlik / simülasyon)             │ ← kalan (≈ 30vh), kendi içinde kayar
└─────────────────────────────────────────────────────────────┘
```

Kesin ölçüler:
- `.topbar`: yükseklik `clamp(52px, 8vh, 72px)`.
- `.runway`: `flex: 1 1 auto; min-height: 56vh;` genişlik **kapsayıcının tamamı** (kapsayıcı yan boşluk 16px). Canvas bu alanı tamamen doldurur.
- `.dock`: `height: clamp(240px, 32vh, 360px); overflow:auto`.
- Patron geldiğinde patron paneli **yolun içinde, sağda** durur: genişlik yolun `%34`'ü, yükseklik yolun `%94`'ü. Soru balonu panelin üstündedir. Seçenekler dock'tadır.
- Kod: `100dvh` kullan; `100vh` kullanma.

## 6. Engel türleri (özet; ayrıntı `01` ve `02`)

| `tip` | Yolda görünen | Öğretme işi |
|---|---|---|
| `hikaye` | Zaman kapısı (saatli kemer) | Konunun hikâyesi, 3 kısa satır, bilim insanı kamera hakkı |
| `kavram` | Kavram kapısı (kollu kapı) | Etkileşimli simülasyon, görevi yapınca kapı açılır |
| `dusman` | Küçük kusur düşmanı | 1 cümlelik kavram sorusu, 3 seçenek + eminlik |
| `tahmin` | Zemin çukuru | Önce tahmin et + eminlik, sonra simülasyon doğrular |
| `tuzak` | Dikenli plaka | Yanlış cümledeki hatalı parçayı bul |
| `kopru` | Kırık köprü | Mantık zincirini sürükleyerek sıraya diz |
| `patron` | Bilim insanı canavar | Sınav tarzı açık uçlu soru (Claude puanlar) |
| `sandik` | Sandık | Bilim insanı kartı, fabrika makinesi, özet, kontrol noktası |

Bir istasyonun sırası **her zaman**: `hikaye → kavram → dusman → dusman → tahmin → tuzak → kopru → (hata defteri düşmanı, çalışma anında eklenir) → patron → sandik`.

## 7. Stil: "Neon Çizgi Roman" (kullanıcı kararı)

Kullanıcı: *"Koyu neon bilim kurgunun en iyi özelliklerini al, renkli çizgi romanla birleştir. Modifiye edilmiş renkli çizgi roman."*

Özet (tam tokenlar `05-sanat-ui-kiti.md`):
- **Çizgi romandan:** kalın mürekkep çizgisi, düz doygun renk dolgular, konuşma balonları, yarım ton (halftone) nokta dokusu, sert ofset gölge, Lilita One başlık + Nunito gövde, "BAM!" patlama etiketleri.
- **Neon'dan:** koyu lacivert-mor zemin (göz yormaz, odak verir), yalnızca **enerji/etkileşim** öğelerinde parıltı (voltaj çubuğu, canavar aurası, seçili öğe, yol çizgisi), perspektif ızgara zemin.
- **Neon'un zayıflığı düzeltilir:** küçük soluk yazı yok. Tüm metin ≥ 16 px, kontrast ≥ 4.5:1. Tarama çizgisi (scanline) overlay **yok**.
- Parıltı **metne uygulanmaz**.

## 8. Teknik kısıtlar (artifact ortamı)

- **Tek HTML çıktısı**: `oyun/dist/oyun.html`. Kaynak parçalar `oyun/src/` altında, derleme `build.sh` ile birleştirme (bkz. `08`). Paketleyici (webpack vb.) **yok**.
- Dış kaynak yalnızca **Google Fonts** (stylesheet) ve `cdnjs.cloudflare.com` script'leri. Görsel/ses dosyası yok: her şey **canvas / SVG / CSS** ile çizilir.
- `fetch`/XHR ile dış sunucuya erişim **yoktur** (CSP). Claude erişimi `sample` yeteneği ile yapılır (bkz. `04`).
- `localStorage` her okuma/yazma `try/catch` içinde. Yoksa oyun bellekte çalışır.
- `alert/confirm/prompt` **yok** (çalışmaz). Onaylar sayfa içi.
- `window.print`, indirme bağlantısı, `mailto:` yok.
- Klavye erişilebilirliği: tüm düğmeler `button`, odak halkası görünür, `Esc` = duraklat.
- `prefers-reduced-motion`: parallax ve sarsıntı kapanır, geçişler anlık olur; oyun yine de oynanır.
- Performans hedefi: 60 fps, tek `requestAnimationFrame` döngüsü, `dt` en fazla 50 ms ile sınırlı, sekme gizliyken duraklat.

## 9. Başarı ölçütleri (sınava dönük)

Oyun bitince oyuncu şunları **kendi cümlesiyle** yazabilmeli (patron fazlarında test edilir):
1. Kristalin yarıiletkende neden gerektiği; CZ'de tek kristalin nedeni.
2. Kuantum mekaniğinin doğuş nedenleri; H atomunun kararlılığı.
3. Schrödinger denkleminin girdi/çıktısı; sonsuz kuyuda kuantalaşma ve sıfır noktası enerjisi.
4. Basamak/bariyerde yansıma ve tünelleme mantığı.
5. Postülatlar; özdurum olmayan durumda ölçümde çökme; belirsizlik ilkesi ve eşlenik değişkenler.
6. Periyodik yapıda enerji bantlarının oluşumu.

## 10. Bilinen tuzaklar (oyunun içine "tuzak" olarak gömülür)

Kullanıcının testte yaptığı hatalar. Her biri en az bir `tuzak` engeli ve bir hata defteri tohumudur:

| Kavram id | Yanlış inanç | Doğrusu |
|---|---|---|
| `fotoelektrik_siddet` | Işığı parlaklaştırırsam eşik altında da elektron kopar | Tek foton yetmez; şiddet foton sayısını artırır, enerjisini değil |
| `sifir_noktasi_sicaklik` | Sıfır noktası enerjisi sıcaklıktan gelir | Sınır koşulundan gelir; mutlak sıfırda da E₁ > 0 |
| `belirsizlik_alet` | Belirsizlik ölçüm aletinin kusurudur / ölçümün bozmasıdır | Dalga doğasının temel sonucu |
| `schrodinger_cokme` | Schrödinger denklemi çöker / olasılık denklemidir | Denklem düzgün evriltir, çökme ölçümle olur; özdeğer problemidir |
| `kuantalasma_olcum` | Enerji kuantalaşması ölçüm sonucudur | Sınır koşullarından çıkar |
| `bant_sonsuz_kuyu` | Sonsuz kuyuda bantlar var | Bantlar çok atomlu katıda oluşur |
| `iletken_olasilik` | İletken/yalıtkan farkı olasılık farkıdır | Bant doluluğu ve bant aralığı |
| `kristal_pahali` | Kristal pahalı olduğu için tercih edilir | Periyodiklik öngörülebilir bantlar verir |
