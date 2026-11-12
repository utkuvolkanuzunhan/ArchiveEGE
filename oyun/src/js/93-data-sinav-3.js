/* 93-data-sinav-3.js (A13) Mock exam verisi: s09 (Band test) + s01-s04/s07 ek sorular + SEÇKİ işaretleri. TAMAMEN İngilizce.
 * 91/92 dosyalarından sonra yüklenir (alfabetik). Seçki = tahmin: bkz. oyun/denetim/SECKI.md */
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

  /* ---- s01 ek ---- */
  M('sv-s01-m9', 's01', 'Which statement distinguishes a single crystal from a polycrystalline solid?', 'A single crystal has long-range order throughout; a polycrystal consists of many small crystal grains separated by grain boundaries', ['A single crystal has no periodic arrangement; a polycrystal is perfectly periodic', 'A single crystal contains only one atom; a polycrystal contains many atoms', 'A single crystal has short-range order only; a polycrystal has no order at all'], 'In a single crystal the same lattice continues over the whole sample. A polycrystal is a patchwork of small crystallites with different orientations; the grain boundaries scatter carriers.');
  M('sv-s01-m10', 's01', 'GaAs crystallises in the zincblende structure. How does it compare with the diamond structure?', 'It has the same FCC-based arrangement, but the two atoms of the basis are different (Ga and As)', ['It is a BCC lattice with a one-atom basis', 'It is a simple cubic lattice of Ga atoms only', 'It has a coordination number of 8 instead of 4'], 'Zincblende is the diamond arrangement with two different atoms on the two interpenetrating FCC sublattices. Each atom still has 4 nearest neighbours.');
  K('sv-s01-k4', 's01', 'crystalline solids in industry', 'Explain why crystalline solids are used in the semiconductor industry, and why polycrystalline or amorphous solids are less suitable.',
    'In a crystal the periodic arrangement of atoms creates a periodic potential, which gives well-defined energy bands and a well-defined bandgap. Electrical properties therefore can be predicted, reproduced and controlled by doping. In polycrystalline solids, grain boundaries scatter or trap carriers; in amorphous solids, dangling bonds and missing long-range order smear the band edges and add defect states. Carrier mobility and lifetime drop and device properties vary from sample to sample, so reproducible devices are difficult.',
    ['Periodic potential gives well-defined bands and bandgap', 'Predictable, reproducible properties; control by doping', 'Grain boundaries scatter or trap carriers', 'Amorphous: dangling bonds, no long-range order']);

  /* ---- s02 ek ---- */
  M('sv-s02-m9', 's02', 'What does the notation {100} denote in a cubic crystal?', 'The family of planes equivalent by cubic symmetry: (100), (010), (001) and their negatives', ['A single plane parallel to the x axis', 'The direction normal to the (100) plane', 'A family of directions equivalent to [100]'], 'Curly braces {hkl} mean the set of all planes related by the crystal symmetry. Round brackets denote one plane, square brackets one direction and angle brackets a family of directions.');
  M('sv-s02-m10', 's02', 'A plane cuts the x axis at a, the y axis at −a and is parallel to the z axis. Determine its Miller indices.', '(1 1̄ 0)', ['(1 1 0)', '(1̄ 1̄ 0)', '(1 1̄ 1)'], 'Intercepts: 1, −1, ∞. Reciprocals: 1, −1, 0. The negative index is written with a bar: (1 1̄ 0).');
  K('sv-s02-k4', 's02', 'single crystal growth', 'Explain the main reason for growing a single-crystal silicon ingot by the Czochralski method instead of using polycrystalline silicon.',
    'In the Czochralski method a seed crystal is dipped into molten silicon and slowly pulled up while rotating, so the melt solidifies with the same crystal order as the seed. The result is one continuous lattice without grain boundaries. Grain boundaries scatter carriers and act as recombination centres, which lowers mobility and carrier lifetime and makes the properties differ from one device to another. A single crystal guarantees the same well-defined band structure over the whole wafer, so devices are uniform and reproducible.',
    ['Seed crystal dipped in melt, pulled while rotating', 'Seed continues its crystal order: no grain boundaries', 'Grain boundaries lower mobility and lifetime', 'Uniform, reproducible band structure over the wafer']);

  /* ---- s03 / s04 ek ---- */
  K('sv-s03-k4', 's03', 'why quantum mechanics', 'Explain why quantum mechanics was needed. Describe three failures of classical physics and the successes of quantum theory that resolved them.',
    'Classical physics failed in several experiments. Blackbody radiation: the Rayleigh-Jeans law predicts infinite energy at high frequency (ultraviolet catastrophe), while Planck\'s hypothesis E = hf removes it. Photoelectric effect: classical waves predict that intensity controls electron energy and that no threshold exists, but experiments show a threshold frequency and K_max = hf − φ, explained by Einstein\'s photons. Atomic spectra: classical theory predicts a continuous spectrum and a collapsing atom, while atoms show discrete lines explained by quantised energy levels. Quantum theory also explains the stability of atoms, the periodic table and the electrical properties of solids.',
    ['Blackbody: ultraviolet catastrophe, Planck E = hf', 'Photoelectric: threshold frequency, photons', 'Discrete atomic spectra and atomic stability', 'Quantum theory explains atoms and solids']);
  K('sv-s04-k4', 's04', 'hydrogen atom stability', 'Explain why the hydrogen atom is stable according to quantum mechanics, while classical physics predicts that the electron would spiral into the nucleus.',
    'Classically, an orbiting electron accelerates and should radiate electromagnetic energy, so it would lose energy and fall into the nucleus within about 10^-11 s. In quantum mechanics the electron is a confined wave. Confining it to a smaller region increases its momentum spread and therefore its kinetic energy (uncertainty principle, E ~ ħ²/2mr²), while the Coulomb attraction lowers the potential energy as r decreases. The total energy has a minimum at a finite radius, the Bohr radius, so the lowest state has a non-zero size and energy −13.6 eV. There is no lower state to fall into, so the atom is stable.',
    ['Classical: accelerating charge radiates and collapses', 'Electron is a confined wave', 'Confinement raises kinetic energy (uncertainty)', 'Energy minimum at finite radius: no lower state']);

  /* ---- s07 ek ---- */
  K('sv-s07-k5', 's07', 'postulates of quantum mechanics', 'State the main principles (postulates) of quantum mechanics.',
    '(1) The state of a system is described by a wave function ψ, and |ψ|² is the probability density. (2) Every measurable quantity (observable) is represented by a Hermitian operator. (3) A measurement can only give one of the eigenvalues of the operator. (4) If ψ = Σ cₙφₙ, where φₙ are eigenfunctions, the probability of obtaining the eigenvalue aₙ is |cₙ|², and after the measurement the state becomes φₙ. (5) Between measurements the wave function evolves in time according to the Schrödinger equation.',
    ['State described by ψ, |ψ|² probability density', 'Observables are Hermitian operators', 'Results are eigenvalues; probability |cₙ|²', 'Time evolution by Schrödinger equation']);
  K('sv-s07-k6', 's07', 'measurement of a non-eigenstate', 'A system is not in an eigenstate of the observable being measured. According to the postulates of quantum mechanics, what happens when the measurement is made? What happens if the measurement is repeated immediately?',
    'If the system is not in an eigenstate, it is in a superposition ψ = Σ cₙφₙ of eigenstates of the operator. The measurement gives one of the eigenvalues aₙ, and the outcome cannot be predicted: the probability of aₙ is |cₙ|². Immediately after the measurement the wave function collapses to the corresponding eigenstate φₙ. If the measurement is repeated immediately, it gives the same eigenvalue with probability 1. The collapse is caused by the measurement, not by the Schrödinger equation, which evolves the wave function smoothly and deterministically between measurements.',
    ['Superposition of eigenstates ψ = Σ cₙφₙ', 'Result is one eigenvalue with probability |cₙ|²', 'Collapse to the eigenstate φₙ', 'Repeated measurement gives the same result']);

  /* ---- s09 Band test ---- */
  M('sv-s09-m1', 's09', 'N identical atoms are brought close together to form a crystal. What happens to each atomic energy level?', 'It splits into N closely spaced levels that form an energy band', ['It stays as a single level', 'It splits into exactly two levels', 'It disappears because electrons become free'], 'The wave functions of neighbouring atoms overlap. Because the Pauli exclusion principle forbids identical states, each level splits into N slightly different levels; for N ~ 10^22 they form a quasi-continuous band.');
  M('sv-s09-m2', 's09', 'Why does an insulator not conduct current?', 'Its valence band is full and the bandgap is large, so electrons cannot reach empty states', ['It contains no electrons', 'Its conduction band is half filled', 'Its atoms are too heavy to move'], 'A full band offers no empty states for electrons to move into, and the large gap prevents thermal excitation to the next band. A half-filled band would be a metal.');
  M('sv-s09-m3', 's09', 'Which band picture describes a metal?', 'A partially filled band, so electrons can move into nearby empty states', ['A completely full valence band separated by a large gap', 'A completely empty valence band', 'Two full bands with no gap between them'], 'In a metal the highest occupied band is only partly filled (or overlaps another band), so a small field can shift electrons into empty states.');
  M('sv-s09-m4', 's09', 'According to the Pauli exclusion principle, how many electrons can occupy one energy level (including spin)?', '2', ['1', '4', 'Any number'], 'No two electrons can share the same set of quantum numbers. A level holds two electrons of opposite spin.');
  M('sv-s09-m5', 's09', 'The bandgap is best defined as:', 'The range of energies between the top of the valence band and the bottom of the conduction band where no allowed states exist', ['The spacing between two neighbouring levels inside one band', 'The width of the valence band', 'The energy needed to ionise a single atom'], 'Inside the bandgap there are no allowed electron states in a perfect crystal.');
  M('sv-s09-m6', 's09', 'A crystal contains N atoms, each contributing one s level. Including spin, how many electron states does the resulting s band hold?', '2N', ['N', 'N/2', '4N'], 'N atoms give N orbital levels in the band, and each holds two electrons of opposite spin, so 2N states.');
  M('sv-s09-m7', 's09', 'What mainly distinguishes a semiconductor from an insulator?', 'A smaller bandgap, so thermal energy can excite some electrons into the conduction band', ['A half-filled valence band', 'A larger number of atoms per unit volume', 'The absence of a periodic lattice'], 'Silicon has Eg ≈ 1.1 eV, so a few carriers are excited at room temperature; in a wide-gap insulator almost none are.');
  M('sv-s09-m8', 's09', 'Why do energy bands form in a crystal, but not in a single isolated infinite well?', 'Bands need many coupled atoms (a periodic potential); a single well has only discrete levels', ['A single well has no boundary conditions', 'A single well has too much energy', 'Bands form only at high temperature'], 'An isolated well gives discrete levels from its boundary conditions. Coupling many wells splits each level into N levels, forming a band.');
  M('sv-s09-m9', 's09', 'When the atoms in a crystal are moved closer together, the width of an energy band:', 'increases, because the overlap of neighbouring wave functions increases', ['decreases, because the levels merge into one', 'stays the same', 'becomes zero'], 'Stronger overlap means stronger splitting, so the band is wider. When atoms are far apart the levels return to the sharp atomic levels.');
  M('sv-s09-m10', 's09', 'Why can a completely filled band not carry a net current?', 'There are no empty states available, so an electric field cannot change the electron distribution', ['Filled bands contain no electrons', 'Electrons in a full band are not charged', 'The Pauli principle forces all electrons to have zero velocity'], 'Every state is occupied, so an applied field cannot shift electrons to new states; for every electron with velocity v there is one with −v.');
  K('sv-s09-k1', 's09', 'energy bands', 'Explain why the allowed energies of electrons in a periodic structure (a crystal) form bands.',
    'An isolated atom has discrete energy levels. When N atoms are brought together, the electron wave functions overlap and the atoms interact. The Pauli exclusion principle forbids two electrons from having the same state, so each atomic level must split into N slightly different levels. For N ~ 10^22 the spacing between these levels is far below kT, so they form an almost continuous energy band. Between the bands there are energies with no allowed states: the bandgap. The periodic potential of the lattice (Bloch theorem) produces the same allowed and forbidden energy regions.',
    ['Isolated atom: discrete levels', 'Overlap + Pauli: each level splits into N levels', 'N ~ 10^22: quasi-continuous band', 'Forbidden region between bands: bandgap']);
  K('sv-s09-k2', 's09', 'metal insulator semiconductor', 'Compare metals, insulators and semiconductors using their band structure.',
    'In a metal the highest occupied band is partly filled (or overlaps the next band), so electrons can easily move into nearby empty states and conduct. In an insulator the valence band is completely full and the bandgap to the empty conduction band is large (several eV), so electrons cannot be excited and no current flows. A semiconductor has the same band filling as an insulator at 0 K, but the bandgap is small (about 1 eV), so thermal energy excites some electrons into the conduction band and leaves holes, and doping can control the carrier density. The difference is therefore band filling and bandgap size, not the number of atoms.',
    ['Metal: partly filled band', 'Insulator: full valence band, large gap', 'Semiconductor: small gap, thermal excitation', 'Difference is filling and gap size']);
  K('sv-s09-k3', 's09', 'Pauli and filled bands', 'State the Pauli exclusion principle and use it to explain why a completely filled band carries no current.',
    'The Pauli exclusion principle says that no two electrons can occupy the same quantum state; an energy level can hold at most two electrons, with opposite spin. In a completely filled band all states are occupied. An applied electric field would have to move electrons into slightly different states, but there are no empty states available, so the distribution of electrons does not change. For every electron moving with velocity v there is another moving with −v, so the net current is zero. Only a partly filled band, or electrons excited across the gap, can conduct.',
    ['No two electrons in the same state', 'At most two electrons per level (spin)', 'Full band: no empty states to move into', 'Net current zero; partly filled band conducts']);
  K('sv-s09-k4', 's09', 'level spacing in a band', 'Estimate the level spacing inside an energy band of width 5 eV formed from 5 × 10^22 atoms, and compare it with kT at 300 K (kT ≈ 0.026 eV). What does this show?',
    'The band contains about N = 5 × 10^22 levels spread over 5 eV, so the average spacing is ΔE ≈ 5 eV / (5 × 10^22) = 1 × 10^-22 eV. This is about 10^20 times smaller than kT ≈ 0.026 eV at 300 K. Thermal energy can therefore move an electron between neighbouring levels with no noticeable cost, and the levels behave as a continuum. This is why a macroscopic crystal is described by continuous bands rather than by individual levels.',
    ['Spacing = band width / N', 'ΔE ≈ 10^-22 eV', 'Much smaller than kT = 0.026 eV', 'Levels act as a continuum']);

  /* ---- SEÇKİ: çıkma olasılığı en yüksek 50 MCQ + 20 klasik (TAHMİN, bkz. SECKI.md) ---- */
  var SECKI_MCQ = [
    'sv-s01-m1','sv-s01-m2','sv-s01-m3','sv-s01-m4','sv-s01-m5','sv-s01-m6','sv-s01-m7','sv-s01-m8','sv-s01-m9','sv-s01-m10',
    'sv-s02-m1','sv-s02-m2','sv-s02-m3','sv-s02-m4','sv-s02-m5','sv-s02-m6','sv-s02-m7','sv-s02-m8','sv-s02-m9','sv-s02-m10',
    'sv-s03-m1','sv-s03-m2','sv-s03-m3','sv-s03-m5',
    'sv-s04-m1','sv-s04-m2','sv-s04-m3','sv-s04-m6',
    's05-m1','s05-m2','s05-m3','s05-m6','s05-m8','s05-m10',
    's06-m1','s06-m2','s06-m3','s06-m6',
    's07-m1','s07-m3','s07-m4','s07-m5','s07-m10',
    's08-m1','s08-m6','s08-m9',
    'sv-s09-m1','sv-s09-m2'
  ];
  var SECKI_KLASIK = [
    'sv-s01-k4','sv-s01-k3','sv-s01-k1',
    'sv-s02-k4','sv-s02-k1',
    'sv-s03-k4',
    'sv-s04-k4','sv-s04-k1',
    's05-k1','s05-k3','s05-k4',
    's06-k3',
    'sv-s07-k5','sv-s07-k6','s07-k3',
    's08-k1','s08-k3',
    'sv-s09-k1','sv-s09-k2'
  ];
  function isaretle(dizi, idler){
    var map = {}; dizi.forEach(function(x){ map[x.id] = x; });
    idler.forEach(function(id){ if (map[id]) map[id].secki = true; });
  }
  isaretle(S.mcq, SECKI_MCQ);
  isaretle(S.klasik, SECKI_KLASIK);
})();
