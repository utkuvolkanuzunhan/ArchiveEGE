# BUG-s04-A (İstasyon 4: kavram o02 Bohr, düşman o03, düşman o04)
## Düzeltildi
- Kod düzeltmesi yapılmadı (süre doldu).
## İncelendi
- 70-sim-bohr.js ve 90-data-s04.js okundu: başarı koşulu gecis [3,2]; Photon düğmesiyle erişilebilir. Terimler English (Türkçe) biçiminde, şıklar dahil.
- 1366x768 ve 1440x900: kavram ekranında tasma yok, konsolda yalnızca font engeli hatası.
## Bulgu / Kalan
- Bohr simülasyonu başlangıçta zaten n=3, m=2 ile açılıyor; Photon'a tek tıklamak görevi bitiriyor (görev çok kolay). Öneri: params başlangıcını farklı yap (örn. n:4, m:1), basari gecis [3,2] kalsın.
- Düşmanlar o03/o04 doğru/yanlış oynanmadı; dock/balon metni kalıcılığı ve Onayla akışı doğrulanmadı.
- Headless'ta koşucu engele geç yürüyor (sim ~9 sn sonra açılıyor); betik beklemeli yazılmalı.
