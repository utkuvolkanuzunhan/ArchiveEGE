/* 90-data-s06.js · İstasyon 06 "Tünel istasyonu" verisi (E6)
 * Q.data.stations.s06 alanını doldurur. Metinler oyun/istasyonlar/06-tunel-istasyonu.md'den aynen alınır.
 * Bağımlılık: 00-q.js (Q.data). Şema: oyun/01-veri-semalari.md §3.
 */
(function(){
  'use strict';

  function sec(t, dogru, neden){ return { t: t, dogru: dogru, neden: neden }; }

  var o03 = {
    id: 's06-o03', tip: 'dusman', baslik: 'Kusur düşmanı', kavram: 'basamak_yansima', agirlik: 1,
    soru: 'E > V₀ iken parçacığın basamaktan yansıma olasılığı nedir?',
    secenekler: [
      sec('Sıfırdan büyük, dalga kısmen yansır', true, 'Doğru. k₁ ≠ k₂ olduğundan yansıma vardır.'),
      sec('Sıfır, klasik fizik gibi', false, 'Hayır. Klasikte sıfır, dalga mekaniğinde değil.'),
      sec('Yüzde yüz', false, 'Hayır. E > V₀ ise bir kısmı geçer.')
    ],
    kusurSkin: 'vakans'
  };

  var o04 = {
    id: 's06-o04', tip: 'dusman', baslik: 'Kusur düşmanı', kavram: 'bariyer_sonumlenme', agirlik: 1,
    soru: 'E < V₀ iken ψ bariyerin içinde ne yapar?',
    secenekler: [
      sec('Üstel olarak sönümlenir ama sıfır olmaz', true, 'Doğru. Yasak bölgede dalga salınmaz, sönümlenir.'),
      sec('Aniden sıfır olur', false, 'Hayır. ψ ve türevi süreklidir, aniden sıfır olamaz.'),
      sec('Salınmaya devam eder', false, 'Hayır. Yasak bölgede dalga salınmaz.')
    ],
    kusurSkin: 'tane_siniri'
  };

  var o05 = {
    id: 's06-o05', tip: 'tahmin', baslik: 'Tahmin çukuru', kavram: 'tunelleme_kalinlik', agirlik: 1.5,
    soru: 'Bariyeri kalınlaştırırsan geçiş olasılığı ne olur?',
    secenekler: [
      sec('Üstel olarak azalır', true, 'Doğru. T ∝ e^(−2κa).'),
      sec('Doğrusal azalır', false, 'Yanlış. Azalma üsteldir, çok hızlıdır.'),
      sec('Değişmez', false, 'Yanlış. Kalınlık arttıkça sönümlenme büyür.')
    ],
    sim: {
      modul: 'basamak',
      onceki: { mod: 'bariyer', E: 2, V0: 4, a: 0.3 },
      sonraki: { mod: 'bariyer', E: 2, V0: 4, a: 1.5 }
    },
    acik: 'Kalınlık 0,3\'ten 1,5 nm\'ye çıkınca geçiş olasılığı milyarlarca kat düşüyor.'
  };

  Q.data.stations.s06 = {
    id: 's06',
    sira: 6,
    ad: 'Tünel istasyonu',
    makine: 'Tünel istasyonu',
    renk: '#7a5cff',
    konu: 'Basamak potansiyeli, yansıma, bariyer, tünelleme',
    sinavSorulari: ['S5', 'S6'],
    sureHedefDk: 22,
    patronId: 'broglie',
    kavramlar: ['basamak_yansima', 'bariyer_sonumlenme', 'tunelleme_kalinlik', 'dalga_surekli'],
    engeller: [
      {
        id: 's06-o01', tip: 'hikaye', baslik: 'Zaman kapısı', kavram: null, agirlik: 1,
        yer: 'Paris', yil: 1924, rivayet: false,
        satirlar: [
          { kim: 'selin', metin: 'Tünel istasyonunda elektron bir duvarla karşılaşıyor. Geçer mi?' },
          { kim: 'broglie', metin: 'Madde dalgaysa ışık gibi davranır: engelde hem yansır hem geçebilir.' },
          { kim: 'selin', metin: 'Önce basamak, sonra bariyer. Dalga davranışı hep aynı.' }
        ]
      },
      {
        id: 's06-o02', tip: 'kavram', baslik: 'Kavram kapısı', kavram: 'basamak_yansima', agirlik: 1,
        gorev: 'Enerjiyi basamaktan yüksek tut, R\'yi 0,1-0,2 yap.',
        sim: {
          modul: 'basamak',
          params: { mod: 'basamak', V0: 1.0, E: 3.0 },
          basari: { R: [0.1, 0.2] }
        },
        ogrenilen: 'E > V₀ iken bile dalga kısmen yansır; klasikte yansıma olmazdı.'
      },
      o03,
      o04,
      o05,
      {
        id: 's06-o06', tip: 'tuzak', baslik: 'Yanılgı tuzağı', kavram: 'bariyer_sonumlenme', agirlik: 1,
        iddia: 'Enerjisi bariyerden düşük parçacık, kuantumda da kesinlikle geçemez.',
        parcalar: ['Enerjisi bariyerden düşük parçacık,', 'kuantumda da', 'kesinlikle geçemez.'],
        yanlisParca: 1,
        duzeltme: 'Kuantumda ψ bariyerde sönümlenir ama sıfır olmaz; ince bariyerden geçiş olasılığı vardır.'
      },
      {
        id: 's06-o07', tip: 'kopru', baslik: 'Mantık köprüsü', kavram: 'dalga_surekli', agirlik: 1,
        soru: 'Basamak çözümünü sıraya diz',
        bloklar: [
          'ψ iki bölgede de yazılır',
          'x = 0\'da ψ ve ψ\' sürekli olmalı',
          'Süreklilik katsayıları (r, t) belirler',
          'R=|r|² ve T=1−R'
        ],
        sonuc: 'Her bölgede ψ, sınırda süreklilik, katsayılar, R ve T.'
      },
      {
        id: 's06-o08', tip: 'patron', baslik: 'Dalga Canavarı', kavram: null, agirlik: 1,
        canavar: 'broglie', canavarAd: 'Dalga Canavarı',
        giris: 'Ben dalgayım! Duvarlara çarparım, bazen içinden geçerim.',
        fazlar: [
          {
            tip: 'secmeli', kavram: 'basamak_yansima',
            soru: 'E < V₀ olan basamakta yansıma katsayısı R kaçtır?',
            secenekler: [
              sec('R = 1', true, 'Doğru. Hepsi yansır; bölge 2\'de yalnızca sönümlü ψ var.'),
              sec('R = 0', false, 'Hayır. R = 0 hiç yansıma olmaması demek; E < V₀ iken hepsi yansır.'),
              sec('R = 0,5', false, 'Hayır. E < V₀ iken bölge 2\'ye akı gitmez, yani R = 1.')
            ],
            alt: {
              soru: 'Tünelleme hangi dalga özelliğinin sonucudur?',
              secenekler: [
                sec('ψ\'nin bariyerde sönümlenip sıfır olmaması', true, 'Doğru. Öbür yanda ψ sıfırdan farklı kalır.'),
                sec('Parçacığın bariyerden zıplaması', false, 'Hayır. Zıplama klasik bir fikir.'),
                sec('Bariyerin erimesi', false, 'Hayır. Bariyer değişmez.')
              ]
            }
          },
          {
            tip: 'acik',
            pdfSoru: 'Calculate the wave function and the reflection coefficient of the electron for the given potential.',
            soru: 'Basamak potansiyelinde ψ ve yansıma katsayısı nasıl bulunur? Mantığı anlat.',
            anahtarFikirler: [
              'İki bölgede ψ yazılır: gelen, yansıyan ve geçen dalga.',
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
                sec('ψ ve ψ\' sürekliliğinden r bulunur', true, 'Doğru. Sınırda süreklilik katsayıları belirler.'),
                sec('E\'yi V₀\'a bölerek', false, 'Yanlış. Bu doğrudan R vermez.'),
                sec('Sıcaklıkla', false, 'Yanlış. Sıcaklık gerekmez.'),
                sec('ψ\'nin karesini alarak', false, 'Yanlış. Önce r bulunur.')
              ]
            },
            alt: { soru: 'Basamakta ψ sürekliliği neden gerekir ve neyi belirler?' }
          },
          {
            tip: 'acik',
            pdfSoru: null,
            soru: 'Tünelleme nedir? Geçiş olasılığı neden kalınlıkla azalır?',
            anahtarFikirler: [
              'E < V₀ iken klasik geçiş yok; kuantumda ψ bariyerde sönümlenir.',
              'ψ sıfırdan farklı kaldığından öbür yanda bulunma olasılığı vardır.',
              'Geçiş olasılığı T ∝ e^(−2κa), kalınlıkla üstel azalır.',
              'Tünel diyodu ve flash bellek gibi aygıtlarda önemlidir.'
            ],
            yanlisKavramlar: [
              'Parçacık bariyerin üstünden zıplar',
              'Geçerken enerjisini kaybeder'
            ],
            yanlisKavramIds: ['tunelleme_kalinlik', 'tunelleme_kalinlik'],
            idealCevap: 'E < V₀ iken klasik fizik geçişi yasaklar. Kuantumda ψ bariyerin içinde üstel olarak sönümlenir ama sıfır olmaz, bu yüzden öbür tarafta bulunma olasılığı vardır. Geçiş olasılığı T ∝ e^(−2κa) olduğundan bariyer kalınlaştıkça çok hızlı azalır. Tünel diyodu ve flash bellek gibi aygıtlarda kullanılır.',
            yedekSecmeli: {
              soru: 'Tünelleme neden olur?',
              secenekler: [
                sec('ψ bariyerde sönümlenir ama sıfır olmaz', true, 'Doğru. Öbür yanda ψ kalır.'),
                sec('Parçacık enerji kazanır', false, 'Yanlış. Enerji aynı kalır.'),
                sec('Bariyer ısınır', false, 'Yanlış. Isı sebep değil.'),
                sec('Parçacık dalga değildir', false, 'Yanlış. Tünelleme dalga davranışıdır.')
              ]
            },
            alt: { soru: 'Tünelleme olasılığı neden kalınlıkla üstel azalır?' }
          }
        ]
      },
      {
        id: 's06-o09', tip: 'sandik', baslik: 'Sandık', kavram: null, agirlik: 1,
        kart: { id: 'broglie', yil: 1924, tekCumle: 'Maddenin de dalga gibi davrandığını önerdi.' },
        ozet: ['E > V₀ iken bile kısmi yansıma', 'E < V₀: ψ bariyerde sönümlenir', 'Tünelleme kalınlıkla üstel azalır'],
        kontrolNoktasi: true
      }
    ],
    temelTur: {
      kartlar: [
        { baslik: 'Basamak', metin: 'Dalga basamakta kısmen yansır, kısmen geçer.' },
        { baslik: 'Yasak bölge', metin: 'E < V₀ iken ψ sönümlenir, sıfır olmaz.' },
        { baslik: 'Tünelleme', metin: 'İnce bariyerde geçiş olasılığı var, kalınlıkla azalır.' }
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
        soru: 'Sınırda neden ψ ve ψ\' sürekli olmalıdır?',
        secenekler: [
          sec('Denklemin ikinci türev içermesi bunu gerektirir', true, 'Doğru. Süreksizlik denklemi sağlamaz.'),
          sec('Süreklilik şart değildir', false, 'Hayır. Süreklilik katsayıları belirler.'),
          sec('Yalnızca E < V₀ için gerekir', false, 'Hayır. Her durumda gerekir.')
        ],
        kusurSkin: 'safsizlik'
      }
    ]
  };
})();
