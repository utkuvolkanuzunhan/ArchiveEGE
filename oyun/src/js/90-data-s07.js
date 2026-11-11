/* 90-data-s07.js · İstasyon 07 "Ölçüm laboratuvarı" verisi (E7)
 * Q.data.stations.s07 alanını doldurur. Metinler oyun/istasyonlar/07-olcum-laboratuvari.md'den aynen alınır.
 * Bağımlılık: 00-q.js (Q.data). Şema: oyun/01-veri-semalari.md §3.
 */
(function(){
  'use strict';

  function sec(t, dogru, neden){ return { t: t, dogru: dogru, neden: neden }; }

  var o03 = {
    id: 's07-o03', tip: 'dusman', baslik: 'Kusur düşmanı', kavram: 'ozdeger_olcum', agirlik: 1,
    soru: 'Bir ölçüm hangi değerleri verebilir?',
    secenekler: [
      sec('Yalnızca operatörün özdeğerlerini', true, 'Doğru. Her ölçüm özdeğerlerden birini verir.'),
      sec('Herhangi bir değeri', false, 'Hayır. Yalnızca özdeğerler çıkabilir.'),
      sec('Özdeğerlerin ortalamasını', false, 'Hayır. Tek ölçümde ortalama değil, bir özdeğer çıkar.')
    ],
    kusurSkin: 'vakans'
  };

  var o04 = {
    id: 's07-o04', tip: 'dusman', baslik: 'Kusur düşmanı', kavram: 'olasilik_katsayi', agirlik: 1,
    soru: 'ψ = c₁φ₁ + c₂φ₂ iken sonucun φ₁ çıkma olasılığı nedir?',
    secenekler: [
      sec('|c₁|²', true, 'Doğru. Olasılık katsayının karesidir.'),
      sec('c₁', false, 'Hayır. Olasılık katsayının kendisi değil karesidir.'),
      sec('c₁ + c₂', false, 'Hayır. Katsayılar toplanmaz; her sonucun olasılığı kendi karesidir.')
    ],
    kusurSkin: 'tane_siniri'
  };

  var o05 = {
    id: 's07-o05', tip: 'tahmin', baslik: 'Tahmin çukuru', kavram: 'olcum_cokme', agirlik: 1.5,
    soru: 'Çöktükten sonra aynı büyüklüğü hemen tekrar ölçersen ne olur?',
    secenekler: [
      sec('Aynı sonuç çıkar', true, 'Doğru. ψ artık özdurumda, sonuç değişmez.'),
      sec('Yeni rastgele sonuç', false, 'Yanlış. Çöken durum özdurumdur, sonuç aynı kalır.'),
      sec('İki sonucun ortalaması', false, 'Yanlış. Tek ölçüm bir özdeğer verir.')
    ],
    sim: {
      modul: 'olcum',
      onceki: { c1sq: 0.3 },
      sonraki: { c1sq: 0.3, olcTekrar: true }
    },
    acik: 'Çöktükten sonra ψ özdurumdur; tekrar ölçüm aynı sonucu verir.'
  };

  Q.data.stations.s07 = {
    id: 's07',
    sira: 7,
    ad: 'Ölçüm laboratuvarı',
    makine: 'Ölçüm lab.',
    renk: '#ff3df0',
    konu: 'Postülatlar, ölçüm, çökme',
    sinavSorulari: ['S8', 'S9'],
    sureHedefDk: 23,
    patronId: 'born',
    kavramlar: ['postulatlar', 'olcum_cokme', 'ozdeger_olcum', 'evrim_belirlenimci', 'olasilik_katsayi', 'schrodinger_cokme'],
    engeller: [
      {
        id: 's07-o01', tip: 'hikaye', baslik: 'Zaman kapısı', kavram: null, agirlik: 1,
        yer: 'Göttingen', yil: 1926, rivayet: false,
        satirlar: [
          { kim: 'selin', metin: 'Ölçüm laboratuvarı: bakınca ne oluyor?' },
          { kim: 'born', metin: 'ψ\'nin karesini olasılık olarak yorumladım. Ölçümde sonuç kesin değil, olasılıkla çıkar.' },
          { kim: 'selin', metin: 'Kuantumun kuralları beş postülat. Ölçüm üçüncü ve dördüncüde.' }
        ]
      },
      {
        id: 's07-o02', tip: 'kavram', baslik: 'Kavram kapısı', kavram: 'olcum_cokme', agirlik: 1,
        gorev: 'Ölç, sonra tekrar ölç: sonuç ne?',
        sim: {
          modul: 'olcum',
          params: { c1sq: 0.3 },
          basari: { tekrarAyni: true }
        },
        ogrenilen: 'Ölçüm ψ\'yi sonuca çökertir; hemen tekrar ölçersen aynı sonucu alırsın.'
      },
      o03,
      o04,
      o05,
      {
        id: 's07-o06', tip: 'tuzak', baslik: 'Yanılgı tuzağı', kavram: 'schrodinger_cokme', agirlik: 1,
        iddia: 'Schrödinger denklemi ψ\'yi ölçüm anında çökertir.',
        parcalar: ['Schrödinger denklemi', 'ψ\'yi ölçüm anında', 'çökertir.'],
        yanlisParca: 0,
        duzeltme: 'Denklem ψ\'yi düzgün evriltir. Çökme ayrı postülattır ve yalnızca ölçümle olur.'
      },
      {
        id: 's07-o07', tip: 'kopru', baslik: 'Mantık köprüsü', kavram: 'evrim_belirlenimci', agirlik: 1,
        soru: 'Ölçüm döngüsünü sıraya diz',
        bloklar: [
          'Sistem özdurumların süperpozisyonundadır',
          'Ölçüm bir özdeğeri |c|² olasılıkla verir',
          'ψ o özdurumuna çöker',
          'Sonra denklem ψ\'yi yeniden evriltir'
        ],
        sonuc: 'Süperpozisyon, olasılıklı sonuç, çökme, belirlenimci evrim.'
      },
      {
        id: 's07-o08', tip: 'patron', baslik: 'Olasılık Canavarı', kavram: null, agirlik: 1,
        canavar: 'born', canavarAd: 'Olasılık Canavarı',
        giris: 'Zar atıyorum! Ama kurallarım var. Olasılığım |c|².',
        fazlar: [
          {
            tip: 'secmeli', kavram: 'olcum_cokme',
            soru: 'Ölçümden önce sistem özdurumda değilse ne vardır?',
            secenekler: [
              sec('Özdurumların süperpozisyonu', true, 'Doğru. ψ = Σ cₙφₙ.'),
              sec('Gizli ama belirli bir değer', false, 'Hayır. Standart yorumda ölçümden önce belirli değer yoktur.'),
              sec('Sıfır enerji', false, 'Hayır. Enerji sıfır olmak zorunda değil.')
            ],
            alt: {
              soru: 'Hangi büyüklük bir ölçüm sonucu olabilir?',
              secenekler: [
                sec('Operatörün özdeğeri', true, 'Doğru. Ölçüm özdeğer verir.'),
                sec('Herhangi bir sayı', false, 'Hayır. Yalnızca özdeğerler.'),
                sec('ψ\'nin kendisi', false, 'Hayır. ψ doğrudan ölçülmez.')
              ]
            }
          },
          {
            tip: 'acik',
            pdfSoru: 'Explain the principles of quantum mechanics.',
            soru: 'Kuantum mekaniğinin ilkelerini (postülatlarını) açıkla.',
            anahtarFikirler: [
              'Durum ψ ile tarif edilir, |ψ|² olasılık yoğunluğudur.',
              'Her gözlenebilir bir operatöre karşılık gelir.',
              'Ölçüm yalnızca özdeğer verir, durum özdurumuna çöker.',
              'Zaman evrimi Schrödinger denklemiyle belirlenimcidir.'
            ],
            yanlisKavramlar: [
              'Kuantum mekaniği her şeyi rastgele yapar',
              'Ölçümde ψ hiç değişmez'
            ],
            yanlisKavramIds: ['evrim_belirlenimci', 'olcum_cokme'],
            idealCevap: 'Sistemin durumu ψ ile tarif edilir ve |ψ|² olasılık yoğunluğudur. Her gözlenebilir bir operatörle temsil edilir. Ölçüm yalnızca operatörün özdeğerlerinden birini verir ve durum o özdurumuna çöker. Ölçümler arasında ψ, Schrödinger denklemiyle belirlenimci biçimde evrilir.',
            yedekSecmeli: {
              soru: 'Hangisi kuantum postülatlarından biridir?',
              secenekler: [
                sec('Her gözlenebilir bir operatöre karşılık gelir', true, 'Doğru. Bu ikinci postülat.'),
                sec('Ölçüm ψ\'yi değiştirmez', false, 'Yanlış. Ölçüm ψ\'yi özdurumuna çökertir.'),
                sec('Enerji her değeri alır', false, 'Yanlış. Yalnızca özdeğerler.'),
                sec('Denklem rastgele evrilir', false, 'Yanlış. Evrim belirlenimcidir.')
              ]
            },
            alt: { soru: 'Postülatların ölçümle ilgili olanlarını anlat.' }
          },
          {
            tip: 'acik',
            pdfSoru: 'The third postulate of quantum mechanics concerns measurement; explain how the system changes its state if its current state is not an eigenstate of the observable being measured.',
            soru: '3. postülat: durum özdurum değilse ölçümde sistem nasıl değişir?',
            anahtarFikirler: [
              'Durum özdurumların süperpozisyonudur: ψ = Σ cₙφₙ.',
              'Ölçüm özdeğerlerden birini |cₙ|² olasılıkla verir.',
              'Ölçümden sonra ψ ölçülen özdurumuna çöker.',
              'Hemen tekrar ölçüm aynı sonucu verir.'
            ],
            yanlisKavramlar: [
              'Ölçüm özdeğerlerin ortalamasını verir',
              'Çökme Schrödinger denkleminden gelir'
            ],
            yanlisKavramIds: ['ozdeger_olcum', 'schrodinger_cokme'],
            idealCevap: 'Durum özdurum değilse özdurumların süperpozisyonudur: ψ = Σ cₙφₙ. Ölçüm özdeğerlerden birini |cₙ|² olasılıkla verir. Ölçümden sonra durum ölçülen özdurumuna çöker; hemen tekrar ölçüm aynı sonucu verir.',
            yedekSecmeli: {
              soru: 'Özdurum olmayan durumda ölçümden sonra ne olur?',
              secenekler: [
                sec('Durum ölçülen özdurumuna çöker', true, 'Doğru. Sonuç olasılıkla belirlenir.'),
                sec('Durum hiç değişmez', false, 'Yanlış. Ölçüm durumu değiştirir.'),
                sec('Durum ortalama özdurumda olur', false, 'Yanlış. Ortalama özdurum diye bir şey yok.'),
                sec('Sistem yok olur', false, 'Yanlış. Sistem özdurumda kalır.')
              ]
            },
            alt: { soru: 'Ölçüm sonucu hangi olasılıkla çıkar ve ölçümden sonra ψ ne olur?' }
          }
        ]
      },
      {
        id: 's07-o09', tip: 'sandik', baslik: 'Sandık', kavram: null, agirlik: 1,
        kart: { id: 'born', yil: 1926, tekCumle: 'ψ\'nin karesinin olasılık olduğunu söyledi.' },
        ozet: ['Ölçüm özdeğer verir, |c|² olasılıkla', 'Ölçümde ψ özdurumuna çöker', 'Denklem belirlenimci, çökme ölçümle'],
        kontrolNoktasi: true
      }
    ],
    temelTur: {
      kartlar: [
        { baslik: 'Süperpozisyon', metin: 'Ölçümden önce durum özdurumların toplamı olabilir.' },
        { baslik: 'Ölçüm', metin: 'Bir özdeğer çıkar, olasılığı |c|².' },
        { baslik: 'Çökme', metin: 'Ölçümden sonra ψ o özdurumdadır.' }
      ],
      sim: { modul: 'olcum', params: { c1sq: 0.3 } }
    },
    tekrarHavuzu: [
      Object.assign({}, o03, { id: 's07-t01' }),
      Object.assign({}, o04, { id: 's07-t02' }),
      {
        id: 's07-t03', tip: 'dusman', baslik: 'Kusur düşmanı', kavram: 'olcum_cokme', agirlik: 1,
        soru: o05.soru,
        secenekler: o05.secenekler,
        kusurSkin: 'vakans'
      },
      {
        id: 's07-t04', tip: 'dusman', baslik: 'Kusur düşmanı', kavram: 'evrim_belirlenimci', agirlik: 1,
        soru: 'Ölçümler arasında ψ nasıl evrilir?',
        secenekler: [
          sec('Schrödinger denklemiyle belirlenimci biçimde', true, 'Doğru. Rastgelelik yalnızca ölçümde ortaya çıkar.'),
          sec('Rastgele', false, 'Hayır. Evrim düzgündür.'),
          sec('Hiç evrilmez', false, 'Hayır. Zamanla evrilir.')
        ],
        kusurSkin: 'safsizlik'
      }
    ]
  };
})();
