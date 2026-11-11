/* 90-data-s05.js · İstasyon 05 "Dalga odası" verisi (E5)
 * Q.data.stations.s05 alanını doldurur. Metinler oyun/istasyonlar/05-dalga-odasi.md'den aynen alınır.
 * Bağımlılık: 00-q.js (Q.data). Çalışma anında yalnızca veri okunur, fonksiyon çağrılmaz.
 * Şema: oyun/01-veri-semalari.md §3.
 */
(function(){
  'use strict';

  function sec(t, dogru, neden){ return { t: t, dogru: dogru, neden: neden }; }

  var o03 = {
    id: 's05-o03', tip: 'dusman', baslik: 'Kusur düşmanı', kavram: 'psi_olasilik', agirlik: 1,
    soru: 'Dalga fonksiyonu ψ(x) fiziksel olarak neyi anlatır?',
    secenekler: [
      sec('|ψ(x)|² bulunma olasılık yoğunluğunu verir', true, 'Doğru. ψ\'nin kendisi ölçülemez, karesi olasılıktır.'),
      sec('Parçacığın gerçek konumunu', false, 'Hayır. ψ konum vermez, olasılık dağılımı verir.'),
      sec('Parçacığın enerjisini', false, 'Hayır. Enerji denklemin özdeğeridir.')
    ],
    kusurSkin: 'vakans'
  };

  var o04 = {
    id: 's05-o04', tip: 'dusman', baslik: 'Kusur düşmanı', kavram: 'schrodinger_girdi_cikti', agirlik: 1,
    soru: 'Schrödinger denklemine ne verirsin, ne alırsın?',
    secenekler: [
      sec('Potansiyel V(x) ve sınır koşulu ver; ψ, izinli E\'leri al', true, 'Doğru. Girdi V(x) ve sınır koşulu, çıktı ψ ile E.'),
      sec('ψ ver, potansiyeli al', false, 'Hayır. Potansiyel girdidir, ψ çıktıdır.'),
      sec('Enerji ver, konumu al', false, 'Hayır. Enerjiler denklemin çıktısıdır.')
    ],
    kusurSkin: 'tane_siniri'
  };

  var o05 = {
    id: 's05-o05', tip: 'tahmin', baslik: 'Tahmin çukuru', kavram: 'kuantalasma_sinir', agirlik: 1.5,
    soru: 'Kuyu genişliği L yarıya inerse E₁ ne olur?',
    secenekler: [
      sec('4 katına çıkar', true, 'Doğru. E ∝ 1/L².'),
      sec('2 katına çıkar', false, 'Yanlış. Enerji L²\'ye ters orantılıdır: 4 kat.'),
      sec('Değişmez', false, 'Yanlış. Dar kuyuda dalga boyu kısalır, enerji artar.')
    ],
    sim: {
      modul: 'kuyu',
      onceki: { L: 2, n: 1 },
      sonraki: { L: 1, n: 1 }
    },
    acik: 'E ∝ 1/L²: L yarıya inince enerji dört katına çıkar.'
  };

  Q.data.stations.s05 = {
    id: 's05',
    sira: 5,
    ad: 'Dalga odası',
    makine: 'Dalga odası',
    renk: '#00e5ff',
    konu: 'Schrödinger denklemi, ψ, sonsuz kuyu, kuantalaşma',
    sinavSorulari: ['S5'],
    sureHedefDk: 24,
    patronId: 'schro',
    kavramlar: ['psi_olasilik', 'schrodinger_girdi_cikti', 'kuantalasma_sinir', 'sifir_noktasi_sicaklik', 'schrodinger_cokme', 'kuantalasma_olcum'],
    engeller: [
      {
        id: 's05-o01', tip: 'hikaye', baslik: 'Zaman kapısı', kavram: null, agirlik: 1,
        yer: 'Zürih', yil: 1926, rivayet: false,
        satirlar: [
          { kim: 'selin', metin: 'Dalga odası: burada her şey tek bir denkleme bağlı.' },
          { kim: 'schro', metin: 'Dalga fonksiyonu ψ için bir denklem yazdım. Atomun enerjileri denklemden çıktı.' },
          { kim: 'schro', metin: 'Enerjileri ben eklemedim. Sınır koşullarından kendiliğinden ortaya çıktılar.' }
        ]
      },
      {
        id: 's05-o02', tip: 'kavram', baslik: 'Kavram kapısı', kavram: 'kuantalasma_sinir', agirlik: 1,
        gorev: 'Kuyu genişliğini 2\'den 1 nm\'ye indir.',
        sim: {
          modul: 'kuyu',
          params: { L: 2, n: 1 },
          basari: { yariya: true }
        },
        ogrenilen: 'Duvarda ψ = 0 olduğundan yalnızca belirli dalga boyları sığar; enerji kuantalanır.'
      },
      o03,
      o04,
      o05,
      {
        id: 's05-o06', tip: 'tuzak', baslik: 'Yanılgı tuzağı', kavram: 'sifir_noktasi_sicaklik', agirlik: 1,
        iddia: 'Sonsuz kuyudaki parçacığın enerjisi, sıcaklık sıfır olmadığı için sıfırdan büyüktür.',
        parcalar: ['Sonsuz kuyudaki parçacığın enerjisi,', 'sıcaklık sıfır olmadığı için', 'sıfırdan büyüktür.'],
        yanlisParca: 1,
        duzeltme: 'Sebep sıcaklık değil: sınır koşulu dalganın sığmasını gerektirir. Mutlak sıfırda da E₁ > 0.'
      },
      {
        id: 's05-o07', tip: 'kopru', baslik: 'Mantık köprüsü', kavram: 'kuantalasma_sinir', agirlik: 1,
        soru: 'Kuantalaşma zincirini sıraya diz',
        bloklar: [
          'Duvarlarda ψ sıfır olmak zorundadır',
          'Kuyuya yalnızca tam sayı yarım dalga sığar',
          'Dalga boyu λ = 2L/n ile sınırlanır',
          'Enerji E ∝ n²/L² belirli değerler alır'
        ],
        sonuc: 'Sınır koşulu, sığan dalgalar, kısıtlı λ, kuantalı enerji.'
      },
      {
        id: 's05-o08', tip: 'patron', baslik: 'Kuantum Kedisi', kavram: null, agirlik: 1,
        canavar: 'schro', canavarAd: 'Kuantum Kedisi',
        giris: 'Miyav! Sıfır enerjiyle kutuya sığacağımı mı sandın?',
        fazlar: [
          {
            tip: 'secmeli', kavram: 'schrodinger_cokme',
            soru: 'Zamana bağlı Schrödinger denklemi ψ\'yi nasıl değiştirir?',
            secenekler: [
              sec('Düzgün ve belirlenimci biçimde evriltir', true, 'Doğru. Çökme denklemden değil, ölçümden gelir.'),
              sec('Ölçüm yapınca çökertir', false, 'Hayır. Çökme ayrı bir postülattır, denklemin işi değil.'),
              sec('Rastgele değiştirir', false, 'Hayır. Denklem rastgele değil, belirlenimcidir.')
            ],
            alt: {
              soru: 'Ĥψ = Eψ matematiksel olarak nasıl bir problemdir?',
              secenekler: [
                sec('Özdeğer problemi', true, 'Doğru. İzinli E\'ler özdeğerlerdir.'),
                sec('Başlangıç değer problemi', false, 'Hayır. Bu zamana bağlı denklem için geçerli.'),
                sec('Olasılık hesabı', false, 'Hayır. Olasılık |ψ|²\'dir, denklem değil.')
              ]
            }
          },
          {
            tip: 'acik',
            pdfSoru: 'For the given potential below, it is required to calculate the wave function and the allowed energies in electron-volts (eV).',
            soru: 'Sonsuz kuyuda ψ ve izinli enerjiler nasıl bulunur? Mantığı anlat.',
            anahtarFikirler: [
              'Duvarlarda ψ = 0 sınır koşulu uygulanır.',
              'Çözüm sinüs dalgasıdır: ψ = √(2/L) sin(nπx/L).',
              'Yalnızca L = nλ/2 ile sığan dalgalar izinlidir.',
              'Enerji E = n²π²ħ²/(2mL²), elektron için yaklaşık 0,376·n²/L² eV (L nm).'
            ],
            yanlisKavramlar: [
              'Enerji sıcaklıktan gelir',
              'Kuantalaşma ölçüm sonucudur'
            ],
            yanlisKavramIds: ['sifir_noktasi_sicaklik', 'kuantalasma_olcum'],
            idealCevap: 'Duvarlarda ψ = 0 olmalıdır. Çözüm ψ = √(2/L) sin(nπx/L) sinüs dalgasıdır; yalnızca L = nλ/2 ile sığan dalgalar izinlidir. Bu yüzden enerji E = n²π²ħ²/(2mL²) değerleriyle kuantalanır. n = 0 dalga olmadığı için yoktur, en düşük enerji E₁ > 0\'dır.',
            yedekSecmeli: {
              soru: 'Sonsuz kuyuda enerji neden kuantalıdır?',
              secenekler: [
                sec('Duvarlarda ψ = 0 olduğundan yalnızca belirli dalga boyları sığar', true, 'Doğru. Sınır koşulu kuantalaşmayı doğurur.'),
                sec('Ölçüm enerjiyi ayrıklaştırır', false, 'Yanlış. Kuantalaşma ölçümden önce de vardır.'),
                sec('Sıcaklık seviyeleri ayırır', false, 'Yanlış. Sıcaklık sebep değil.'),
                sec('Bantlar oluşur', false, 'Yanlış. Bantlar çok atomlu katıda oluşur.')
              ]
            },
            alt: { soru: 'Sonsuz kuyuda n = 0 neden yoktur ve bu E₁\'e ne söyler?' }
          },
          {
            tip: 'acik',
            pdfSoru: null,
            soru: 'Schrödinger denklemi çöker mi? Çökme nedir?',
            anahtarFikirler: [
              'Zamana bağlı denklem ψ\'yi düzgün ve belirlenimci evriltir.',
              'Çökme ayrı bir postülattır ve ölçümle olur.',
              'Zamandan bağımsız denklem özdeğer problemidir (Ĥψ = Eψ).',
              'Girdi V(x) ve sınır koşulu, çıktı ψ ve izinli E\'ler.'
            ],
            yanlisKavramlar: [
              'Schrödinger denklemi çöker',
              'Denklem yalnızca bir olasılık denklemidir'
            ],
            yanlisKavramIds: ['schrodinger_cokme', 'schrodinger_cokme'],
            idealCevap: 'Schrödinger denklemi çökmez; ψ\'yi zamanla düzgün ve belirlenimci biçimde evriltir. Çökme ayrı bir postülattır ve yalnızca ölçümle olur. Denklemin girdisi potansiyel V(x) ve sınır koşullarıdır, çıktısı ψ ve izinli E değerleridir.',
            yedekSecmeli: {
              soru: 'Çökme ne zaman olur?',
              secenekler: [
                sec('Ölçüm sırasında', true, 'Doğru. Çökme ölçüm postülatıdır.'),
                sec('Denklem çözülürken', false, 'Yanlış. Denklem çökme üretmez.'),
                sec('Zaman geçtikçe', false, 'Yanlış. Zamanla evrim düzgündür.'),
                sec('Sıcaklık artınca', false, 'Yanlış. Sıcaklıkla ilgisi yok.')
              ]
            },
            alt: { soru: 'Zamana bağlı denklemle çökme arasındaki farkı anlat.' }
          }
        ]
      },
      {
        id: 's05-o09', tip: 'sandik', baslik: 'Sandık', kavram: null, agirlik: 1,
        kart: { id: 'schro', yil: 1926, tekCumle: 'Dalga fonksiyonunun denklemini yazdı; enerjiler kendiliğinden çıktı.' },
        ozet: ['Girdi: V(x) ve sınır koşulu', 'Sınır koşulu enerjiyi kuantalar', 'En düşük enerji sıfır olamaz'],
        kontrolNoktasi: true
      }
    ],
    temelTur: {
      kartlar: [
        { baslik: 'ψ nedir?', metin: '|ψ|² bulunma olasılık yoğunluğudur.' },
        { baslik: 'Sınır koşulu', metin: 'Duvarda ψ = 0: yalnızca sığan dalgalar izinli.' },
        { baslik: 'E₁ > 0', metin: 'n = 0 dalga yok demek; en düşük enerji sıfır değil.' }
      ],
      sim: { modul: 'kuyu', params: { L: 2, n: 1 } }
    },
    tekrarHavuzu: [
      Object.assign({}, o03, { id: 's05-t01' }),
      Object.assign({}, o04, { id: 's05-t02' }),
      {
        id: 's05-t03', tip: 'dusman', baslik: 'Kusur düşmanı', kavram: 'kuantalasma_sinir', agirlik: 1,
        soru: o05.soru,
        secenekler: o05.secenekler,
        kusurSkin: 'vakans'
      },
      {
        id: 's05-t04', tip: 'dusman', baslik: 'Kusur düşmanı', kavram: 'kuantalasma_olcum', agirlik: 1,
        soru: 'Enerji kuantalaşması nereden gelir?',
        secenekler: [
          sec('Sınır koşullarından', true, 'Doğru. Yalnızca sığan çözümler izinli.'),
          sec('Ölçüm sonucundan', false, 'Hayır. Ölçümden önce de enerjiler ayrıktır.'),
          sec('Sıcaklıktan', false, 'Hayır. Sıcaklık sebep değil.')
        ],
        kusurSkin: 'safsizlik'
      }
    ]
  };
})();
