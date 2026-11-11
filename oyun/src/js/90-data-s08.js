/* 90-data-s08.js · İstasyon 08 "Kalibrasyon odası" verisi (E8)
 * Q.data.stations.s08 alanını doldurur. Metinler oyun/istasyonlar/08-kalibrasyon-odasi.md'den aynen alınır.
 * Şema: oyun/01-veri-semalari.md §3.
 */
(function(){
  'use strict';

  function sec(t, dogru, neden){ return { t: t, dogru: dogru, neden: neden }; }

  var o03 = {
    id: 's08-o03', tip: 'dusman', baslik: 'Kusur düşmanı', kavram: 'belirsizlik_dalga', agirlik: 1,
    soru: 'Δx küçülürse Δp (momentum) ne olur?',
    secenekler: [
      sec('Büyür (increases)', true, 'Doğru. ΔxΔp ≥ ħ/2 product (çarpım) en az sabit kalır.'),
      sec('Küçülür (decreases)', false, 'Yanlış. Product (çarpım) sınırlı olduğundan biri küçülünce öbürü büyür.'),
      sec('Değişmez (unchanged)', false, 'Yanlış. ΔxΔp ≥ ħ/2 condition (koşul) bunu zorunlu kılar.')
    ],
    kusurSkin: 'vakans'
  };

  var o04 = {
    id: 's08-o04', tip: 'dusman', baslik: 'Kusur düşmanı', kavram: 'belirsizlik_makro', agirlik: 1,
    soru: 'Bilardo topunda uncertainty (belirsizlik) neden fark edilmez?',
    secenekler: [
      sec('ħ çok küçük, ΔxΔp limit (sınır) ihmal edilebilir', true, 'Doğru. Uncertainty principle (belirsizlik ilkesi) her cisimde geçerli, etkisi görünmez.'),
      sec('Top uncertainty (belirsizlik) kapsamında değildir', false, 'Hayır. Principle (ilke) her cisim için geçerlidir.'),
      sec('Top bir wave (dalga) değildir', false, 'Hayır. Wavelength (dalga boyu) yalnızca ihmal edilecek kadar küçüktür.')
    ],
    kusurSkin: 'tane_siniri'
  };

  var o05 = {
    id: 's08-o05', tip: 'tahmin', baslik: 'Tahmin çukuru', kavram: 'belirsizlik_dalga', agirlik: 1.5,
    soru: 'Wave packet (dalga paketi) için position (konum) genişliğini yarıya indirirsen momentum spread (momentum yayılması) ne olur?',
    secenekler: [
      sec('İki katına çıkar (doubles)', true, 'Doğru. σp = ħ/(2σx).'),
      sec('Yarıya iner (halves)', false, 'Yanlış. Position (konum) daralınca momentum genişler.'),
      sec('Aynı kalır (unchanged)', false, 'Yanlış. Position (konum) ve momentum bağlıdır.')
    ],
    sim: {
      modul: 'belirsizlik',
      onceki: { sx: 2 },
      sonraki: { sx: 1 }
    },
    acik: 'σx 2\'den 1\'e inince σp iki katına çıktı; product (çarpım) ħ/2\'de kaldı.'
  };

  Q.data.stations.s08 = {
    id: 's08',
    sira: 8,
    ad: 'Calibration (kalibrasyon) odası',
    makine: 'Kalibrasyon',
    renk: '#39ff88',
    konu: 'Uncertainty (belirsizlik) principle, conjugate variable (eşlenik değişken)',
    sinavSorulari: ['S10'],
    sureHedefDk: 22,
    patronId: 'heis',
    kavramlar: ['belirsizlik_dalga', 'belirsizlik_alet', 'eslenik_degisken', 'belirsizlik_makro'],
    engeller: [
      {
        id: 's08-o01', tip: 'hikaye', baslik: 'Zaman kapısı', kavram: null, agirlik: 1,
        yer: 'Kopenhag', yil: 1927, rivayet: false,
        satirlar: [
          { kim: 'selin', metin: 'Calibration (kalibrasyon) odası: measurement (ölçüm) mükemmelleştirmek istiyoruz.' },
          { kim: 'heis', metin: 'Position (konum) ve momentum aynı anda keyfi hassas measure (ölçülemez). Instrument (alet) yüzünden değil.' },
          { kim: 'heis', metin: 'Doğa böyle: wave (dalga) isen keskin konum ve keskin momentum aynı anda olmaz.' }
        ]
      },
      {
        id: 's08-o02', tip: 'kavram', baslik: 'Kavram kapısı', kavram: 'belirsizlik_dalga', agirlik: 1,
        gorev: 'Position width (konum genişliği) daralt, momentuma bak.',
        sim: {
          modul: 'belirsizlik',
          params: { sx: 3 },
          basari: { dar: true }
        },
        ogrenilen: 'Position (konum) daraldıkça momentum yayılır; product (çarpım) hep en az ħ/2.'
      },
      o03,
      o04,
      o05,
      {
        id: 's08-o06', tip: 'tuzak', baslik: 'Yanılgı tuzağı', kavram: 'belirsizlik_alet', agirlik: 1,
        iddia: 'Uncertainty (belirsizlik), measurement (ölçüm) instrument (aletimizin) yeterince hassas olmamasından kaynaklanır.',
        parcalar: ['Uncertainty (belirsizlik),', 'measurement (ölçüm) instrument (aletimizin) yeterince', 'hassas olmamasından kaynaklanır.'],
        yanlisParca: 1,
        duzeltme: 'Uncertainty (belirsizlik) instrument (alet) kusuru değil, wave nature (dalga doğası) temel sonucudur.'
      },
      {
        id: 's08-o07', tip: 'kopru', baslik: 'Mantık köprüsü', kavram: 'belirsizlik_dalga', agirlik: 1,
        soru: 'Uncertainty (belirsizlik) zincirini sıraya diz',
        bloklar: [
          'Parçacık bir wave packet (dalga paketi) olur',
          'Sharp position (keskin konum) çok wavelength (dalga boyu) toplamıdır',
          'Çok wavelength (dalga boyu) geniş momentum demektir',
          'ΔxΔp ≥ ħ/2'
        ],
        sonuc: 'Wave packet (dalga paketi), sharp position (keskin konum), broad momentum (geniş momentum), ΔxΔp ≥ ħ/2.'
      },
      {
        id: 's08-o08', tip: 'patron', baslik: 'Belirsizlik Canavarı', kavram: null, agirlik: 1,
        canavar: 'heis', canavarAd: 'Belirsizlik Canavarı',
        giris: 'Neredeyim? Ne kadar hızlıyım? İkisini birden bilemezsin!',
        fazlar: [
          {
            tip: 'secmeli', kavram: 'eslenik_degisken',
            soru: 'Position (konum) ve momentum neden aynı anda keyfi hassas ölçülemez?',
            secenekler: [
              sec('Operator (operatör) commute (değişme) yapmaz, ortak eigenstate (özdurum) yoktur', true, 'Doğru. [x,p] = iħ ≠ 0.'),
              sec('Instrument (alet) yetersizdir', false, 'Hayır. Instrument (alet) kusuru değil, doğanın yapısı.'),
              sec('Measurement (ölçüm) particle (parçacığı) bozar, tek sebep bu', false, 'Hayır. Measurement (ölçüm) olmasa da principle (ilke) geçerlidir.')
            ],
            alt: {
              soru: '[x, p] = iħ commutator (komütatör) ne anlama gelir?',
              secenekler: [
                sec('x ve p operator (operatör) commute (değişme) etmez', true, 'Doğru. Bu yüzden ortak eigenstate (özdurum) yok.'),
                sec('x ve p equal (eşittir)', false, 'Hayır. Bu bir equality (eşitlik) değil, commutation relation (değişme bağıntısı).'),
                sec('p sıfırdır', false, 'Hayır. p sıfır olmak zorunda değil.')
              ]
            }
          },
          {
            tip: 'acik',
            pdfSoru: 'Explain the uncertainty principle and why it is impossible to simultaneously measure conjugate variables with unlimited precision.',
            soru: 'Uncertainty principle (belirsizlik ilkesi) explain (açıkla). Conjugate variables (eşlenik değişkenler) neden aynı anda keyfi hassas ölçülemez?',
            anahtarFikirler: [
              'ΔxΔp ≥ ħ/2: biri keskinleşince öbürü yayılır.',
              'Wave packet (dalga paketi): keskin konum çok wavelength (dalga boyu) gerektirir.',
              'Position (konum) ve momentum operator (operatör) değişmez, yani commute (değişme) etmez ([x,p] = iħ).',
              'Instrument (alet) kusuru değil, doğanın (wave nature, dalga doğası) temel limit (sınırı).'
            ],
            yanlisKavramlar: [
              'Uncertainty (belirsizlik) measurement (ölçüm) instrument (aletinin) kusurudur',
              'Measurement (ölçüm) particle (parçacığı) bozduğu için olur, tek sebep bu'
            ],
            yanlisKavramIds: ['belirsizlik_alet', 'belirsizlik_alet'],
            idealCevap: 'Uncertainty principle (belirsizlik ilkesi) ΔxΔp ≥ ħ/2 der: biri keskinleşince öbürü yayılır. Sebep wave nature (dalga doğası) olup keskin bir konum çok sayıda wavelength (dalga boyu) toplamını gerektirir, bu da geniş bir momentum distribution (dağılımı) demektir. Position (konum) ve momentum operator (operatör) değişmediği için ortak eigenstate (özdurum) yoktur. Bu instrument (alet) kusuru değil, doğanın temel limit (sınır) özelliğidir.',
            yedekSecmeli: {
              soru: 'Uncertainty principle (belirsizlik ilkesi) neden vardır?',
              secenekler: [
                sec('Particle (parçacık) wave nature (dalga doğası) özelliğinden', true, 'Doğru. Keskin konum geniş momentum demektir.'),
                sec('Instrument (alet) yetersiz olduğundan', false, 'Yanlış. Ideal instrument (alet) için de geçerli.'),
                sec('Temperature (sıcaklık) yüzünden', false, 'Yanlış. Temperature (sıcaklık) etkisinden bağımsız.'),
                sec('Sadece electron (elektron) için', false, 'Yanlış. Her cisimde geçerli, büyükte ihmal edilir.')
              ]
            },
            alt: { soru: 'ΔxΔp ≥ ħ/2 neden wave nature (dalga doğası) kaynaklıdır? Explain (açıkla).' }
          },
          {
            tip: 'acik',
            pdfSoru: null,
            soru: 'Conjugate variable (eşlenik değişken) nedir? Define (tanımla), örnek ver ve günlük hayatta neden görmediğimizi explain (açıkla).',
            anahtarFikirler: [
              'Conjugate pair (eşlenik çift): aynı anda keyfi hassas ölçülemeyen iki büyüklük.',
              'Örnek: position (konum) x ve momentum p.',
              'Operator (operatör) commute (değişme) etmediği için ortak eigenstate (özdurum) yoktur.',
              'Günlük cisimde effect (etki) ihmal edilir, çünkü ħ çok küçüktür.'
            ],
            yanlisKavramlar: [
              'Her büyüklük çifti uncertainty (belirsizlik) gösterir',
              'Yalnızca electron (elektron) gibi küçük particle (parçacık) için geçerlidir'
            ],
            yanlisKavramIds: ['eslenik_degisken', 'belirsizlik_makro'],
            idealCevap: 'Conjugate variables (eşlenik değişkenler), aynı anda keyfi hassas ölçülemeyen büyüklük çiftidir; örneğin position (konum) ve momentum. Operator (operatör) commute (değişme) etmediği için ortak eigenstate (özdurum) yoktur. Günlük cisimlerde ħ çok küçük olduğundan limit (sınır) ihmal edilir.',
            yedekSecmeli: {
              soru: 'Hangisi bir conjugate pair (eşlenik çift) olur?',
              secenekler: [
                sec('Position (konum) ve momentum', true, 'Doğru. Operator (operatör) commute (değişme) etmez.'),
                sec('Mass (kütle) ve volume (hacim)', false, 'Yanlış. Bu çift için principle (ilke) yok.'),
                sec('Temperature (sıcaklık) ve color (renk)', false, 'Yanlış. Conjugate pair (eşlenik çift) değil.'),
                sec('Velocity (hız) ve acceleration (ivme)', false, 'Yanlış. Bu conjugate pair (eşlenik çift) değil.')
              ]
            },
            alt: { soru: 'Position ve momentum neden conjugate variable sayılır? Justify (gerekçelendir).' }
          }
        ]
      },
      {
        id: 's08-o09', tip: 'sandik', baslik: 'Sandık', kavram: null, agirlik: 1,
        kart: { id: 'heis', yil: 1927, tekCumle: 'Position (konum) ve momentumun aynı anda sharp (keskin) olamayacağını gösterdi.' },
        ozet: ['ΔxΔp ≥ ħ/2', 'Sebep wave nature (dalga doğası), instrument (alet) değil', 'Günlük cisimde effect (etki) ihmal edilir'],
        kontrolNoktasi: true
      }
    ],
    temelTur: {
      kartlar: [
        { baslik: 'Wave packet (dalga paketi)', metin: 'Parçacık, wave packet gibi davranır.' },
        { baslik: 'Sharp position (keskin konum)', metin: 'Position (konum) daralırsa momentum yayılır.' },
        { baslik: 'Not instrument (alet değil)', metin: 'Uncertainty (belirsizlik) measurement (ölçüm) kusuru değil, doğanın limit (sınırı).' }
      ],
      sim: { modul: 'belirsizlik', params: { sx: 3 } }
    },
    tekrarHavuzu: [
      Object.assign({}, o03, { id: 's08-t01' }),
      Object.assign({}, o04, { id: 's08-t02' }),
      {
        id: 's08-t03', tip: 'dusman', baslik: 'Kusur düşmanı', kavram: 'belirsizlik_dalga', agirlik: 1,
        soru: o05.soru,
        secenekler: o05.secenekler,
        kusurSkin: 'vakans'
      },
      {
        id: 's08-t04', tip: 'dusman', baslik: 'Kusur düşmanı', kavram: 'eslenik_degisken', agirlik: 1,
        soru: 'Hangi operator (operatör) çifti commute etmez ve uncertainty (belirsizlik) verir?',
        secenekler: [
          sec('Position (konum) ve momentum', true, 'Doğru. [x,p] = iħ.'),
          sec('Position (konum) ve position (konum)', false, 'Hayır. Aynı operator (operatör) kendisiyle commute (değişme) eder.'),
          sec('Mass (kütle) ve charge (yük)', false, 'Hayır. Bunlar number (sayı), operator (operatör) değil.')
        ],
        kusurSkin: 'safsizlik'
      },
      {
        id: 's08-t05', tip: 'dusman', baslik: 'Kusur düşmanı', kavram: 'belirsizlik_alet', agirlik: 1,
        soru: 'Uncertainty principle (belirsizlik ilkesi) neden alet kusuru değildir?',
        secenekler: [
          sec('Ideal instrument (alet) için de geçerli, wave nature (dalga doğası) sonucudur', true, 'Doğru. Instrument (alet) kusuru değil, doğanın limit (sınırı).'),
          sec('Instrument (alet) hep mükemmeldir', false, 'Hayır. Mesele instrument (alet) kalitesi değil.'),
          sec('Yalnızca temperature (sıcaklık) ile ilgilidir', false, 'Hayır. Temperature (sıcaklık) etkisinden bağımsızdır.')
        ],
        kusurSkin: 'tane_siniri'
      }
    ]
  };
})();
