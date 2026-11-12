# İstasyon 07 · Ölçüm laboratuvarı (`s07`)

> **Ajan E7:** Bu dosyayı `oyun/src/js/90-data-s07.js` dosyasına, `01-veri-semalari.md` şemasına uygun JavaScript verisine çevir. Metinleri **aynen** kullan. Kontrol: `node oyun/test/veri-dogrula.js`.
> Okunacaklar: `00`, `01` (§3), `06` (`olcum` parametreleri: `c1sq`), bu dosya.

| Alan | Değer |
|---|---|
| `id` / `sira` | `s07` / 7 |
| `ad` / `makine` | Ölçüm laboratuvarı / Ölçüm lab. |
| `renk` | `#ff3df0` |
| `konu` | Postülatlar, ölçüm, çökme |
| `sinavSorulari` | `["S8","S9"]` |
| `sureHedefDk` | 23 |
| `patronId` | `born` |
| `kavramlar` | `postulatlar`, `olcum_cokme`, `ozdeger_olcum`, `evrim_belirlenimci`, `olasilik_katsayi`, `schrodinger_cokme` |

## Engeller

### o01 · hikaye · "Zaman kapısı"
- `yer`: Göttingen · `yil`: 1926 · `rivayet`: false · `kavram`: null
- satır 1 · `selin`: "Ölçüm laboratuvarı: bakınca ne oluyor?"
- satır 2 · `born`: "ψ'nin karesini olasılık olarak yorumladım. Ölçümde sonuç kesin değil, olasılıkla çıkar."
- satır 3 · `selin`: "Kuantumun kuralları beş postülat. Ölçüm üçüncü ve dördüncüde."

### o02 · kavram · "Kavram kapısı" · kavram `olcum_cokme`
- `gorev`: "Ölç, sonra tekrar ölç: sonuç ne?"
- `sim`: modul `olcum`, params `{c1sq:0.3}`, basari `{tekrarAyni:true}`
- `ogrenilen`: "Ölçüm ψ'yi sonuca çökertir; hemen tekrar ölçersen aynı sonucu alırsın."

### o03 · dusman · "Kusur düşmanı" · kavram `ozdeger_olcum` · `kusurSkin` `vakans`
- `soru`: "Bir ölçüm hangi değerleri verebilir?"
- seçenekler:
  1. "Yalnızca operatörün özdeğerlerini" · **DOĞRU** · neden: "Doğru. Her ölçüm özdeğerlerden birini verir."
  2. "Herhangi bir değeri" · yanlış · neden: "Hayır. Yalnızca özdeğerler çıkabilir."
  3. "Özdeğerlerin ortalamasını" · yanlış · neden: "Hayır. Tek ölçümde ortalama değil, bir özdeğer çıkar."

### o04 · dusman · "Kusur düşmanı" · kavram `olasilik_katsayi` · `kusurSkin` `tane_siniri`
- `soru`: "ψ = c₁φ₁ + c₂φ₂ iken sonucun φ₁ çıkma olasılığı nedir?"
- seçenekler:
  1. "|c₁|²" · **DOĞRU** · neden: "Doğru. Olasılık katsayının karesidir."
  2. "c₁" · yanlış · neden: "Hayır. Olasılık katsayının kendisi değil karesidir."
  3. "c₁ + c₂" · yanlış · neden: "Hayır. Katsayılar toplanmaz; her sonucun olasılığı kendi karesidir."

### o05 · tahmin · "Tahmin çukuru" · kavram `olcum_cokme` · agirlik 1.5
- `soru`: "|c₁|² = 0,3 olan aynı ψ durumu 100 kez taze hazırlanıp her seferinde bir kez ölçülürse sonuçlar nasıl dağılır?"
- seçenekler:
  1. "Yaklaşık 30 kez φ₁, 70 kez φ₂; her tek sonuç rastgele" · **DOĞRU**
  2. "Her seferinde ortalama değer çıkar" · yanlış
  3. "Hepsi φ₁ çıkar" · yanlış
