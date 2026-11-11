# Elektronik Malzemeler ve Aygıt Fiziği: 4 Saatlik Çalışma Planı (v3)

**Kaynaklar:** Örnek sınav PDF'i (10 soru) ve 4 konu başlığı.
**Öncelik (kullanıcıdan):**
- Konu 1 ve 2 (kristal özellikler, kafes yapıları, Miller indisleri) **en önemli**. Konu 3 ve 4'ün (bantlar, Fermi, drift) derste ne kadar işlendiği belli değil.
- Örnek sorular gerçek sınavın zorluk seviyesini yansıtıyor. Hoca "kolay soracağım" dedi, işlem muhtemelen az.
- Bu yüzden: kavramsal sorular ve Miller uygulaması öne, hesaplar "tarif" seviyesinde ve sona.

**Yöntem (her blokta):** örnek soru → mantık → senin 3-5 cümlen → geri bildirim. Şık yok, kendi cümlenle.

## Örnek sınavın haritası

| Soru | Tür | Konu | Blok |
|---|---|---|---|
| 1. Kristal katılar neden yarıiletken endüstrisinde? | Açıklama | Kristal | 1 |
| 2. CZ yönteminde tek kristal büyütmenin ana nedeni | Açıklama | Kristal | 1 |
| 3. Kuantum mekaniğinin doğuş ve başarı nedenleri | Açıklama | Kuantum | 3 |
| 4. Hidrojen atomunun kararlılığı | Açıklama | Kuantum | 3 |
| 5. Potansiyel için ψ ve izinli enerjiler | Hesap (tarif) | Schrödinger | 5, 6 |
| 6. Basamak potansiyelinde ψ, yansıma katsayısı | Hesap (tarif) | Schrödinger | 6 |
| 7. Periyodik yapıda izinli enerjiler neden bant? | Açıklama | Bantlar | 7 |
| 8. Kuantum mekaniğinin ilkeleri | Açıklama | Postülatlar | 4 |
| 9. 3. postülat: özdurum değilse ölçümde ne olur? | Açıklama | Ölçüm | 4 |
| 10. Belirsizlik ilkesi, eşlenik değişkenler | Açıklama | Belirsizlik | 4 |

## Teşhis

| Konu | Durum |
|---|---|
| Neden kuantum? | Yarım doğru, somut başarısızlıklar eksik |
| Schrödinger | **Kritik karışıklık:** denklem çökmez, çökme ölçümle olur |
| Kuantalaşma | Bilinmiyor: sınır koşulu → duran dalga → λ kısıtı → E kısıtı |
| Bantlar | Pauli'yi hatırlıyor, mekanizmayı kuramıyor |
| Kristal / Miller | **Henüz test edilmedi, Blok 1'de ölçülür** |

**Tekrar eden hata:** "Sıfır noktası enerjisi sıcaklıktan gelir." Yanlış. Sebep sınır koşuludur.

## Zaman Çizelgesi (240 dk)

