# 06 — Moderatör / Yönetici Kötüye Kullanımı

## Tanım

Yetkili kişilerin (moderatör, yönetici) yetkilerini kendi veya arkadaşları lehine, ya da başkalarının aleyhine kullanması. Bu saldırı dışarıdan değil, içeriden gelir.

## Örnek senaryolar

- Moderatör kendi yüklemelerini veya arkadaşlarınınkini kontrol etmeden onaylar.
- Moderatör sevmediği birinin yüklemelerini sürekli reddeder.
- Yönetici veritabanından kendine kredi yazar.
- Yönetici `/kaynak` komutunu sızıntı olmadığı halde, kimin hangi dosyayı indirdiğini merak ettiği için kullanır (gizlilik ihlali).

## Etki

- Sisteme olan güven bir anda çöker. "Adil sistem" vaadi ortadan kalkar.
- Kullanıcıların indirme geçmişi gibi kişisel verileri kötüye kullanılabilir.

## Önlemler

| Önlem | Açıklama | Durum |
|---|---|---|
| Kendi yüklemesini onaylayamama | Moderatör kendi dosyasını onaylayamaz; başka bir moderatör onaylar. | `PİLOT` |
| İşlem kaydı (audit log) | Her onay, ret, kredi değişikliği ve `/kaynak` sorgusu kimin yaptığıyla birlikte silinemez şekilde kaydedilir. | `PİLOT` |
| `/kaynak` için gerekçe | `/kaynak` sorgusu bir rapor/vaka numarasına bağlanmadan çalışmaz. | `PİLOT` |
| En az iki yönetici | Tek kişiye bağımlılığı ve tek kişinin denetimsiz gücünü önler. | `PİLOT` |
| Elle kredi değişikliği yok | Krediler sadece kurallarla değişir; zorunlu düzeltmeler gerekçeyle ve kayıtla yapılır. | `PİLOT` |
| Moderatör istatistikleri | Moderatör başına onay/ret oranları ve aynı kişilere verilen kararlar periyodik olarak gözden geçirilir. | `SONRA` |
| Kararlara itiraz | Reddedilen yükleme için başka bir moderatöre itiraz hakkı. | `SONRA` |
| Şeffaflık raporu | Dönem sonunda toplam onay, ret, ceza ve `/kaynak` sorgu sayıları kullanıcılarla paylaşılır. | `AÇIK` |

## Tespit (izlenecek işaretler)

- Bir moderatörün belirli kullanıcılara karşı aşırı yüksek onay veya ret oranı.
- Vaka numarasına bağlı olmayan veya sık yapılan `/kaynak` sorguları.
- İşlem kaydında açıklanamayan kredi değişiklikleri.

## Bilinen açıklar

- Veritabanına doğrudan erişimi olan bir yönetici, teknik olarak işlem kaydını da değiştirebilir. Bu ancak yöneticiler arası karşılıklı denetim ve kayıtların ayrı bir yere yedeklenmesiyle sınırlandırılabilir.

## Açık sorular

- Moderatörler nasıl seçilecek? (Gönüllülük, itibar puanı, seçim?)
- Moderatörlük emeği kredi ile ödüllendirilecek mi? Ödüllendirilirse "hızlı onaylayıp kredi kazanma" teşviki oluşur mu?
