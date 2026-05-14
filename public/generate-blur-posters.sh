#!/bin/bash

# Generate blurred poster images from thumbnail files (videos and images)
# Usage: ./generate-blur-posters.sh
# Requires: ffmpeg (for video frame extraction), ImageMagick magick (for blur + WebP conversion)

cd "$(dirname "$0")"

generated=0
skipped=0
failed=0

for input in thumbnails/*; do
  filename=$(basename "$input")
  name="${filename%.*}"
  ext=$(echo "${filename##*.}" | tr '[:upper:]' '[:lower:]')
  output="posters/${name}-blur.webp"

  # Skip if blur poster already exists
  if [ -f "$output" ]; then
    skipped=$((skipped + 1))
    continue
  fi

  echo "Generating blur poster for $filename..."

  case "$ext" in
    mp4|webm|mov)
      tmp="/tmp/poster-frame-$$.jpg"
      ffmpeg -i "$input" -vframes 1 "$tmp" -y 2>/dev/null
      magick "$tmp" -resize 1200x -blur 0x20 -quality 85 "$output" 2>/dev/null
      result=$?
      rm -f "$tmp"
      ;;
    gif)
      tmp="/tmp/poster-frame-$$.jpg"
      ffmpeg -i "$input" -vframes 1 "$tmp" -y 2>/dev/null
      magick "$tmp" -resize 1200x -blur 0x20 -quality 85 "$output" 2>/dev/null
      result=$?
      rm -f "$tmp"
      ;;
    jpg|jpeg|png|webp)
      magick "$input" -resize 1200x -blur 0x20 -quality 85 "$output" 2>/dev/null
      result=$?
      ;;
    *)
      echo "  Skipping unsupported format: $ext"
      skipped=$((skipped + 1))
      continue
      ;;
  esac

  if [ $result -eq 0 ] && [ -f "$output" ]; then
    echo "  ✓ Created $output"
    generated=$((generated + 1))
  else
    echo "  ✗ Failed to create $output"
    failed=$((failed + 1))
  fi
done

echo ""
echo "Done! Generated: $generated, Skipped (already existed): $skipped, Failed: $failed"
