# 02 · Koşu Motoru ve Engel Akışı (Paket A2)

> Yazan ajan: **A2**. Yazılacak dosya: `src/js/95-runner.js` (gerekirse `95-runner-b.js`).
> Önce oku: `00`, `01`. Çizim fonksiyonlarını **A5 yazar** (`Q.art.drawWorld/drawRunner/drawObstacle`). A2 onları çağırır; A5 yazılmadan test etmek için A2 geçici bir **sahte çizim** (dikdörtgenler) kullanır ve `Q.art.*` varsa onu tercih eder.

## 1. Görev

Yatay kayan koşu alanını çalıştırmak, engelleri veri sırasıyla yola dizmek, koşucuyu engele yaklaşınca **yavaşça durdurmak**, ilgili engel işleyicisini çağırmak ve sonucu uygulamak.

## 2. Yol (canvas) ölçüleri

- Canvas kapsayıcısı `.runway` (A4 üretir; yüksekliği `min-height:56vh`, genişliği tüm kapsayıcı). Motor **yalnızca bu kapsayıcının içine** bir `<canvas>` ekler ve `ResizeObserver` ile boyutu izler.
- Mantıksal yükseklik `H = 720`. Mantıksal genişlik `W = round(720 × kapsayıcıGenişlik / kapsayıcıYükseklik)`.
- Çizim ölçeği `s = kapsayıcıYükseklik / 720 × devicePixelRatio`. Canvas piksel boyutu `W·s × 720·s`, CSS boyutu kapsayıcıya `100%`.
- Zemin çizgisi `groundY = 600`. Koşucunun ayak noktası `groundY`.
- Koşucunun ekran konumu sabit: `runnerScreenX = 0.26 × W`. Kamera `camX` dünyayı kaydırır. Dünya x'i = `camX + ekranX`.

## 3. Dünya yerleşimi

İstasyon verisindeki `engeller` dizisi sırasıyla yola dizilir:

```
obstacleX[0] = 1200
obstacleX[i] = obstacleX[i-1] + gap(tip[i-1]) 
gap: hikaye 1000, kavram 1000, dusman 900, tahmin 1000, tuzak 900, kopru 1000, patron 1200, sandik 1000
```
Çalışma anında **hata defteri düşmanları** `Q.battle.reviewPick(stationIndex, 2)` ile alınır ve `kopru` ile `patron` arasına eklenir (ek engel olarak aynı `dusman` işleyicisiyle).
İstasyon başında 1200 birimlik boş yol, sonunda `sandik`tan sonra 1200 birimlik boş yol vardır.
**Hızlı mod:** `Q.state.ayarlar.sadecePatron` açıksa engel listesi şuna indirilir: ilk `hikaye` (yalnızca ilk satır gösterilir), `patron`, `sandik`. Hata defteri düşmanı eklenmez. `Q.state.ayarlar.hikayeAtla` açıksa `hikaye` engeli listeye hiç konmaz.

## 4. Hareket

- Koşu hızı `v = 260 birim/sn × Q.state.ayarlar.hiz`. `dt` en fazla 0.05 sn.
- Koşucu ekranda sabit, `camX += v·dt` (durumdayken).
- Koşucu alt animasyon karesi: `t` (saniye) ile `Q.art.drawRunner(ctx, x, groundY, durum, t)`.
- **Tetik mesafesi:** bir engelin dünya konumu `ox`. `ox − (camX + runnerScreenX) ≤ 420` olunca motor **yavaşlama** evresine geçer:
  - `v` değeri 1.4 saniyede `cubic-bezier(.2,.7,.3,1)` eğrisi ile 0'a iner. Bu "yavaşça başlar" isteğinin kendisidir.
  - Koşucu durduğunda mesafe 160 ± 20 birim olmalıdır (engel koşucudan hep aynı uzaklıkta durur). Gerekirse hedef mesafe için yavaşlama başlangıcı hesaplanır: `d_dur = v0 × 1.4 × (1/ortalamaOran)`; basit yaklaşım: ilk 1.4 sn boyunca `camX` konumunu doğrudan hedefe `easeOutCubic` ile götür.
- Engelin `durum`u: `idle → intro → aktif → cozuldu | basarisiz`. `intro` durumu 1.2 sn sürer (engel çizimi büyür/belirir), sonra `aktif` olur ve handler çağrılır.

## 5. Engel akışı (her engel için sırayla)

```
1. zaman akışı yavaşlar (bölüm 4)
2. runway.setObstacleState('intro'); await 1.2 sn
3. bus.emit('obstacle:enter', {stationId, index, ob})
4. host = ui.dock.mount(boş div); ctx = {...}  (01 §5.1)
5. runway.setObstacleState('aktif')
6. sonuc = await Q.obs.handlers[ob.tip].enter(ob, ctx)    // handler engeli çözer
7. Q.battle.apply(sonuc)  (patron hariç; patron kendi uygular)
8. ui.dock.clear()
9. if (Q.state.voltaj <= 0) → await Q.battle.kisaDevre(stationId) → son kontrol noktasına dön (bölüm 7)
10. sonuc.dogru === true → runway.anim('kapi-ac'|'atla'|'saldir'...) ; setObstacleState('cozuldu'); resume()
    sonuc.dogru === false → runway.anim('sendele'|'dus'); engel 'cozuldu' sayılır (oyuncu öğrendi, geçer)
11. bus.emit('obstacle:done', ...); Q.state.ilerleme güncelle; Q.save.write()
12. await resume() (koşucu yeniden hızlanır, 0.8 sn)
```
Engel işleyicisi bulunamazsa motor `Q.ui.toast('Engel yüklenemedi: '+tip)` gösterir ve engeli atlar.

