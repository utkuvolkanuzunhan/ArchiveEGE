/* 90-data-s07.js · İstasyon 07 "Ölçüm laboratuvarı" verisi (E7)
 * Q.data.stations.s07 alanını doldurur. Metinler oyun/istasyonlar/07-olcum-laboratuvari.md'den aynen alınır.
 * Bağımlılık: 00-q.js (Q.data). Şema: oyun/01-veri-semalari.md §3.
 */
(function(){
  'use strict';

  function sec(t, dogru, neden){ return { t: t, dogru: dogru, neden: neden }; }

  var o03 = {
    id: 's07-o03', tip: 'dusman', baslik: 'Kusur düşmanı', kavram: 'ozdeger_olcum', agirlik: 1,
    soru: 'Bir measurement (ölçüm) hangi değerleri verebilir?',
    secenekler: [
      sec('Yalnızca operatörün eigenvalue (özdeğer) değerlerini', true, 'Doğru. Her ölçüm eigenvalue değerlerinden birini verir.'),
      sec('Herhangi bir değeri', false, 'Hayır. Yalnızca eigenvalue (özdeğer) çıkabilir.'),
      sec('Eigenvalue ortalamasını', false, 'Hayır. Tek ölçümde ortalama değil, bir eigenvalue çıkar.')
    ],
    kusurSkin: 'vakans'
  };

  var o04 = {
    id: 's07-o04', tip: 'dusman', baslik: 'Kusur düşmanı', kavram: 'olasilik_katsayi', agirlik: 1,
    soru: 'ψ = c₁φ₁ + c₂φ₂ iken sonucun φ₁ çıkma probability (olasılık) değeri nedir?',
    secenekler: [
      sec('|c₁|²', true, 'Doğru. Probability (olasılık) katsayının karesidir.'),
      sec('c₁', false, 'Hayır. Probability katsayının kendisi değil karesidir.'),
      sec('c₁ + c₂', false, 'Hayır. Katsayılar toplanmaz; her sonucun olasılığı kendi karesidir.')
    ],
    kusurSkin: 'tane_siniri'
  };

  var o05 = {
    id: 's07-o05', tip: 'tahmin', baslik: 'Tahmin çukuru', kavram: 'olcum_cokme', agirlik: 1.5,
    soru: 'Collapse (çökme) sonrası aynı büyüklüğü hemen tekrar ölçersen ne olur?',
    secenekler: [
      sec('Aynı sonuç çıkar', true, 'Doğru. ψ artık eigenstate (özdurum) içinde, sonuç değişmez.'),
      sec('Yeni rastgele sonuç', false, 'Yanlış. Çöken durum eigenstate olur, sonuç aynı kalır.'),
      sec('İki sonucun ortalaması', false, 'Yanlış. Tek ölçüm bir eigenvalue verir.')
    ],
    sim: {
      modul: 'olcum',
      onceki: { c1sq: 0.3 },
      sonraki: { c1sq: 0.3, olcTekrar: true }
    },
    acik: 'Collapse sonrası ψ eigenstate (özdurum) olur; tekrar ölçüm aynı sonucu verir.'
  };

  Q.data.stations.s07 = {
    id: 's07',
    sira: 7,
    ad: 'Ölçüm laboratuvarı',
    makine: 'Ölçüm lab.',
    renk: '#ff3df0',
    konu: 'Postülatlar, ölçüm, çökme',
    sinavSorulari: ['S8', 'S9'],
    sureHedefDk: 23,
    patronId: 'born',
    kavramlar: ['postulatlar', 'olcum_cokme', 'ozdeger_olcum', 'evrim_belirlenimci', 'olasilik_katsayi', 'schrodinger_cokme'],
    engeller: [
      {
        id: 's07-o01', tip: 'hikaye', baslik: 'Zaman kapısı', kavram: null, agirlik: 1,
        yer: 'Göttingen', yil: 1926, rivayet: false,
        satirlar: [
          { kim: 'selin', metin: 'Ölçüm laboratuvarı: bakınca ne oluyor?' },
          { kim: 'born', metin: 'ψ\'nin karesini probability (olasılık) olarak yorumladım. Measurement (ölçüm) sonucu kesin değil, olasılıkla çıkar.' },
          { kim: 'selin', metin: 'Kuantumun kuralları beş postulate (postülat). Ölçüm üçüncü ve dördüncüde.' }
        ]
      },
      {
        id: 's07-o02', tip: 'kavram', baslik: 'Kavram kapısı', kavram: 'olcum_cokme', agirlik: 1,
        gorev: 'Measure (ölç), sonra tekrar ölç: sonuç ne?',
        sim: {
          modul: 'olcum',
          params: { c1sq: 0.3 },
          basari: { tekrarAyni: true }
        },
        ogrenilen: 'Measurement (ölçüm) ψ\'yi sonuca collapse (çökertir) eder; hemen tekrar ölçersen aynı sonucu alırsın.'
      },
      o03,
      o04,
      o05,
      {
        id: 's07-o06', tip: 'tuzak', baslik: 'Yanılgı tuzağı', kavram: 'schrodinger_cokme', agirlik: 1,
        iddia: 'Schrödinger denklemi ψ\'yi ölçüm anında collapse (çökme) ettirir.',
        parcalar: ['Schrödinger denklemi', 'ψ\'yi ölçüm anında', 'collapse (çökme) ettirir.'],
        yanlisParca: 0,
        duzeltme: 'Denklem ψ\'yi düzgün evriltir. Collapse (çökme) ayrı postulate (postülat) olup yalnızca ölçümle olur.'
      },
      {
        id: 's07-o07', tip: 'kopru', baslik: 'Mantık köprüsü', kavram: 'evrim_belirlenimci', agirlik: 1,
        soru: 'Ölçüm döngüsünü sıraya diz',
        bloklar: [
          'Sistem eigenstate (özdurum) superposition (süperpozisyon) içindedir',
          'Ölçüm bir eigenvalue (özdeğer) değerini |c|² olasılıkla verir',
          'ψ o eigenstate durumuna collapse (çöker) eder',
          'Sonra denklem ψ\'yi yeniden evriltir'
        ],
        sonuc: 'Superposition (süperpozisyon), olasılıklı sonuç, collapse (çökme), deterministic (belirlenimci) evrim.'
      },
      {
        id: 's07-o08', tip: 'patron', baslik: 'Olasılık Canavarı', kavram: null, agirlik: 1,
        canavar: 'born', canavarAd: 'Olasılık Canavarı',
        giris: 'Zar atıyorum! Ama kurallarım var. Olasılığım |c|².',
        fazlar: [
          {
            tip: 'secmeli', kavram: 'olcum_cokme',
            soru: 'Ölçümden önce sistem eigenstate (özdurum) içinde değilse ne vardır?',
            secenekler: [
              sec('Eigenstate (özdurum) superposition (süperpozisyonu)', true, 'Doğru. ψ = Σ cₙφₙ.'),
              sec('Gizli ama belirli bir değer', false, 'Hayır. Standart yorumda ölçümden önce belirli değer yoktur.'),
              sec('Sıfır enerji', false, 'Hayır. Enerji sıfır olmak zorunda değil.')
            ],
            alt: {
              soru: 'Hangi büyüklük bir ölçüm sonucu olabilir?',
              secenekler: [
                sec('Operatörün eigenvalue (özdeğer) değeri', true, 'Doğru. Ölçüm eigenvalue verir.'),
                sec('Herhangi bir sayı', false, 'Hayır. Yalnızca eigenvalue.'),
                sec('ψ\'nin kendisi', false, 'Hayır. ψ doğrudan ölçülmez.')
              ]
            }
          },
          {
            tip: 'acik',
            pdfSoru: 'Explain the principles of quantum mechanics.',
            soru: 'Quantum mechanics (kuantum mekaniği) postulate (postülat) ilkelerini explain (açıkla).',
            anahtarFikirler: [
              'State (durum) ψ ile tarif edilir, |ψ|² probability density (olasılık yoğunluğu) olur.',
              'Her observable (gözlenebilir) bir operator (operatör) ile temsil edilir.',
              'Ölçüm yalnızca eigenvalue (özdeğer) verir, durum eigenstate (özdurum) durumuna collapse (çöker) eder.',
              'Time evolution (zaman evrimi) Schrödinger denklemiyle deterministic (belirlenimci) olur.'
            ],
            yanlisKavramlar: [
              'Kuantum mekaniği her şeyi rastgele yapar',
              'Ölçümde ψ hiç değişmez'
            ],
            yanlisKavramIds: ['evrim_belirlenimci', 'olcum_cokme'],
            idealCevap: 'Sistemin durumu ψ ile tarif edilir ve |ψ|² probability density (olasılık yoğunluğu) olur. Her observable (gözlenebilir) bir operator (operatör) ile temsil edilir. Measurement (ölçüm) yalnızca eigenvalue (özdeğer) değerlerinden birini verir ve durum o eigenstate (özdurum) durumuna collapse (çöker) eder. Ölçümler arasında ψ, Schrödinger denklemiyle deterministic (belirlenimci) biçimde evrilir.',
            yedekSecmeli: {
              soru: 'Hangisi kuantum postulate (postülat) ilkelerinden biridir?',
              secenekler: [
                sec('Her observable (gözlenebilir) bir operator (operatör) ile temsil edilir', true, 'Doğru. Bu ikinci postulate.'),
                sec('Ölçüm ψ\'yi değiştirmez', false, 'Yanlış. Ölçüm ψ\'yi eigenstate durumuna collapse ettirir.'),
                sec('Enerji her değeri alır', false, 'Yanlış. Yalnızca eigenvalue.'),
                sec('Denklem rastgele evrilir', false, 'Yanlış. Evrim deterministic (belirlenimci) olur.')
              ]
            },
            alt: { soru: 'Postulate (postülat) ilkelerinin measurement (ölçüm) ile ilgili olanlarını explain (açıkla).' }
          },
          {
            tip: 'acik',
            pdfSoru: 'The third postulate of quantum mechanics concerns measurement; explain how the system changes its state if its current state is not an eigenstate of the observable being measured.',
            soru: '3. postulate (postülat): durum eigenstate (özdurum) değilse ölçümde sistem nasıl değişir? Explain (açıkla).',
            anahtarFikirler: [
              'State superposition (süperpozisyon) olarak eigenstate (özdurum) toplamıdır: ψ = Σ cₙφₙ.',
              'Ölçüm eigenvalue (özdeğer) değerlerinden birini |cₙ|² olasılıkla verir.',
              'Ölçümden sonra ψ ölçülen eigenstate durumuna collapse (çöker) eder.',
              'Hemen tekrar ölçüm aynı sonucu verir.'
            ],
            yanlisKavramlar: [
              'Ölçüm eigenvalue ortalamasını verir',
              'Collapse Schrödinger denkleminden gelir'
            ],
            yanlisKavramIds: ['ozdeger_olcum', 'schrodinger_cokme'],
            idealCevap: 'Durum eigenstate (özdurum) değilse eigenstate toplamının superposition (süperpozisyon) halidir: ψ = Σ cₙφₙ. Measurement (ölçüm) eigenvalue (özdeğer) değerlerinden birini |cₙ|² olasılıkla verir. Ölçümden sonra durum ölçülen eigenstate durumuna collapse (çöker) eder; hemen tekrar ölçüm aynı sonucu verir.',
            yedekSecmeli: {
              soru: 'Eigenstate (özdurum) olmayan durumda ölçümden sonra ne olur?',
              secenekler: [
                sec('Durum ölçülen eigenstate durumuna collapse (çöker) eder', true, 'Doğru. Sonuç olasılıkla belirlenir.'),
                sec('Durum hiç değişmez', false, 'Yanlış. Ölçüm durumu değiştirir.'),
                sec('Durum ortalama eigenstate içinde olur', false, 'Yanlış. Ortalama eigenstate diye bir şey yok.'),
                sec('Sistem yok olur', false, 'Yanlış. Sistem eigenstate içinde kalır.')
              ]
            },
            alt: { soru: 'Measurement (ölçüm) sonucu hangi probability (olasılık) ile çıkar ve ölçümden sonra ψ ne olur? Explain (açıkla).' }
          }
        ]
      },
      {
        id: 's07-o09', tip: 'sandik', baslik: 'Sandık', kavram: null, agirlik: 1,
        kart: { id: 'born', yil: 1926, tekCumle: 'ψ\'nin karesinin olasılık olduğunu söyledi.' },
        ozet: ['Ölçüm eigenvalue (özdeğer) verir, |c|² olasılıkla', 'Ölçümde ψ eigenstate (özdurum) durumuna collapse (çöker) eder', 'Denklem deterministic (belirlenimci), collapse ölçümle'],
        kontrolNoktasi: true
      }
    ],
    temelTur: {
      kartlar: [
        { baslik: 'Superposition (süperpozisyon)', metin: 'Ölçümden önce durum eigenstate (özdurum) toplamı olabilir.' },
        { baslik: 'Measurement (ölçüm)', metin: 'Bir eigenvalue (özdeğer) çıkar, olasılığı |c|².' },
        { baslik: 'Collapse (çökme)', metin: 'Ölçümden sonra ψ o eigenstate (özdurum) içindedir.' }
      ],
      sim: { modul: 'olcum', params: { c1sq: 0.3 } }
    },
    tekrarHavuzu: [
      Object.assign({}, o03, { id: 's07-t01' }),
      Object.assign({}, o04, { id: 's07-t02' }),
      {
        id: 's07-t03', tip: 'dusman', baslik: 'Kusur düşmanı', kavram: 'olcum_cokme', agirlik: 1,
        soru: o05.soru,
        secenekler: o05.secenekler,
        kusurSkin: 'vakans'
      },
      {
        id: 's07-t04', tip: 'dusman', baslik: 'Kusur düşmanı', kavram: 'evrim_belirlenimci', agirlik: 1,
        soru: 'Ölçümler arasında ψ nasıl evolve (evrilir)?',
        secenekler: [
          sec('Schrödinger denklemiyle deterministic (belirlenimci) biçimde', true, 'Doğru. Rastgelelik yalnızca ölçümde ortaya çıkar.'),
          sec('Rastgele', false, 'Hayır. Evrim düzgündür.'),
          sec('Hiç evrilmez', false, 'Hayır. Zamanla evrilir.')
        ],
        kusurSkin: 'safsizlik'
      }
    ]
  };
})();
