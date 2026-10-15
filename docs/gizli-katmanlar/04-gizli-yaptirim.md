# 04 — Gizli Hile Tespiti ve Yaptırım

## Amaç

Hile yapan kişinin, tespit edildiğini fark edip yöntemini değiştirmesini önlemek. Hileci ne kadar geç fark ederse, o kadar çok veri toplanır ve o kadar az zarar verir.

## Temel ayrım: Etkisizleştirme gizli olabilir, cezalandırma olamaz

| Tür | Örnek | Gizli olabilir mi? |
|---|---|---|
| **Etkisizleştirme** | Kişinin oyları ve raporları sessizce sıfır ağırlıkla sayılır | **Evet** |
| **İzleme** | Kişinin hesabı inceleme listesine alınır, işlemleri daha yakından izlenir | **Evet** |
| **Cezalandırma** | Kredi kesintisi, seviye düşürme, erişim engeli, uzaklaştırma | **Hayır** — bildirilir, gerekçe ve itiraz hakkı verilir |

Neden bu ayrım?

1. **Haksız ceza riski:** Otomatik tespit yanılabilir. Gerçek arkadaşların birbirine oy vermesi, arkadaş halkası gibi görünebilir. Kişinin haberi olmadan ceza verilirse kendini savunamaz.
2. **KVKK 11. madde:** Kişi, otomatik analiz sonucu aleyhine çıkan sonuca itiraz etme hakkına sahiptir. Haberi olmadığı bir sonuca itiraz edemez.
3. **Güven:** Bir kişinin sessizce kredisinin düşürüldüğü ortaya çıkarsa, herkes "bana da yapılıyor mu?" diye düşünür. Sistem bir anda güvenilirliğini kaybeder.

Oyların etkisizleştirilmesi ise kimseye doğrudan zarar vermez: Kişi hâlâ indirebilir, yükleyebilir, kredi kazanabilir. Sadece başkalarını etkileme gücü geçici olarak kaldırılır. Bu, büyük platformlarda da yaygın ve kabul görmüş bir uygulamadır.

## Gizli etkisizleştirme kuralları

| Tetikleyici | Gizli işlem | Süre |
|---|---|---|
| Karşılıklı oy halkası tespiti | Halkadaki kişilerin birbirine verdiği oylar 0 ağırlıkla sayılır | Moderatör incelemesine kadar |
| Raporlarının çoğu reddedilen kullanıcı | Raporları moderatör kuyruğunun en altına düşer | 30 gün |
| Tek yükleyiciye yoğunlaşan düşük oylar | Bu oylar 0 ağırlıkla sayılır | Moderatör incelemesine kadar |
| Kısa sürede çok sayıda indirme (toplu indirme) | Hesap izleme listesine alınır; sonraki indirmeler en güçlü varyantlarla gönderilir | 30 gün |

Kişinin arayüzünde hiçbir şey değişmez: Oy verdiğinde "Teşekkürler" mesajını görmeye devam eder.

## Süreç

```
Otomatik tespit ──▶ Gizli etkisizleştirme + izleme ──▶ Moderatör incelemesi
                                                         │
                         ┌───────────────────────────────┼──────────────────────┐
                         ▼                               ▼                      ▼
                  Hile yok (yanlış alarm)        Hafif / ilk ihlal        Ciddi / tekrar
                  Etkisizleştirme kaldırılır     Uyarı mesajı             Bildirilen ceza
                  Kayıt kapatılır                                         + gerekçe + itiraz hakkı
```

## Önemli kurallar

- **Süre sınırı:** Hiçbir gizli işlem süresiz değildir. Moderatör incelemesi yapılmazsa işlem süre sonunda otomatik kalkar.
- **İşlem kaydı:** Her gizli işlem, tetikleyen kuralla ve tarihle kaydedilir (bkz. [manipülasyon/06](../manipulasyon/06-yetkili-kotuye-kullanimi.md)).
- **Moderatör de gizlice etkisizleştiremez:** Elle gizli işlem başlatmak için gerekçe yazılması zorunludur. Böylece bir moderatör sevmediği birinin oylarını keyfi olarak sıfırlayamaz.
- **Bilgi talebi:** Kullanıcı KVKK kapsamında hakkındaki işlemleri sorarsa, kendisine uygulanan işlemler bildirilir.

## Açık sorular

- Tetikleyicilerin eşik değerleri (ör. "kısa sürede çok indirme" kaç dosya?) pilot verisiyle belirlenmeli.
- İzleme listesindeki kişi sayısı ve süresi şeffaflık raporunda toplu olarak paylaşılsın mı?
