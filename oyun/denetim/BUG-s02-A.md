# BUG-s02-A (İstasyon 2: kavram, düşman o03, düşman o04)
## Düzeltildi
- 20-components.css: `.btn{display:inline-flex}` `[hidden]` özniteliğini eziyordu; kavram kapısında İpucu ve Geç düğmeleri 45/120 sn beklemeden baştan görünüyordu. `.btn[hidden]{display:none}` eklendi.
- 80-obs-dusman.js: yanlış cevapta seçilen şıkkın nedeni gösterilmiyordu (yalnızca doğru şıkkınki). Artık "Yanlış. <seçilen neden> Doğrusu: <doğru neden>".
## Oynandı (1366x768, 1440x900)
- Kavram: sim açıldı, api.done ile geçildi, Devam çalıştı. Düşman o03/o04: doğru ve yanlış + eminlik, açıklama + Devam; şıklar karıştırılıyor. Tasma yok, konsolda yalnızca font engeli hatası.
## Kalan
- Açık uçlu/yedek akış bu gruptaki düşmanlarda yok (yalnızca seçmeli). Kavram simülasyonu gerçek etkileşimle sonuna kadar doğrulanmadı (api.done ile geçildi).
