# Aygıt Fiziği – Kuantum Bölümü: 4 Saatlik Çalışma Planı

**Sınav biçimi:** Klasik (açık uçlu), "mantık" ağırlıklı, hesaplama az. Schrödinger vurgulu.
**Başlangıç seviyesi:** Genel kültür var, mekanizma ("ne, neden") zayıf. Türev/integral orta-üstü, diferansiyel denklem yok.
**Çalışma yöntemi (her blokta aynı):** 1) Önce örnek soru → 2) Mantığın açıklanması → 3) Sen kendi cümlenle 3-5 cümle yazarsın → 4) Claude geri bildirim verir.

> Not: PDF/konu listesi depoya yüklenmediği için konular Aygıt Fiziği'ndeki standart kuantum girişine göre seçildi. PDF yüklenirse plan revize edilir.

## Teşhis (4 açık uçlu sorunun sonucu)

| Konu | Durum | Düzeltme |
|---|---|---|
| Neden kuantum? | Yarım doğru | "Küçük cisimler farklı davranır" doğru ama eksik. Klasik fiziğin **somut** başarısızlıkları: kara cisim ışıması, fotoelektrik olay, atomun kararlılığı/ayrık spektrum. Büyük sayılar yasası klasik sınırı açıklar, ama kuantum rastgeleliği **bilgi eksikliği değil, doğanın yapısıdır**. |
| Schrödinger denklemi | **Kritik karışıklık** | Denklem **çökmez**. Zamana bağlı denklem ψ'yi düzgün ve belirlenimci biçimde evriltir. "Çökme" ayrı bir postüladır ve **ölçümle** olur. Girdi: potansiyel V(x) + sınır koşulları. Çıktı: ψ ve izinli E değerleri. |
| Enerji kuantalaşması | Bilinmiyor | Sınır koşulunu sağlayan dalga ancak belirli E değerlerinde var olur (gitar teli gibi). |
| İletken/yalıtkan | Bilinmiyor | Fark "olasılık" değil, **enerji bantları ve bant aralığıdır**. |

**Üç ana tuzak (şıklı testte de takıldığın yerler):**
1. Işığın şiddeti ≠ foton enerjisi (fotoelektrik).
2. Kuantalaşma = sınır koşullarının sonucu (ayrı bir varsayım değil).
3. Belirsizlik = dalga doğasının sonucu (alet kusuru değil).

## Omurga: Tek bir neden-sonuç zinciri

Sınavda cümle kurabilmek için bütün konu şu zincirdir. Her bloğu bu zincire bağla.

```
Klasik fizik başarısız → ışık ve madde hem dalga hem parçacık → davranışı ψ (dalga fonksiyonu) tarif eder
→ ψ'yi Schrödinger denklemi verir → sınır koşulları sadece belirli E'lere izin verir (kuantalaşma)
→ atomda seviyeler → çok atom bir araya gelince seviyeler yarılır, bantlar oluşur
→ bant doluluğu ve bant aralığı → iletken / yalıtkan / yarı iletken
```

## Zaman Çizelgesi (240 dk)

| # | Süre | Blok | Hedef cümle (sınavda yazabilmelisin) |
|---|---|---|---|
| 0 | 15 dk | Harita | Zinciri kâğıda kendi kelimelerinle çiz. |
| 1 | 35 dk | Neden kuantum? | "Klasik fizik X'i açıklayamadı, kuantum fikri Y ile çözdü." |
| 2 | 30 dk | Dalga-parçacık, belirsizlik | "Konumu keskin dalga paketi çok dalga boyunun toplamıdır, o yüzden momentum yayılır." |
| 3 | 50 dk | **Schrödinger (çekirdek blok)** | "Denklem V(x) ve sınır koşulundan ψ ve izinli E'leri üretir." |
| 4 | 25 dk | Tünelleme ve sonlu kuyu | "ψ bariyerde üstel sönümlenir ama sıfır olmaz, bu yüzden geçiş olasılığı sıfırdan büyüktür." |
| 5 | 30 dk | Atomdan katıya: bantlar | "N atom, her seviyeden N yakın seviye üretir (Pauli), bantlar böyle oluşur." |
| 6 | 35 dk | Sınav provası | 8 açık uçlu soru, her biri 3-5 cümle. |
| 7 | 20 dk | Hata defteri ve son tekrar | Tuzakların ve zayıf noktaların son turu. |

## Blok ayrıntıları

### Blok 0: Harita (15 dk)
- Yukarıdaki zinciri okuyup kapat, sonra kendi cümlenle yaz. Eksik halka = çalışılacak yer.

