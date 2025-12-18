mkdir -p webp

for img in *.png *.jpg *.jpeg; do
  [ -e "$img" ] || continue
  cwebp -q 85 "$img" -o "webp/${img%.*}.webp"
done