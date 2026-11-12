# HESAP: Hesap çalıştayı (Tekrar Merkezi sekmesi)

Sınavda küçük hesap çıkabildiği için (örnek sınav Soru 5 ve 6) Tekrar Merkezi'ne **"Hesap çalıştayı"** sekmesi eklendi. 34 görev, 15 konu, s01-s10'un hepsinde en az bir `istasyonSonu` görevi.

## Dosyalar
- `src/js/87-data-hesap.js`: veri + okuma API'si (`Q.data.hesap`, `Q.hesap`).
- `src/js/98-tekrar-hesap.js`: sekme arayüzü (`Q.tekrarHesap`). `97-tekrar.js`'e yalnızca iki küçük ekleme: `SEKMELER` listesine `['hesap','Hesap çalıştayı']` ve `git()` içinde yönlendirme.
- `test/hesap-dogrula.py`: tüm sayıların bağımsız (numpy/scipy) doğrulaması. `python3 oyun/test/hesap-dogrula.py [--yaz]`.
- `test/hesap.test.js`: Playwright testi (1366x768 ve 1440x900, 44 kontrol).

## Görev biçimi
`{id, istasyon:'s01'..'s10', istasyonSonu:bool, konu, baslik (EN), soru (EN, sınav tarzı), veriler:[], adimlar:[{baslik, metin, formul, kod?, adimSoru?}], sonuc:{deger, birim, metin}, sinavNotu, zorluk:1..3, tip:'sinav'|'alistirma'}`

`adimSoru` (oyun içi adım adım yönlendirme için): `{soru, sayiCevap:{deger, birim}, tolerans}` ya da `{soru, secenekler:[{t, dogru}]}`. Çözüm metni/formülü ara cevap doğru olunca (ya da "Çözümü göster" ile) açılır. Yazım: `^{üst}`, `_{alt}` işaretleri `Q.tekrarHesap.yaz(el, metin)` ile sup/sub olur.

## Okuma API'si (oyun içi entegrasyon için)
- `Q.hesap.liste()`: tüm görevler (kopya dizi).
- `Q.hesap.gorev(id)`: görev ya da `null`.
- `Q.hesap.istasyonSonu('s06')`: o istasyonun `istasyonSonu:true` görevleri (veri sırasıyla). `Q.hesap.istasyon(st)`: istasyonun tüm görevleri.
- `Q.hesap.konular`, `Q.hesap.konuAd(k)`.
- Arayüz yardımcıları: `Q.tekrarHesap.adimUI(host, adim, bitti, no)` (tek adım + ara cevap kutusu; `bitti()` adım açılınca çağrılır), `kontrol(girdi, hedef, tol)` (`{ok, v, gecersiz, ters}`; varsayılan ±%2, virgül/`1.5e-4`/`1,96×10^-8` kabul), `sayiOku`, `yaz`.
- Kayıt: `Q.state.hesapCalisma = {gorevId: 'cozdum'|'tekrar'}` (cip-hatti-v1 içinde, geriye uyumlu isteğe bağlı üst düzey alan; alan yoksa boş sayılır, `v:1` korunur).

## İstasyon eşlemesi (istasyonSonu)
| İst. | Görevler |
|---|---|
| s01 | atom-fcc, si-yogunluk |
| s02 | pack-fcc, miller-326 (ek: pack-bcc, miller-210) |
| s03 | foto-cu, foto-esik (ek: foton-400) |
| s04 | bohr-gecis, debroglie-100 (ek: bohr-iyon, debroglie-lam) |
| s05 | q5-bolgeler, q5-bos-kuyu (ek: q5-perturbasyon, q5-sayisal, q5-basit, kuyu-norm, kuyu-foton) |
| s06 | q6-e-gt, q6-e-lt (ek: tunel-1nm) |
| s07 | olc-p, olc-E |
| s08 | bel-v, bel-t |
| s09 | bant-si, bant-gaas |
| s10 | fd-100meV, drift-J (ek: fd-orta, np-ni, drift-v) |