### 5.1 Hangi engel hangi animasyonla çözülür

| tip | doğru sonuç | yanlış sonuç |
|---|---|---|
| hikaye | `kapi-ac` (kemer parlar, koşucu içinden geçer) | yok (hep geçer) |
| kavram | `kapi-ac` | yok (görev bitmeden geçilmez) |
| dusman | `saldir` (kılıç yayı, düşman patlar, "BAM!") | `sendele` (düşman vurur, ekran sarsılır) |
| tahmin | `atla` (çukurun üstünden zıplar) | `dus` (çukura düşer, 0.8 sn sonra tırmanır) |
| tuzak | `tuzak-boz` (plaka söner) | `sendele` |
| kopru | `kopru-kur` (tahtalar sırayla yerine oturur) | `sendele` (köprü sallanır, yine geçer) |
| patron | `zafer` | voltaj bittiyse `kisa devre` akışı |
| sandik | `zafer` (sandık açılır) | yok |

## 6. Engel şeridi (HUD)

Motor, istasyon başlarken `Q.ui.hud.setPath(nodes)` çağırır. `nodes` = engel dizisinin her biri için `{tip, durum}`; durum `bekliyor|simdi|tamam|hata`. Her `obstacle:done` sonrası güncellenir. (A4, bunu üst şeritte küçük yuvarlak düğümler olarak çizer.)

## 7. Kontrol noktaları ve geri dönüş

- Kontrol noktaları: istasyon başı (index 0), her `sandik` sonrası, ve **ilk `dusman` engelinin öncesi** (index = ilk dusman).
- `Q.state.ilerleme[id].kontrol` o an en son geçilen kontrol noktasının engel indeksidir.
- Kısa devre sonrası: koşucu `kontrol` indeksindeki engelden **1000 birim önceye** konur, `camX` ayarlanır, voltaj `70` olur.
- Oyuncu istasyondan çıkarsa (`Esc → Haritaya dön`), `Q.state.ilerleme[id].enSon` kayda geçer; sonraki girişte oradan devam eder.

## 8. Giriş (klavye / fare)

- Oyun skor/ritim oyunu değildir. **Hiçbir engel refleks gerektirmez**; koşma, durma, atlama ve saldırı animasyonları otomatiktir. Klavye girişi yalnızca: `Esc` duraklat/menü, `Enter` seçili düğmeyi onayla, `1/2/3` seçenek seç, `Q/W/E` eminlik seç (`Bilmiyorum/Emin değilim/Eminim`).
- Fare: tüm düğmeler tıklanır.
- `visibilitychange` ile sekme gizlenirse duraklat.

## 9. Çizim sırası (her kare)

```
Q.art.drawWorld(ctx, camX, t, istasyon.renk)           // gök, uzak silüet, orta katman, zemin
engelleri çiz (görünür aralıktakiler): Q.art.drawObstacle(ctx, ob.tip, ekranX, groundY, durum, t, {skin, renk})
koşucuyu çiz: Q.art.drawRunner(ctx, runnerScreenX, groundY, runnerDurum, t)
efektler: parçacıklar (BAM yıldızı, kıvılcım), hasar sayıları (Q.ui overlay, DOM)
```
Yalnızca ekrana girecek (`[camX−300, camX+W+300]`) engeller çizilir.

## 10. Duraklatma, çıkış, istasyon bitişi

- `Esc`: yol dondurulur, `Q.ui.modal.open` ile menü: **Devam / Ayarlar / Haritaya dön**.
- İstasyon son `sandik` çözülünce `Q.state.ilerleme[id].tamam = true`, `Q.state.fabrika.kurulu` listesine eklenir, `station:end` yayılır, `start()` Promise'i `'tamam'` ile çözülür.
- Hata/istisna: `try/catch` ile yakala, `Q.ui.toast`, oyun çökmez.

## 11. Kabul testleri (A2 bunları kendi yazar ve çalıştırır)

1. Sahte işleyici ile 9 engelli istasyon sonuna kadar akar; her engelde koşucu durur, 1.4 sn yavaşlama ölçülür (±0.2 sn).
2. Pencere boyutu değişince canvas oranı bozulmaz, koşucu `0.26W` konumunda kalır.
3. `Esc` duraklatır; devam edince `dt` zıplaması olmaz.
4. Kısa devre simülasyonu: voltaj 0'a çekilince koşucu kontrol noktasına döner.
5. Reduced-motion açıkken yavaşlama anlıktır, oyun yine ilerler.
6. Canvas, `.runway` alanını %100 doldurur: genişlik ≥ pencere genişliğinin %96'sı, yükseklik ≥ pencere yüksekliğinin %50'si (Playwright ile ölçülür).
