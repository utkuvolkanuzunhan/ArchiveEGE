# Manipülasyona Karşı Önlemler

Bu klasör, ArchiveEGE sisteminin kötüye kullanılma yollarını ve her birine karşı alınan önlemleri toplar.
Amaç: Sistemi kurmadan önce "biri bunu nasıl kandırır?" sorusunu sistematik olarak sormak.

## Hedef: Her hileyi kârsız kılmak

Her hileyi **imkânsız** kılmak mümkün değildir; bunu vaat eden hiçbir sistem yoktur (bankalar, sınav sistemleri ve oyun şirketleri dahil). Gerçekçi ve ulaşılabilir hedef şudur:

> Her hile için, **beklenen kazanç < beklenen maliyet** olmalıdır.

Beklenen maliyet = yakalanma olasılığı × ceza + hilenin gerektirdiği emek.

Örnek: Sahte hesapla 20 başlangıç kredisi kazanmak için bir arkadaşının okul e-postasını ödünç alması gerekir (emek). Yakalanırsa iki hesap da uzaklaştırılır ve tüm itibarını kaybeder (ceza). Oysa aynı 20 krediyi tek bir iyi not yükleyerek kazanabilir. Hile yapmak, dürüst katkıdan daha zahmetli ve riskli hale gelir.

Bu klasördeki her önlem, bu dengeyi hilecinin aleyhine çevirmek için vardır. Ek gizli önlemler (tuzak dosyalar, gizli yaptırım) [../gizli-katmanlar](../gizli-katmanlar/README.md) klasöründedir.

## Temel ilkeler

1. **Her kural bir gün kandırılır.** Önlemler katmanlı olmalı; tek bir önleme güvenilmez.
2. **Önlem, koruduğu şeyden pahalı olmamalı.** Pilot aşamasında basit önlemler yeterli; karmaşık olanlar kullanıcı sayısı arttıkça eklenir.
3. **Caydırıcılık, yakalamaktan önemlidir.** Önlemler (filigran gibi) kullanıcılara açıkça duyurulur.
4. **Yanlış suçlama, kaçırılan bir hileden daha zararlıdır.** Otomatik sistemler sadece işaretler; ceza kararını insan verir.
5. **Kurallar parametrelidir.** Eşik değerler (oy sınırı, kredi miktarı vb.) koda gömülmez, ayarlardan değiştirilir.

## Saldırı kataloğu

| No | Saldırı | Etki | Olasılık | Pilotta önlem var mı? |
|---|---|---|---|---|
| [01](01-sahte-hesap.md) | Sahte / çoklu hesap (Sybil) | Yüksek | Orta | Evet |
| [02](02-puan-manipulasyonu.md) | Puan (oy) manipülasyonu | Orta | Yüksek | Kısmen |
| [03](03-kredi-kasma.md) | Değersiz içerikle kredi kasma | Yüksek | Yüksek | Evet |
| [04](04-sizinti.md) | Kredili içeriğin dışarı sızdırılması | Orta | Yüksek | Evet |
| [05](05-rapor-kotuye-kullanimi.md) | Raporlama sisteminin kötüye kullanımı | Orta | Orta | Kısmen |
| [06](06-yetkili-kotuye-kullanimi.md) | Moderatör / yönetici kötüye kullanımı | Yüksek | Düşük | Kısmen |
| [07](07-katman-atlatma.md) | Erişim seviyelerini ve özel paylaşımı atlatma | Orta | Orta | Kısmen |

**Etki:** Saldırı başarılı olursa sisteme verdiği zarar.
**Olasılık:** Pilot ölçeğinde (yaklaşık 100-500 kullanıcı) denenme ihtimali.

## Yeni bir saldırı nasıl eklenir?

1. [SABLON.md](SABLON.md) dosyasını kopyalayın, sıradaki numarayla adlandırın (ör. `07-...md`).
2. Alanları doldurun. Somut bir örnek senaryo yazmak zorunludur.
3. Yukarıdaki kataloğa bir satır ekleyin.

Kullanıcılardan gelen geri bildirimler ("Şöyle hile yapılabilir") de bu şablonla buraya işlenir.

## Durum etiketleri

Önlem tablolarında kullanılan etiketler:

- `PİLOT` — İlk sürümde mutlaka olacak.
- `SONRA` — Kullanıcı sayısı artınca veya sorun görülünce eklenecek.
- `AÇIK` — Henüz karar verilmedi, tartışmaya açık.
