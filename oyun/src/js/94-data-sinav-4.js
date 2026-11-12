/* 94-data-sinav-4.js (A14) Mock exam verisi: s10 (Fermi level, carriers, drift) + SEÇKİ işaretleri. TAMAMEN İngilizce.
 * 93'ten sonra yüklenir (alfabetik). 90-data-s10.js ile tutarlı. Seçki = tahmin: bkz. oyun/denetim/SECKI.md */
(function(){
  'use strict';
  var S = Q.data.sinav = Q.data.sinav || { mcq: [], klasik: [] };
  var n = 1;
  function M(id, st, q, c, w, ex){
    var pos = n++ % 4, opts = w.slice(); opts.splice(pos, 0, c);
    S.mcq.push({ id: id, station: st, q: q, options: opts, answer: pos, explanation: ex });
  }
  function K(id, st, concept, question, modelAnswer, keyPoints){
    S.klasik.push({ id: id, station: st, question: question, modelAnswer: modelAnswer, keyPoints: keyPoints, concept: concept });
  }

  /* ---- s10 Fermi level, carriers, drift ---- */
  M('sv-s10-m1', 's10', 'In the Fermi-Dirac distribution f(E) = 1/(1 + e^((E − E_F)/kT)), what is the value of f at E = E_F for any temperature T > 0?', '1/2', ['1', '0', '1/e'], 'At E = E_F the exponent is zero, so f = 1/(1 + 1) = 1/2. The Fermi level is the energy at which the occupation probability is one half.');
  M('sv-s10-m2', 's10', 'How does the Fermi function f(E) look at T = 0 K?', 'A step function: f = 1 for E < E_F and f = 0 for E > E_F', ['f = 1/2 for all energies', 'f = 1 for all energies', 'A smooth curve that decreases slowly over several eV'], 'At T = 0 K the exponent goes to −∞ below E_F and +∞ above it, so all states below E_F are filled and all states above are empty.');
  M('sv-s10-m3', 's10', 'The temperature of a material is raised. What happens to the Fermi function f(E) around E_F?', 'The transition region broadens, so some electrons occupy states above E_F', ['The curve becomes a sharper step', 'f(E_F) increases above 1/2', 'The Fermi level moves to zero energy'], 'The width of the transition region is of the order of kT. A larger kT smooths the curve, but f(E_F) stays 1/2.');
  M('sv-s10-m4', 's10', 'In thermal equilibrium np = nᵢ². A semiconductor is doped so that the electron density n increases. What happens to the hole density p?', 'p decreases, so that the product np stays equal to nᵢ²', ['p increases by the same factor as n', 'p stays unchanged', 'p becomes equal to n'], 'Extra electrons recombine with holes. The mass-action law keeps the product np fixed at nᵢ² at a given temperature, so p = nᵢ²/n falls.');
  M('sv-s10-m5', 's10', 'The drift velocity of a carrier in an electric field E is v_d = μE. If the field is doubled, the drift velocity:', 'doubles, because v_d is proportional to E', ['stays the same', 'is halved', 'increases by a factor of four'], 'The mobility μ is the proportionality constant between drift velocity and field (at low to moderate fields), so doubling E doubles v_d.');
  M('sv-s10-m6', 's10', 'Why does the carrier velocity not increase without limit under a constant electric field?', 'Scattering by lattice vibrations and impurities limits the average velocity to v_d = μE', ['The electric field becomes zero after some time', 'The carrier mass becomes infinite', 'The Pauli exclusion principle forbids motion'], 'The field accelerates the carrier, but frequent collisions randomize its motion. A balance between acceleration and scattering gives a constant average drift velocity.');
  M('sv-s10-m7', 's10', 'The current density in a semiconductor is J = q(nμₙ + pμₚ)E. Which statement is correct?', 'Both electrons and holes contribute, and their contributions add', ['Only electrons contribute to the current', 'Electron and hole currents cancel each other', 'J does not depend on the field E'], 'Electrons and holes drift in opposite directions, but because they have opposite charge their currents point the same way and add.');
  M('sv-s10-m8', 's10', 'A pure (intrinsic) semiconductor is heated. What happens to the carrier density nᵢ?', 'It increases, because thermal energy excites more electrons across the bandgap', ['It decreases, because the bandgap widens', 'It stays constant because it depends only on the lattice', 'It becomes zero'], 'Thermal excitation across the gap grows rapidly with T (roughly e^(−Eg/2kT)), so nᵢ and therefore the conductivity increase.');
  K('sv-s10-k1', 's10', 'Fermi-Dirac distribution', 'State the Fermi-Dirac distribution. Explain the meaning of the Fermi level E_F and describe how f(E) changes with temperature.',
    'The Fermi-Dirac distribution f(E) = 1/(1 + e^((E − E_F)/kT)) gives the probability that an electron state of energy E is occupied. The Fermi level E_F is the energy at which this probability is exactly 1/2, so f(E_F) = 1/2 at every temperature T > 0. At T = 0 K the function is a step: all states below E_F are filled and all states above it are empty. When the temperature rises, the transition region around E_F broadens over a width of the order of kT, so a few states above E_F become occupied and a few states below become empty, but f(E_F) stays 1/2.',
    ['f(E) = 1/(1 + e^((E − E_F)/kT)) is occupation probability', 'f(E_F) = 1/2', 'T = 0 K: step function', 'Higher T: transition region broadens (width ~ kT)']);
  K('sv-s10-k2', 's10', 'carrier densities', 'What does the relation np = nᵢ² state? What happens to the electron and hole densities when a semiconductor is doped with donors?',
    'In thermal equilibrium the product of the electron density n and the hole density p equals the square of the intrinsic carrier density nᵢ, which depends on the material and on temperature but not on doping. In an intrinsic semiconductor n = p = nᵢ. If donors are added, the electron density n increases to about the donor density. The extra electrons fill (recombine with) holes, so p decreases to p = nᵢ²/n while the product np stays equal to nᵢ². The semiconductor becomes n-type, with electrons as majority carriers and holes as minority carriers.',
    ['np = nᵢ² in equilibrium', 'nᵢ depends on material and T, not on doping', 'Donors raise n, p falls to nᵢ²/n', 'Majority and minority carriers']);
  K('sv-s10-k3', 's10', 'drift current', 'Define the drift velocity and the mobility, and derive the expression for the current density J in a semiconductor with electron density n and hole density p. Why does the drift velocity saturate at a constant value in a constant field?',
    'When an electric field E is applied, carriers acquire an average drift velocity v_d = μE, where the mobility μ is the proportionality constant. Electrons have mobility μₙ and holes μₚ. The current density is the charge density times the velocity: the electron contribution is q n μₙ E and the hole contribution is q p μₚ E, so J = q(nμₙ + pμₚ)E. The two terms add because electrons and holes move in opposite directions but have opposite charge. The velocity does not grow without limit because the field accelerates the carrier only until it scatters from lattice vibrations or impurities; acceleration and scattering balance, which gives a constant average velocity.',
    ['v_d = μE; μ is the mobility', 'J = q n μₙ E + q p μₚ E', 'Electron and hole currents add', 'Scattering balances acceleration: constant v_d']);

  /* ---- SEÇKİ: s10 payı 2 MCQ + 1 klasik (TAHMİN; 93'teki listeden 2 MCQ + 1 klasik çıkarıldı, bkz. SECKI.md) ---- */
  function isaretle(dizi, idler){
    var map = {}; dizi.forEach(function(x){ map[x.id] = x; });
    idler.forEach(function(id){ if (map[id]) map[id].secki = true; });
  }
  isaretle(S.mcq, ['sv-s10-m1', 'sv-s10-m4']);
  isaretle(S.klasik, ['sv-s10-k3']);
})();
