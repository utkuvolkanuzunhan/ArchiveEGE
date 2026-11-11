# BUG-s05-C (İstasyon 5 Dalga odası, engel 7-9: patron, sandık, istasyon sonu, harita, kayıt)
Playwright, 1366x768 ve 1440x900, Claude backend yok (yedek akış). Takılma, taşma, konsol hatası yok (yalnızca font ERR_FAILED, route ile abort).
## Doğrulanan
- Patron "Kuantum Kedisi" (s05-o08): Faz 1/3 seçmeli; doğru şık -> Devam -> Faz 2/3 açık uçlu. "Bilmiyorum" -> "Yanlış" + ideal cevap -> "İkinci şans" (alt soru) -> Faz 3/3 aynı şekilde. Metin yazıp gönder -> eminlik -> yedek seçmeli (Faz 2 ve 3) doğru çalışıyor; bossHp 120 -> 0.
- Yanlış yol: iki yanlış + "Eminim" -> voltaj 0 -> kısa devre, "Temelden bir daha" kartları (ψ nedir?) görünüyor; ilerleme.s05.tamam=false, kisaDevre=1, bossHp 120 kalır.
- Yanlış cevap geri bildirimi sade Türkçe ("Cevabın yanlış. Doğru seçenek: ..."); dil biçimi `English (Türkçe)` uygun.
- Sandık: kart schro + "Yeni makine kuruldu" + 3 maddelik özet + "Kayıt alındı" + Devam; fabrika.kurulu=[s05], kartlar=[schro].
- İstasyon sonu -> fabrika haritası açılır; s05 "çalışıyor". Yenileme sonrası localStorage cip-hatti-v1: ilerleme.s05 {tamam:true,enSon:8,kontrol:1}, fabrika.kurulu, voltaj korunuyor; açılışta "Devam" ile başlık ekranı.
## Düzeltilen
- 90-data-s05.js patron faz 1 doğru-şık nedeninde "postulate (postülat) ından" biçim hatası -> "postulate (postülat) ile gelir".
## Küçük gözlemler (düzeltilmedi)
- Fabrika haritası 1366'da dar (~560px) tek sütun ortada; alttaki boş çerçeve kart koleksiyonu üstünde; "Measurement (ölçüm) laboratuvarı" kartı metni kenara sığıyor.
- İstasyon sonunda aktif.index hâlâ 6 (enSon 8); zararsız.