### Blok 1: Neden kuantum? (35 dk)
- **Önce soru:** Isıtılan bir demir önce kırmızı, sonra beyaz parlıyor. Klasik fizik bunu neden açıklayamıyordu? (Her frekansa sonsuz enerji → "mor ötesi felaketi".)
- **Mantık:** Planck: enerji paketli (E = hf). Böylece yüksek frekans "pahalılaşır" ve sonsuzluk kaybolur.
- **Fotoelektrik:** Eşik altında şiddet artsa da elektron çıkmaz. Tek foton, tek elektron.
- **Atom spektrumu:** Atomlar sürekli değil, belirli renklerde ışır. Seviyeler ayrık.
- **Yaz:** Klasik fiziğin 3 başarısızlığını ve hangisinin hangi fikri doğurduğunu 1 cümleyle.

### Blok 2: Dalga-parçacık ikiliği ve belirsizlik (30 dk)
- **Önce soru:** Elektron çift yarıktan tek tek gönderilirse ekranda ne oluşur? (Tek tek noktalar, zamanla girişim deseni.)
- **Mantık:** de Broglie: parçacığın dalga boyu λ = h/p. Bilardo topunda λ ihmal edilebilir, elektronda değil.
- **Belirsizlik:** Dalga paketi mantığıyla anlat: keskin konum = çok dalga boyu = yayılmış momentum.
- **Sorunun cevabı (S1 klasik sınav):** "Küçüldükçe rastgeleleşme" değil, dalga boyu cismin boyutuyla kıyaslanabilir olunca dalga davranışı görünür olur.

### Blok 3: Schrödinger (50 dk, en önemli blok)
1. **(10 dk) Denklem ne yapar?** Girdi: potansiyel enerji V(x) ve sınır koşulları. Çıktı: ψ(x) ve izinli E değerleri. Hesap yok, rolünü anla.
2. **(10 dk) ψ ve |ψ|²:** ψ ölçülemez, |ψ|² bulunma olasılık yoğunluğudur. Toplam olasılık 1.
3. **(15 dk) Kuantalaşma nereden gelir?** Gitar teli benzetmesi: uçları sabit tel sadece belirli frekanslarda titreşir. Aynı şekilde kuyuda ψ duvarlarda sıfır olmak zorundadır, bu da yalnızca belirli dalga boylarına ve dolayısıyla belirli E'lere izin verir.
4. **(5 dk) Sıfır noktası enerjisi:** Kuyuya sığan en uzun dalga bile sonlu λ taşır, yani E > 0.
5. **(10 dk) Çökme nedir?** Zamana bağlı denklem belirlenimcidir, ψ'yi düzgünce evriltir. Ölçüm ayrı bir olaydır: ψ, ölçülen duruma çöker. İkisini asla karıştırma.
- **Yaz:** "Schrödinger denklemi nedir, ne verir, kuantalaşma nasıl çıkar?" sorusuna 5 cümle.

### Blok 4: Tünelleme ve sonlu kuyu (25 dk)
- **Önce soru:** Enerjisi bariyerden düşük elektron nasıl geçebilir?
- **Mantık:** ψ bariyerin içinde sıfır olmaz, üstel sönümlenir. Bariyer inceyse öbür tarafta kalan ψ sıfırdan farklıdır. Bu, aygıtlarda (tünel diyodu, flash bellek) gerçek bir etkidir.
- **Sonlu kuyu:** ψ duvarın içine "sızar", seviyeler sonsuz kuyudakinden daha düşük çıkar.

### Blok 5: Atomdan katıya (30 dk)
- **Önce soru:** Bakır iletken, elmas yalıtkan. Aynı kuantum fiziği bunu nasıl açıklar?
- **Mantık:** İki atom yaklaşınca ψ'ler örtüşür, her seviye ikiye yarılır (Pauli ilkesi aynı durumu yasaklar). N atom = N yakın seviye = bir **bant**.
- **İletken:** Son bant yarı dolu, elektronun hareket edeceği boş seviye hemen yanında.
- **Yalıtkan:** Dolu bant ile boş bant arasında büyük **bant aralığı**.
- **Yarı iletken:** Bant aralığı küçük, ısı veya ışıkla elektron üst banda atlayabilir.
- **Yaz:** Üç malzemeyi bant resmiyle 1'er cümleyle ayır.

### Blok 6: Sınav provası (35 dk)
Claude sana 8 açık uçlu soru sorar (Schrödinger ağırlıklı). Sen her birine 3-5 cümleyle cevap yazarsın, Claude "doğru / eksik / yanlış kavram" diye geri bildirim verir. Şık yok. Cevabı kendin kurmalısın.

### Blok 7: Hata defteri ve son tekrar (20 dk)
- Yanlış çıkan ya da "bilmiyorum" dediğin her noktayı tek cümleyle yaz.
- Zinciri tekrar çiz, bu sefer hiç bakmadan.

## Kısa kural listesi (çalışırken)
- Bir cevabı yazarken "neden?" sorusunu en az bir kez kendine sor.
- "Çünkü formül öyle" yetmez, mantığı cümleyle anlat.
- Takıldığın yerde tahmin etme, "bilmiyorum" de, birlikte kuralım.