| # | Süre | Blok | PDF sorusu |
|---|---|---|---|
| 0 | 10 dk | Harita ve sınav analizi | hepsi |
| 1 | 45 dk | **Kristal yapı, yarıiletkenler, CZ** | S1, S2 |
| 2 | 35 dk | **Miller indisleri (uygulama ağırlıklı)** | Konu 2 |
| 3 | 20 dk | Neden kuantum, H atomu kararlılığı | S3, S4 |
| 4 | 30 dk | Postülatlar, ölçüm, belirsizlik | S8, S9, S10 |
| 5 | 35 dk | Schrödinger, sonsuz kuyu (mantık ağırlıklı) | S5 |
| 6 | 15 dk | Basamak, bariyer, yansıma (kısa) | S5, S6 |
| 7 | 25 dk | Periyodik yapı → bant; Fermi ve drift (işlendiyse) | S7, Konu 3-4 |
| 8 | 20 dk | Sınav provası (PDF'ten 4 soru) | seçilir |
| 9 | 5 dk | Hata defteri | - |

## Ana zincir

```
Kristal (periyodik kafes) → periyodik potansiyel → Schrödinger → sınır koşulları kuantalaşma
→ çok atom: seviyeler yarılır, bantlar → Fermi seviyesi, taşıyıcı sayısı → drift akımı
```

## Blok ayrıntıları

### Blok 1: Kristal yapı, yarıiletkenler, CZ (S1, S2)
- **Katı türleri:** tek kristal (uzun menzilli düzen), çok kristalli (küçük kristal taneleri), amorf (düzen yok).
- **Kristal = kafes + baz.** Birim hücre kafesi öteleme ile tekrar eder. Kafes sabiti a (Si için ≈ 5,43 Å).
- **Kübik hücreler:** sc (hücre başına 1 atom, doluluk %52), bcc (2 atom, %68), fcc (4 atom, %74).
- **Elmas yapı:** fcc kafes + iki atomlu baz. Her atomun 4 komşusu var (tetrahedral). Si ve Ge elmas yapıdadır.
- **Çinko sülfür (zincblende):** elmas yapıya benzer ama iki farklı atom. GaAs bu yapıdadır.
- **Yarıiletken grupları:** element (Si, Ge, IV. grup), bileşik (GaAs gibi III-V, ZnS gibi II-VI).
- **S1 cevabı:** Kristalde periyodik potansiyel iyi tanımlı enerji bantları ve bant aralığı verir, böylece elektriksel özellikler tahmin edilebilir ve katkılama ile kontrol edilir. Çok kristalli veya amorf yapıda tane sınırları ve sarkık bağlar taşıyıcıları saçar veya tuzaklar, özellikler tekrarlanamaz hale gelir.
- **CZ (Czochralski) yöntemi:** Eriyik silisyuma bir tohum kristal batırılır, yavaşça döndürülerek çekilir, eriyik tohumun kristal düzenini devam ettirerek katılaşır.
- **S2 cevabı:** Tek kristalde tane sınırı yoktur. Tane sınırları taşıyıcı hareketliliğini ve ömrünü düşürür, aygıt özelliklerini kristalden kristale değiştirir. Tek kristal, tüm waferde aynı iyi tanımlı bant yapısını garanti eder.

### Blok 2: Miller indisleri (Konu 2, uygulama ağırlıklı)
**Düzlem (hkl) için 4 adım:**
1. Düzlemin eksenleri kestiği noktaları bul (a birimiyle).
2. Tersini al.
3. Kesirleri en küçük tam sayılara çevir.
4. Parantez içine yaz: (hkl). Düzlem bir eksene paralelse kesişim ∞, indis 0.

**Örnekler:**
- Kesişimler 1, 1, 1 → (111)
- Kesişimler 2, ∞, ∞ → ters: ½, 0, 0 → ×2 → (100)
- Kesişimler 1, 2, ∞ → ters: 1, ½, 0 → ×2 → (210)
- Negatif kesişim → indisin üstüne çizgi (bar).

**Notasyon:** (hkl) tek düzlem, {hkl} kübik simetriyle eşdeğer düzlem ailesi, [uvw] yön, ⟨uvw⟩ yön ailesi. Kübikte [hkl] yönü (hkl) düzlemine diktir.
**Düzlem aralığı (kübik):** d = a / √(h²+k²+l²).
**Pratik bilgi:** Si waferler genellikle (100) veya (111) yönünde kesilir. (100) MOS aygıtlarda arayüz kusurları düşük olduğundan, (111) ise yüzey atom yoğunluğu yüksek olduğundan anılır.
**Uygulama:** Bu blokta 6-8 farklı düzlem/yön sorusu birlikte çözülür.

### Blok 3: Neden kuantum, H atomu (S3, S4)
- Klasik başarısızlıklar: kara cisim (mor ötesi felaketi → Planck E=hf), fotoelektrik (eşik altında şiddet işe yaramaz), atom spektrumu (ayrık çizgiler).
- **H atomu kararlılığı:** Klasikte yörüngedeki elektron ışıma yapıp çekirdeğe düşmeli. Kuantumda elektron hapsolmuş bir dalgadır, en düşük durumun enerjisi sıfır olamaz. Daha çok sıkışırsa kinetik enerji artar (belirsizlik), bu yüzden bir denge yarıçapında durur.

### Blok 4: Postülatlar, ölçüm, belirsizlik (S8, S9, S10)
- **İlkeler:** (1) Durum ψ ile tarif edilir, |ψ|² olasılık yoğunluğu. (2) Her ölçülebilir büyüklük bir operatördür. (3) Ölçüm yalnızca operatörün özdeğerlerini verir. (4) ψ = Σ cₙφₙ ise a_n bulunma olasılığı |cₙ|². (5) Zamanla evrim Schrödinger denklemiyle.
- **S9 cevabı:** Sistem özdurumda değilse özdurumların süperpozisyonundadır. Ölçüm, özdeğerlerden birini |cₙ|² olasılığıyla verir ve ψ o özdurumuna çöker. Tekrar ölçülürse aynı sonuç çıkar.
- **S10 cevabı:** Konum ve momentum operatörleri değişmez ([x,p]=iħ), ortak özdurumları yoktur. Dalga paketi mantığı: konumu keskin dalga çok dalga boyu içerir, momentum yayılır. ΔxΔp ≥ ħ/2. Alet kusuru değildir.

### Blok 5: Schrödinger, sonsuz kuyu (S5, mantık ağırlıklı)
- Sınır koşulu ψ(0)=ψ(L)=0 → L = nλ/2 → λ = 2L/n → p = nh/2L → E ∝ n²/L².
- **ψₙ = √(2/L) sin(nπx/L)**, **Eₙ = n²π²ħ²/(2mL²)**. Pratik: elektron için Eₙ ≈ 0,376·n²/L² eV (L nm cinsinden).
- n = 0 yok, E₁ > 0 (sıfır noktası enerjisi, ısıdan bağımsız).
- Denklem çökmez: zamana bağlı Schrödinger denklemi ψ'yi belirlenimci evriltir, çökme yalnızca ölçümle olur.

### Blok 6: Basamak, bariyer (S5, S6, kısa)
- **Basamak (E>V₀):** k₁=√(2mE)/ħ, k₂=√(2m(E−V₀))/ħ. ψ ve ψ' x=0'da sürekli. r=(k₁−k₂)/(k₁+k₂), **R=|r|²**, T=1−R.
- **E<V₀:** R=1, ψ bölge 2'de e^(−κx) ile sönümlenir, κ=√(2m(V₀−E))/ħ.
- **S5'te olası yaklaşım (hocayla teyit):** 9 eV bariyer 10 nm kalınlıkta ve izinli E çok düşükse κd ≈ 150, iki kuyu pratikte bağımsızdır, Eₙ ≈ 20 nm'lik sonsuz kuyu seviyeleri (her seviye iki katlı).

### Blok 7: Periyodik yapı → bant; Fermi ve drift (S7, Konu 3-4)
- **S7 cevabı:** Periyodik potansiyelde N atomun seviyeleri örtüşür. Pauli aynı durumu yasakladığı için her seviye N yakın seviyeye yarılır. N ~ 10²² olunca seviyeler sürekli bant gibi görünür. Bantlar arasında izinli olmayan bant aralığı kalır.
- İletken: bant yarı dolu. Yalıtkan: dolu bant + büyük aralık. Yarıiletken: küçük aralık, ısıyla taşıyıcı üretilir.
- **Derste işlendiyse:** Fermi-Dirac f(E) = 1/(1+e^((E−E_F)/kT)); np = nᵢ²; drift v_d = μE, J = q(nμₙ+pμₚ)E.
- İşlenmediyse bu kısım atlanır, S7 yeterlidir.

### Blok 8: Sınav provası
PDF'ten 4 soru seçilir (en az biri kristal, en az biri Schrödinger). Kendi cümlenle cevaplanır.

### Blok 9: Hata defteri
Yanlış çıkan her noktayı tek cümleyle yaz. Zinciri hiç bakmadan çiz.

## Kural
"Çünkü formül öyle" yetmez. Her cevapta "neden?" sorusunu yanıtla.
