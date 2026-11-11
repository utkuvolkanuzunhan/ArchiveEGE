# BUG s08 grup C (o07 kopru, o08 patron tum fazlar, o09 sandik, istasyon sonu, harita, kayit) - 1366x768 / 1440x900

Dogru cevapla oynandi (Claude yok -> acik fazlarda yedekSecmeli). Konsol hatasi yok (yalniz font ag hatasi). Patron 3 faz, sandik, "Kayit alindi", istasyon "tamam" (enSon 8, kontrol 1), harita: s09 acildi. Sayfa yenilenince ilerleme (localStorage cip-hatti-v1) korunuyor.

1. DUZELTILDI (1366x768 ve 1440x900): Patron yedek secmeli (4 secenek) ekraninda "Onayla" dugmesi dock disina tasiyordu (alt y=775/798 > 768; 1440x900'de 907/930 > 900). `.opt` dock icinde sikilastirildi (min-height 34, padding 4px 12px). Dosya: src/styles/20-components.css (satir 96).
2. DUZELTILDI (dil): s04 verisinde "Atom cok cold (soguk) olduğu icin" karisik dil -> "Because the atom is too cold (atom cok soguk olduğu icin)". Dosya: src/js/90-data-s04.js:143. Baska cold/hot karisimi bulunmadi.
3. Not (duzeltilmedi, s08 veri dili): bozuk karisik cumleler: "Position (konum) ve momentum aynı anda keyfi hassas measure (ölçülemez)" (o01), "Uncertainty principle (belirsizlik ilkesi) explain (açıkla). Conjugate variables ... neden" (faz 2), "Hangisi bir conjugate pair (eşlenik çift) olur?" (faz 3 yedek), "wave (dalga) isen" (o01). Terim parantezi var ama cumle yapisi/dil karisik; DIL-1 duzeni icin gozden gecirilmeli.
4. Not: kopru 1366x768'de sorunsuz (Kontrol gorunur), sandik/kontrol noktasi akisi sorunsuz.
