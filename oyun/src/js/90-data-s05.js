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
    soru: 'Wave function (dalga fonksiyonu) ψ(x) fiziksel olarak neyi anlatır?',
    secenekler: [
      sec('|ψ(x)|² probability density (olasılık yoğunluğu) verir', true, 'Doğru. ψ\'nin kendisi ölçülemez, karesi probability (olasılık) yoğunluğudur.'),
      sec('Parçacığın gerçek konumunu', false, 'Hayır. ψ konum vermez, probability distribution (olasılık dağılımı) verir.'),
      sec('Parçacığın enerjisini', false, 'Hayır. Enerji denklemin eigenvalue (özdeğer) değeridir.')
    ],
    kusurSkin: 'vakans'
  };

  var o04 = {
    id: 's05-o04', tip: 'dusman', baslik: 'Kusur düşmanı', kavram: 'schrodinger_girdi_cikti', agirlik: 1,
    soru: 'Schrödinger equation (Schrödinger denklemi) için ne verirsin, ne alırsın?',
    secenekler: [
      sec('V(x) ve boundary condition (sınır koşulu) ver; ψ ile izinli E al', true, 'Doğru. Girdi V(x) ve boundary condition, çıktı ψ ile E.'),
      sec('ψ ver, potansiyeli al', false, 'Hayır. Potential girdidir, ψ çıktıdır.'),
      sec('Enerji ver, konumu al', false, 'Hayır. Enerjiler denklemin çıktısıdır.')
    ],
    kusurSkin: 'tane_siniri'
  };

  var o05 = {
    id: 's05-o05', tip: 'tahmin', baslik: 'Tahmin çukuru', kavram: 'kuantalasma_sinir', agirlik: 1.5,
    soru: 'Potential well (potansiyel kuyusu) genişliği L yarıya inerse E₁ ne olur?',
    secenekler: [
      sec('4 katına çıkar', true, 'Doğru. E ∝ 1/L².'),
      sec('2 katına çıkar', false, 'Yanlış. Energy (enerji) L²\'ye ters orantılıdır: 4 kat.'),
      sec('Değişmez', false, 'Yanlış. Dar well\'de wavelength (dalga boyu) kısalır, enerji artar.')
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
    konu: 'Schrödinger equation (Schrödinger denklemi), ψ, infinite well (sonsuz kuyu), quantization (kuantalaşma)',
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
          { kim: 'schro', metin: 'Wave function (dalga fonksiyonu) ψ için bir denklem yazdım. Atomun energy levels (enerji seviyeleri) denklemden çıktı.' },
          { kim: 'schro', metin: 'Enerjileri ben eklemedim. Boundary conditions (sınır koşulları) yüzünden kendiliğinden ortaya çıktılar.' }
        ]
      },
      {
        id: 's05-o02', tip: 'kavram', baslik: 'Kavram kapısı', kavram: 'kuantalasma_sinir', agirlik: 1,
        gorev: 'Well (kuyu) genişliğini 2\'den 1 nm\'ye indir.',
        sim: {
          modul: 'kuyu',
          params: { L: 2, n: 1 },
          basari: { yariya: true }
        },
        ogrenilen: 'Duvarda ψ = 0 olduğundan yalnızca belirli wavelengths (dalga boyları) sığar; energy quantization (enerji kuantalaşması) oluşur.'
      },
      o03,
      o04,
      o05,
      {
        id: 's05-o06', tip: 'tuzak', baslik: 'Yanılgı tuzağı', kavram: 'sifir_noktasi_sicaklik', agirlik: 1,
        iddia: 'Infinite well (sonsuz kuyu) içindeki parçacığın enerjisi, sıcaklık sıfır olmadığı için sıfırdan büyüktür.',
        parcalar: ['Infinite well (sonsuz kuyu) içindeki parçacığın enerjisi,', 'sıcaklık sıfır olmadığı için', 'sıfırdan büyüktür.'],
        yanlisParca: 1,
        duzeltme: 'Sebep sıcaklık değil: boundary condition (sınır koşulu) dalganın sığmasını gerektirir. Mutlak sıfırda da E₁ > 0 (zero-point energy, sıfır noktası enerjisi).'
      },
      {
        id: 's05-o07', tip: 'kopru', baslik: 'Mantık köprüsü', kavram: 'kuantalasma_sinir', agirlik: 1,
        soru: 'Quantization (kuantalaşma) zincirini sıraya diz',
        bloklar: [
          'Walls (duvarlar) üzerinde ψ sıfır olmak zorundadır',
          'Well (kuyu) içine yalnızca tam sayı yarım dalga sığar',
          'Wavelength (dalga boyu) λ = 2L/n ile sınırlanır',
          'Energy (enerji) E ∝ n²/L² belirli değerler alır'
        ],
        sonuc: 'Boundary condition (sınır koşulu), sığan dalgalar, kısıtlı λ, quantized energy (kuantalı enerji).'
      },
      {
        id: 's05-o08', tip: 'patron', baslik: 'Kuantum Kedisi', kavram: null, agirlik: 1,
        canavar: 'schro', canavarAd: 'Kuantum Kedisi',
        giris: 'Miyav! Sıfır enerjiyle kutuya sığacağımı mı sandın?',
        fazlar: [
          {
            tip: 'secmeli', kavram: 'schrodinger_cokme',
            soru: 'Time-dependent Schrödinger equation (zamana bağlı Schrödinger denklemi) ψ\'yi nasıl değiştirir?',
            secenekler: [
              sec('Düzgün ve belirlenimci biçimde evriltir', true, 'Doğru. Collapse (çökme) denklemden değil, measurement (ölçüm) postülatından gelir.'),
              sec('Ölçüm yapınca çökertir', false, 'Hayır. Collapse ayrı bir postülattır, denklemin işi değil.'),
              sec('Rastgele değiştirir', false, 'Hayır. Denklem rastgele değil, deterministic (belirlenimci) yapıdadır.')
            ],
            alt: {
              soru: 'Ĥψ = Eψ matematiksel olarak nasıl bir problemdir?',
              secenekler: [
                sec('Eigenvalue problem (özdeğer problemi)', true, 'Doğru. İzinli E\'ler eigenvalues (özdeğerler) olur.'),
                sec('Initial value problem (başlangıç değer problemi)', false, 'Hayır. Bu zamana bağlı denklem için geçerli.'),
                sec('Olasılık hesabı', false, 'Hayır. Probability density |ψ|²\'dir, denklem değil.')
              ]
            }
          },
          {
            tip: 'acik',
            pdfSoru: 'For the given potential below, it is required to calculate the wave function and the allowed energies in electron-volts (eV).',
            soru: 'Infinite well (sonsuz kuyu) için ψ ve allowed energies (izinli enerjiler) nasıl bulunur? Mantığı explain (açıkla).',
            anahtarFikirler: [
              'Walls (duvarlar) üzerinde ψ = 0 boundary condition (sınır koşulu) uygulanır.',
              'Çözüm sinüs dalgasıdır (standing wave, duran dalga): ψ = √(2/L) sin(nπx/L).',
              'Yalnızca L = nλ/2 ile sığan waves (dalgalar) izinlidir.',
              'Enerji E = n²π²ħ²/(2mL²), elektron için yaklaşık 0,376·n²/L² eV (L nm).'
            ],
            yanlisKavramlar: [
              'Energy (enerji) sıcaklıktan gelir',
              'Quantization (kuantalaşma) ölçüm sonucudur'
            ],
            yanlisKavramIds: ['sifir_noktasi_sicaklik', 'kuantalasma_olcum'],
            idealCevap: 'Duvarlarda ψ = 0 olmalıdır (boundary condition, sınır koşulu). Çözüm ψ = √(2/L) sin(nπx/L) sinüs dalgasıdır; yalnızca L = nλ/2 ile sığan dalgalar izinlidir. Bu yüzden energy (enerji) E = n²π²ħ²/(2mL²) değerleriyle quantized (kuantalı) olur. n = 0 dalga olmadığı için yoktur, en düşük enerji E₁ > 0\'dır (zero-point energy, sıfır noktası enerjisi).',
            yedekSecmeli: {
              soru: 'Infinite well (sonsuz kuyu) içinde energy (enerji) neden quantized (kuantalı) olur?',
              secenekler: [
                sec('Duvarlarda ψ = 0 olduğundan yalnızca belirli wavelengths (dalga boyları) sığar', true, 'Doğru. Boundary condition (sınır koşulu) quantization (kuantalaşma) doğurur.'),
                sec('Measurement (ölçüm) enerjiyi ayrıklaştırır', false, 'Yanlış. Quantization ölçümden önce de vardır.'),
                sec('Sıcaklık seviyeleri ayırır', false, 'Yanlış. Sıcaklık sebep değil.'),
                sec('Bands (bantlar) oluşur', false, 'Yanlış. Bantlar çok atomlu katıda oluşur.')
              ]
            },
            alt: { soru: 'Infinite well (sonsuz kuyu) içinde n = 0 neden yoktur ve bu E₁\'e ne söyler? Justify (gerekçelendir).' }
          },
          {
            tip: 'acik',
            pdfSoru: null,
            soru: 'Schrödinger equation (Schrödinger denklemi) collapse (çökme) yapar mı? Collapse nedir? Define (tanımla).',
            anahtarFikirler: [
              'Time-dependent equation (zamana bağlı denklem) ψ\'yi düzgün ve deterministic (belirlenimci) evriltir.',
              'Collapse (çökme) ayrı bir postülattır ve measurement (ölçüm) ile olur.',
              'Time-independent equation (zamandan bağımsız denklem) eigenvalue problem (özdeğer problemi) olur (Ĥψ = Eψ).',
              'Girdi V(x) ve boundary condition, çıktı ψ ve allowed energies (izinli enerjiler).'
            ],
            yanlisKavramlar: [
              'Schrödinger equation (Schrödinger denklemi) çöker',
              'Denklem yalnızca bir probability (olasılık) denklemidir'
            ],
            yanlisKavramIds: ['schrodinger_cokme', 'schrodinger_cokme'],
            idealCevap: 'Schrödinger equation (Schrödinger denklemi) çökmez; ψ\'yi zamanla düzgün ve deterministic (belirlenimci) biçimde evriltir. Collapse (çökme) ayrı bir postülattır ve yalnızca measurement (ölçüm) ile olur. Denklemin girdisi potential (potansiyel) V(x) ve boundary conditions (sınır koşulları), çıktısı ψ ve allowed energies (izinli enerjiler) E olur.',
            yedekSecmeli: {
              soru: 'Collapse (çökme) ne zaman olur?',
              secenekler: [
                sec('Measurement (ölçüm) sırasında', true, 'Doğru. Collapse ölçüm postülatıdır.'),
                sec('Denklem çözülürken', false, 'Yanlış. Denklem collapse üretmez.'),
                sec('Zaman geçtikçe', false, 'Yanlış. Time evolution (zamanla evrim) düzgündür.'),
                sec('Sıcaklık artınca', false, 'Yanlış. Sıcaklıkla ilgisi yok.')
              ]
            },
            alt: { soru: 'Time-dependent equation (zamana bağlı denklem) ile collapse (çökme) arasındaki farkı compare (karşılaştır).' }
          }
        ]
      },
      {
        id: 's05-o09', tip: 'sandik', baslik: 'Sandık', kavram: null, agirlik: 1,
        kart: { id: 'schro', yil: 1926, tekCumle: 'Wave function (dalga fonksiyonu) denklemini yazdı; energy levels (enerji seviyeleri) kendiliğinden çıktı.' },
        ozet: ['Girdi: V(x) ve boundary condition (sınır koşulu)', 'Boundary condition enerjiyi quantize (kuantalar) eder', 'Lowest energy (en düşük enerji) sıfır olamaz'],
        kontrolNoktasi: true
      }
    ],
    temelTur: {
      kartlar: [
        { baslik: 'ψ nedir?', metin: '|ψ|² probability density (olasılık yoğunluğu) olur.' },
        { baslik: 'Sınır koşulu', metin: 'Boundary condition (sınır koşulu): duvarda ψ = 0, yalnızca sığan dalgalar izinli.' },
        { baslik: 'E₁ > 0', metin: 'n = 0 dalga yok demek; lowest energy (en düşük enerji) sıfır değil.' }
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
        soru: 'Energy quantization (enerji kuantalaşması) nereden gelir?',
        secenekler: [
          sec('Boundary conditions (sınır koşulları)', true, 'Doğru. Yalnızca sığan çözümler izinli.'),
          sec('Measurement (ölçüm) sonucundan', false, 'Hayır. Ölçümden önce de enerjiler ayrıktır.'),
          sec('Sıcaklıktan', false, 'Hayır. Sıcaklık sebep değil.')
        ],
        kusurSkin: 'safsizlik'
      }
    ]
  };
})();
