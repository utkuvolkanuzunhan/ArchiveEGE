/* 90-data-s07.js · İstasyon 07 "Ölçüm laboratuvarı" verisi (E7)
 * Q.data.stations.s07 alanını doldurur. Metinler oyun/istasyonlar/07-olcum-laboratuvari.md'den aynen alınır.
 * Bağımlılık: 00-q.js (Q.data). Şema: oyun/01-veri-semalari.md §3.
 */
(function(){
  'use strict';

  function sec(t, dogru, neden){ return { t: t, dogru: dogru, neden: neden }; }

  var o03 = {
    id: 's07-o03', tip: 'dusman', baslik: 'Defect (kusur) düşmanı', kavram: 'ozdeger_olcum', agirlik: 1,
    soru: 'Bir measurement (ölçüm) hangi değerleri verebilir?',
    secenekler: [
      sec('Yalnızca operator (operatör) eigenvalue (özdeğer) değerlerini', true, 'Doğru. Her measurement (ölçüm) eigenvalue (özdeğer) değerlerinden birini verir.'),
      sec('Herhangi bir değeri', false, 'Hayır. Yalnızca eigenvalue (özdeğer) çıkabilir; measurement (ölçüm) başka değer vermez.'),
      sec('Eigenvalue (özdeğer) average (ortalama) değerini', false, 'Hayır. Tek measurement (ölçüm) average (ortalama) değil, bir eigenvalue (özdeğer) verir.')
    ],
    kusurSkin: 'vakans'
  };

  var o04 = {
    id: 's07-o04', tip: 'dusman', baslik: 'Defect (kusur) düşmanı', kavram: 'olasilik_katsayi', agirlik: 1,
    soru: 'ψ = c₁φ₁ + c₂φ₂ iken sonucun φ₁ çıkma probability (olasılık) değeri nedir?',
    secenekler: [
      sec('|c₁|²', true, 'Doğru. Probability (olasılık) coefficient (katsayı) karesidir.'),
      sec('c₁ (coefficient, katsayı)', false, 'Hayır. Probability (olasılık) coefficient (katsayı) kendisi değil karesidir.'),
      sec('c₁ + c₂', false, 'Hayır. Coefficient (katsayı) toplanmaz; her sonucun probability (olasılık) değeri kendi karesidir.')
    ],
    kusurSkin: 'tane_siniri'
  };

  var o05 = {
    id: 's07-o05', tip: 'tahmin', baslik: 'Tahmin çukuru', kavram: 'olcum_cokme', agirlik: 1.5,
    soru: 'Collapse (çökme) sonrası aynı büyüklüğü hemen tekrar measure (ölçersen) ne olur?',
    secenekler: [
      sec('Aynı result (sonuç) çıkar', true, 'Doğru. ψ artık eigenstate (özdurum) içinde, result (sonuç) değişmez.'),
      sec('Yeni random (rastgele) result (sonuç)', false, 'Yanlış. Collapse (çökme) sonrası state (durum) eigenstate (özdurum) olur, result (sonuç) aynı kalır.'),
      sec('İki result (sonuç) average (ortalama) değeri', false, 'Yanlış. Tek measurement (ölçüm) bir eigenvalue (özdeğer) verir.')
    ],
    sim: {
      modul: 'olcum',
      onceki: { c1sq: 0.3 },
      sonraki: { c1sq: 0.3, olcTekrar: true }
    },
    acik: 'Collapse (çökme) sonrası ψ eigenstate (özdurum) olur; tekrar measurement (ölçüm) aynı result (sonuç) verir.'
  };

  Q.data.stations.s07 = {
    id: 's07',
    sira: 7,
    ad: 'Measurement (ölçüm) laboratuvarı',
    makine: 'Ölçüm lab.',
    renk: '#ff3df0',
    konu: 'Postulate (postülat), measurement (ölçüm), collapse (çökme)',
    sinavSorulari: ['S8', 'S9'],
    sureHedefDk: 23,
    patronId: 'born',
    kavramlar: ['postulatlar', 'olcum_cokme', 'ozdeger_olcum', 'evrim_belirlenimci', 'olasilik_katsayi', 'schrodinger_cokme'],
    engeller: [
      {
        id: 's07-o01', tip: 'hikaye', baslik: 'Zaman kapısı', kavram: null, agirlik: 1,
        yer: 'Göttingen', yil: 1926, rivayet: false,
        onBilgi: [
          { baslik: "Born, postülatlar ve ölçüm", madde: [
            "1926'da Born, |ψ|² değerini probability (olasılık) olarak yorumladı; Born bu çalışmasıyla 1954'te Nobel aldı.",
            "1927 dolayında Bohr ve Heisenberg'in Copenhagen interpretation (Kopenhag yorumu) şekillendi.",
            "1932'de von Neumann, quantum mechanics (kuantum mekaniği) postulate (postülat) yapısını matematiksel kurdu.",
            "1935'te Schrödinger, kendi cat (kedi) düşünce deneyiyle ölçüm sorununu tartışmaya açtı." ] }
        ],
        satirlar: [
          { kim: 'selin', metin: 'Measurement (ölçüm) laboratuvarı: bakınca ne oluyor?' },
          { kim: 'born', metin: 'ψ\'nin karesini probability (olasılık) olarak yorumladım. Measurement (ölçüm) result (sonuç) kesin değil, probability (olasılık) ile çıkar.' },
          { kim: 'selin', metin: 'Kuantumun kuralları beş postulate (postülat). Measurement (ölçüm) üçüncü ve dördüncüde.' }
        ]
      },
      {
        id: 's07-o02', tip: 'kavram', baslik: 'Kavram kapısı', kavram: 'olcum_cokme', agirlik: 1,
        onBilgi: [
          { baslik: "Observable (gözlenebilir), operator (operatör)", madde: [
            "Observable (gözlenebilir): ölçülebilen büyüklük, örneğin energy (enerji), position (konum), momentum.",
            "Her observable bir operator (operatör) ile temsil edilir; Ĥ enerji operatörüdür.",
            "Eigenvalue (özdeğer): operatörün izinli sayısı; eigenstate (özdurum): o sayıya ait kesin durum φₙ.",
            "Gözlenebilirin operatörü Hermitian (Hermityen) olur; bu yüzden eigenvalue (özdeğer) değerleri gerçel sayıdır." ] },
          { baslik: "Superposition (süperpozisyon), probability", madde: [
            "Superposition (süperpozisyon): durum eigenstate (özdurum) toplamı olabilir: ψ = c₁φ₁ + c₂φ₂ + ...",
            "Her c coefficient (katsayı) ile ölçüm sonucu φₙ için probability (olasılık) = |cₙ|².",
            "Olasılıklar toplanınca 1 eder: Σ|cₙ|² = 1 (normalization, normalizasyon).",
            "Sık karışan nokta: olasılık c'nin kendisi değil karesidir; katsayılar doğrudan toplanmaz." ] },
          { baslik: "Measurement (ölçüm), collapse (çökme)", madde: [
            "Measurement (ölçüm) yalnızca bir eigenvalue (özdeğer) verir; expectation value (beklenen değer) ⟨E⟩ = Σ|cₙ|²Eₙ çok ölçümün average (ortalama) değeridir, tek ölçümde görülmez.",
            "Ölçümden sonra ψ ölçülen eigenstate (özdurum) durumuna collapse (çöker); hemen tekrar ölçersen sonuç kararlıdır.",
            "Aralarda Schrödinger equation (denklemi) ψ'yi deterministic (belirlenimci) evriltir; rastgelelik yalnızca ölçümde.",
            "Schrödinger denklemi çökmez; collapse (çökme) ayrı bir postulate (postülat) ve measurement (ölçüm) ile gelir." ] }
        ],
        gorev: 'Measure (ölç), sonra tekrar measure (ölç): result (sonuç) ne?',
        sim: {
          modul: 'olcum',
          params: { c1sq: 0.3 },
          basari: { tekrarAyni: true }
        },
        ogrenilen: 'Measurement (ölçüm) ψ\'yi result (sonuç) durumuna collapse (çökertir) eder; hemen tekrar measure (ölçersen) aynı result (sonuç) alırsın.'
      },
      o03,
      o04,
      o05,
      {
        id: 's07-o06', tip: 'tuzak', baslik: 'Yanılgı tuzağı', kavram: 'schrodinger_cokme', agirlik: 1,
        iddia: 'Schrödinger equation (denklem) ψ\'yi measurement (ölçüm) anında collapse (çökme) ettirir.',
        parcalar: ['Schrödinger equation (denklem)', 'ψ\'yi measurement (ölçüm) anında', 'collapse (çökme) ettirir.'],
        yanlisParca: 0,
        duzeltme: 'Equation (denklem) ψ\'yi smooth (düzgün) evriltir. Collapse (çökme) ayrı postulate (postülat) olup yalnızca measurement (ölçüm) ile olur.'
      },
      {
        id: 's07-o07', tip: 'kopru', baslik: 'Mantık köprüsü', kavram: 'evrim_belirlenimci', agirlik: 1,
        soru: 'Measurement (ölçüm) döngüsünü sıraya diz',
        bloklar: [
          'System (sistem) eigenstate (özdurum) superposition (süperpozisyon) içindedir',
          'Measurement (ölçüm) bir eigenvalue (özdeğer) değerini |c|² probability (olasılık) ile verir',
          'ψ o eigenstate durumuna collapse (çöker) eder',
          'Sonra equation (denklem) ψ\'yi yeniden evolve (evriltir)'
        ],
        sonuc: 'Superposition (süperpozisyon), probabilistic (olasılıklı) result (sonuç), collapse (çökme), deterministic (belirlenimci) evolution (evrim).'
      },
      {
        id: 's07-o08', tip: 'patron', baslik: 'Probability (Olasılık) Canavarı', kavram: null, agirlik: 1,
        canavar: 'born', canavarAd: 'Probability (Olasılık) Canavarı',
        giris: 'Zar atıyorum! Ama kurallarım var. Probability (olasılık) |c|².',
        fazlar: [
          {
            tip: 'secmeli', kavram: 'olcum_cokme',
            soru: 'Measurement (ölçüm) öncesi system (sistem) eigenstate (özdurum) içinde değilse ne vardır?',
            secenekler: [
              sec('Eigenstate (özdurum) superposition (süperpozisyon) hâli', true, 'Doğru. ψ = Σ cₙφₙ.'),
              sec('Hidden (gizli) ama belirli bir value (değer)', false, 'Hayır. Standart yorumda measurement (ölçüm) öncesi belirli value (değer) yoktur.'),
              sec('Zero energy (sıfır enerji)', false, 'Hayır. Energy (enerji) sıfır olmak zorunda değil.')
            ],
            alt: {
              soru: 'Hangi büyüklük bir measurement (ölçüm) result (sonuç) olabilir?',
              secenekler: [
                sec('Operator (operatör) eigenvalue (özdeğer) değeri', true, 'Doğru. Measurement (ölçüm) eigenvalue (özdeğer) verir.'),
                sec('Herhangi bir number (sayı)', false, 'Hayır. Yalnızca eigenvalue (özdeğer).'),
                sec('ψ\'nin kendisi (wave function, dalga fonksiyonu)', false, 'Hayır. ψ doğrudan measure (ölçülmez).')
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
              'Measurement (ölçüm) yalnızca eigenvalue (özdeğer) verir, state (durum) eigenstate (özdurum) durumuna collapse (çöker) eder.',
              'Time evolution (zaman evrimi) Schrödinger equation (denklem) ile deterministic (belirlenimci) olur.'
            ],
            yanlisKavramlar: [
              'Quantum mechanics (kuantum mekaniği) her şeyi random (rastgele) yapar',
              'Measurement (ölçüm) sırasında ψ hiç değişmez'
            ],
            yanlisKavramIds: ['evrim_belirlenimci', 'olcum_cokme'],
            idealCevap: 'Sistemin durumu ψ ile tarif edilir ve |ψ|² probability density (olasılık yoğunluğu) olur. Her observable (gözlenebilir) bir operator (operatör) ile temsil edilir. Measurement (ölçüm) yalnızca eigenvalue (özdeğer) değerlerinden birini verir ve durum o eigenstate (özdurum) durumuna collapse (çöker) eder. Measurement (ölçüm) arasında ψ, Schrödinger equation (denklem) ile deterministic (belirlenimci) biçimde evrilir.',
            yedekSecmeli: {
              soru: 'Hangisi kuantum postulate (postülat) ilkelerinden biridir?',
              secenekler: [
                sec('Her observable (gözlenebilir) bir operator (operatör) ile temsil edilir', true, 'Doğru. Bu ikinci postulate (postülat).'),
                sec('Measurement (ölçüm) ψ\'yi değiştirmez', false, 'Yanlış. Measurement (ölçüm) ψ\'yi eigenstate (özdurum) durumuna collapse (çökme) ettirir.'),
                sec('Energy (enerji) her değeri alır', false, 'Yanlış. Yalnızca eigenvalue (özdeğer).'),
                sec('Equation (denklem) random (rastgele) evolve (evrilir)', false, 'Yanlış. Evolution (evrim) deterministic (belirlenimci) olur.')
              ]
            },
            alt: { soru: 'Postulate (postülat) ilkelerinin measurement (ölçüm) ile ilgili olanlarını explain (açıkla).' }
          },
          {
            tip: 'acik',
            pdfSoru: 'The third postulate of quantum mechanics concerns measurement; explain how the system changes its state if its current state is not an eigenstate of the observable being measured.',
            soru: '3. postulate (postülat): state (durum) eigenstate (özdurum) değilse measurement (ölçüm) sırasında system (sistem) nasıl değişir? Explain (açıkla).',
            anahtarFikirler: [
              'State (durum) superposition (süperpozisyon) olarak eigenstate (özdurum) toplamıdır: ψ = Σ cₙφₙ.',
              'Measurement (ölçüm) eigenvalue (özdeğer) değerlerinden birini |cₙ|² probability (olasılık) ile verir.',
              'Measurement (ölçüm) sonrası ψ ölçülen eigenstate (özdurum) durumuna collapse (çöker) eder.',
              'Hemen tekrar measurement (ölçüm) aynı result (sonuç) verir.'
            ],
            yanlisKavramlar: [
              'Measurement (ölçüm) eigenvalue (özdeğer) average (ortalama) değerini verir',
              'Collapse (çökme) Schrödinger equation (denklem) kaynaklıdır'
            ],
            yanlisKavramIds: ['ozdeger_olcum', 'schrodinger_cokme'],
            idealCevap: 'Durum eigenstate (özdurum) değilse eigenstate toplamının superposition (süperpozisyon) halidir: ψ = Σ cₙφₙ. Measurement (ölçüm) eigenvalue (özdeğer) değerlerinden birini |cₙ|² probability (olasılık) ile verir. Measurement (ölçüm) sonrası state (durum) ölçülen eigenstate (özdurum) durumuna collapse (çöker) eder; hemen tekrar measurement (ölçüm) aynı result (sonuç) verir.',
            yedekSecmeli: {
              soru: 'Eigenstate (özdurum) olmayan state (durumda) measurement (ölçüm) sonrası ne olur?',
              secenekler: [
                sec('State (durum) ölçülen eigenstate (özdurum) durumuna collapse (çöker) eder', true, 'Doğru. Result (sonuç) probability (olasılık) ile belirlenir.'),
                sec('State (durum) hiç değişmez', false, 'Yanlış. Measurement (ölçüm) state (durum) değiştirir.'),
                sec('State (durum) average (ortalama) eigenstate (özdurum) içinde olur', false, 'Yanlış. Average (ortalama) eigenstate (özdurum) diye bir şey yok.'),
                sec('System (sistem) yok olur', false, 'Yanlış. System (sistem) eigenstate (özdurum) içinde kalır.')
              ]
            },
            alt: { soru: 'Measurement (ölçüm) sonucu hangi probability (olasılık) ile çıkar ve ölçümden sonra ψ ne olur? Explain (açıkla).' }
          }
        ]
      },
      { id: 's07-h01', tip: 'hesap', baslik: 'Hesap görevi', kavram: null, agirlik: 0, hesapGorev: 'olc-E' },
      {
        id: 's07-o09', tip: 'sandik', baslik: 'Sandık', kavram: null, agirlik: 1,
        kart: { id: 'born', yil: 1926, tekCumle: 'ψ\'nin karesinin probability (olasılık) olduğunu söyledi.' },
        ozet: ['Measurement (ölçüm) eigenvalue (özdeğer) verir, |c|² probability (olasılık) ile', 'Measurement (ölçüm) sırasında ψ eigenstate (özdurum) durumuna collapse (çöker) eder', 'Equation (denklem) deterministic (belirlenimci), collapse (çökme) measurement (ölçüm) ile'],
        kontrolNoktasi: true
      }
    ],
    temelTur: {
      kartlar: [
        { baslik: 'Superposition (süperpozisyon)', metin: 'Measurement (ölçüm) öncesi state (durum) eigenstate (özdurum) toplamı olabilir.' },
        { baslik: 'Measurement (ölçüm)', metin: 'Bir eigenvalue (özdeğer) çıkar, probability (olasılık) |c|².' },
        { baslik: 'Collapse (çökme)', metin: 'Measurement (ölçüm) sonrası ψ o eigenstate (özdurum) içindedir.' }
      ],
      sim: { modul: 'olcum', params: { c1sq: 0.3 } }
    },
    tekrarHavuzu: [
      Object.assign({}, o03, { id: 's07-t01' }),
      Object.assign({}, o04, { id: 's07-t02' }),
      {
        id: 's07-t03', tip: 'dusman', baslik: 'Defect (kusur) düşmanı', kavram: 'olcum_cokme', agirlik: 1,
        soru: o05.soru,
        secenekler: o05.secenekler,
        kusurSkin: 'vakans'
      },
      {
        id: 's07-t04', tip: 'dusman', baslik: 'Defect (kusur) düşmanı', kavram: 'evrim_belirlenimci', agirlik: 1,
        soru: 'Measurement (ölçüm) arasında ψ nasıl evolve (evrilir)?',
        secenekler: [
          sec('Schrödinger equation (denklem) ile deterministic (belirlenimci) biçimde', true, 'Doğru. Randomness (rastgelelik) yalnızca measurement (ölçüm) sırasında ortaya çıkar.'),
          sec('Random (rastgele)', false, 'Hayır. Evolution (evrim) smooth (düzgün) ilerler.'),
          sec('Hiç evolve (evrilmez)', false, 'Hayır. Zamanla evolve (evrilir).')
        ],
        kusurSkin: 'safsizlik'
      }
    ]
  };
})();