## Sınav Soru 5 ve 6: ne yapıldı, hangi yaklaşım
**Soru 5** (50 nm sonsuz kuyu, 20-30 nm arası 9 eV engel), 5 görev:
1. `q5-bolgeler`: 3 bölge, her bölgede çözüm (V=0: sin/cos; engel E<V₀: gerçek üstel), sınır koşulları (iki duvar + x=20 ve 30'da ψ, ψ' sürekliliği), 4 bilinmeyen/4 homojen denklem, determinant=0; orta noktaya göre simetriden: çift `k cot(kw) = −κ tanh(κd/2)`, tek `k cot(kw) = −κ coth(κd/2)` (w=20 nm, d=10 nm). Sayı: κd = 153,7.
2. `q5-bos-kuyu`: ENGELSİZ 50 nm kuyu: ψₙ=√(2/L)sin(nπx/L), E₁=0,1504 meV, E₂=0,6016, E₃=1,354 meV. Açıkça "engelsiz" diye işaretli.
3. `q5-perturbasyon`: engelin birinci mertebe pertürbasyonu: ΔE₁ = 9 eV × 0,3871 = 3,484 eV, bu E₁⁽⁰⁾'dan ve seviye aralığından yaklaşık 10⁴ kat büyük. **Sonuç: pertürbasyon bu engel için GEÇERSİZ** (V₀ ≫ Eₙ); görevde bu açıkça yazılı. İstenen "pertürbasyon etkisi" bu yüzden bir geçerlilik testi olarak sunuldu, enerji düzeltmesi olarak değil.
4. `q5-sayisal`: tam çözüm. κd≈154 olduğundan engel pratik olarak geçirimsiz: iki bağımsız 20 nm kuyu (her seviye ikili, çift/tek ayrışması ~e^{−κd} ≈ 10⁻⁶⁷). Tam öz değer koşulu brentq ile: **E₁=0,9340 meV, E₂=3,7360, E₃=8,4059** (sonsuz 20 nm kuyu limiti 0,9401, %0,65 fark; nedeni ψ'nin engele 1/κ=0,065 nm sızması: 0,3760/20,065²=0,9340). Bağımsız çapraz denetim: sonlu fark (FD, dx=0,02 nm) ortalaması 0,9330 (±%0,1). Python kodu adımda gösterilir.
5. `q5-basit`: basitleştirilmiş sınav versiyonu (engel yerine sabit V=9 eV): ψₙ aynı, Eₙ = 9 eV + n²π²ħ²/2mL²; E₂−E₁ = 0,4512 meV.

**Soru 6** (basamak): `q6-e-gt` (E=10, V₀=5 eV: k₁=16,20, k₂=11,46 nm⁻¹, ψ_I=e^{ik₁x}+re^{−ik₁x}, ψ_II=te^{ik₂x}, r=(k₁−k₂)/(k₁+k₂), t=2k₁/(k₁+k₂), R=0,0294, T=0,971; T=(k₂/k₁)|t|² uyarısı) ve `q6-e-lt` (E=3, V₀=5 eV: ψ_II=te^{−κx}, κ=7,245 nm⁻¹, R=1, |t|²=4E/V₀=2,4, sızma derinliği 1/κ=0,138 nm).

## Doğrulama çıktısı (`python3 oyun/test/hesap-dogrula.py --yaz`)
Her görevin `sonuc.deger` ve her sayısal `adimSoru` değeri bağımsız hesapla %0,5 içinde eşleşmek zorunda; metinde geçen ek sayılar (Q5 E₁/E₂/E₃, etkin genişlik, P=0,3871, T=0,971, tam tünel T vb.) ayrıca denetlenir; kontrolü olmayan görev hata sayılır; her istasyonda `istasyonSonu` görevi aranır. Sabitler: CODATA 2018 (ħ²/2m=0,038100 eV·nm², hc=1239,84 eV·nm).

```
Q5 tam (meV): E1=0.93399 E2=3.73595 E3=8.40589 | FD ortalama: 0.93299 3.73194 8.39682 | boş 50 nm: 0.15041 0.60165 1.35371 | iki kuyu sınırı 20 nm: 0.94008 3.76030 8.46068
kappa(E->0, V0=9)=15.3695 nm^-1, kappa*d=153.70, e^-kd=1.78e-67
basamak R(E=2V0)=0.02944 ; E=10,V0=5: T=0.97056
tünel E=1,V0=4,a=1nm: e^-2ka=1.961e-08, tam T=5.883e-08
atom-fcc         sonuc=4 (veri 4)
si-yogunluk      sonuc=4.99678 (veri 4.997)
pack-fcc         sonuc=0.74048 (veri 0.7405)
pack-bcc         sonuc=0.680175 (veri 0.6802)
miller-326       sonuc=0.0775714 (veri 0.07757)
miller-210       sonuc=0.223607 (veri 0.2236)
foton-400        sonuc=3.0996 (veri 3.0996)
foto-cu          sonuc=0.259368 (veri 0.2594)
foto-esik        sonuc=539.062 (veri 539.06)
bohr-gecis       sonuc=656.112 (veri 656.1)
bohr-iyon        sonuc=3.40142 (veri 3.4014)
debroglie-100    sonuc=0.122643 (veri 0.12264)
debroglie-lam    sonuc=6.01648 (veri 6.0165)
q5-bolgeler      sonuc=153.695 (veri 153.7)
q5-bos-kuyu      sonuc=0.150412 (veri 0.1504)
q5-perturbasyon  sonuc=3.48388 (veri 3.484)
q5-sayisal       sonuc=0.933989 (veri 0.934)
q5-basit         sonuc=0.451236 (veri 0.4512)
kuyu-norm        sonuc=0.632456 (veri 0.6325)
kuyu-foton       sonuc=4.39625 (veri 4.396)
q6-e-gt          sonuc=0.0294373 (veri 0.02944)
q6-e-lt          sonuc=0.138021 (veri 0.138)
tunel-1nm        sonuc=1.96111e-08 (veri 1.961e-08)
olc-p            sonuc=0.8 (veri 0.8)
olc-E            sonuc=0.164513 (veri 0.1645)
bel-v            sonuc=578.838 (veri 578.8)
bel-t            sonuc=0.329106 (veri 0.3291)
bant-si          sonuc=1107 (veri 1107)
bant-gaas        sonuc=873.128 (veri 873.1)
fd-100meV        sonuc=0.0204688 (veri 0.02047)
fd-orta          sonuc=0.5 (veri 0.5)
np-ni            sonuc=22500 (veri 22500)
drift-v          sonuc=1350 (veri 1350)
drift-J          sonuc=21.6294 (veri 21.63)
96 kontrol, 0 hata
```

## Arayüz
Sol: konu / istasyon / tür filtresi ve görev listesi (✓ çözdüm, ↻ tekrar). Sağ: soru (İngilizce), Verilenler, kendi cevabını sayı olarak gir + Kontrol (±%2, birim hatırlatması, mertebe uyarısı), "Adım göster" (ara cevaplı adımlar sıradaki adımı kilitler), "Tümünü göster", sonuçta formül özeti + "Sınavda dikkat" + Çözdüm/Tekrar çalış. 1366x768 ve 1440x900'de yatay taşma yok (test).

## Testler
hesap.test.js 44/44; veri-dogrula, sinav-dogrula, core (8), battle (7), claude (11), runner, tekrar-hata (27), smoke 9/9 geçti.

## Sınırlar
- İstasyon sonu oyun içi entegrasyonu (yeni engel tipi `hesap`, runner/96-final bağlantısı) bu işin dışında; yalnızca veri ve okuma API'si hazır.
- Soru 5'in kesin beklenen cevabı hoca çözümüne bağlı: sınavda "iki bağımsız 20 nm kuyu" yaklaşımı gerekçesiyle (κd≈154) yazılması ve gerekirse hocayla teyit edilmesi önerilir.
