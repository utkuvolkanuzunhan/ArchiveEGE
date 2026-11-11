/* 90-data-s04.js · İstasyon 04 "Atom mikroskobu" verisi (E4)
 * Q.data.stations.s04 alanını doldurur. Metinler oyun/istasyonlar/04-atom-mikroskobu.md'den aynen alınır.
 * Şema: oyun/01-veri-semalari.md §3.
 */
(function(){
  'use strict';

  function sec(t, dogru, neden){ return { t: t, dogru: dogru, neden: neden }; }

  var o03 = {
    id: 's04-o03', tip: 'dusman', baslik: 'Kusur düşmanı', kavram: 'ayrik_spektrum', agirlik: 1,
    soru: 'Hidrojen atomu neden yalnızca belirli renklerde ışır?',
    secenekler: [
      sec('Enerji seviyeleri ayrık, geçiş farkı kadar foton çıkar', true, 'Doğru. Her renk bir seviye farkına karşılık gelir.'),
      sec('Atom sıcaklığa göre renk seçer', false, 'Hayır. Renkler seviye farklarından gelir, sıcaklıktan değil.'),
      sec('Elektron her enerjide dolaşabilir', false, 'Hayır. Yalnızca belirli seviyeler izinlidir.')
    ],
    kusurSkin: 'vakans'
  };

  var o04 = {
    id: 's04-o04', tip: 'dusman', baslik: 'Kusur düşmanı', kavram: 'debroglie_dalga', agirlik: 1,
    soru: 'Bilardo topu neden dalga gibi davranmıyor?',
    secenekler: [
      sec('Dalga boyu (h/p) çok küçük kalıyor', true, 'Doğru. Büyük momentum, ihmal edilecek kadar küçük dalga boyu.'),
      sec('Top atomlardan oluşmadığı için', false, 'Hayır. Top da atomdan oluşur; dalga boyu ölçülemeyecek kadar küçük.'),
      sec('Dalga özelliği yalnızca ışıkta var', false, 'Hayır. Elektron kırınımı maddenin de dalga olduğunu gösterir.')
    ],
    kusurSkin: 'safsizlik'
  };

  var o05 = {
    id: 's04-o05', tip: 'tahmin', baslik: 'Tahmin çukuru', kavram: 'atom_kararlilik', agirlik: 1.5,
    soru: 'Hidrojende elektron, n=1 seviyesinin (−13,6 eV) altına inebilir mi?',
    secenekler: [
      sec('Hayır, n=1 en alt seviye', true, 'Doğru. Altında izinli seviye yok, atom kararlı.'),
      sec('Evet, ışıma yaparak çekirdeğe düşer', false, 'Yanlış. Klasik tahmin buydu; kuantumda alt seviye var.'),
      sec('Evet, sıcaklık düşerse', false, 'Yanlış. Sebep sıcaklık değil, dalga doğasıdır.')
    ],
    sim: {
      modul: 'bohr',
      onceki: { n: 2, m: 1 },
      sonraki: { n: 1, m: 1, altinaDene: true }
    },
    acik: 'n=1\'in altında izinli seviye yok; elektron daha aşağı inemez.'
  };

  Q.data.stations.s04 = {
    id: 's04',
    sira: 4,
    ad: 'Atom mikroskobu',
    makine: 'Atom mikroskobu',
    renk: '#7cf5a0',
    konu: 'H atomu kararlılığı, ayrık seviyeler, madde dalgası',
    sinavSorulari: ['S4'],
    sureHedefDk: 22,
    patronId: 'bohr',
    kavramlar: ['atom_kararlilik', 'ayrik_spektrum', 'debroglie_dalga', 'bohr_seviye', 'sifir_noktasi_sicaklik'],
    engeller: [
      {
        id: 's04-o01', tip: 'hikaye', baslik: 'Zaman kapısı', kavram: null, agirlik: 1,
        yer: 'Kopenhag', yil: 1913, rivayet: false,
        satirlar: [
          { kim: 'selin', metin: 'Atom mikroskobu bir elektron arıyor. O neden çekirdeğe düşmüyor?' },
          { kim: 'bohr', metin: 'Elektron yalnızca belirli seviyelerde durabilir. Seviyeler arası atlarken ışık yayar.' },
          { kim: 'anlatici', metin: 'On bir yıl sonra de Broglie ekledi: elektron da dalga, yörüngeye tam sayı dalga sığar.' }
        ]
      },
      {
        id: 's04-o02', tip: 'kavram', baslik: 'Kavram kapısı', kavram: 'bohr_seviye', agirlik: 1,
        gorev: 'n=3\'ten n=2\'ye geçişin rengini bul.',
        sim: {
          modul: 'bohr',
          params: { n: 3, m: 2 },
          basari: { gecis: [3, 2] }
        },
        ogrenilen: 'Seviyeler ayrık; geçişte seviye farkı kadar enerjili foton çıkar.'
      },
      o03,
      o04,
      o05,
      {
        id: 's04-o06', tip: 'tuzak', baslik: 'Yanılgı tuzağı', kavram: 'atom_kararlilik', agirlik: 1,
        iddia: 'Klasik fiziğe göre elektron çekirdek çevresinde sonsuza kadar kararlı döner.',
        parcalar: ['Klasik fiziğe göre', 'elektron çekirdek çevresinde', 'sonsuza kadar kararlı döner.'],
        yanlisParca: 2,
        duzeltme: 'Klasikte ivmeli elektron ışıma yapar, enerji kaybeder ve çekirdeğe düşer; kuantum bunu önler.'
      },
      {
        id: 's04-o07', tip: 'kopru', baslik: 'Mantık köprüsü', kavram: 'atom_kararlilik', agirlik: 1,
        soru: 'Kararlılık zincirini sıraya diz',
        bloklar: [
          'Elektron hapsolmuş bir dalgadır',
          'Yalnızca belirli dalga boyları sığar',
          'En alt seviyenin enerjisi sıfır değildir',
          'Elektron daha aşağı düşemez, atom kararlıdır'
        ],
        sonuc: 'Hapsolmuş dalga, ayrık seviyeler, alt sınır, kararlı atom.'
      },
      {
        id: 's04-o08', tip: 'patron', baslik: 'Yörünge Canavarı', kavram: null, agirlik: 1,
        canavar: 'bohr', canavarAd: 'Yörünge Canavarı',
        giris: 'Elektronunu çekirdeğime düşüreceğim! Düşemez diyorsan kanıtla.',
        fazlar: [
          {
            tip: 'secmeli', kavram: 'atom_kararlilik',
            soru: 'Atomun en düşük enerji seviyesi neden vardır?',
            secenekler: [
              sec('Elektron dalgası çekirdek çevresinde sınırlı sığar, alt sınır oluşur', true, 'Doğru. Hapsolmuş dalganın enerjisi sıfır olamaz.'),
              sec('Çekirdek elektronu iter', false, 'Hayır. Çekirdek elektronu çeker.'),
              sec('Sıcaklık sıfıra inemez', false, 'Hayır. Sebep sıcaklık değil, dalga doğasıdır.')
            ],
            alt: {
              soru: 'Elektronu çekirdeğe daha çok sıkıştırırsan kinetik enerjisi ne olur?',
              secenekler: [
                sec('Artar', true, 'Doğru. Konum daralır, momentum ve kinetik enerji büyür.'),
                sec('Azalır', false, 'Hayır. Dar alanda dalga boyu kısalır, enerji artar.'),
                sec('Değişmez', false, 'Hayır. Belirsizlik ilkesi sıkıştırmayı sınırlar.')
              ]
            }
          },
          {
            tip: 'acik',
            pdfSoru: 'Briefly explain the stability of the Hydrogen atom using quantum mechanical theory.',
            soru: 'Hidrojen atomunun kararlılığını kuantum teorisiyle kısaca açıkla.',
            anahtarFikirler: [
              'Klasikte ışıma yapan elektron çekirdeğe düşmeliydi.',
              'Kuantumda elektron hapsolmuş dalgadır, enerji seviyeleri ayrıktır.',
              'En düşük seviyenin enerjisi sıfır değildir, altına inilemez.',
              'Çekirdeğe sıkışmak kinetik enerjiyi artırır (belirsizlik), denge oluşur.'
            ],
            yanlisKavramlar: [
              'Elektron çekirdekten itildiği için düşmez',
              'Atom sıcaklık yüzünden kararlıdır'
            ],
            yanlisKavramIds: ['atom_kararlilik', 'sifir_noktasi_sicaklik'],
            idealCevap: 'Klasik fizikte yörüngedeki elektron ışıma yapıp enerji kaybeder ve çekirdeğe düşerdi. Kuantumda elektron hapsolmuş bir dalgadır, enerjisi ayrık seviyelerdir ve en düşük seviyenin enerjisi sıfır değildir. Çekirdeğe daha çok sıkışmak kinetik enerjiyi artırdığından elektron bir denge durumunda kalır.',
            yedekSecmeli: {
              soru: 'H atomu neden kararlıdır?',
              secenekler: [
                sec('En alt seviyenin altı yok, elektron düşemez', true, 'Doğru. Hapsolmuş dalganın alt enerji sınırı var.'),
                sec('Elektron çekirdekten itilir', false, 'Yanlış. Çekirdek elektronu çeker.'),
                sec('Atom çok soğuk olduğu için', false, 'Yanlış. Sıcaklık sebep değil.'),
                sec('Elektron aslında durur', false, 'Yanlış. Elektron durmaz, en düşük enerjili dalga durumundadır.')
              ]
            },
            alt: { soru: 'Klasik atom modeli neden çöküyordu, kuantum bunu nasıl çözdü?' }
          },
          {
            tip: 'acik',
            pdfSoru: null,
            soru: 'Madde dalgası nedir? Günlük hayatta neden dalga davranışı görmeyiz?',
            anahtarFikirler: [
              'de Broglie: parçacığın dalga boyu λ = h/p.',
              'Elektron kırınımı maddenin dalga davrandığını gösterir.',
              'Büyük cisimde momentum büyük, λ ihmal edilebilir.',
              'Atom ölçeğinde λ boyutla kıyaslanabilir, dalga etkisi görünür.'
            ],
            yanlisKavramlar: [
              'Dalga yalnızca ışığa özgüdür',
              'Büyük cisimler rastgele davranır'
            ],
            yanlisKavramIds: ['debroglie_dalga', 'kuantum_rastgele_sanisi'],
            idealCevap: 'de Broglie\'ye göre momentumlu her parçacığın dalga boyu λ = h/p\'dir; elektron kırınımı bunu doğrular. Günlük cisimlerde momentum çok büyük olduğundan λ ihmal edilecek kadar küçüktür. Atom boyutunda λ boyutla kıyaslanabilir olduğundan dalga etkisi görünür.',
            yedekSecmeli: {
              soru: 'Madde dalga boyu neye bağlıdır?',
              secenekler: [
                sec('Momentuma, λ = h/p', true, 'Doğru. Momentum büyüdükçe λ küçülür.'),
                sec('Rengine', false, 'Yanlış. Renk bu kavramla ilgisiz.'),
                sec('Hacmine', false, 'Yanlış. Hacim λ\'yı belirlemez.'),
                sec('Sıcaklığa yalnızca', false, 'Yanlış. Doğrudan momentuma bağlıdır.')
              ]
            },
            alt: { soru: 'Elektron kırınımı deneyi neyi kanıtlar?' }
          }
        ]
      },
      {
        id: 's04-o09', tip: 'sandik', baslik: 'Sandık', kavram: null, agirlik: 1,
        kart: { id: 'bohr', yil: 1913, tekCumle: 'Atomda elektronun yalnızca belirli seviyelerde durabileceğini gösterdi.' },
        ozet: ['Seviyeler ayrık, geçişte foton çıkar', 'n=1 en alt seviye, atom kararlı', 'λ = h/p: madde de dalga'],
        kontrolNoktasi: true
      }
    ],
    temelTur: {
      kartlar: [
        { baslik: 'Ayrık seviyeler', metin: 'Elektron yalnızca belirli enerjilerde durur.' },
        { baslik: 'En alt seviye', metin: 'n=1\'in altı yok; elektron çekirdeğe düşmez.' },
        { baslik: 'Madde dalgası', metin: 'Her parçacığın λ = h/p dalga boyu vardır.' }
      ],
      sim: { modul: 'bohr', params: { n: 3, m: 2 } }
    },
    tekrarHavuzu: [
      Object.assign({}, o03, { id: 's04-t01' }),
      Object.assign({}, o04, { id: 's04-t02' }),
      {
        id: 's04-t03', tip: 'dusman', baslik: 'Kusur düşmanı', kavram: 'atom_kararlilik', agirlik: 1,
        soru: o05.soru,
        secenekler: o05.secenekler,
        kusurSkin: 'vakans'
      },
      {
        id: 's04-t04', tip: 'dusman', baslik: 'Kusur düşmanı', kavram: 'sifir_noktasi_sicaklik', agirlik: 1,
        soru: 'Hapsolmuş parçacığın en düşük enerjisi neden sıfır değildir?',
        secenekler: [
          sec('Sınır koşulu dalganın sığmasını gerektirir', true, 'Doğru. Sıcaklık değil, sınır koşulu sebep.'),
          sec('Sıcaklık sıfıra inemez', false, 'Hayır. Mutlak sıfırda da E₁ > 0.'),
          sec('Ölçüm enerjiyi ekler', false, 'Hayır. Ölçüm olmasa da alt enerji vardır.')
        ],
        kusurSkin: 'tane_siniri'
      }
    ]
  };
})();
