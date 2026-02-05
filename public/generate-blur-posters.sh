#!/bin/bash

# Generate blurred poster images from video files
# Usage: ./generate-blur-posters.sh

cd "$(dirname "$0")"

# Process the 3 new video files
videos=("forms.mp4" "particle-sphere.webm" "the-infinite-almanac.webm")

for video in "${videos[@]}"; do
  input="thumbnails/$video"
  output="posters/${video%.*}-blur.webp"
  
  if [ ! -f "$input" ]; then
    echo "Warning: $input not found, skipping..."
    continue
  fi
  
  echo "Generating blur poster for $video..."
  ffmpeg -i "$input" -vf "scale=1200:-1,boxblur=20:5" -vframes 1 -q:v 2 "$output" -y
  
  if [ $? -eq 0 ]; then
    echo "✓ Created $output"
  else
    echo "✗ Failed to create $output"
  fi
done

echo ""
echo "Done!"
