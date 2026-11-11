#!/bin/bash
cd "$(dirname "$0")"
build() { # name title fonts
  {
    echo "<title>$2</title>"
    echo '<meta name="claude:viewport-fit-sides" content="cover">'
    echo "<link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css2?$3&display=swap\">"
    echo "<style>"; cat common.css "$1.css"; echo "</style>"
    cat common.html
    echo "<script>"; cat common.js; echo "</script>"
  } > "out-$1.html"
}
build neon "Çip Hattı Neon" "family=Chakra+Petch:wght@600;700&family=Rajdhani:wght@500;600;700"
build comic "Çip Hattı Çizgi Roman" "family=Lilita+One&family=Nunito:wght@600;800"
build modern "Çip Hattı Sade" "family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600"
ls -la out-*.html
