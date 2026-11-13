# ArchiveEGE: kural dosyası

Bu depo EGE derslerinin çalışma arşivi ve öğrenme içeriğidir. Şu an içinde "Çip Hattı" adlı Aygıt Fiziği öğrenme oyunu (`oyun/`), `oyunteorisiispat` ve kuantum çalışma planı (`kuantum-calisma-plani.md`) var.
Merkez kurallar: `volkan-merkez/AGENTS.md`. Bu dosya depoya özgü olanı söyler; çelişkide bu dosya üstündür (güvenlik ve bütçe kuralları hariç).

## Genel

- Dil Türkçedir. Klasör ve dosya adlarında Türkçe karakter kullanılmaz.
- Arşiv içeriği (ders notları, kişisel çalışma dosyaları) toplu okunmaz, dış modele gönderilmez. Kişisel veri görürsen içeriğini yazma.
- Anahtar, token ve parola depoya yazılmaz. Claude API anahtarı yalnızca oyunun Ayarlar ekranından kullanıcıca girilir.
- Hiçbir ajana özel kural yoktur; Claude Code, Antigravity ve diğer ajanlar aynı kuralları izler.
- Yeni bağımlılık eklenmez. Oyun tek HTML dosyasıdır, `bash` ve `node` dışında araç istemez.

## Oyun (`oyun/`)

- Sözleşme `oyun/01-veri-semalari.md` dosyasındadır. Şema değişikliği onay ister.
- Kaynak `oyun/src/` altındadır. `oyun/dist/oyun.html` derleme çıktısıdır; elle düzenlenmez, `bash oyun/build.sh` ile üretilir.
- Ayrıntı ve belge haritası: `oyun/README.md`. İlerleme: `oyun/DURUM.md`.

## Testler

Tek komutluk bir test yok; testler Node ile tek tek çalışır (depo kökünden):

```
node oyun/test/core.test.js
node oyun/test/battle.test.js
node oyun/test/claude.test.js
node oyun/test/runner.test.js
node oyun/test/ui.test.js
node oyun/test/obs-kopru.test.js
node oyun/test/obs-patron.test.js
node oyun/test/veri-dogrula.js
```

- Duman testi `node oyun/test/smoke.js` Playwright/Chromium ister ve önce `bash oyun/build.sh` gerekir; yalnızca elle çalıştırılır.
- Testlerde gerçek Claude API çağrısı yapılmaz.

## Onay isteyen işler

Şema (`oyun/01-veri-semalari.md` ve veri biçimleri), güvenlik, veri silme, sürüm ve bu kural dosyaları.
