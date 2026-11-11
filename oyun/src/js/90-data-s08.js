/* 90-data-s08.js · İstasyon 08 "Kalibrasyon odası" verisi (E8)
 * Q.data.stations.s08 alanını doldurur. Metinler oyun/istasyonlar/08-kalibrasyon-odasi.md'den aynen alınır.
 * Şema: oyun/01-veri-semalari.md §3.
 */
(function(){
  'use strict';

  function sec(t, dogru, neden){ return { t: t, dogru: dogru, neden: neden }; }

  var o03 = {
    id: 's08-o03', tip: 'dusman', baslik: 'Kusur düşmanı', kavram: 'belirsizlik_dalga', agirlik: 1,
    soru: 'Δx küçülürse Δp ne olur?',
    secenekler: [
      sec('Büyür', true, 'Doğru. ΔxΔp ≥ ħ/2 çarpımı en az sabit kalır.'),
      sec('Küçülür', false, 'Yanlış. Çarpım sınırlı olduğundan biri küçülünce öbürü büyür.'),
      sec('Değişmez', false, 'Yanlış. ΔxΔp ≥ ħ/2 koşulu bunu zorunlu kılar.')
    ],
    kusurSkin: 'vakans'
  };

  var o04 = {
    id: 's08-o04', tip: 'dusman', baslik: 'Kusur düşmanı', kavram: 'belirsizlik_makro', agirlik: 1,
    soru: 'Bilardo topunda belirsizlik neden fark edilmez?',
    secenekler: [
      sec('ħ çok küçük, ΔxΔp sınırı ihmal edilebilir', true, 'Doğru. İlke her cisimde geçerli, etkisi görünmez.'),
      sec('Top belirsizliğe tabi değildir', false, 'Hayır. İlke her cisim için geçerlidir.'),
      sec('Top bir dalga değildir', false, 'Hayır. Dalga boyu yalnızca ihmal edilecek kadar küçüktür.')
    ],
    kusurSkin: 'tane_siniri'
  };

  var o05 = {
    id: 's08-o05', tip: 'tahmin', baslik: 'Tahmin çukuru', kavram: 'belirsizlik_dalga', agirlik: 1.5,
    soru: 'Dalga paketinin konum genişliğini yarıya indirirsen momentum yayılması ne olur?',
    secenekler: [
      sec('İki katına çıkar', true, 'Doğru. σp = ħ/(2σx).'),
      sec('Yarıya iner', false, 'Yanlış. Konum daralınca momentum genişler.'),
      sec('Aynı kalır', false, 'Yanlış. İkisi bağlıdır.')
    ],
    sim: {
      modul: 'belirsizlik',
      onceki: { sx: 2 },
      sonraki: { sx: 1 }
    },
    acik: 'σx 2\'den 1\'e inince σp iki katına çıktı; çarpım ħ/2\'de kaldı.'
  };

  Q.data.stations.s08 = {
    id: 's08',
    sira: 8,
    ad: 'Kalibrasyon odası',
    makine: 'Kalibrasyon',
    renk: '#39ff88',
    konu: 'Belirsizlik ilkesi, eşlenik değişkenler',
    sinavSorulari: ['S10'],
    sureHedefDk: 22,
    patronId: 'heis',
    kavramlar: ['belirsizlik_dalga', 'belirsizlik_alet', 'eslenik_degisken', 'belirsizlik_makro'],
    engeller: [
      {
        id: 's08-o01', tip: 'hikaye', baslik: 'Zaman kapısı', kavram: null, agirlik: 1,
        yer: 'Kopenhag', yil: 1927, rivayet: false,
        satirlar: [
          { kim: 'selin', metin: 'Kalibrasyon odası: ölçümü mükemmelleştirmek istiyoruz.' },
          { kim: 'heis', metin: 'Konum ve momentumu aynı anda keyfi hassas ölçemezsin. Alet yüzünden değil.' },
          { kim: 'heis', metin: 'Doğa böyle: dalgaysan, keskin konum ve keskin momentum aynı anda olmaz.' }
        ]
      },
      {
        id: 's08-o02', tip: 'kavram', baslik: 'Kavram kapısı', kavram: 'belirsizlik_dalga', agirlik: 1,
        gorev: 'Konum genişliğini daralt, momentuma bak.',
        sim: {
          modul: 'belirsizlik',
          params: { sx: 3 },
          basari: { dar: true }
        },
        ogrenilen: 'Konum daraldıkça momentum yayılır; çarpım hep en az ħ/2.'
      },
      o03,
      o04,
      o05,
      {
        id: 's08-o06', tip: 'tuzak', baslik: 'Yanılgı tuzağı', kavram: 'belirsizlik_alet', agirlik: 1,
        iddia: 'Belirsizlik, ölçüm aletimizin yeterince hassas olmamasından kaynaklanır.',
        parcalar: ['Belirsizlik,', 'ölçüm aletimizin yeterince', 'hassas olmamasından kaynaklanır.'],
        yanlisParca: 1,
        duzeltme: 'Belirsizlik alet kusuru değil, dalga doğasının temel sonucudur.'
      },
      {
        id: 's08-o07', tip: 'kopru', baslik: 'Mantık köprüsü', kavram: 'belirsizlik_dalga', agirlik: 1,
        soru: 'Belirsizlik zincirini sıraya diz',
        bloklar: [
          'Parçacık bir dalga paketidir',
          'Keskin konum çok dalga boyunun toplamıdır',
          'Çok dalga boyu geniş momentum demektir',
          'ΔxΔp ≥ ħ/2'
        ],
        sonuc: 'Dalga paketi, keskin konum, geniş momentum, ΔxΔp ≥ ħ/2.'
      },
      {
        id: 's08-o08', tip: 'patron', baslik: 'Belirsizlik Canavarı', kavram: null, agirlik: 1,
        canavar: 'heis', canavarAd: 'Belirsizlik Canavarı',
        giris: 'Neredeyim? Ne kadar hızlıyım? İkisini birden bilemezsin!',
        fazlar: [
          {
            tip: 'secmeli', kavram: 'eslenik_degisken',
            soru: 'Konum ve momentum neden aynı anda keyfi hassas ölçülemez?',
            secenekler: [
              sec('Operatörleri değişmez, ortak özdurumları yoktur', true, 'Doğru. [x,p] = iħ ≠ 0.'),
              sec('Aletlerimiz yetersizdir', false, 'Hayır. Alet kusuru değil, doğanın yapısı.'),
              sec('Ölçüm parçacığı bozar, tek sebep bu', false, 'Hayır. Ölçüm olmasa da ilke geçerlidir.')
            ],
            alt: {
              soru: '[x, p] = iħ ne anlama gelir?',
              secenekler: [
                sec('x ve p operatörleri değişmez', true, 'Doğru. Bu yüzden ortak özdurumları yok.'),
                sec('x ve p eşittir', false, 'Hayır. Bu bir eşitlik değil, değişme bağıntısı.'),
                sec('p sıfırdır', false, 'Hayır. p sıfır olmak zorunda değil.')
              ]
            }
          },
          {
            tip: 'acik',
            pdfSoru: 'Explain the uncertainty principle and why it is impossible to simultaneously measure conjugate variables with unlimited precision.',
            soru: 'Belirsizlik ilkesini açıkla. Eşlenik değişkenler neden aynı anda keyfi hassas ölçülemez?',
            anahtarFikirler: [
              'ΔxΔp ≥ ħ/2: biri keskinleşince öbürü yayılır.',
              'Dalga paketi: keskin konum çok dalga boyu gerektirir.',
              'Konum ve momentum operatörleri değişmez ([x,p] = iħ).',
              'Alet kusuru değil, doğanın (dalga doğasının) temel sınırı.'
            ],
            yanlisKavramlar: [
              'Belirsizlik ölçüm aletinin kusurudur',
              'Ölçüm parçacığı bozduğu için olur, tek sebep bu'
            ],
            yanlisKavramIds: ['belirsizlik_alet', 'belirsizlik_alet'],
            idealCevap: 'Belirsizlik ilkesi ΔxΔp ≥ ħ/2 der: biri keskinleşince öbürü yayılır. Sebep dalga doğasıdır; keskin bir konum çok sayıda dalga boyunun toplamını gerektirir, bu da geniş bir momentum dağılımıdır. Konum ve momentum operatörleri değişmediği için ortak özdurumları yoktur. Bu alet kusuru değil, doğanın temel sınırıdır.',
            yedekSecmeli: {
              soru: 'Belirsizlik ilkesi neden vardır?',
              secenekler: [
                sec('Parçacığın dalga doğasından', true, 'Doğru. Keskin konum geniş momentum demektir.'),
                sec('Aletler yetersiz olduğundan', false, 'Yanlış. İdeal alette de geçerli.'),
                sec('Sıcaklık yüzünden', false, 'Yanlış. Sıcaklıktan bağımsız.'),
                sec('Sadece elektronda', false, 'Yanlış. Her cisimde geçerli, büyükte ihmal edilir.')
              ]
            },
            alt: { soru: 'ΔxΔp ≥ ħ/2 neden dalga doğasından kaynaklanır?' }
          },
          {
            tip: 'acik',
            pdfSoru: null,
            soru: 'Eşlenik değişken nedir? Örnek ver ve günlük hayatta neden görmediğimizi anlat.',
            anahtarFikirler: [
              'Eşlenik çift: aynı anda keyfi hassas ölçülemeyen iki büyüklük.',
              'Örnek: konum x ve momentum p.',
              'Operatörleri değişmediği için ortak özdurumları yoktur.',
              'Günlük cisimde etki ihmal edilir, çünkü ħ çok küçüktür.'
            ],
            yanlisKavramlar: [
              'Her büyüklük çifti belirsizlik gösterir',
              'Yalnızca elektron gibi küçük parçacıklarda geçerlidir'
            ],
            yanlisKavramIds: ['eslenik_degisken', 'belirsizlik_makro'],
            idealCevap: 'Eşlenik değişkenler, aynı anda keyfi hassas ölçülemeyen büyüklük çiftidir; örneğin konum ve momentum. Operatörleri değişmediği için ortak özdurumları yoktur. Günlük cisimlerde ħ çok küçük olduğundan sınır ihmal edilir.',
            yedekSecmeli: {
              soru: 'Hangisi bir eşlenik çifttir?',
              secenekler: [
                sec('Konum ve momentum', true, 'Doğru. Operatörleri değişmez.'),
                sec('Kütle ve hacim', false, 'Yanlış. Bu çift için ilke yok.'),
                sec('Sıcaklık ve renk', false, 'Yanlış. Eşlenik çift değil.'),
                sec('Hız ve ivme', false, 'Yanlış. Bu eşlenik çift değil.')
              ]
            },
            alt: { soru: 'Konum ve momentum neden eşlenik değişken sayılır?' }
          }
        ]
      },
      {
        id: 's08-o09', tip: 'sandik', baslik: 'Sandık', kavram: null, agirlik: 1,
        kart: { id: 'heis', yil: 1927, tekCumle: 'Konum ve momentumun aynı anda keskin olamayacağını gösterdi.' },
        ozet: ['ΔxΔp ≥ ħ/2', 'Sebep dalga doğası, alet değil', 'Günlük cisimde etki ihmal edilir'],
        kontrolNoktasi: true
      }
    ],
    temelTur: {
      kartlar: [
        { baslik: 'Dalga paketi', metin: 'Parçacık, dalga paketi gibi davranır.' },
        { baslik: 'Keskin konum', metin: 'Konum daralırsa momentum yayılır.' },
        { baslik: 'Alet değil', metin: 'Belirsizlik ölçüm kusuru değil, doğanın sınırı.' }
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
        soru: 'Hangi operatör çifti değişmez ve belirsizlik verir?',
        secenekler: [
          sec('Konum ve momentum', true, 'Doğru. [x,p] = iħ.'),
          sec('Konum ve konum', false, 'Hayır. Aynı operatör kendisiyle değişir.'),
          sec('Kütle ve yük', false, 'Hayır. Bunlar sayıdır, operatör değil.')
        ],
        kusurSkin: 'safsizlik'
      },
      {
        id: 's08-t05', tip: 'dusman', baslik: 'Kusur düşmanı', kavram: 'belirsizlik_alet', agirlik: 1,
        soru: 'Belirsizlik ilkesi neden alet kusuru değildir?',
        secenekler: [
          sec('İdeal alette de geçerli, dalga doğasının sonucudur', true, 'Doğru. Alet kusuru değil, doğanın sınırı.'),
          sec('Aletler hep mükemmeldir', false, 'Hayır. Mesele aletin kalitesi değil.'),
          sec('Yalnızca sıcaklıkla ilgilidir', false, 'Hayır. Sıcaklıktan bağımsızdır.')
        ],
        kusurSkin: 'tane_siniri'
      }
    ]
  };
})();
