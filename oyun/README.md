# Çip Hattı · Öğrenme Oyunu

Aygıt Fiziği (kristal yapı, Miller indisleri, kuantum mekaniği, Schrödinger, enerji bantları) için, bilim insanı canavarlarla dolu yatay kayan bir koşu oyunu. Tek HTML dosyası, yaklaşık 4 saatlik.

## Doküman haritası

| Dosya | İçerik |
|---|---|
| `00-genel-tasarim.md` | Vizyon, kullanıcı kuralları, ekran düzeni, stil özeti, kısıtlar, tuzaklar |
| `01-veri-semalari.md` | **Sözleşme:** dosya yapısı, `Q` nesnesi, tüm şemalar, modül arayüzleri |
| `02-motor-kosucu.md` | Koşu motoru ve engel akışı (A2) |
| `03-savas-eminlik-voltaj.md` | Eminlik, hasar tablosu, voltaj, kısa devre, hata defteri (A3) |
| `04-claude-istemcisi.md` | Claude erişimi (`sample`), puanlama istemi (A6) |
| `05-sanat-ui-kiti.md` | "Neon Çizgi Roman" stili, arayüz, karakter/engel/dünya çizimi (A4, A5) |
| `06-simulasyonlar.md` | 13 simülasyon modülü (S1-S13) |
| `07-ayarlar-kayit-harita.md` | Ayarlar, "her yere eriş" anahtarı, harita, süre (A8) |
| `08-entegrasyon-yayin-test.md` | Derleme, test, final, yayın (A9) |
| `09-engel-isleyicileri.md` | 8 engel türünün davranışı (H1-H5) |
| `istasyonlar/01..10-*.md` | 10 istasyonun tam içeriği (soru, seçenek, açıklama, patron fazları) |
| `PROMPTLAR.md` | Ajan paketleri ve prompt'lar |
| `ORKESTRATOR.md` | Orkestratör görevi ve başlatma komutu |
| `DURUM.md` | İlerleme tablosu (orkestratör günceller) |
| `referans/` | Önizleme kaynakları (canavar üretici, CSS, kuyu/Miller çizimi) |
| `denetim/` | Denetçi raporları (`BUG-n.md`, `DIL-n.md`) |
| `ilerleme/` | Ajan ilerleme dosyaları (yarım kalırsa devam için) |
| `SORULAR.md` | Ajanların belirsizlik notları |

## Nasıl başlanır

1. Yeni bir Claude Code oturumu aç (bu depoda).
2. `oyun/ORKESTRATOR.md` içindeki **0. Başlatma komutu**nu yapıştır.
3. Orkestratör M1 (oynanabilir dilim) → M2 → M3 sırasıyla ajanları yönetir.
4. Yarım kalırsa aynı dosyadaki **0.1 Devam komutu**yla başka hesapta sürdür.

## Nasıl çalıştırılır (A9 tamamlar)
_(A9 paketi: derleme ve açma talimatı buraya eklenecek.)_
