# BUG-s03b (Istasyon 3, tuzak/kopru/patron/sandik)
Oynandi (s03, idx4 ile): tuzak, kopru, patron (3 faz, secmeli+acik+yedek secmeli, ikinci sans), sandik, istasyon sonu, hem dogru hem yanlis yol. Yanlis yol sonuna kadar bitti ("tamam"), konsol hatasi yok, takilma yok, veri-md uyumlu.
## Duzeltilen
- Konusma baloncugu etiketi ham id gosteriyordu (anlatici/selin/einstein): 50-ui.js gorunen ada cevrildi.
- Geri bildirimde "Yanlis. Dogru. ..." / "Dogru. Dogru. ..." / "Seciltigin: Hayir. ..." cift hukum: dusman ve patron secmeli aciklamasinda nedenin bas hukum kelimesi atildi.
## Kalan / denenmedi
- Dogru yol tam kosusu: patron sonunda tarayici kapandi (muhtemelen test betigi); haritaya donus ve kayit icerigi dogrulanmadi.
- Karacisim simulasyonunun gercek oynanisi oynanmadi. Tasma olcumu yapilmadi (ekranlarda tasma gorulmedi).
- "Claude yok, cok. secmeli soru:" metni oyuncuya gorunuyor (yedek akis, kasitli olabilir).
