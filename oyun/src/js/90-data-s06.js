/* 90-data-s06.js · İstasyon 06 "Tünel istasyonu" verisi (E6)
 * Q.data.stations.s06 alanını doldurur. Metinler oyun/istasyonlar/06-tunel-istasyonu.md'den aynen alınır.
 * Bağımlılık: 00-q.js (Q.data). Şema: oyun/01-veri-semalari.md §3.
 */
(function(){
  'use strict';

  function sec(t, dogru, neden){ return { t: t, dogru: dogru, neden: neden }; }

  var o03 = {
    id: 's06-o03', tip: 'dusman', baslik: 'Kusur düşmanı', kavram: 'basamak_yansima', agirlik: 1,
    soru: 'E > V₀ iken parçacığın step (basamak) potansiyelinden reflection (yansıma) olasılığı nedir?',
    secenekler: [
      sec('Sıfırdan büyük, wave (dalga) kısmen yansır', true, 'Doğru. k₁ ≠ k₂ olduğundan reflection (yansıma) vardır.'),
      sec('Sıfır, klasik fizik gibi', false, 'Hayır. Klasikte sıfır, wave mechanics (dalga mekaniği) içinde değil.'),
      sec('Yüzde yüz', false, 'Hayır. E > V₀ ise bir kısmı geçer.')
    ],
    kusurSkin: 'vakans'
  };

  var o04 = {
    id: 's06-o04', tip: 'dusman', baslik: 'Kusur düşmanı', kavram: 'bariyer_sonumlenme', agirlik: 1,
    soru: 'E < V₀ iken wave function (dalga fonksiyonu) ψ, barrier (bariyer) içinde ne yapar?',
    secenekler: [
      sec('Üstel olarak sönümlenir ama sıfır olmaz', true, 'Doğru. Forbidden region (yasak bölge) içinde dalga salınmaz, decays (sönümlenir).'),
      sec('Aniden sıfır olur', false, 'Hayır. ψ ve türevi süreklidir, aniden sıfır olamaz.'),
      sec('Salınmaya devam eder', false, 'Hayır. Yasak bölgede dalga salınmaz.')
    ],
    kusurSkin: 'tane_siniri'
  };

  var o05 = {
    id: 's06-o05', tip: 'tahmin', baslik: 'Tahmin çukuru', kavram: 'tunelleme_kalinlik', agirlik: 1.5,
    soru: 'Barrier (bariyer) kalınlaşırsa transmission probability (geçiş olasılığı) ne olur?',
    secenekler: [
      sec('Üstel olarak azalır', true, 'Doğru. Exponential decay (üstel azalma): T ∝ e^(−2κa).'),
      sec('Doğrusal azalır', false, 'Yanlış. Azalma exponential (üstel), çok hızlıdır.'),
      sec('Değişmez', false, 'Yanlış. Kalınlık arttıkça sönümlenme büyür.')
    ],
    sim: {
      modul: 'basamak',
      onceki: { mod: 'bariyer', E: 2, V0: 4, a: 0.3 },
      sonraki: { mod: 'bariyer', E: 2, V0: 4, a: 1.5 }
    },
    acik: 'Thickness (kalınlık) 0,3\'ten 1,5 nm\'ye çıkınca transmission (geçiş) olasılığı milyarlarca kat düşüyor.'
  };

  Q.data.stations.s06 = {
    id: 's06',
    sira: 6,
    ad: 'Tünel istasyonu',
    makine: 'Tünel istasyonu',
    renk: '#7a5cff',
    konu: 'Step potential (basamak potansiyeli), reflection (yansıma), barrier (bariyer), tunneling (tünelleme)',
    sinavSorulari: ['S5', 'S6'],
    sureHedefDk: 22,
    patronId: 'broglie',
    kavramlar: ['basamak_yansima', 'bariyer_sonumlenme', 'tunelleme_kalinlik', 'dalga_surekli'],
    engeller: [
      {
        id: 's06-o01', tip: 'hikaye', baslik: 'Zaman kapısı', kavram: null, agirlik: 1,
        yer: 'Paris', yil: 1924, rivayet: false,
        satirlar: [
          { kim: 'selin', metin: 'Tünel istasyonunda electron (elektron) bir duvarla karşılaşıyor. Geçer mi?' },
          { kim: 'broglie', metin: 'Matter wave (madde dalgası) ise ışık gibi davranır: engelde hem yansır hem geçebilir.' },
          { kim: 'selin', metin: 'Önce step (basamak), sonra barrier (bariyer). Wave (dalga) davranışı hep aynı.' }
        ]
      },
      {
        id: 's06-o02', tip: 'kavram', baslik: 'Kavram kapısı', kavram: 'basamak_yansima', agirlik: 1,
        gorev: 'Energy (enerji) step (basamak) yüksekliğinden büyük kalsın; R\'yi 0,1-0,2 yap.',
        sim: {
          modul: 'basamak',
          params: { mod: 'basamak', V0: 1.0, E: 3.0 },
          basari: { R: [0.1, 0.2] }
        },
        ogrenilen: 'E > V₀ iken bile wave (dalga) kısmen yansır; klasikte reflection (yansıma) olmazdı.'
      },
      o03,
      o04,
      o05,
      {
        id: 's06-o06', tip: 'tuzak', baslik: 'Yanılgı tuzağı', kavram: 'bariyer_sonumlenme', agirlik: 1,
        iddia: 'Enerjisi barrier (bariyer) yüksekliğinden düşük parçacık, kuantumda da kesinlikle geçemez.',
        parcalar: ['Enerjisi barrier (bariyer) yüksekliğinden düşük parçacık,', 'kuantumda da', 'kesinlikle geçemez.'],
        yanlisParca: 1,
        duzeltme: 'Kuantumda ψ barrier (bariyer) içinde decays (sönümlenir) ama sıfır olmaz; ince bariyerde tunneling (tünelleme) olasılığı vardır.'
      },
      {
        id: 's06-o07', tip: 'kopru', baslik: 'Mantık köprüsü', kavram: 'dalga_surekli', agirlik: 1,
        soru: 'Step potential (basamak) çözümünü sıraya diz',
        bloklar: [
          'ψ iki region (bölge) için de yazılır',
          'x = 0\'da ψ ve ψ\' continuous (sürekli) olmalı',
          'Continuity (süreklilik) katsayıları (r, t) belirler',
          'R=|r|² ve T=1−R'
        ],
        sonuc: 'Her region (bölge) için ψ, boundary condition (sınır koşulu) olarak süreklilik, katsayılar, R ve T.'
      },
      {
        id: 's06-o08', tip: 'patron', baslik: 'Dalga Canavarı', kavram: null, agirlik: 1,
        canavar: 'broglie', canavarAd: 'Dalga Canavarı',
        giris: 'Ben wave (dalga)! Duvarlara çarparım, bazen içinden geçerim.',
        fazlar: [
          {
            tip: 'secmeli', kavram: 'basamak_yansima',
            soru: 'E < V₀ olan step (basamak) potansiyelinde reflection coefficient (yansıma katsayısı) R kaçtır?',
            secenekler: [
              sec('R = 1', true, 'Doğru. Hepsi yansır; bölge 2\'de yalnızca decaying (sönümlü) ψ var.'),
              sec('R = 0', false, 'Hayır. R = 0 hiç yansıma olmaması demek; E < V₀ iken hepsi yansır.'),
              sec('R = 0,5', false, 'Hayır. E < V₀ iken bölge 2\'ye akı gitmez, yani R = 1.')
            ],
            alt: {
              soru: 'Tunneling (tünelleme) hangi wave (dalga) özelliğinin sonucudur?',
              secenekler: [
                sec('ψ\'nin bariyerde sönümlenip sıfır olmaması', true, 'Doğru. Öbür yanda ψ sıfırdan farklı kalır.'),
                sec('Parçacığın bariyerden zıplaması', false, 'Hayır. Zıplama classical (klasik) bir fikir.'),
                sec('Bariyerin erimesi', false, 'Hayır. Bariyer değişmez.')
              ]
            }
          },
          {
            tip: 'acik',
            pdfSoru: 'Calculate the wave function and the reflection coefficient of the electron for the given potential.',
            soru: 'Step potential (basamak potansiyeli) için wave function (dalga fonksiyonu) ve reflection coefficient (yansıma katsayısı) nasıl bulunur? Explain (açıkla): mantığı anlat.',
            anahtarFikirler: [
              'İki region (bölge) için ψ yazılır: incident (gelen), reflected (yansıyan) ve transmitted (geçen) wave (dalga).',
              'x = 0\'da ψ ve ψ\' sürekli olmalı.',
              'k₁=√(2mE)/ħ, k₂=√(2m(E−V₀))/ħ ile r=(k₁−k₂)/(k₁+k₂).',
              'R = |r|², T = 1 − R; E < V₀ ise R = 1.'
            ],
            yanlisKavramlar: [
              'E > V₀ ise hiç yansıma olmaz',
              'ψ bariyerde aniden sıfır olur'
            ],
            yanlisKavramIds: ['basamak_yansima', 'bariyer_sonumlenme'],
            idealCevap: 'Her iki bölgede ψ yazılır: solda gelen ve yansıyan, sağda geçen dalga. x = 0\'da ψ ve ψ\' sürekli olmalıdır. Buradan r = (k₁−k₂)/(k₁+k₂) çıkar, yansıma katsayısı R = |r|², geçiş T = 1 − R\'dir. E < V₀ ise bölge 2\'de ψ sönümlenir ve R = 1\'dir.',
            yedekSecmeli: {
              soru: 'R = |r|² nasıl bulunur?',
              secenekler: [
                sec('ψ ve ψ\' continuity (sürekliliği) ile r bulunur', true, 'Doğru. Boundary (sınır) noktasında continuity katsayıları belirler.'),
                sec('E\'yi V₀\'a bölerek', false, 'Yanlış. Bu doğrudan R vermez.'),
                sec('Sıcaklıkla', false, 'Yanlış. Sıcaklık gerekmez.'),
                sec('ψ\'nin karesini alarak', false, 'Yanlış. Önce r bulunur.')
              ]
            },
            alt: { soru: 'Step (basamak) potansiyelinde ψ continuity (sürekliliği) neden gerekir ve neyi belirler? Justify (gerekçelendir).' }
          },
          {
            tip: 'acik',
            pdfSoru: null,
            soru: 'Tunneling (tünelleme) nedir? Define (tanımla) ve transmission probability (geçiş olasılığı) neden thickness (kalınlık) ile azalır, explain (açıkla).',
            anahtarFikirler: [
              'E < V₀ iken klasik geçiş yok; kuantumda ψ barrier (bariyer) içinde decays (sönümlenir).',
              'ψ sıfırdan farklı kaldığından öbür yanda bulunma olasılığı vardır.',
              'Geçiş olasılığı T ∝ e^(−2κa), kalınlıkla üstel azalır.',
              'Tunnel diode (tünel diyodu) ve flash memory (flash bellek) gibi aygıtlarda önemlidir.'
            ],
            yanlisKavramlar: [
              'Parçacık bariyerin üstünden zıplar',
              'Geçerken enerjisini kaybeder'
            ],
            yanlisKavramIds: ['tunelleme_kalinlik', 'tunelleme_kalinlik'],
            idealCevap: 'E < V₀ iken klasik fizik geçişi yasaklar. Kuantumda ψ bariyerin içinde üstel olarak sönümlenir ama sıfır olmaz, bu yüzden öbür tarafta bulunma olasılığı vardır. Geçiş olasılığı T ∝ e^(−2κa) olduğundan bariyer kalınlaştıkça çok hızlı azalır. Tünel diyodu ve flash bellek gibi aygıtlarda kullanılır.',
            yedekSecmeli: {
              soru: 'Tunneling (tünelleme) neden olur?',
              secenekler: [
                sec('ψ barrier (bariyer) içinde decays (sönümlenir) ama sıfır olmaz', true, 'Doğru. Öbür yanda ψ kalır.'),
                sec('Parçacık enerji kazanır', false, 'Yanlış. Enerji aynı kalır.'),
                sec('Bariyer ısınır', false, 'Yanlış. Isı sebep değil.'),
                sec('Parçacık dalga değildir', false, 'Yanlış. Tunneling wave (dalga) davranışıdır.')
              ]
            },
            alt: { soru: 'Tunneling (tünelleme) olasılığı neden thickness (kalınlık) ile exponentially (üstel) azalır?' }
          }
        ]
      },
      {
        id: 's06-o09', tip: 'sandik', baslik: 'Sandık', kavram: null, agirlik: 1,
        kart: { id: 'broglie', yil: 1924, tekCumle: 'Matter (madde) için de wave (dalga) davranışı önerdi.' },
        ozet: ['E > V₀ iken bile partial reflection (kısmi yansıma)', 'E < V₀: ψ barrier (bariyer) içinde decays (sönümlenir)', 'Tunneling (tünelleme) thickness (kalınlık) ile exponentially (üstel) azalır'],
        kontrolNoktasi: true
      }
    ],
    temelTur: {
      kartlar: [
        { baslik: 'Step (basamak)', metin: 'Wave (dalga) step üzerinde kısmen yansır, kısmen geçer.' },
        { baslik: 'Forbidden region (yasak bölge)', metin: 'E < V₀ iken ψ decays (sönümlenir), sıfır olmaz.' },
        { baslik: 'Tunneling (tünelleme)', metin: 'İnce barrier (bariyer) için transmission (geçiş) olasılığı var, kalınlıkla azalır.' }
      ],
      sim: { modul: 'basamak', params: { mod: 'bariyer', E: 2, V0: 4, a: 0.3 } }
    },
    tekrarHavuzu: [
      Object.assign({}, o03, { id: 's06-t01' }),
      Object.assign({}, o04, { id: 's06-t02' }),
      {
        id: 's06-t03', tip: 'dusman', baslik: 'Kusur düşmanı', kavram: 'tunelleme_kalinlik', agirlik: 1,
        soru: o05.soru,
        secenekler: o05.secenekler,
        kusurSkin: 'vakans'
      },
      {
        id: 's06-t04', tip: 'dusman', baslik: 'Kusur düşmanı', kavram: 'dalga_surekli', agirlik: 1,
        soru: 'Boundary (sınır) noktasında neden ψ ve ψ\' continuous (sürekli) olmalıdır?',
        secenekler: [
          sec('Denklemin second derivative (ikinci türev) içermesi bunu gerektirir', true, 'Doğru. Discontinuity (süreksizlik) denklemi sağlamaz.'),
          sec('Süreklilik şart değildir', false, 'Hayır. Continuity (süreklilik) katsayıları belirler.'),
          sec('Yalnızca E < V₀ için gerekir', false, 'Hayır. Her durumda gerekir.')
        ],
        kusurSkin: 'safsizlik'
      }
    ]
  };
})();
