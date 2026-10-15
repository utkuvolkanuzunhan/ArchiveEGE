# 07 — Erişim Seviyelerini ve Özel Paylaşımı Atlatma

İlgili tasarım: [gizli-katmanlar/01](../gizli-katmanlar/01-erisim-seviyeleri.md), [gizli-katmanlar/02](../gizli-katmanlar/02-ozel-paylasim.md)

## Tanım

Erişim seviyeleri ve özel paylaşım yeni kurallar getirir; her yeni kural yeni bir hile yolu demektir. Bu dosya, bu katmanlara özgü hileleri toplar.

## Örnek senaryolar

- **Seviye kiralama:** Altın seviyedeki Ece, Bronz seviyedeki arkadaşlarının istediği dosyaları indirip onlara gösterir.
- **Grup üzerinden aklama:** Can arşivden Altın bir dosya indirir ve 8 kişilik çalışma grubuna "kendi notu" gibi yükler; gruptaki Bronz üyeler Altın içeriğe erişir.
- **Kredi aklama:** Bir kişi sahte hesaplarla grup kurup dosyaları birbirine aktararak kredi veya itibar kazanmaya çalışır.
- **Seviye kasma:** Altın'a ulaşmak için birçok küçük, düşük değerli yükleme yapmak.

## Önlemler

| Önlem | Açıklama | Durum |
|---|---|---|
| Kişiye özel filigran ve varyant | Altın içerik en güçlü katmanlarla dağıtılır; başkasına gösterilen kopya kaynağına kadar izlenebilir. | `PİLOT` |
| Arşiv dosyası gruba yüklenemez | Hash ve benzerlik kontrolü ile arşivden indirilmiş dosyanın gruba yeniden yüklenmesi engellenir. | `PİLOT` |
| Grup paylaşımı kredi/itibar kazandırmaz | Aklamayı anlamsız kılar. | `PİLOT` |
| Kredi transferi yok | Kullanıcılar arası kredi aktarımı yapılamaz. | `PİLOT` |
| İtibar sadece kaliteli katkıdan | İtibar, düşük puanlı veya hiç indirilmeyen yüklemelerden çok az kazanılır. | `PİLOT` |
| Farklı ders koşulu | Altın için en az 2 farklı derse katkı gerekir; tek derste seri yükleme yetmez. | `PİLOT` |

## Bilinen açıklar

- Ekrandan gösterme (telefonu arkadaşına uzatmak) engellenemez. Bu küçük ölçekli paylaşım zaten kademeli iniş sayesinde zamanla meşrulaşır; toplu dağıtıma dönüşmediği sürece kabul edilebilir.

## Açık sorular

- Altın seviyedeki birinin içeriği izinsiz dağıttığı tespit edilirse seviyesi mi düşürülsün, itibarı mı sıfırlansın?
