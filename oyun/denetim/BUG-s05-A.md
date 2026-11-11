# BUG-s05-A (İstasyon 5, engel 1-3: kavram + 2 düşman)
Kapsam: Playwright 1366x768; kavram kapısı (kuyu sim) gerçekten oynandı, düşman o03 açıldı. Düşman doğru/yanlış cevap akışı ve 1440x900 SÜRE DOLDUĞU İÇİN tamamlanmadı.
## Bulunan / düzeltilen
- KRİTİK (tüm istasyonlar): kavram kapısında `sim.basari` (veri) sime iletilmiyordu (yalnızca `sim.params` gidiyordu) -> kuyu sim başarı koşulu hiç tetiklenmedi, kapı yalnızca 120 sn sonra "Geç" ile açılıyordu. DÜZELTİLDİ: 80-obs-kavram.js basari'yı params'a ekler. Doğrulandı: L=1 nm -> kapı açılır, "Devam" görünür.
- `.btn{display:inline-flex}` `hidden` özniteliğini eziyordu; İpucu/Geç düğmeleri baştan görünüyordu. DÜZELTİLDİ (20-components.css `[hidden]` kuralı; s02 ile aynı düzeltme).
- Kavram sim başarı koşulu erişilebilir (başlangıç L=2, kaydırıcı min 1). Etiket taşması/konsol hatası yok (yalnızca font ERR_FAILED).
## Kalan
- o03/o04 doğru-yanlış yol, 1440x900, soru metninin dock'ta iki kez görünmesi (balon+panel; bilinçli mi, doğrulanmadı).
