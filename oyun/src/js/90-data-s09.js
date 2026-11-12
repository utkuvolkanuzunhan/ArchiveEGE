/* 90-data-s09.js · İstasyon 09 "Bant testi" verisi (E9)
 * Q.data.stations.s09 alanını doldurur. Metinler oyun/istasyonlar/09-bant-testi.md ile aynıdır.
 * Şema: oyun/01-veri-semalari.md §3. Sim: bant (başarı {N:32, malzemeler:3}).
 */
(function(){
  'use strict';

  function sec(t, dogru, neden){ return { t: t, dogru: dogru, neden: neden }; }

  var o03 = {
    id: 's09-o03', tip: 'dusman', baslik: 'Defect (kusur) düşmanı', kavram: 'pauli_dislama', agirlik: 1,
    soru: 'Pauli exclusion principle (Pauli dışlama ilkesi): bir energy level (enerji seviyesi) en çok kaç electron (elektron) alır?',
    secenekler: [
      sec('İki electron (elektron), zıt spin (spin)', true, 'Doğru. İki electron (elektron) aynı quantum state (kuantum durumu) paylaşamaz; zıt spin (spin) iki ayrı durum verir, seviyeye iki electron (elektron) sığar.'),
      sec('Sınırsız electron (elektron)', false, 'Yanlış. Pauli exclusion principle (Pauli dışlama ilkesi) bunu yasaklar.'),
      sec('Yalnızca bir electron (elektron), spin (spin) fark etmez', false, 'Yanlış. Zıt spin (spin) ile iki electron (elektron) sığar.')
    ],
    kusurSkin: 'pauli_cift'
  };

  var o04 = {
    id: 's09-o04', tip: 'dusman', baslik: 'Defect (kusur) düşmanı', kavram: 'bant_aralik', agirlik: 1,
    soru: 'Insulator (yalıtkan) neden akım taşımaz?',
    secenekler: [
      sec('Valence band (valans bandı) dolu, bandgap (yasak enerji aralığı) büyük', true, 'Doğru. Electron (elektron) boş seviyeye çıkamaz.'),
      sec('Atom (atom) hiç electron (elektron) içermez', false, 'Hayır. Electron (elektron) vardır, ama hareket edemez.'),
      sec('Conduction band (iletim bandı) yarı doludur', false, 'Hayır. Yarı dolu band (bant) metal (metal) özelliğidir.')
    ],
    kusurSkin: 'bant_bosluk'
  };

  var o05 = {
    id: 's09-o05', tip: 'tahmin', baslik: 'Tahmin çukuru', kavram: 'bant_yarilma', agirlik: 1.5,
    soru: 'N atom (atom) yaklaşınca her atomic energy level (atomik enerji seviyesi) ne olur?',
    secenekler: [
      sec('N yakın energy level (enerji seviyesine) yarılır', true, 'Doğru. N energy level (enerji seviyesi), birleşip energy band (enerji bandı) olur.'),
      sec('Tek energy level (enerji seviyesi) olarak kalır', false, 'Yanlış. Atomlar etkileşince energy level (enerji seviyesi) yarılır.'),
      sec('Energy level (enerji seviyesi) sayısı N kat azalır', false, 'Yanlış. Energy level (enerji seviyesi) sayısı N kat artar.')
    ],
    sim: {
      modul: 'bant',
      onceki: { N: 1 },
      sonraki: { N: 32 }
    },
    acik: 'N 1\'den 32\'ye çıkınca tek energy level (enerji seviyesi) 32 çizgiye yarıldı; çizgiler band (bant) oluşturdu.'
  };

  Q.data.stations.s09 = {
    id: 's09',
    sira: 9,
    ad: 'Band (bant) testi',
    makine: 'Bant',
    renk: '#ffb02e',
    konu: 'Periodic structure (periyodik yapı), energy bands (enerji bantları)',
    sinavSorulari: ['S7'],
    sureHedefDk: 22,
    patronId: 'pauli',
    kavramlar: ['bant_yarilma', 'pauli_dislama', 'bant_aralik', 'bant_sonsuz_kuyu', 'iletken_olasilik', 'kristal_pahali'],
    engeller: [
      {
        id: 's09-o01', tip: 'hikaye', baslik: 'Zaman kapısı', kavram: null, agirlik: 1,
        yer: 'Zürih', yil: 1928, rivayet: false,
        onBilgi: [
          { baslik: "Pauli, Bloch ve bant kuramı", madde: [
            "1925'te Pauli exclusion principle (Pauli dışlama ilkesi) önerdi; fikir sonra electron spin (spin) ile bağlandı.",
            "1928'de Bloch, periodic potential (periyodik potansiyel) içindeki dalgalar için Bloch theorem (Bloch teoremi) verdi.",
            "1931'de A. H. Wilson, band theory (bant kuramı) ile metal (metal), insulator (yalıtkan), semiconductor (yarıiletken) ayrımını açıkladı.",
            "1947'de Bardeen ve Brattain ilk transistor'u yaptı; bant fikirlerinin pratik sonucu." ] }
        ],
        satirlar: [
          { kim: 'selin', metin: 'Tek atomda energy level (enerji seviyesi) belli. Atomlar bir araya gelince solid (katı) içinde ne olur?' },
          { kim: 'pauli', metin: 'Her energy level N seviyeye yarılır, seviyeler birleşip energy band (enerji bandı) olur. Pauli: seviyeye en çok iki electron (elektron) sığar.' },
          { kim: 'pauli', metin: 'Dolu valence band (valans bandı) akım taşımaz; üstteki conduction band (iletim bandı) ile arasında bandgap (yasak enerji aralığı) var.' }
        ]
      },
      {
        id: 's09-o02', tip: 'kavram', baslik: 'Kavram kapısı', kavram: 'bant_yarilma', agirlik: 1,
        onBilgi: [
          { baslik: "Energy band (enerji bandı) nasıl oluşur", madde: [
            "Tek atomda energy level (enerji seviyesi) ayrıktır; N atom yaklaşınca her seviye N yakın seviyeye yarılır.",
            "Yakın seviyeler birleşip energy band (enerji bandı) olur; band içinde seviyeler neredeyse sürekli dizilir.",
            "Tek infinite well (sonsuz kuyu) bant vermez; bant, çok atomlu periodic potential (periyodik potansiyel) içinde olur.",
            "Crystal (kristal) düzenli olduğu için bantlar öngörülebilir; amorf yapıda bu düzen bozulur." ] },
          { baslik: "Pauli ilkesi ve doluluk", madde: [
            "Pauli exclusion principle (Pauli dışlama ilkesi): iki electron (elektron) aynı quantum state (kuantum durumu) paylaşamaz.",
            "Spin (spin) iki değer alır (yukarı, aşağı); bir seviyedeki durum sayısını buradan çıkar.",
            "Electron (elektron) seviyeleri alttan yukarı doldurur (Fermi filling, Fermi dolumu).",
            "Sık karışan nokta: tam dolu band (bant) boş seviye bırakmadığı için akım taşımaz; yarı dolu band (bant) taşır." ] },
          { baslik: "Bandgap (yasak enerji aralığı), malzeme", madde: [
            "Valence band (valans bandı): dolu üst band. Conduction band (iletim bandı): üstteki, akım taşıyabilen band.",
            "Bandgap (yasak enerji aralığı) E_g (birim eV): iki band arası; bu enerjide allowed state (izinli durum) yoktur.",
            "Metal (metal): band yarı dolu ya da örtüşür. Insulator (yalıtkan): büyük E_g (elmas ≈ 5,5 eV).",
            "Semiconductor (yarıiletken): küçük E_g (silikon ≈ 1,1 eV). Ayrım probability (olasılık) değil, band (bant) yapısıdır." ] }
        ],
        gorev: 'N atom (atom) sayısını 32 yap, her malzemede Fill electrons (elektron doldur) düğmesine bas.',
        sim: {
          modul: 'bant',
          params: { N: 2, malzeme: 'yariiletken' },
          basari: { N: 32, malzemeler: 3, doldurma: true }
        },
        ogrenilen: 'N atom (atom) N seviye verir; bandgap (yasak enerji aralığı) ve doluluk malzemeyi belirler.'
      },
      o03,
      o04,
      o05,
      {
        id: 's09-o06', tip: 'tuzak', baslik: 'Yanılgı tuzağı', kavram: 'bant_sonsuz_kuyu', agirlik: 1,
        iddia: 'Tek infinite well (sonsuz kuyu) içinde energy bands (enerji bantları) oluşur.',
        parcalar: ['Tek infinite well (sonsuz kuyu)', 'içinde energy bands (enerji bantları)', 'oluşur.'],
        yanlisParca: 0,
        duzeltme: 'Bands (bantlar) çok atomlu solid (katı) içinde oluşur; tek infinite well (sonsuz kuyu) içinde discrete levels (kesikli seviyeler) vardır.'
      },
      {
        id: 's09-o07', tip: 'kopru', baslik: 'Mantık köprüsü', kavram: 'bant_yarilma', agirlik: 1,
        soru: 'Band (bant) oluşum zincirini sıraya diz',
        bloklar: [
          'N atom (atom) bir araya gelir',
          'Her energy level (enerji seviyesi) N yakın çizgiye yarılır',
          'Energy level (enerji seviyesi) çizgileri birleşip energy band (enerji bandı) olur',
          'Bandgap (yasak enerji aralığı) energy band (enerji bandı) gruplarını ayırır'
        ],
        sonuc: 'N atom (atom), N energy level (enerji seviyesi), energy bands (enerji bantları), aralarında bandgap (yasak enerji aralığı).'
      },
      {
        id: 's09-o08', tip: 'patron', baslik: 'Exclusion (Dışlama) Canavarı', kavram: null, agirlik: 1,
        canavar: 'pauli', canavarAd: 'Exclusion (Dışlama) Canavarı',
        giris: 'Aynı yere iki kişi sığmaz! Elektronlar da öyle!',
        fazlar: [
          {
            tip: 'secmeli', kavram: 'bant_aralik',
            soru: 'Metal (metal), insulator (yalıtkan) ve semiconductor (yarıiletken) arasındaki fark nedir?',
            secenekler: [
              sec('Band (bant) doluluğu ve bandgap (yasak enerji aralığı)', true, 'Doğru. Yarı dolu band (bant) metal (metal) verir.'),
              sec('Probability (olasılık) farkı', false, 'Hayır. Fark probability (olasılık) değil, band (bant) yapısıdır.'),
              sec('Atom (atom) sayısı farkı', false, 'Hayır. Hepsi çok atomlu solid (katı) içindedir.')
            ],
            alt: {
              soru: 'Bandgap (yasak enerji aralığı) nedir?',
              secenekler: [
                sec('Valence band (valans bandı) ile conduction band (iletim bandı) arası yasak energy (enerji)', true, 'Doğru. Bu aralıkta allowed state (izinli durum) yoktur.'),
                sec('Bir band (bant) içindeki seviye aralığı', false, 'Hayır. O aralık çok küçüktür.'),
                sec('Electron (elektron) kütlesi', false, 'Hayır. Bandgap (yasak enerji aralığı) bir energy (enerji) aralığıdır.')
              ]
            }
          },
          {
            tip: 'acik',
            pdfSoru: 'Explain how energy bands form in a crystal and why materials differ as metals, insulators and semiconductors.',
            soru: 'Energy bands (enerji bantları) nasıl oluşur? Explain (açıkla). Metal (metal), insulator (yalıtkan), semiconductor (yarıiletken) neden farklıdır?',
            anahtarFikirler: [
              'N atom (atom) yaklaşınca her seviye N seviyeye yarılır, band (bant) olur.',
              'Pauli exclusion principle (Pauli dışlama ilkesi): seviye başına iki electron (elektron).',
              'Periodic potential (periyodik potansiyel): Bloch teoremi allowed energy band (izinli enerji bandı) ve bandgap (yasak enerji aralığı) verir.',
              'Doluluk ve bandgap (yasak enerji aralığı) metal (metal), insulator (yalıtkan), semiconductor (yarıiletken) ayırır.'
            ],
            yanlisKavramlar: [
              'Tek infinite well (sonsuz kuyu) içinde bantlar oluşur',
              'İletken ve yalıtkan farkı probability (olasılık) farkıdır'
            ],
            yanlisKavramIds: ['bant_sonsuz_kuyu', 'iletken_olasilik'],
            idealCevap: 'Atoms (atomlar) bir araya gelince her energy level (enerji seviyesi) N yakın seviyeye yarılır ve energy band (enerji bandı) oluşur. Periodic potential (periyodik potansiyel) allowed (izinli) bantlar ve bandgap (yasak enerji aralığı) verir. Pauli exclusion principle (Pauli dışlama ilkesi) gereği seviye başına iki electron (elektron) vardır. Yarı dolu band (bant) metal (metal), dolu valence band (valans bandı) ve büyük bandgap insulator (yalıtkan), küçük bandgap semiconductor (yarıiletken) verir.',
            yedekSecmeli: {
              soru: 'Energy band (enerji bandı) neden oluşur?',
              secenekler: [
                sec('Çok atomun energy level (enerji seviyesi) yarılması', true, 'Doğru. N atom (atom) N seviye verir.'),
                sec('Tek atomun sınır koşulundan', false, 'Yanlış. Tek atomda discrete levels (kesikli seviyeler) vardır.'),
                sec('Electron (elektron) sayısı azalınca', false, 'Yanlış. Neden atomların etkileşmesidir.'),
                sec('Temperature (sıcaklık) artınca', false, 'Yanlış. Band (bant) yapısı crystal (kristal) periodicity (periyodikliği) sonucudur.')
              ]
            },
            alt: { soru: 'Periodic potential (periyodik potansiyel) neden energy bands (enerji bantları) verir? Explain (açıkla).' }
          },
          {
            tip: 'acik',
            pdfSoru: null,
            soru: 'Pauli exclusion principle (Pauli dışlama ilkesi) nedir? State (belirt) ve band (bant) doluluğuna etkisini explain (açıkla).',
            anahtarFikirler: [
              'İki electron (elektron) aynı quantum state (kuantum durumu) paylaşamaz.',
              'Her energy level (enerji seviyesi) en çok iki electron (elektron) alır.',
              'Electron (elektron) seviyeleri alttan yukarı doldurur.',
              'Dolu band (bant) akım taşımaz; yarı dolu band (bant) taşır.'
            ],
            yanlisKavramlar: [
              'Bir seviyeye istediği kadar electron (elektron) sığar',
              'Dolu band (bant) da akım taşır'
            ],
            yanlisKavramIds: ['pauli_dislama', 'iletken_olasilik'],
            idealCevap: 'Pauli exclusion principle (Pauli dışlama ilkesi): iki electron (elektron) aynı quantum state (kuantum durumu) içinde olamaz; her energy level (enerji seviyesi) zıt spin (spin) ile en çok iki electron alır. Electron (elektron) seviyeleri alttan doldurur. Tam dolu band (bant) boş seviye olmadığı için akım taşımaz, yarı dolu band (bant) taşır.',
            yedekSecmeli: {
              soru: 'Pauli exclusion principle (Pauli dışlama ilkesi) ne der?',
              secenekler: [
                sec('Aynı quantum state (kuantum durumu) iki electron (elektron) içeremez', true, 'Doğru. Seviye başına iki electron (elektron), zıt spin (spin).'),
                sec('Electron (elektron) enerji kaybedemez', false, 'Yanlış. İlke durum paylaşımıyla ilgilidir.'),
                sec('Tüm electron (elektron) aynı seviyeye iner', false, 'Yanlış. İlke tam tersini söyler.'),
                sec('Electron (elektron) bandgap (yasak enerji aralığı) içinde durur', false, 'Yanlış. Orada allowed state (izinli durum) yok.')
              ]
            },
            alt: { soru: 'Dolu band (bant) neden akım taşımaz? Justify (gerekçelendir).' }
          }
        ]
      },
      { id: 's09-h01', tip: 'hesap', baslik: 'Hesap görevi', kavram: null, agirlik: 0, hesapGorev: 'bant-si' },
      {
        id: 's09-o09', tip: 'sandik', baslik: 'Sandık', kavram: null, agirlik: 1,
        kart: { id: 'pauli', yil: 1925, tekCumle: 'İki electron (elektron) aynı quantum state (kuantum durumu) içinde olamaz.' },
        ozet: ['N atom (atom), N seviye, band (bant)', 'Seviye başına iki electron (elektron)', 'Doluluk ve bandgap (yasak enerji aralığı) malzemeyi belirler'],
        kontrolNoktasi: true
      }
    ],
    temelTur: {
      kartlar: [
        { baslik: 'Level splitting (seviye yarılması)', metin: 'N atom (atom) her seviyeyi N çizgiye yarar.' },
        { baslik: 'Pauli exclusion (Pauli dışlama)', metin: 'Her energy level (enerji seviyesi) iki electron (elektron) alır.' },
        { baslik: 'Bandgap (yasak enerji aralığı)', metin: 'Doluluk ve aralık metal (metal), insulator (yalıtkan), semiconductor (yarıiletken) ayırır.' }
      ],
      sim: { modul: 'bant', params: { N: 8, malzeme: 'yariiletken' } }
    },
    tekrarHavuzu: [
      Object.assign({}, o03, { id: 's09-t01' }),
      Object.assign({}, o04, { id: 's09-t02' }),
      {
        id: 's09-t03', tip: 'dusman', baslik: 'Defect (kusur) düşmanı', kavram: 'bant_yarilma', agirlik: 1,
        soru: o05.soru,
        secenekler: o05.secenekler,
        kusurSkin: 'vakans'
      },
      {
        id: 's09-t04', tip: 'dusman', baslik: 'Defect (kusur) düşmanı', kavram: 'iletken_olasilik', agirlik: 1,
        soru: 'Conductor (iletken) ve insulator (yalıtkan) farkı neden kaynaklanır?',
        secenekler: [
          sec('Band (bant) doluluğu ve bandgap (yasak enerji aralığı)', true, 'Doğru. Probability (olasılık) farkı değil, band (bant) yapısı.'),
          sec('Probability (olasılık) farkı', false, 'Hayır. Fark band (bant) yapısındadır.'),
          sec('Atom (atom) rengi', false, 'Hayır. Renk belirleyici değildir.')
        ],
        kusurSkin: 'safsizlik'
      },
      {
        id: 's09-t05', tip: 'dusman', baslik: 'Defect (kusur) düşmanı', kavram: 'kristal_pahali', agirlik: 1,
        soru: 'Crystal (kristal) neden tercih edilir?',
        secenekler: [
          sec('Periodicity (periyodiklik) öngörülebilir energy bands (enerji bantları) verir', true, 'Doğru. Pahalı olduğu için değil.'),
          sec('Crystal (kristal) pahalıdır, bu yüzden', false, 'Hayır. Fiyat neden değildir.'),
          sec('Amorphous (amorf) malzeme band (bant) vermez', false, 'Hayır. Asıl neden periodicity (periyodiklik) ve öngörülebilirlik.')
        ],
        kusurSkin: 'dislokasyon'
      },
      {
        id: 's09-t06', tip: 'dusman', baslik: 'Defect (kusur) düşmanı', kavram: 'bant_sonsuz_kuyu', agirlik: 1,
        soru: 'Energy bands (enerji bantları) nerede oluşur?',
        secenekler: [
          sec('Çok atomlu solid (katı) içinde', true, 'Doğru. Tek kuyuda discrete levels (kesikli seviyeler) vardır.'),
          sec('Tek infinite well (sonsuz kuyu) içinde', false, 'Hayır. Orada yalnızca discrete levels (kesikli seviyeler) var.'),
          sec('Tek atomda', false, 'Hayır. Tek atomda discrete levels (kesikli seviyeler) vardır.')
        ],
        kusurSkin: 'tane_siniri'
      }
    ]
  };
})();
