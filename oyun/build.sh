#!/bin/bash
# Çip Hattı derleme: src/ -> dist/oyun.html (tek dosya). Bağımlılık yok (bash + node).
# Kullanım: bash oyun/build.sh [--zorunlu-degil]
#   --zorunlu-degil : eksik zorunlu dosyaları sarı uyarıyla listeler ama derlemeyi sürdürür.
cd "$(dirname "$0")" || exit 1
SOFT=0; [ "$1" = "--zorunlu-degil" ] && SOFT=1
Y=$'\033[33m'; K=$'\033[31m'; G=$'\033[32m'; N=$'\033[0m'

REQ_CSS="00-tokens 10-layout 20-components 30-runway-overlay"
REQ_JS="00-q 10-state 20-settings 30-claude 40-art-chars 41-art-runner 42-art-world 50-ui 60-battle
80-obs-hikaye 80-obs-sandik 80-obs-dusman 80-obs-tuzak 80-obs-kavram 80-obs-tahmin 80-obs-kopru 85-obs-patron
90-data-s01 90-data-s02 90-data-s03 90-data-s04 90-data-s05 90-data-s06 90-data-s07 90-data-s08 90-data-s09 90-data-s10
95-runner 99-main"
REQ_SIM="kristal_tur czochralski kafes miller karacisim fotoelektrik bohr kuyu basamak olcum belirsizlik bant fermi"

EKSIK=()
for f in $REQ_CSS; do [ -f "src/styles/$f.css" ] || EKSIK+=("src/styles/$f.css"); done
for f in $REQ_JS;  do [ -f "src/js/$f.js" ]     || EKSIK+=("src/js/$f.js"); done
for f in $REQ_SIM; do [ -f "src/js/70-sim-$f.js" ] || EKSIK+=("src/js/70-sim-$f.js"); done
[ -f src/html/shell.html ] || EKSIK+=("src/html/shell.html")

if [ ${#EKSIK[@]} -gt 0 ]; then
  if [ $SOFT -eq 1 ]; then
    echo "${Y}UYARI: ${#EKSIK[@]} zorunlu dosya eksik (--zorunlu-degil ile geçiliyor):${N}"
    for e in "${EKSIK[@]}"; do echo "${Y}  - $e${N}"; done
  else
    echo "${K}HATA: eksik zorunlu dosyalar:${N}"
    for e in "${EKSIK[@]}"; do echo "${K}  - $e${N}"; done
    echo "(geçici olarak atlamak için: bash oyun/build.sh --zorunlu-degil)"
    exit 1
  fi
fi

# Yükleme sırası kuralı: JS dosya adı NN- ile başlamalı (alfabetik sıra = yükleme sırası)
for f in src/js/*.js; do
  [ -e "$f" ] || continue
  case "$(basename "$f")" in [0-9][0-9]-*.js) ;; *) echo "${K}HATA: geçersiz JS dosya adı (NN- öneki yok): $f${N}"; exit 1;; esac
done

mkdir -p dist
OUT=dist/oyun.html
{
  echo '<!doctype html><meta charset="utf-8">'
  echo '<title>Çip Hattı</title>'
  echo '<meta name="claude:viewport-fit-sides" content="cover">'
  echo '<meta name="viewport" content="width=device-width,initial-scale=1">'
  echo '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lilita+One&family=Nunito:wght@600;800&display=swap">'
  echo '<style>'
  for f in $(ls src/styles/*.css 2>/dev/null | sort); do cat "$f"; echo; done
  echo '</style>'
  [ -f src/html/shell.html ] && cat src/html/shell.html
  echo '<script>'
  for f in $(ls src/js/*.js 2>/dev/null | sort); do cat "$f"; echo; done
  echo '</script>'
} > "$OUT"

# Sözdizimi denetimi: birleşik script'i ayıkla, node --check
TMP="$(mktemp -d)"
node -e '
const fs=require("fs");const h=fs.readFileSync(process.argv[1],"utf8");
const i=h.lastIndexOf("<script>"),j=h.lastIndexOf("</script>");
fs.writeFileSync(process.argv[2],h.slice(i+8,j));' "$OUT" "$TMP/birlesik.js"
if ! node --check "$TMP/birlesik.js"; then echo "${K}HATA: birleşik script sözdizimi hatalı${N}"; rm -rf "$TMP"; exit 1; fi
rm -rf "$TMP"

BOYUT=$(wc -c < "$OUT")
if [ "$BOYUT" -gt 16777216 ]; then echo "${K}HATA: çıktı 16 MB üstünde ($BOYUT)${N}"; exit 1; fi
echo "${G}Derlendi: $OUT ($((BOYUT/1024)) KB)${N}"
