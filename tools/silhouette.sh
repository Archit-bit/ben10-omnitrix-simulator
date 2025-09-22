#!/usr/bin/env bash
set -euo pipefail

# Converts all images in assets/raw_aliens to 512x512 black silhouettes
# with transparent background, centered, saved in public/aliens/*.png.
# Requires: ImageMagick ('magick' or 'convert')

ROOT="$(pwd)"
SRC="$ROOT/assets/raw_aliens"
DST="$ROOT/public/aliens"

echo "Root:   $ROOT"
echo "Source: $SRC"
echo "Output: $DST"

mkdir -p "$DST"

# pick available binary
if command -v magick >/dev/null 2>&1; then
  IM="magick"
elif command -v convert >/dev/null 2>&1; then
  IM="convert"
else
  echo "ERROR: ImageMagick not installed"
  exit 1
fi

shopt -s nullglob nocaseglob
FILES=("$SRC"/*.{png,jpg,jpeg,webp,svg})

for f in "${FILES[@]}"; do
  [ -e "$f" ] || continue
  base="$(basename "$f")"
  name="${base%.*}"
  out="$DST/${name,,}.png"
  echo "→ $f"

  $IM -size 1600x1600 canvas:black \
     \( "$f" -resize 1600x1600\> -colorspace Gray -auto-level -threshold 65% -negate \) \
     -compose copyopacity -composite \
     -gravity center -background none -resize 512x512 -extent 512x512 \
     "PNG32:$out"

  echo "✓ $out"
done

echo "Done. All silhouettes in $DST"
