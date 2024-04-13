#!/bin/sh

OUT_DIR=dist/
OUT_JS=$OUT_DIR/main.js
OUT_ZIP=out.zip

# Clean up
rm -rf $OUT_DIR
rm -f $OUT_ZIP

mkdir $OUT_DIR

# Build the JS file
touch $OUT_JS
for file in \
    main.js \
    track.js \
; do
    cat src/$file >> $OUT_JS
done

# Copy files as is
for file in \
    style.css \
    index.html \
; do
    cp src/$file $OUT_DIR/$file
done

# Zip file
# zip -r $OUT_ZIP dist/*
(cd dist && zip -r - .) > $OUT_ZIP

exit 0
