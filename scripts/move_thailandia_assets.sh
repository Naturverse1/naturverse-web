#!/usr/bin/env bash
set -euo pipefail
mkdir -p public/kingdoms/Thailandia

# Move any of the existing Thailandia images from /attached_assets
# Adjust/extend patterns if needed.
shopt -s nullglob
for f in attached_assets/*Coconut* attached_assets/*Non-Bua* attached_assets/*Lao* \
         attached_assets/*Pineapple* attached_assets/*Mango* attached_assets/*Nikki*; do
  base="$(basename "$f" | tr ' ' '-' )"
  cp "$f" "public/kingdoms/Thailandia/${base}"
done

echo "Thailandia assets copied to public/kingdoms/Thailandia"

