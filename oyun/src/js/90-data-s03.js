/* 90-data-s03.js · İstasyon 03 "Işık-test odası" verisi (E3)
 * Q.data.stations.s03 alanını doldurur. Metinler oyun/istasyonlar/03-isik-test-odasi.md'den aynen alınır.
 * Bağımlılık: 00-q.js (Q.data). Çalışma anında yalnızca veri okunur, fonksiyon çağrılmaz.
 * Şema: oyun/01-veri-semalari.md §3.
 */
(function(){
  'use strict';

  function sec(t, dogru, neden){ return { t: t, dogru: dogru, neden: neden }; }

  var o03 = {
    id: 's03-o03', tip: 'dusman', baslik: 'Kusur düşmanı', kavram: 'karacisim_felaket', agirlik: 1,
    soru: 'Mor ötesi felaketi, klasik teorinin neyi yanlış öngörmesidir?',
    secenekler: [
      sec('Kısa dalga boyunda sonsuz enerji', true, 'Doğru. Klasik teori yüksek frekansta enerjiyi sonsuz buluyordu.'),
      sec('Işığın hiç yayılmaması', false, 'Hayır. Sorun sonsuz enerji öngörüsüydü.'),
      sec('Sıcaklığın hep sabit kalması', false, 'Hayır. Sıcaklıkla ilgili bir sorun değildi.')
    ],
    kusurSkin: 'vakans'
  };

  var o04 = {
    id: 's03-o04', tip: 'dusman', baslik: 'Kusur düşmanı', kavram: 'planck_paket', agirlik: 1,
    soru: 'Planck\'a göre bir ışık paketinin enerjisi neye bağlıdır?',
    secenekler: [
      sec('Frekansına (E = hf)', true, 'Doğru. Yüksek frekans, büyük paket.'),
      sec('Şiddetine', false, 'Hayır. Şiddet paket sayısını belirler.'),
      sec('Hızına', false, 'Hayır. Işığın hızı sabit; enerji frekansla değişir.')
    ],
    kusurSkin: 'tane_siniri'
  };

  var o05 = {
    id: 's03-o05', tip: 'tahmin', baslik: 'Tahmin çukuru', kavram: 'fotoelektrik_siddet', agirlik: 1.5,
    soru: 'Eşik frekansın altındaki ışığı 10 kat parlatırsan kaç elektron kopar?',
    secenekler: [
      sec('Çok sayıda', false, 'Yanlış. Tek foton yetmezse kaç foton olursa olsun elektron kopmaz.'),
      sec('Hiç', true, 'Doğru. Şiddet foton sayısını artırır, foton başına enerjiyi değil.'),
      sec('Gecikmeyle kopar', false, 'Yanlış. Enerji birikmez, gecikme gözlenmez.')
    ],
    sim: {
      modul: 'fotoelektrik',
      onceki: { f: 3.0, I: 1, metal: 'Na' },
      sonraki: { f: 3.0, I: 10, metal: 'Na' }
    },
    acik: 'hf < φ: foton başına enerji yetmiyor, parlaklık işe yaramaz.'
  };

  Q.data.stations.s03 = {
    id: 's03',
    sira: 3,
    ad: 'Işık-test odası',
    makine: 'Işık-test odası',
    renk: '#ffd23f',
    konu: 'Neden kuantum mekaniği? Kara cisim, fotoelektrik',
    sinavSorulari: ['S3'],
    sureHedefDk: 22,
    patronId: 'einstein',
    kavramlar: ['karacisim_felaket', 'planck_paket', 'fotoelektrik_siddet', 'kuantum_rastgele_sanisi'],
    engeller: [
      {
        id: 's03-o01', tip: 'hikaye', baslik: 'Zaman kapısı', kavram: null, agirlik: 1,
        yer: 'Berlin', yil: 1900, rivayet: false,
        satirlar: [
          { kim: 'selin', metin: 'Işık-test odası ışığı ölçüyor. Klasik fizik burada tökezledi.' },
          { kim: 'planck', metin: 'Enerjiyi paket paket verince sonsuzluk kayboldu. Çaresizlikten attığım bir adımdı.' },
          { kim: 'einstein', metin: 'Ben ışığı paketlere böldüm: fotonlar. Fotoelektrik olayı böyle açıkladım.' }
        ]
      },
      {
        id: 's03-o02', tip: 'kavram', baslik: 'Kavram kapısı', kavram: 'karacisim_felaket', agirlik: 1,
        gorev: 'Sıcaklığı 5000 K yap, klasik eğriyi açık tut.',
        sim: {
          modul: 'karacisim',
          params: { T: 3000 },
          basari: { T: [4900, 5100], klasikGoster: true }
        },
        ogrenilen: 'Klasik eğri kısa dalga boyunda patlıyor; Planck eğrisi patlamıyor.'
      },
      o03,
      o04,
      o05,
      {
        id: 's03-o06', tip: 'tuzak', baslik: 'Yanılgı tuzağı', kavram: 'fotoelektrik_siddet', agirlik: 1,
        iddia: 'Işığı yeterince parlatırsan eşik altında da elektron koparabilirsin.',
        parcalar: ['Işığı yeterince parlatırsan', 'eşik altında da', 'elektron koparabilirsin.'],
        yanlisParca: 0,
        duzeltme: 'Eşik altında parlaklık işe yaramaz; elektron için foton başına yeterli enerji gerekir.'
      },
      {
        id: 's03-o07', tip: 'kopru', baslik: 'Mantık köprüsü', kavram: 'fotoelektrik_siddet', agirlik: 1,
        soru: 'Fotoelektrik mantığını sıraya diz',
        bloklar: [
          'Işık foton paketlerinden oluşur',
          'Foton enerjisi E = hf',
          'hf iş fonksiyonunu aşarsa elektron kopar',
          'Şiddet yalnızca elektron sayısını artırır'
        ],
        sonuc: 'Foton enerjisi frekansla belirlenir, eşik aşılırsa elektron kopar, şiddet sayıyı artırır.'
      },
      {
        id: 's03-o08', tip: 'patron', baslik: 'Foton Canavarı', kavram: null, agirlik: 1,
        canavar: 'einstein', canavarAd: 'Foton Canavarı',
        giris: 'Ben fotonum! Parlaklığımı artırsam da seni eşikten geçirmem.',
        fazlar: [
          {
            tip: 'secmeli', kavram: 'fotoelektrik_siddet',
            soru: 'Fotoelektrik olayda elektronun kinetik enerjisi neye bağlıdır?',
            secenekler: [
              sec('Işığın frekansına (K = hf − φ)', true, 'Doğru. Frekans arttıkça kinetik enerji artar.'),
              sec('Işığın şiddetine', false, 'Hayır. Şiddet elektron sayısını etkiler.'),
              sec('Metalin kalınlığına', false, 'Hayır. Kalınlık enerjiyi belirlemez.')
            ],
            alt: {
              soru: 'Frekansı ikiye katlarsan foton enerjisi ne olur?',
              secenekler: [
                sec('İki katına çıkar', true, 'Doğru. E = hf, frekansla orantılı.'),
                sec('Aynı kalır', false, 'Hayır. Enerji frekansla artar.'),
                sec('Yarıya iner', false, 'Hayır. Frekans artınca enerji düşmez.')
              ]
            }
          },
          {
            tip: 'acik',
            pdfSoru: 'Explain the reasons for the emergence and success of quantum mechanics.',
            soru: 'Kuantum mekaniği neden doğdu ve neden başarılı oldu?',
            anahtarFikirler: [
              'Klasik fizik kara cisim ışımasını (mor ötesi felaketi) açıklayamadı.',
              'Fotoelektrik olay ve ayrık atom spektrumları da açıklanamadı.',
              'Çözüm: enerji paketli (E = hf), madde ve ışık ikiliği.',
              'Başarı: bu gözlemleri ve atom ile katı özelliklerini doğru öngördü.'
            ],
            yanlisKavramlar: [
              'Işığın şiddeti artarsa eşik altında da elektron kopar',
              'Kuantum, küçük cisimlerde bilgi eksikliğinden doğan rastgelelik demektir'
            ],
            yanlisKavramIds: ['fotoelektrik_siddet', 'kuantum_rastgele_sanisi'],
            idealCevap: 'Klasik fizik kara cisim ışımasını (mor ötesi felaketi), fotoelektrik olayı ve atomların ayrık spektrumunu açıklayamadı. Planck enerjiyi paketli (E = hf) kabul etti, Einstein ışığı foton olarak aldı, madde dalga davranışı gösterdi. Kuantum mekaniği bu gözlemleri ve atom ile katıların özelliklerini doğru öngördüğü için başarılıdır.',
            yedekSecmeli: {
              soru: 'Kuantum mekaniği neden doğdu?',
              secenekler: [
                sec('Klasik fizik kara cisim, fotoelektrik ve atom spektrumunu açıklayamadı', true, 'Doğru. Üç temel başarısızlık.'),
                sec('Bilgisayarlar icat edildiği için', false, 'Yanlış. Kuantum bilgisayardan öncedir.'),
                sec('Newton yanıldığı için her şey değişti', false, 'Yanlış. Klasik fizik büyük ölçekte hâlâ geçerli.'),
                sec('Işık hiç dalga olmadığı için', false, 'Yanlış. Işık hem dalga hem parçacık gibi davranır.')
              ]
            },
            alt: { soru: 'Klasik fiziğin açıklayamadığı üç gözlemi say.' }
          },
          {
            tip: 'acik',
            pdfSoru: null,
            soru: 'Fotoelektrik olayı klasik dalga teorisi neden açıklayamaz?',
            anahtarFikirler: [
              'Klasik dalgada şiddet arttıkça enerji artar, eşik beklenmez.',
              'Deneyde eşik frekansın altında elektron hiç kopmaz.',
              'Elektron tek bir fotondan enerji alır, enerji birikmez.',
              'Kinetik enerji frekansla artar, şiddetle değil.'
            ],
            yanlisKavramlar: [
              'Elektronlar enerjiyi biriktirip gecikmeyle çıkar',
              'Parlaklık elektronun enerjisini artırır'
            ],
            yanlisKavramIds: ['fotoelektrik_siddet', 'fotoelektrik_siddet'],
            idealCevap: 'Klasik dalga teorisinde şiddet arttıkça enerji artar, yani yeterince parlak ışık her frekansta elektron koparmalıydı. Deneyde eşik frekansın altında hiç elektron kopmaz, üstünde ise gecikmesiz kopar. Einstein: elektron tek bir fotondan enerji alır, kinetik enerji frekansla artar, şiddet yalnızca sayıyı artırır.',
            yedekSecmeli: {
              soru: 'Klasik teori fotoelektrikte neyi yanlış bekler?',
              secenekler: [
                sec('Yeterince parlak ışığın her frekansta elektron koparmasını', true, 'Doğru. Deneyde eşik altında hiç kopmaz.'),
                sec('Elektronun hiç kopmamasını', false, 'Yanlış. Klasik teori kopacağını söyler.'),
                sec('Işığın hızının değişmesini', false, 'Yanlış. Hız konusu değil.'),
                sec('Metalin erimesini', false, 'Yanlış. Erime konusu değil.')
              ]
            },
            alt: { soru: 'Eşik frekans deneyi dalga teorisini nasıl çürütür?' }
          }
        ]
      },
      {
        id: 's03-o09', tip: 'sandik', baslik: 'Sandık', kavram: null, agirlik: 1,
        kart: { id: 'einstein', yil: 1905, tekCumle: 'Işığı foton paketlerine bölüp fotoelektrik olayı açıkladı.' },
        ozet: ['Klasik fizik üç yerde tökezledi', 'E = hf: enerji paket paket', 'Eşik altı: şiddet işe yaramaz'],
        kontrolNoktasi: true
      }
    ],
    temelTur: {
      kartlar: [
        { baslik: 'Mor ötesi felaketi', metin: 'Klasik teori kısa dalga boyunda sonsuz enerji buluyordu.' },
        { baslik: 'Paket enerji', metin: 'Planck: ışık paket paket yayılır, E = hf.' },
        { baslik: 'Eşik', metin: 'Tek foton yetmezse parlaklık işe yaramaz.' }
      ],
      sim: { modul: 'fotoelektrik', params: { f: 3.0, I: 1, metal: 'Na' } }
    },
    tekrarHavuzu: [
      Object.assign({}, o03, { id: 's03-t01' }),
      Object.assign({}, o04, { id: 's03-t02' }),
      {
        id: 's03-t03', tip: 'dusman', baslik: 'Kusur düşmanı', kavram: 'fotoelektrik_siddet', agirlik: 1,
        soru: o05.soru,
        secenekler: o05.secenekler,
        kusurSkin: 'vakans'
      },
      {
        id: 's03-t04', tip: 'dusman', baslik: 'Kusur düşmanı', kavram: 'kuantum_rastgele_sanisi', agirlik: 1,
        soru: 'Kuantum rastgeleliği neden bilgi eksikliği değildir?',
        secenekler: [
          sec('Doğanın temel yapısıdır, daha çok bilgiyle ortadan kalkmaz', true, 'Doğru. Standart yorumda olasılık temeldir.'),
          sec('Aletler yetersiz olduğu için', false, 'Hayır. Daha iyi alet rastgeleliği gidermez.'),
          sec('Yalnızca sıcaklıkla oluşur', false, 'Hayır. Sıcaklıktan bağımsızdır.')
        ],
        kusurSkin: 'safsizlik'
      }
    ]
  };
})();
