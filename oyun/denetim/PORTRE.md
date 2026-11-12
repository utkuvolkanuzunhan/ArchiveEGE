# PORTRE · Bilim insanı portreleri

- `src/js/41-art-portre.js`: `Q.art.portre(id, {cls, sil})` -> kare SVG (200x200, renkler satır içi), `Q.art.PORTRE_IDS`, `Q.art.portreVarMi(id)`. Build `src/js/*.js` glob'u ile otomatik alır.
- Tablo id -> özellikler (yüz genişliği/çene, saç stili, kaş, bıyık/sakal, gözlük, giysi, renk, arka plan, köşe motifi). 28 kişi (23 kart id'sinin hepsi dahil; bragg + braggl çifti, takma adlar: heisenberg, vonneumann, davisson_germer vb.). Tanımsız id: id'den türetilmiş renkli varsayılan silüet.
- Kilitli kart: `sil:true` ile "?" silüeti (gerçek yüz sızmaz).
- `21-kartlar.js`: koleksiyon kartı ve detay paneli (Tekrar Merkezi aynı `detayDom`'u kullandığından otomatik) portreyi kullanır; yoksa eski cameo'ya düşer. Detay portresi 140px.
- `test/sanat-portre.html`: contact sheet (büyük, 78px, tanımsız id). 40-art-chars.js'teki cameo'lar silinmedi, artık kartlarda kullanılmıyor.
