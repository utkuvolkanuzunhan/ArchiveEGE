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
        rol: 'Ham kumdan çıkan silicon (silisyum) eriyiğini Czochralski yöntemiyle tek bir single crystal (tek kristal) külçeye çevirir.',
        neden: 'Çip, atomları kusursuz dizilmiş tek kristal ister. Grain boundary (tane sınırı) taşıyıcıları saçar ve aygıtı bozar.',
        bagliKavramlar: ['Amorphous (amorf) / polycrystalline (çok kristalli) / single crystal (tek kristal)', 'Grain boundary (tane sınırı)', 'Czochralski growth (Czochralski büyütme) ve seed (tohum)'],
        miniSoru: {
          soru: 'Fırında neden single crystal (tek kristal) silicon (silisyum) üretiyoruz?',
          secenekler: [
            s('Çünkü tek kristalde grain boundary (tane sınırı) yoktur ve periyodik düzen tüm parçada sürer', true, 'Düzen bozulmadığı için elektronlar öngörülebilir davranır.'),
            s('Çünkü amorphous (amorf) silicon (silisyum) daha pahalıdır', false, 'Neden fiyat değil, long-range order (uzun menzilli düzen) gereksinimidir.'),
            s('Çünkü tek kristal ışık yaymaz', false, 'Seçim, ışıkla değil kristal düzeniyle ilgilidir.')
          ]
        }
      },
      s02: {
        kisa: 'Kesim testeresi',
        rol: 'Külçeyi belirli bir crystal plane (kristal düzlemi) boyunca dilimleyip wafer (dilim) üretir. Düzlem Miller indices (Miller indisleri) ile adlandırılır.',
        neden: 'Yüzeyin atom dizilimi düzleme göre değişir. Aynı malzeme (100) ve (111) dilimlerinde farklı davranır, o yüzden doğru düzlemi seçmek gerekir.',
        bagliKavramlar: ['Lattice (kafes) ve unit cell (birim hücre)', 'Miller indices (Miller indisleri) ve reciprocal (ters) alma', 'Atoms per unit cell (birim hücredeki atom sayısı)'],
        miniSoru: {
          soru: 'Wafer (dilim) neden rastgele değil, belirli bir crystal plane (kristal düzlemi) boyunca kesilir?',
          secenekler: [
            s('Çünkü yüzeydeki atom dizilimi ve yoğunluğu düzleme bağlıdır, aygıt özellikleri de buna bağlıdır', true, 'Düzlem, Miller indices (Miller indisleri) ile belirlenir.'),
            s('Çünkü her düzlemde atom sayısı aynıdır', false, 'Planar density (düzlemsel yoğunluk) düzleme göre değişir.'),
            s('Çünkü Miller indices (Miller indisleri) wafer (dilim) kalınlığını belirler', false, 'Miller indices (Miller indisleri) yönelimi verir, kalınlığı vermez.')
          ]
        }
      },
      s03: {
        kisa: 'Işık-test odası',
        rol: 'Klasik fiziğin neden yetmediğini gösterir: blackbody (kara cisim) ışıması ve photoelectric effect (fotoelektrik olay) ışığın energy quanta (enerji paketleri) halinde olduğunu kanıtlar.',
        neden: 'Çipin içi klasik fizikle açıklanamaz. Foton paketleri fikri, elektronun enerjisinin de ayrık olduğu kuantum dünyasına giriş kapısıdır.',
        bagliKavramlar: ['Blackbody radiation (kara cisim ışıması) ve ultraviolet catastrophe (mor ötesi felaket)', 'Photon (foton) ve E = hν', 'Photoelectric effect (fotoelektrik olay) ve threshold frequency (eşik frekansı)'],
        miniSoru: {
          soru: 'Photoelectric effect (fotoelektrik olay) deneyi ışığı hakkında neyi gösterir?',
          secenekler: [
            s('Işık enerjisi photon (foton) paketleri halindedir, eşik frekansının altında yoğunluk artsa da elektron kopmaz', true, 'Elektronu koparan şey frekanstır, intensity (şiddet) değil.'),
            s('Işığın şiddeti artınca eşik frekansı düşer', false, 'Threshold frequency (eşik frekansı) metale bağlıdır, şiddete bağlı değildir.'),
            s('Işık yalnızca klasik bir dalgadır', false, 'Klasik dalga resmi bu deneyi açıklayamaz.')
          ]
        }
      },
      s04: {
        kisa: 'Atom mikroskobu',
        rol: 'Hydrogen atom (hidrojen atomu) kararlılığını ve discrete energy levels (ayrık enerji seviyelerini) inceler. Matter wave (madde dalgası) fikri burada gelir.',
        neden: 'Çipteki elektronlar atomlara bağlıdır. Seviyelerin ayrık olması, sonraki bölümlerde kuyu ve bantların temelini kurar.',
        bagliKavramlar: ['Bohr model (Bohr modeli) ve quantized energy levels (kuantalı enerji seviyeleri)', 'Atomic spectrum (atom spektrumu)', 'de Broglie wavelength (de Broglie dalga boyu)', 'Zero-point energy (sıfır noktası enerjisi)'],
        miniSoru: {
          soru: 'Atomun discrete spectrum (ayrık spektrumu) neyi gösterir?',
          secenekler: [
            s('Elektron yalnızca belirli energy levels (enerji seviyelerinde) bulunabilir, atlarken ayrık enerjili photon (foton) yayar', true, 'Bohr bu fikri 1913\'te ortaya koydu.'),
            s('Elektron her enerjiyi alabilir', false, 'Bu klasik beklentidir, spektrum çizgili olduğu için çürür.'),
            s('Çekirdek ışık yayar', false, 'Çizgiler elektron geçişlerinden gelir.')
          ]
        }
      },
      s05: {
        kisa: 'Dalga odası',
        rol: 'Schrödinger equation (Schrödinger denklemi) ile wave function (dalga fonksiyonu) ψ\'yi bulur. Infinite well (sonsuz kuyu) örneğinde energy quantization (enerji kuantalaşması) kendiliğinden çıkar.',
        neden: 'Çipteki elektron bir dalgadır. Kuyu modeli, kristal içindeki elektronu anlamanın en sade örneğidir.',
        bagliKavramlar: ['Wave function (dalga fonksiyonu) ψ ve probability density (olasılık yoğunluğu) |ψ|²', 'Boundary conditions (sınır koşulları) ve quantization (kuantalaşma)', 'Zero-point energy (sıfır noktası enerjisi)', 'Schrödinger equation (Schrödinger denklemi) ve collapse (çökme) farkı'],
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
        rol: 'Step potential (basamak potansiyeli) ve barrier (bariyer) karşısında wave function (dalga fonksiyonu) yansır, geçer ve tunneling (tünelleme) ile bariyerin içine sızar.',
        neden: 'Transistör kapılarında ve flash bellekte elektronlar ince bariyerlerden tünelleyerek geçer. Hem hizmet eder hem sızıntı yapar.',
        bagliKavramlar: ['Reflection (yansıma) ve transmission (geçirme)', 'Evanescent wave (sönümlenen dalga)', 'Tunneling (tünelleme) ve barrier width (bariyer kalınlığı)', 'Continuity of ψ (ψ\'nin sürekliliği)'],
        miniSoru: {
          soru: 'Barrier (bariyer) kalınlaştıkça tunneling (tünelleme) olasılığına ne olur?',
          secenekler: [
            s('Üstel olarak azalır, çünkü ψ bariyerin içinde sönümlenir', true, 'Transmission (geçirme) kalınlıkla üstel düşer.'),
            s('Değişmez', false, 'Kalınlık sönümlenme mesafesini doğrudan etkiler.'),
            s('Artar, çünkü daha çok yüzey vardır', false, 'Kalınlık arttıkça geçiş zorlaşır.')
          ]
        }
      },
      s07: {
        kisa: 'Ölçüm lab.',
        rol: 'Quantum mechanics\'in postulates (postülatlarını) ve measurement (ölçümü) işler. Ölçüm sonucu eigenvalue (özdeğer) olur ve state collapse (hâl çökmesi) yaşanır.',
        neden: 'Çipin okuma ve yazma işlemleri ölçümdür. Ölçümün durumu nasıl değiştirdiğini bilmeden sonuçlar yanlış okunur.',
        bagliKavramlar: ['Postulates (postülatlar) ve operator (işlemci)', 'Eigenvalue (özdeğer) ve eigenstate (özdurum)', 'Measurement collapse (ölçümle çökme)', 'Born rule (Born kuralı) ve probability (olasılık)'],
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
        rol: 'Uncertainty principle (belirsizlik ilkesi) ile conjugate variables (eşlenik değişkenler) arasındaki sınırı gösterir. Konum ne kadar bilinirse momentum o kadar belirsizleşir.',
        neden: 'Çipin küçülmesinin sınırı budur. Elektronu çok dar bir bölgeye hapsetmek momentumunu ve enerjisini büyütür.',
        bagliKavramlar: ['Uncertainty principle (belirsizlik ilkesi) Δx Δp ≥ ħ/2', 'Conjugate variables (eşlenik değişkenler)', 'Zero-point energy (sıfır noktası enerjisi)', 'Wave packet (dalga paketi)'],
        miniSoru: {
          soru: 'Uncertainty principle (belirsizlik ilkesi) neden bir ölçüm aleti hatası değildir?',
          secenekler: [
            s('Çünkü dalga doğasından gelir, conjugate variables (eşlenik değişkenler) aynı anda keskin olamaz', true, 'Daha iyi alet bu sınırı kaldırmaz.'),
            s('Çünkü aletler yeterince hassas değildir', false, 'Sınır, ideal aletle bile geçerlidir.'),
            s('Çünkü yalnızca makroskopik cisimlerde görülür', false, 'Etki makroskopik cisimlerde sadece çok küçüktür.')
          ]
        }
      },
      s09: {
        kisa: 'Bant testi',
        rol: 'Periodic structure (periyodik yapı) içinde atom seviyelerinin yarılıp energy bands (enerji bantlarına) dönüşmesini ve band gap (bant aralığını) gösterir.',
        neden: 'Bir malzemenin metal, semiconductor (yarıiletken) ya da insulator (yalıtkan) olması bant yapısına bağlıdır. Çipin tüm çalışma ilkesi buradadır.',
        bagliKavramlar: ['Energy bands (enerji bantları) ve band gap (bant aralığı)', 'Pauli exclusion principle (Pauli dışlama ilkesi)', 'Valence band (değerlik bandı) ve conduction band (iletim bandı)', 'Metal (metal) / semiconductor (yarıiletken) / insulator (yalıtkan)'],
        miniSoru: {
          soru: 'Bir kristalde energy bands (enerji bantları) neden oluşur?',
          secenekler: [
            s('Çok sayıda atomun seviyeleri birbirine yaklaşır, Pauli exclusion principle (Pauli dışlama ilkesi) yüzünden yarılıp banda dönüşür', true, 'Yarılan seviyeler pratikte sürekli bir bant gibi görünür.'),
            s('Elektronlar atomlardan tamamen ayrılır', false, 'Elektronlar kristale aittir ama bantlar seviyelerin yarılmasından gelir.'),
            s('Kristal sıcaklığı bandı yaratır', false, 'Bant yapısı periyodik yapıdan gelir, sıcaklıktan değil.')
          ]
        }
      },
      s10: {
        kisa: 'Paketleme',
        rol: 'Carriers (taşıyıcılar), Fermi level (Fermi seviyesi) ve drift (sürüklenme) ile bantların çipte akıma nasıl dönüştüğünü gösterir.',
        neden: 'Bant yapısı elektrik alanıyla birleşince akım oluşur. Çipin sonunda "çalışıyor" demek bu akım demektir.',
        bagliKavramlar: ['Fermi level (Fermi seviyesi) ve Fermi-Dirac distribution (Fermi-Dirac dağılımı)', 'n-type / p-type carriers (n / p tipi taşıyıcılar)', 'Drift velocity (sürüklenme hızı)'],
        miniSoru: {
          soru: 'Fermi level (Fermi seviyesi) neyi belirtir?',
          secenekler: [
            s('Seviyenin dolu olma olasılığının 1/2 olduğu enerjiyi', true, 'Fermi-Dirac distribution (Fermi-Dirac dağılımı) bu enerjide 1/2 verir.'),
            s('Elektronların hep dolu olduğu en üst bandı', false, 'Bu valence band (değerlik bandı) olur, Fermi seviyesi değildir.'),
            s('Elektronların sürüklenme hızını', false, 'Drift velocity (sürüklenme hızı) ayrı bir kavramdır.')
          ]
        }
      }
    }
  };
})();
