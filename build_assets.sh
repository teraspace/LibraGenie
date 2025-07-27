#!/bin/bash

echo "Building JavaScript assets..."
npx esbuild app/javascript/*.* --bundle --sourcemap --format=iife --outdir=app/assets/builds --public-path=/assets

echo "Building CSS assets..."
npx @tailwindcss/cli -i ./app/assets/stylesheets/application.tailwind.css -o ./app/assets/builds/application.css --minify

echo "Assets built successfully!"
