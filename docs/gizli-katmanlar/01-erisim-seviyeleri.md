# 01 — Kapalı Erişim Seviyeleri

## Amaç

Sisteme daha çok katkı veren kişiye daha değerli içeriği açmak. "Ne kadar topluma fayda sağlarsan o kadar içeriğe erişirsin" ilkesinin doğrudan uygulaması.

## İki ayrı birim: Kredi ve İtibar

Tek bir puanla hem harcama hem seviye belirlenirse çelişki çıkar: İndirme yaptıkça puanın düşer, seviyen de düşer. Bu yüzden iki ayrı birim kullanılır:

| Birim | Nasıl kazanılır? | Harcanır mı? | Ne işe yarar? |
|---|---|---|---|
| **Kredi** | Yükleme, indirilme, iyi puan, oy verme | Evet | Tek tek dosya indirmek |
| **İtibar** | Toplam katkı (onaylanan yüklemeler, aldığı puanlar, isabetli raporlar) | Hayır | Seviye belirlemek |

İtibar çok yavaş azalır (ör. her dönem %10). Böylece bir kez katkı verip yıllarca üst seviyede kalmak mümkün olmaz, ama kısa bir aradan sonra seviye kaybedilmez.

## Seviyeler

| Seviye | Koşul (örnek eşik) | Açılan içerik |
|---|---|---|
| **Ortak havuz** | Herkes, kayıt bile gerekmeyebilir | 3 yıldan eski içerik |
| **Bronz** | E-posta doğrulaması | Ortak havuz + 1-3 yıllık içerik |
| **Gümüş** | İtibar ≥ 50 (ör. 3-4 onaylı, iyi puanlı yükleme) | + son 1 yılın içeriği |
| **Altın** | İtibar ≥ 200 ve en az 2 farklı derse katkı | + son dönemin içeriği, çözümlü setler |

Eşikler örnektir; pilot verisi ve simülasyonla ayarlanmalı.

## Kademeli iniş (zamanla açılma)

İçerik bir seviyede sonsuza kadar kilitli kalmaz. Zamanla bir alt seviyeye iner:

```
Altın ──(6 ay)──▶ Gümüş ──(1 yıl)──▶ Bronz ──(2-3 yıl)──▶ Ortak havuz
```

Örnek: 2026 güz finali çözümleri önce sadece Altın seviyededir. 2027 bahar sonunda Gümüş'e, 2028'de Bronz'a, 2029-2030'da ortak havuza iner.

Bu iniş iki sorunu çözer:

1. **1. sınıf sorunu:** Henüz katkı veremeyen öğrenci, üst sınıfların birkaç yıl önceki içeriğine yine de ulaşır.
2. **Kurum kültürü hedefi:** Arşiv zamanla tamamen kamusal hale gelir. Seviyeler, saklama kültürünü kalıcılaştırmaz; sadece katkı verene **zaman avantajı** sağlar.

## Kilitli içerik görünür mü?

**Önerilen: Varlığı görünür, içeriği kilitli.**

Örneğin Bronz seviyedeki bir kullanıcı aramada şunu görür:

```
🔒 Devre Analizi — 2026 Final Çözümleri (Altın)
   ⭐ 4,7 · 63 indirme · Altın seviyede açılır
   Altın'a 140 itibar kaldı. [Nasıl kazanırım?]
```

Neden tamamen gizlemek yerine bu?

- **Motivasyon:** Kilitli ama görünen içerik, katkı vermek için en güçlü teşviktir. Varlığından haberin olmadığı bir şey için çaba harcamazsın.
- **Güven:** "Üst seviyede gizli bir kulüp var, neler döndüğünü bilmiyoruz" algısı, projenin çözmek istediği güvensizliğin aynısıdır.

İçerik başlığının bile gizli kalması gereken istisnai durumlar (ör. kişisel bilgi içeren dosyalar) moderatör kararıyla işaretlenir.

## Riskler ve önlemler

| Risk | Önlem |
|---|---|
| Seviye için sahte katkı | Seviye, krediden değil itibardan hesaplanır; itibar sadece onaylı ve iyi puanlı katkıdan gelir (bkz. [manipülasyon/03](../manipulasyon/03-kredi-kasma.md)). |
| Altın kullanıcının içeriği alt seviyelere sızdırması | Altın içerik en güçlü filigran ve varyant katmanlarıyla dağıtılır (bkz. [03](03-tuzak-dosyalar.md)). |
| Üst seviyenin kapalı bir elite dönüşmesi | Kademeli iniş zorunludur; hiçbir içerik kalıcı olarak kilitli kalmaz. |

## Açık sorular

- Bölüm dışından kullanıcılar (ör. yan dal öğrencileri) hangi seviyeden başlar?
- Moderatörlük emeği itibar kazandırmalı mı?