- `sim`: modul `olcum`, onceki `{c1sq:0.3}`, sonraki `{c1sq:0.3}` (kavram sim'indeki ölç-tekrar ölç deneyinden farklı: tahmin 100 taze ölçüm dağılımı)
- `acik`: "Taze hazırlanan her ψ için sonuç şansla seçilir, ağırlığı |c|² belirler."

### o06 · tuzak · "Yanılgı tuzağı" · kavram `schrodinger_cokme`
- `iddia`: "Schrödinger denklemi ψ'yi ölçüm anında çökertir."
- `parcalar`: ["Schrödinger denklemi", "ψ'yi ölçüm anında", "çökertir."]
- `yanlisParca`: 0
- `duzeltme`: "Denklem ψ'yi düzgün evriltir. Çökme ayrı postülattır ve yalnızca ölçümle olur."

### o07 · kopru · "Mantık köprüsü" · kavram `evrim_belirlenimci`
- `soru`: "Ölçüm döngüsünü sıraya diz"
- `bloklar` (doğru sırada): ["Sistem özdurumların süperpozisyonundadır", "Ölçüm bir özdeğeri |c|² olasılıkla verir", "ψ o özdurumuna çöker", "Sonra denklem ψ'yi yeniden evriltir"]
- `sonuc`: "Süperpozisyon, olasılıklı sonuç, çökme, belirlenimci evrim."

### o08 · patron · "Olasılık Canavarı"
- `canavar`: `born` · `canavarAd`: "Olasılık Canavarı"
- `giris`: "Zar atıyorum! Ama kurallarım var. Olasılığım |c|²."

**Faz 1 · secmeli** · kavram `olcum_cokme`
- `soru`: "Ölçümden önce sistem özdurumda değilse ne vardır?"
- seçenekler:
  1. "Özdurumların süperpozisyonu" · **DOĞRU** · neden: "Doğru. ψ = Σ cₙφₙ."
  2. "Gizli ama belirli bir değer" · yanlış · neden: "Hayır. Standart yorumda ölçümden önce belirli değer yoktur."
  3. "Sıfır enerji" · yanlış · neden: "Hayır. Enerji sıfır olmak zorunda değil."
- `alt`: soru "Hangi büyüklük bir ölçüm sonucu olabilir?"; seçenekler: 1. "Operatörün özdeğeri" **DOĞRU** (neden: "Doğru. Ölçüm özdeğer verir.") · 2. "Herhangi bir sayı" yanlış (neden: "Hayır. Yalnızca özdeğerler.") · 3. "ψ'nin kendisi" yanlış (neden: "Hayır. ψ doğrudan ölçülmez.")

**Faz 2 · acik · S8**
- `pdfSoru`: "Explain the principles of quantum mechanics."
- `soru`: "Kuantum mekaniğinin ilkelerini (postülatlarını) açıkla."
- `anahtarFikirler`:
  1. "Durum ψ ile tarif edilir, |ψ|² olasılık yoğunluğudur."
  2. "Her gözlenebilir bir operatöre karşılık gelir."
  3. "Ölçüm yalnızca özdeğer verir, durum özdurumuna çöker."
  4. "Zaman evrimi Schrödinger denklemiyle belirlenimcidir."
- `yanlisKavramlar`: ["Kuantum mekaniği her şeyi rastgele yapar", "Ölçümde ψ hiç değişmez"] · `yanlisKavramIds`: ["evrim_belirlenimci", "olcum_cokme"]
- `idealCevap`: "Sistemin durumu ψ ile tarif edilir ve |ψ|² olasılık yoğunluğudur. Her gözlenebilir bir operatörle temsil edilir. Ölçüm yalnızca operatörün özdeğerlerinden birini verir ve durum o özdurumuna çöker. Ölçümler arasında ψ, Schrödinger denklemiyle belirlenimci biçimde evrilir."
- `yedekSecmeli`: soru "Hangisi kuantum postülatlarından biridir?"; seçenekler: 1. "Her gözlenebilir bir operatöre karşılık gelir" **DOĞRU** (neden: "Doğru. Bu ikinci postülat.") · 2. "Ölçüm ψ'yi değiştirmez" yanlış (neden: "Yanlış. Ölçüm ψ'yi özdurumuna çökertir.") · 3. "Enerji her değeri alır" yanlış (neden: "Yanlış. Yalnızca özdeğerler.") · 4. "Denklem rastgele evrilir" yanlış (neden: "Yanlış. Evrim belirlenimcidir.")
- `alt`: soru "Postülatların ölçümle ilgili olanlarını anlat."

**Faz 3 · acik · S9**
- `pdfSoru`: "The third postulate of quantum mechanics concerns measurement; explain how the system changes its state if its current state is not an eigenstate of the observable being measured."
- `soru`: "3. postülat: durum özdurum değilse ölçümde sistem nasıl değişir?"
- `anahtarFikirler`:
  1. "Durum özdurumların süperpozisyonudur: ψ = Σ cₙφₙ."
  2. "Ölçüm özdeğerlerden birini |cₙ|² olasılıkla verir."
  3. "Ölçümden sonra ψ ölçülen özdurumuna çöker."
  4. "Hemen tekrar ölçüm aynı sonucu verir."
- `yanlisKavramlar`: ["Ölçüm özdeğerlerin ortalamasını verir", "Çökme Schrödinger denkleminden gelir"] · `yanlisKavramIds`: ["ozdeger_olcum", "schrodinger_cokme"]
- `idealCevap`: "Durum özdurum değilse özdurumların süperpozisyonudur: ψ = Σ cₙφₙ. Ölçüm özdeğerlerden birini |cₙ|² olasılıkla verir. Ölçümden sonra durum ölçülen özdurumuna çöker; hemen tekrar ölçüm aynı sonucu verir."
- `yedekSecmeli`: soru "Özdurum olmayan durumda ölçümden sonra ne olur?"; seçenekler: 1. "Durum ölçülen özdurumuna çöker" **DOĞRU** (neden: "Doğru. Sonuç olasılıkla belirlenir.") · 2. "Durum hiç değişmez" yanlış (neden: "Yanlış. Ölçüm durumu değiştirir.") · 3. "Durum ortalama özdurumda olur" yanlış (neden: "Yanlış. Ortalama özdurum diye bir şey yok.") · 4. "Sistem yok olur" yanlış (neden: "Yanlış. Sistem özdurumda kalır.")
- `alt`: soru "Ölçüm sonucu hangi olasılıkla çıkar ve ölçümden sonra ψ ne olur?"

### o09 · sandik · "Sandık"
- `kart`: `{id:"born", yil:1926, tekCumle:"ψ'nin karesinin olasılık olduğunu söyledi."}`
- `ozet`: ["Ölçüm özdeğer verir, |c|² olasılıkla", "Ölçümde ψ özdurumuna çöker", "Denklem belirlenimci, çökme ölçümle"]
- `kontrolNoktasi`: true

## Temel tur
- kart 1: "Süperpozisyon" · "Ölçümden önce durum özdurumların toplamı olabilir."
- kart 2: "Ölçüm" · "Bir özdeğer çıkar, olasılığı |c|²."
- kart 3: "Çökme" · "Ölçümden sonra ψ o özdurumdadır."
- `sim`: modul `olcum`, params `{c1sq:0.3}`

## Tekrar havuzu
1. o03'ü kopyala (`ozdeger_olcum`).
2. o04'ü kopyala (`olasilik_katsayi`).
3. o05'i `dusman`a çevir (sim ve acik at, `kusurSkin:"vakans"`).
4. **Ek soru** (kavram `evrim_belirlenimci`, skin `safsizlik`): soru "Ölçümler arasında ψ nasıl evrilir?"; seçenekler: 1. "Schrödinger denklemiyle belirlenimci biçimde" **DOĞRU** (neden: "Doğru. Rastgelelik yalnızca ölçümde ortaya çıkar.") · 2. "Rastgele" yanlış (neden: "Hayır. Evrim düzgündür.") · 3. "Hiç evrilmez" yanlış (neden: "Hayır. Zamanla evrilir.").
