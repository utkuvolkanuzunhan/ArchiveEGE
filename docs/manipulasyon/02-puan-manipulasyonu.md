# 02 — Puan (Oy) Manipülasyonu

## Tanım

Dosya puanlarının gerçek kaliteyi yansıtmayacak şekilde yapay olarak yükseltilmesi veya düşürülmesi.

## Örnek senaryolar

- **Arkadaş halkası:** 5 kişilik bir grup birbirlerinin tüm dosyalarına sürekli 5 yıldız verir; dosyaları öne çıkar ve kalite bonusu kazanırlar.
- **İntikam oyu:** Ayşe, tartıştığı Can'ın tüm dosyalarına 1 yıldız verir.
- **Gelişigüzel oy:** Oy verme kredi kazandırdığı için Burak her dosyaya düşünmeden 5 yıldız verir.
- **Az oylu dosyanın zirvesi:** Tek bir 5 yıldızlı oy alan dosya, basit ortalamada 80 oylu iyi dosyaların önüne geçer.

## Etki

- Arama sıralaması yanıltıcı olur; kötü içerik öne çıkar.
- Kalite bonusu hak etmeyene gider.
- Haksız düşük oy alan yükleyici motivasyonunu kaybeder.

## Önlemler

| Önlem | Açıklama | Durum |
|---|---|---|
| Sadece indiren oy verir | Dosyayı indirmemiş kullanıcı oy veremez. | `PİLOT` |
| Kendi dosyasına oy yok | Yükleyici kendi dosyasını puanlayamaz. | `PİLOT` |
| Kişi başı tek oy | Oy değiştirilebilir ama ikinci oy eklenemez. | `PİLOT` |
| Bayesçi ortalama | `Puan = (C·m + Σoy) / (C + n)`; az oylu dosyalar arşiv ortalamasına çekilir. Başlangıç: `C = 5`. | `PİLOT` |
| Gecikmeli oy sorusu | Oy, indirmeden birkaç gün sonra veya sınavdan sonra istenir. | `PİLOT` |
| Oy verme ödülüne günlük sınır | Oy başına küçük kredi, günlük üst sınırla (ör. günde en fazla 5 oy ödüllendirilir). | `PİLOT` |
| Karşılıklı oy tespiti | İki kullanıcı birbirine sık sık yüksek oy veriyorsa bu oyların ağırlığı düşürülür. | `SONRA` |
| Yükleyici başına düşük oy sınırı | Bir kişinin aynı yükleyicinin dosyalarına verdiği düşük oylar sınırlanır / incelemeye düşer. | `SONRA` |
| Sapma ağırlığı | Her dosyaya hep aynı puanı veren kullanıcının oyunun ağırlığı azaltılır. | `SONRA` |
| İtibar ağırlıklı oy | Uzun süredir aktif ve güvenilir kullanıcıların oyu biraz daha ağır sayılır. | `AÇIK` |

## Tespit (izlenecek işaretler)

- Bir dosyaya kısa sürede gelen ani oy dalgaları (çok yüksek veya çok düşük).
- Kullanıcı çiftleri arasındaki karşılıklı oy sıklığı.
- Bir kullanıcının verdiği oyların dağılımı (hep 5 veya hep 1).

## Bilinen açıklar

- Gerçek arkadaşların birbirini gerçekten beğenmesi ile manipülasyon ayırt edilemeyebilir. Bu yüzden karşılıklı oylar silinmez, sadece ağırlığı azaltılır.
- İtibar ağırlıklı oy, eski kullanıcılara fazla güç verebilir.

## Açık sorular

- `C` (güven eşiği) ve kalite bonusu eşikleri (4,0 / 2,5) pilot verisiyle ayarlanmalı.
- Düşük oyda sebep sorusu (`Okunmuyor`, `Hatalı çözüm`, `Eksik`, `Yanlış ders/yıl`) zorunlu mu olsun?
