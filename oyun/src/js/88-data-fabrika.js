/* 88-data-fabrika.js · Fabrika şeması verisi: istasyon id -> { kisa, rol, neden, bagliKavramlar, miniSoru }
 * Ekler: Q.data.fabrika. Bağımlılık: 00-q.js. Yalnızca veri; davranış 21-fabrika.js içindedir.
 * Terimler `English (Türkçe)` biçiminde. miniSoru: bölüm onarıldıktan sonra "Bu bölümü neden kurduk?" sorusu. */
(function(){
  'use strict';
  function s(t, dogru, neden){ return { t: t, dogru: !!dogru, neden: neden }; }

  Q.data.fabrika = {
    kaynak: { kisa: 'Ham kum', etiket: 'Sand (kum)' },
    cikti: { kisa: 'Çip', etiket: 'Chip (çip)' },
    istasyonlar: {
      s01: {
        kisa: 'Kristal fırını',
        rol: 'Erimiş silicon (silisyum), tek parça kusursuz bir kristal külçeye çevrilir.',
        neden: 'Çip kusursuz sıralı atomlar ister; bozuk dizilim, kalabalık yolda trafik sıkışması gibi elektronu yavaşlatır.',
        bagliKavramlar: ['Single crystal (tek kristal)', 'Grain boundary (tane sınırı)', 'Czochralski growth (Czochralski büyütme)', 'Seed (tohum)'],
        miniSoru: {
          soru: 'Fırında neden single crystal (tek kristal) silicon (silisyum) üretiyoruz?',
          secenekler: [
            s('Tek kristalde grain boundary (tane sınırı) yoktur; düzen tüm parçada sürer', true, 'Düzen bozulmadığı için elektronlar öngörülebilir davranır.'),
            s('Amorphous (amorf) silicon (silisyum) daha pahalıdır', false, 'Neden fiyat değil, long-range order (uzun menzilli düzen) gereksinimidir.'),
            s('Tek kristal ışık yaymaz', false, 'Seçim, ışıkla değil kristal düzeniyle ilgilidir.')
          ]
        }
      },
      s02: {
        kisa: 'Kesim testeresi',
        rol: 'Külçe ince dilimlere kesilir; her dilim bir wafer (dilim) olur.',
        neden: 'Kristal ekmek gibi dilimlenir; hangi düzlemden kestiğin, yüzeydeki atom dizilimini belirler.',
        bagliKavramlar: ['Lattice (kafes)', 'Unit cell (birim hücre)', 'Miller indices (Miller indisleri)', 'Crystal plane (kristal düzlemi)'],
        miniSoru: {
          soru: 'Wafer (dilim) neden rastgele değil, belirli bir crystal plane (kristal düzlemi) boyunca kesilir?',
          secenekler: [
            s('Yüzeydeki atom dizilimi düzleme bağlıdır; aygıt özellikleri de buna bağlıdır', true, 'Düzlem, Miller indices (Miller indisleri) ile belirlenir.'),
            s('Her düzlemde atom sayısı aynıdır', false, 'Planar density (düzlemsel yoğunluk) düzleme göre değişir.'),
            s('Miller indices (Miller indisleri) dilim kalınlığını belirler', false, 'Miller indices (Miller indisleri) yönelimi verir, kalınlığı vermez.')
          ]
        }
      },
      s03: {
        kisa: 'Işık-test odası',
        rol: 'Işığın enerjisinin photon (foton) denen paketlerle geldiğini deneylerle gösterir.',
        neden: 'Enerji rampa değil merdiven gibidir: basamak basamak. Çipin kuantum fiziği bu fikirle başlar.',
        bagliKavramlar: ['Photon (foton)', 'Photoelectric effect (fotoelektrik olay)', 'Blackbody radiation (kara cisim ışıması)', 'Threshold frequency (eşik frekansı)'],
        miniSoru: {
          soru: 'Photoelectric effect (fotoelektrik olay) deneyi ışık hakkında neyi gösterir?',
          secenekler: [
            s('Işık photon (foton) paketleridir; eşik frekansının altında, şiddet artsa da elektron kopmaz', true, 'Elektronu koparan şey frekanstır, intensity (şiddet) değil.'),
            s('Işığın şiddeti artınca eşik frekansı düşer', false, 'Threshold frequency (eşik frekansı) metale bağlıdır, şiddete bağlı değildir.'),
            s('Işık yalnızca klasik bir dalgadır', false, 'Klasik dalga resmi bu deneyi açıklayamaz.')
          ]
        }
      },
      s04: {
        kisa: 'Atom mikroskobu',
        rol: 'Hydrogen atom (hidrojen atomu) içindeki elektronun yalnızca belirli enerjilerde durabildiğini gösterir.',
        neden: 'Elektron bir apartmanda yalnızca belirli katlarda durabilir; çipin enerji bantları bu katlardan doğar.',
        bagliKavramlar: ['Bohr model (Bohr modeli)', 'Energy level (enerji seviyesi)', 'Atomic spectrum (atom spektrumu)', 'de Broglie wavelength (de Broglie dalga boyu)'],
        miniSoru: {
          soru: 'Atomun discrete spectrum (ayrık spektrumu) neyi gösterir?',
          secenekler: [
            s('Elektron yalnızca belirli energy levels (enerji seviyelerinde) bulunur; atlarken photon (foton) yayar', true, 'Bohr bu fikri 1913\'te ortaya koydu.'),
            s('Elektron her enerjiyi alabilir', false, 'Bu klasik beklentidir, spektrum çizgili olduğu için çürür.'),
            s('Çekirdek ışık yayar', false, 'Çizgiler elektron geçişlerinden gelir.')
          ]
        }
      },
      s05: {
        kisa: 'Dalga odası',
        rol: 'Elektronu dalga olarak ele alır; kuyuya hapsolunca enerjisi yalnızca belirli değerler alır.',
        neden: 'Gitar teli gibi: iki ucu tutulu tel belirli notaları çalar, kuyudaki elektron belirli enerjileri alır.',
        bagliKavramlar: ['Wave function (dalga fonksiyonu)', 'Schrödinger equation (Schrödinger denklemi)', 'Infinite well (sonsuz kuyu)', 'Boundary conditions (sınır koşulları)'],
        miniSoru: {
          soru: 'Infinite well (sonsuz kuyu) içinde energy quantization (enerji kuantalaşması) nereden gelir?',
          secenekler: [
            s('Boundary conditions (sınır koşulları) yalnızca belirli dalga boylarına izin verir', true, 'Enerjiyi elle eklemedik, sınır koşulu seçti.'),
            s('Schrödinger equation (Schrödinger denklemi) ölçümle çöker ve seviyeleri seçer', false, 'Denklem deterministiktir. Collapse (çökme) ölçüme aittir.'),
            s('Elektron kuyunun içinde durur ve enerjisi sıfırdır', false, 'Zero-point energy (sıfır noktası enerjisi) sıfırdan büyüktür.')
          ]
        }
      },
      s06: {
        kisa: 'Tünel istasyonu',
        rol: 'Elektron dalgasının ince bir bariyerin içine sızıp karşıya geçebildiğini gösterir.',
        neden: 'Elektron ince bir duvarı aşar gibi geçebilir; transistörde ve flash bellekte bu hem işe yarar hem sızıntı yapar.',
        bagliKavramlar: ['Tunneling (tünelleme)', 'Barrier (bariyer)', 'Reflection (yansıma)', 'Transmission (geçiş)'],
        miniSoru: {
          soru: 'Barrier (bariyer) kalınlaştıkça tunneling (tünelleme) olasılığına ne olur?',
          secenekler: [
            s('Üstel olarak azalır, çünkü ψ bariyerin içinde sönümlenir', true, 'Transmission (geçiş) kalınlıkla üstel düşer.'),
            s('Değişmez', false, 'Kalınlık sönümlenme mesafesini doğrudan etkiler.'),
            s('Artar, çünkü daha çok yüzey vardır', false, 'Kalınlık arttıkça geçiş zorlaşır.')
          ]
        }
      },
      s07: {
        kisa: 'Ölçüm lab.',
        rol: 'Bir ölçüm yapınca kuantum durumuna ne olduğunu ve hangi değerlerin çıkabileceğini öğretir.',
        neden: 'Kuantum dünyasında okumak durumu değiştirir; ölçümü doğru yorumlamazsan sonucu yanlış anlarsın.',
        bagliKavramlar: ['Measurement (ölçüm)', 'Eigenvalue (özdeğer)', 'Collapse (çökme)', 'Born rule (Born kuralı)'],
        miniSoru: {
          soru: 'Collapse (çökme) neden olur?',
          secenekler: [
            s('Measurement (ölçüm) sistemi ölçülen büyüklüğün eigenstate (özdurumuna) taşır', true, 'Schrödinger equation (Schrödinger denklemi) çökmez, çökme ölçüme aittir.'),
            s('Schrödinger equation (Schrödinger denklemi) bir an sonra kendiliğinden çöker', false, 'Denklem ölçümsüz evrimi belirlenimci biçimde verir.'),
            s('Wave function (dalga fonksiyonu) zamanla yok olur', false, 'Yok olmaz, ölçümle değişir.')
          ]
        }
      },
      s08: {
        kisa: 'Kalibrasyon',
        rol: 'Konum ile momentum (momentum) aynı anda keskin bilinemez; aralarında bir sınır vardır.',
        neden: 'Elektronu ne kadar dar sıkıştırırsan o kadar hızlı kıpırdar; bu, çip küçülmesinin sınırlarından biridir.',
        bagliKavramlar: ['Uncertainty principle (belirsizlik ilkesi)', 'Conjugate variables (eşlenik değişkenler)', 'Zero-point energy (sıfır noktası enerjisi)'],
        miniSoru: {
          soru: 'Uncertainty principle (belirsizlik ilkesi) neden bir ölçüm aleti hatası değildir?',
          secenekler: [
            s('Dalga doğasından gelir; conjugate variables (eşlenik değişkenler) aynı anda keskin olamaz', true, 'Daha iyi alet bu sınırı kaldırmaz.'),
            s('Aletler yeterince hassas değildir', false, 'Sınır, ideal aletle bile geçerlidir.'),
            s('Yalnızca makroskopik cisimlerde görülür', false, 'Etki makroskopik cisimlerde sadece çok küçüktür.')
          ]
        }
      },
      s09: {
        kisa: 'Bant testi',
        rol: 'Çok atom yan yana gelince enerji seviyeleri bantlara dönüşür; aralarında bandgap (yasak enerji aralığı) kalır.',
        neden: 'Malzemenin metal, semiconductor (yarıiletken) ya da insulator (yalıtkan) olması bant yapısına bağlıdır.',
        bagliKavramlar: ['Energy band (enerji bandı)', 'Bandgap (yasak enerji aralığı)', 'Valence band (valans bandı)', 'Conduction band (iletim bandı)'],
        miniSoru: {
          soru: 'Bir kristalde energy bands (enerji bantları) neden oluşur?',
          secenekler: [
            s('Atom seviyeleri Pauli exclusion principle (Pauli dışlama ilkesi) yüzünden yarılır ve banda dönüşür', true, 'Yarılan seviyeler pratikte sürekli bir bant gibi görünür.'),
            s('Elektronlar atomlardan tamamen ayrılır', false, 'Elektronlar kristale aittir ama bantlar seviyelerin yarılmasından gelir.'),
            s('Kristal sıcaklığı bandı yaratır', false, 'Bant yapısı periyodik yapıdan gelir, sıcaklıktan değil.')
          ]
        }
      },
      s10: {
        kisa: 'Paketleme',
        rol: 'Bantlardaki carrier (taşıyıcı) elektrik alanıyla nasıl akıma dönüşür, onu gösterir.',
        neden: 'Nehre eğim verince su akar; elektrik alanı verince taşıyıcılar akar ve çip çalışır.',
        bagliKavramlar: ['Carrier (taşıyıcı)', 'Fermi level (Fermi seviyesi)', 'Drift velocity (sürüklenme hızı)', 'Fermi-Dirac distribution (Fermi-Dirac dağılımı)'],
        miniSoru: {
          soru: 'Fermi level (Fermi seviyesi) neyi belirtir?',
          secenekler: [
            s('Seviyenin dolu olma olasılığının 1/2 olduğu enerjiyi', true, 'Fermi-Dirac distribution (Fermi-Dirac dağılımı) bu enerjide 1/2 verir.'),
            s('Elektronların hep dolu olduğu en üst bandı', false, 'Bu valence band (valans bandı) olur, Fermi seviyesi değildir.'),
            s('Elektronların sürüklenme hızını', false, 'Drift velocity (sürüklenme hızı) ayrı bir kavramdır.')
          ]
        }
      }
    }
  };
})();
