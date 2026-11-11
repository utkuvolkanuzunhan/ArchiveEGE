# BUG-s09-A (İstasyon 9 Bant testi, engel 1-3: hikaye, kavram, düşman o03/o04)
Kapsam: Playwright 1366x768 ile hikaye, kavram sim'i (gerçek tıklama), o03 yanlış+doğru yol, o04 doğru yol oynandı. Konsol hatası yok. Fizik içeriği doğru (N atom -> N seviye -> band, Pauli iki electron, dolu valence band + büyük bandgap = insulator).

## Bulunan ve DÜZELTİLEN
- YÜKSEK (kavram sınanmadan önce tanıtılmıyordu): o04 şıkları `valence band`, `conduction band`, `bandgap` terimlerini kullanıyor; hikaye (o01) bu terimleri hiç vermiyor, sim yalnızca "3s/3p" ve "Eg" gösteriyordu. DÜZELTİLDİ: o01 satırları yeniden yazıldı (energy band, Pauli, valence band, conduction band, bandgap tanıtılıyor; 3 satır / <=20 kelime kuralı korundu); sim bantları "valence band"/"conduction band", boşluğu "bandgap Eg" olarak etiketliyor.
- ORTA (dil, DIL-1): sim arayüzü Türkçe-onlyydi ("Elektron doldur", "İletken/Yalıtkan/Yarıiletken", "Bant yarı dolu...", ipucu). DÜZELTİLDİ: `Fill electrons (elektron doldur)`, `Metal (iletken)`, `Insulator (yalıtkan)`, `Semiconductor (yarıiletken)`, durum satırı ve aria-label terimleri İngilizce + parantez.
- ORTA (yanıltıcı açıklama): o03 doğru-cevap açıklaması "Aynı quantum state iki electron paylaşamaz" seçeneğin ("iki electron sığar") tersini söylüyor gibiydi. DÜZELTİLDİ: "iki electron aynı quantum state paylaşamaz; zıt spin iki ayrı durum verir, seviyeye iki electron sığar".
- DÜŞÜK (yerleşim): 1366x768'de sim paneli taşıp canvas üstünü/durum satırını kırpıyordu (ayrıca yeni daha uzun etiketler için). Canvas yüksekliği clamp(150px,19vh,240px) yapıldı, durum metinleri kısaltıldı; artık tam görünüyor.

## Kalan / öneri (düzeltilmedi)
- ORTA: Kavram kapısı yalnızca N>=32 + 3 malzemeye tıklayınca açılıyor; "Fill electrons" hiç basılmasa da geçiliyor, yani oyuncu doluluk (insulator'da dolu valence band, metalde yarı dolu band) görmeden o04'e gelebilir. Öneri: basari'ya `dolduruldu` koşulu (sim kodu + veri). Hikaye artık doluluğu söylüyor ama sim zorlamıyor.
- DÜŞÜK: o03/o04 düşman adı "Vacancy (Boşluk) Kusuru" / "Grain Boundary (Tane Sınırı) Kusuru": konu (Pauli, insulator) ile ilgisiz, s01 kusur teması (`kusurSkin` vakans/tane_siniri). Motor skin başlığını veriyor; s09 için uygun skin yok.
- DÜŞÜK: hikaye sahnesinde Selin ve Pauli konuşma balonları üst üste biniyor (Selin'inki arkada kalıyor); motor/sahne sorunu, tüm hikaye engellerinde olabilir.
- DÜŞÜK: "Atom (atom)", "spin (spin)", "metal (metal)" gibi aynı sözcüğün parantezle tekrarı biraz yapay (DIL-1 kuralına uygun ama gereksiz).
- Gözlem: istasyon başlığı "Band (bant) testi"; engel yolu sabit hızla yürüyor (kavram kapısına ~25 sn), kullanıcıyı bekletiyor olabilir.
- Doğrulanmadı (grup B/C): o05-o09, 1440x900 yerleşim yalnızca hikaye ekranında bakıldı (sorun yok).
