/* 90-data-s10.js · İstasyon 10 "Paketleme (bonus)" verisi (E10)
 * Q.data.stations.s10 alanını doldurur. Metinler oyun/istasyonlar/10-bonus-fermi-drift.md ile aynıdır.
 * Şema: oyun/01-veri-semalari.md §3. Sim: fermi (params: T, EF, E; başarı {T0:true}).
 */
(function(){
  'use strict';

  function sec(t, dogru, neden){ return { t: t, dogru: dogru, neden: neden }; }

  var o03 = {
    id: 's10-o03', tip: 'dusman', baslik: 'Defect (kusur) düşmanı', kavram: 'fermi_seviye', agirlik: 1,
    soru: 'Fermi function (Fermi fonksiyonu) için E = E_F noktasında f(E_F) kaçtır?',
    secenekler: [
      sec('f(E_F) = 1/2', true, 'Doğru. E_F, doluluk olasılığının yarı olduğu energy (enerji) değeridir.'),
      sec('f(E_F) = 1', false, 'Yanlış. Olasılık 1 olsaydı seviye her zaman dolu olurdu.'),
      sec('f(E_F) = 0', false, 'Yanlış. Seviye E_F üstünde bile kısmen doludur.')
    ]
  };

  var o04 = {
    id: 's10-o04', tip: 'dusman', baslik: 'Defect (kusur) düşmanı', kavram: 'tasiyici_np', agirlik: 1,
    soru: 'Dengede np = nᵢ² geçerli. Katkıyla electron (elektron) sayısı n artarsa hole (delik) sayısı p ne olur?',
    secenekler: [
      sec('p azalır, np çarpımı sabit kalır', true, 'Doğru. Yeni electron (elektron) delikleri doldurur; çarpım nᵢ² kalır.'),
      sec('p de aynı oranda artar', false, 'Hayır. Çarpım sabit olduğu için p düşer.'),
      sec('p hiç değişmez', false, 'Hayır. n büyürse p küçülür.')
    ],
    kusurSkin: 'safsizlik'
  };

  var o05 = {
    id: 's10-o05', tip: 'tahmin', baslik: 'Tahmin çukuru', kavram: 'fermi_dagilim', agirlik: 1.5,
    soru: 'Temperature (sıcaklık) 300 K\'den 50 K\'e inerse f(E) eğrisi E_F çevresinde ne olur?',
    secenekler: [
      sec('Dikleşir, step function (basamak fonksiyonu) biçimine yaklaşır', true, 'Doğru. kT küçülünce geçiş bölgesi daralır.'),
      sec('Daha da yumuşar', false, 'Yanlış. Yumuşama sıcaklıkla artar, düşmez.'),
      sec('E_F noktası kaybolur', false, 'Yanlış. f(E_F) = 1/2 her T için sürer.')
    ],
    sim: {
      modul: 'fermi',
      onceki: { T: 300 },
      sonraki: { T: 50 }
    },
    acik: 'T 300 K\'den 50 K\'e inince f(E) eğrisi diklendi; geçiş bölgesi E_F çevresinde daraldı, basamağa yaklaştı.'
  };

  Q.data.stations.s10 = {
    id: 's10',
    sira: 10,
    ad: 'Paketleme (bonus)',
    makine: 'Paketleme',
    renk: '#7be0a4',
    konu: 'Carriers (taşıyıcılar), Fermi level (Fermi seviyesi), drift (sürüklenme)',
    sinavSorulari: [],
    sureHedefDk: 18,
    patronId: 'fermi',
    kavramlar: ['fermi_dagilim', 'fermi_seviye', 'tasiyici_np', 'drift_hiz', 'fermi_hep_dolu', 'drift_ivme'],
    engeller: [
      {
        id: 's10-o01', tip: 'hikaye', baslik: 'Zaman kapısı', kavram: null, agirlik: 1,
        yer: 'Roma', yil: 1926, rivayet: false,
        onBilgi: [
          { baslik: "Fermi-Dirac ve sürüklenme tarihi", madde: [
            "1900 dolayında Drude, metaldeki electron (elektron) hareketini drift (sürüklenme) ve scattering (saçılma) ile modelledi.",
            "1926'da Fermi ve Dirac birbirinden bağımsız Fermi-Dirac statistics (Fermi-Dirac istatistiği) kurdu; Pauli ilkesine uyan parçacıklar için.",
            "1927'de Sommerfeld bu dağılımı metaldeki electron (elektron) gazına uyguladı.",
            "1947'de ilk transistor yapıldı; Bardeen, Brattain ve Shockley 1956 Nobel Fizik Ödülü'nü aldı." ] }
        ],
        satirlar: [
          { kim: 'selin', metin: 'Roma, 1926. Fermi bir dağılım yazdı: Fermi level (Fermi seviyesi) E_F, doluluk olasılığının yarı olduğu energy (enerji) değeridir.' },
          { kim: 'fermi', metin: 'Taşıyıcılar iki türlü: electron (elektron) n ve hole (delik) p. Sıcaklık yükselince f(E) yumuşar, carrier (taşıyıcı) artar.' },
          { kim: 'fermi', metin: 'Alan E uygulanınca carrier (taşıyıcı) v_d = μE hızıyla drift (sürüklenme) yapar. 1947\'de ilk transistör (Bardeen, Brattain, Shockley) buna dayandı.' }
        ]
      },
      {
        id: 's10-o02', tip: 'kavram', baslik: 'Kavram kapısı', kavram: 'fermi_dagilim', agirlik: 1,
        onBilgi: [
          { baslik: "Fermi-Dirac dağılımı, Fermi level", madde: [
            "f(E) = 1/(1 + e^((E−E_F)/kT)): enerjisi E olan bir seviyenin dolu olma olasılığı (0 ile 1 arası).",
            "Fermi level (Fermi seviyesi) E_F: doluluk olasılığının tam yarı olduğu enerji. Formülde E = E_F koyup değeri hesapla.",
            "T = 0 K'de f step function (basamak fonksiyonu) olur; T arttıkça geçiş bölgesi kT mertebesinde genişler.",
            "k = 8,617×10⁻⁵ eV/K; 300 K'de kT ≈ 0,026 eV. E_F bir seviye olmak zorunda değil, bandgap içinde de olabilir." ] },
          { baslik: "Carriers (taşıyıcılar): n, p, nᵢ", madde: [
            "Carriers (taşıyıcılar): n electron (elektron) yoğunluğu, p hole (delik) yoğunluğu (birim cm⁻³).",
            "Intrinsic (katkısız) yarıiletkende n = p = nᵢ; nᵢ sıcaklık ve bandgap ile değişir (Si için ≈ 10¹⁰ cm⁻³).",
            "Doping (katkılama): donor n-type (n-tipi), acceptor p-type (p-tipi) yapar. Dengede np = nᵢ² (kütle etkisi yasası).",
            "Sık karışan nokta: çarpım np sabittir; toplam n+p değil. Katkı bir taşıyıcıyı artırırken diğerini etkiler." ] },
          { baslik: "Drift (sürüklenme), mobility, akım", madde: [
            "Drift velocity (sürüklenme hızı): v_d = μE; μ mobility (hareketlilik, cm²/V·s), E alan (V/cm).",
            "Scattering (saçılma) carrier'ı sürekli yavaşlatır; bu yüzden v_d ivmelenmez, alanla orantılı bir ortalama hıza oturur.",
            "Current density (akım yoğunluğu): J = q(nμₙ + pμₚ)E (A/cm²); electron (elektron) ve hole (delik) katkıları toplanır.",
            "Sık karışan nokta: drift, alan etkisiyle olur; diffusion (difüzyon) ise konsantrasyon farkıyla olur." ] }
        ],
        gorev: 'T\'yi 50 K\'e indir (Fermi eğrisi basamağa döner), sonra alan E\'yi artır (drift hızı v_d = μE).',
        sim: {
          modul: 'fermi',
          params: { T: 300, E: 0 },
          basari: { T0: true, E: true }
        },
        ogrenilen: 'T düşünce f(E) basamağa yaklaşır; E_F\'de f = 1/2 kalır. Alan E, carrier (taşıyıcı) hızını v_d = μE yapar.'
      },
      o03,
      o04,
      o05,
      {
        id: 's10-o06', tip: 'tuzak', baslik: 'Yanılgı tuzağı', kavram: 'fermi_hep_dolu', agirlik: 1,
        iddia: 'Fermi function (Fermi fonksiyonu) için f(E_F) her sıcaklıkta 1 değerini alır.',
        parcalar: ['Fermi function (Fermi fonksiyonu) için', 'f(E_F) her sıcaklıkta', '1 değerini alır.'],
        yanlisParca: 2,
        duzeltme: 'T > 0 için f(E_F) = 1/2 olur. Yalnızca T = 0 K\'de E_F altı tam dolu, üstü boştur (step function, basamak fonksiyonu).'
      },
      {
        id: 's10-o07', tip: 'kopru', baslik: 'Mantık köprüsü', kavram: 'drift_hiz', agirlik: 1,
        soru: 'Drift (sürüklenme) zincirini sıraya diz',
        bloklar: [
          'Electric field (elektrik alanı) E uygulanır',
          'Carrier (taşıyıcı) ortalama v_d = μE hızı kazanır',
          'Hareketli n ve p yük taşır',
          'Akım yoğunluğu J = q(nμₙ + pμₚ)E olur'
        ],
        sonuc: 'Alan E, drift velocity (sürüklenme hızı) v_d = μE verir; n ve p ile birlikte J = q(nμₙ + pμₚ)E akımı çıkar.'
      },
      {
        id: 's10-o08', tip: 'patron', baslik: 'Fermi (Fermi) Canavarı', kavram: null, agirlik: 1,
        canavar: 'fermi', canavarAd: 'Fermi (Fermi) Canavarı',
        giris: 'Seviyeleri ben doldururum! Sıcaklık yükselirse sınırım bulanır!',
        fazlar: [
          {
            tip: 'secmeli', kavram: 'fermi_dagilim',
            soru: 'T = 0 K\'de Fermi function (Fermi fonksiyonu) nasıl görünür?',
            secenekler: [
              sec('E_F altında 1, üstünde 0 (step function)', true, 'Doğru. Seviyeler alttan doldurulur, üstü boş kalır.'),
              sec('Her yerde 1/2', false, 'Hayır. 1/2 yalnızca E = E_F noktasındadır.'),
              sec('Her yerde 1', false, 'Hayır. E_F üstündeki seviyeler boştur.')
            ],
            alt: {
              soru: 'Fermi level (Fermi seviyesi) nedir?',
              secenekler: [
                sec('Doluluk olasılığı 1/2 olan energy (enerji)', true, 'Doğru. f(E_F) = 1/2.'),
                sec('Electron (elektron) kütlesi', false, 'Hayır. E_F bir energy (enerji) değeridir.'),
                sec('Atom (atom) sayısı', false, 'Hayır. E_F doluluk olasılığıyla tanımlanır.')
              ]
            }
          },
          {
            tip: 'acik',
            pdfSoru: null,
            soru: 'Fermi-Dirac dağılımını state (belirt). Temperature (sıcaklık) artınca f(E) nasıl değişir? Explain (açıkla).',
            anahtarFikirler: [
              'f(E) = 1/(1+e^((E−E_F)/kT)) doluluk olasılığıdır.',
              'E = E_F noktasında f = 1/2 olur.',
              'T = 0 K\'de f basamak fonksiyonudur.',
              'T arttıkça geçiş bölgesi genişler, üst seviyeler dolar.'
            ],
            yanlisKavramlar: [
              'f(E_F) her sıcaklıkta 1 değerini alır',
              'Sıcaklık artınca dağılım diklenir'
            ],
            yanlisKavramIds: ['fermi_hep_dolu', 'fermi_dagilim'],
            idealCevap: 'Fermi-Dirac distribution (dağılımı) f(E) = 1/(1+e^((E−E_F)/kT)) bir seviyenin dolu olma olasılığını verir. E = E_F noktasında f = 1/2 olur. T = 0 K\'de f bir step function (basamak fonksiyonu) olur: E_F altı dolu, üstü boş. T arttıkça geçiş bölgesi kT mertebesinde genişler ve bazı electron (elektron) E_F üstüne çıkar.',
            yedekSecmeli: {
              soru: 'Temperature (sıcaklık) artınca f(E) eğrisi nasıl değişir?',
              secenekler: [
                sec('E_F çevresinde yumuşar, geçiş bölgesi genişler', true, 'Doğru. Geçiş genişliği kT ile büyür.'),
                sec('Daha dik bir basamağa dönüşür', false, 'Yanlış. Dik basamak T = 0 K\'dedir.'),
                sec('f(E_F) 1 değerine çıkar', false, 'Yanlış. f(E_F) = 1/2 kalır.'),
                sec('E_F sıfıra iner', false, 'Yanlış. Eğrinin biçimi değişir, tanım değişmez.')
              ]
            },
            alt: { soru: 'f(E_F) = 1/2 olduğunu f(E) formülünden show (göster).' }
          },
          {
            tip: 'acik',
            pdfSoru: null,
            soru: 'Drift velocity (sürüklenme hızı) ve current density (akım yoğunluğu) ifadelerini state (belirt). np = nᵢ² ne söyler? Explain (açıkla).',
            anahtarFikirler: [
              'Drift velocity: v_d = μE, hız alanla orantılıdır.',
              'J = q(nμₙ + pμₚ)E electron ve hole katkısını toplar.',
              'Dengede np = nᵢ² geçerlidir.',
              'n artarsa p azalır, çarpım sabit kalır.'
            ],
            yanlisKavramlar: [
              'Alan altında carrier hızı sürekli artar',
              'Katkı hem n hem p değerini artırır'
            ],
            yanlisKavramIds: ['drift_ivme', 'tasiyici_np'],
            idealCevap: 'Drift velocity (sürüklenme hızı) v_d = μE, mobility (hareketlilik) μ ile alan E ile orantılıdır; scattering (saçılma) hızı sınırlar. Current density (akım yoğunluğu) J = q(nμₙ + pμₚ)E ile hem electron hem hole katkı verir. Dengede np = nᵢ²: katkıyla n artarsa p azalır, çarpım sabit kalır.',
            yedekSecmeli: {
              soru: 'J = q(nμₙ + pμₚ)E ifadesinde J neye bağlıdır?',
              secenekler: [
                sec('n, p, mobility (hareketlilik) ve alan E', true, 'Doğru. Hepsi akım yoğunluğunu belirler.'),
                sec('Yalnızca atom (atom) sayısı', false, 'Yanlış. Taşıyıcı yoğunluğu ve μ belirler.'),
                sec('Yalnızca Fermi level (Fermi seviyesi)', false, 'Yanlış. E_F dolaylı olarak n ve p\'yi etkiler.'),
                sec('Yalnızca bandgap (yasak enerji aralığı)', false, 'Yanlış. Bandgap dolaylı olarak nᵢ\'yi etkiler.')
              ]
            },
            alt: { soru: 'Drift velocity (sürüklenme hızı) neden sürekli artmaz? Justify (gerekçelendir).' }
          }
        ]
      },
      {
        id: 's10-o09', tip: 'sandik', baslik: 'Sandık', kavram: null, agirlik: 1,
        kart: { id: 'fermi', yil: 1926, tekCumle: 'Fermi level (Fermi seviyesi): doluluk olasılığının yarı olduğu energy (enerji).' },
        ozet: ['f(E_F) = 1/2; T = 0 K\'de basamak', 'np = nᵢ² dengede', 'v_d = μE, J = q(nμₙ + pμₚ)E'],
        kontrolNoktasi: true
      }
    ],
    temelTur: {
      kartlar: [
        { baslik: 'Fermi level (Fermi seviyesi)', metin: 'f(E_F) = 1/2; T = 0 K\'de f basamaktır.' },
        { baslik: 'Carriers (taşıyıcılar)', metin: 'Dengede np = nᵢ²; n artarsa p azalır.' },
        { baslik: 'Drift (sürüklenme)', metin: 'v_d = μE ve J = q(nμₙ + pμₚ)E.' }
      ],
      sim: { modul: 'fermi', params: { T: 300 } }
    },
    tekrarHavuzu: [
      Object.assign({}, o03, { id: 's10-t01' }),
      Object.assign({}, o04, { id: 's10-t02' }),
      {
        id: 's10-t03', tip: 'dusman', baslik: 'Defect (kusur) düşmanı', kavram: 'fermi_dagilim', agirlik: 1,
        soru: o05.soru,
        secenekler: o05.secenekler,
        kusurSkin: 'vakans'
      },
      {
        id: 's10-t04', tip: 'dusman', baslik: 'Defect (kusur) düşmanı', kavram: 'drift_hiz', agirlik: 1,
        soru: 'Drift velocity (sürüklenme hızı) v_d = μE ise alan E iki katına çıkınca v_d ne olur?',
        secenekler: [
          sec('İki katına çıkar', true, 'Doğru. v_d alanla orantılıdır.'),
          sec('Yarıya düşer', false, 'Hayır. Orantı doğrudandır.'),
          sec('Değişmez', false, 'Hayır. v_d = μE alana bağlıdır.')
        ],
        kusurSkin: 'tane_siniri'
      },
      {
        id: 's10-t05', tip: 'dusman', baslik: 'Defect (kusur) düşmanı', kavram: 'fermi_hep_dolu', agirlik: 1,
        soru: 'T > 0 iken Fermi function (Fermi fonksiyonu) için hangisi doğrudur?',
        secenekler: [
          sec('f(E_F) = 1/2', true, 'Doğru. E_F noktasında doluluk olasılığı yarıdır.'),
          sec('f(E_F) = 1', false, 'Hayır. Bu yalnızca E_F altı için T = 0 K\'de geçerlidir.'),
          sec('f(E) her yerde 0', false, 'Hayır. Alt seviyeler büyük olasılıkla doludur.')
        ],
        kusurSkin: 'dislokasyon'
      },
      {
        id: 's10-t06', tip: 'dusman', baslik: 'Defect (kusur) düşmanı', kavram: 'drift_ivme', agirlik: 1,
        soru: 'Sabit alanda carrier (taşıyıcı) hızı neden sürekli artmaz?',
        secenekler: [
          sec('Scattering (saçılma) hızı sınırlar, v_d sabitlenir', true, 'Doğru. Saçılma ivmelenmeyi dengeler.'),
          sec('Alan zamanla sıfırlanır', false, 'Hayır. Alan sabit tutulmuştur.'),
          sec('Electron (elektron) kütlesi sonsuzdur', false, 'Hayır. Neden saçılmadır.')
        ],
        kusurSkin: 'pauli_cift'
      }
    ]
  };
})();
