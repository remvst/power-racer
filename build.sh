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
    globals.js \
    math.js \
    util/resizer.js \
    util/first-item.js \
    input/keyboard.js \
    graphics/create-canvas.js \
    graphics/wrap.js \
    entities/entity.js \
    entities/track.js \
    entities/camera.js \
    entities/interpolator.js \
    scene.js \
    level.js \
    main.js \
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
(cd dist && zip -q -r - .) > $OUT_ZIP

date=`date`
echo "Built $date"

exit 0
