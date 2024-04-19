#!/bin/sh

OUT_DIR=dist/
OUT_JS=$OUT_DIR/main.js
OUT_ZIP=out.zip

echo 'Building...'

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
    util/colors.js \
    input/keyboard.js \
    graphics/wrap.js \
    entities/entity.js \
    entities/background.js \
    entities/track.js \
    entities/track-perspective.js \
    entities/camera.js \
    entities/interpolator.js \
    entities/ship.js \
    entities/player.js \
    entities/hud.js \
    entities/booster.js \
    entities/animations/particle.js \
    entities/menu.js \
    sound/sonantx.js \
    sound/song.js \
    sound/ZzFXMicro.js \
    sound/sfx.js \
    scene.js \
    level.js \
    main.js \
; do
    cat src/$file >> $OUT_JS
done

# Terser
tmp=`mktemp`
npx -y terser $OUT_JS --compress ecma=2015,computed_props=false 1>$tmp
cat $tmp 1>$OUT_JS
rm $tmp

# Roadroller
npx -y roadroller $OUT_JS  -o $OUT_JS

# Copy files as is
for file in \
    style.css \
    index.html \
; do
    cp src/$file $OUT_DIR/$file
done

echo "Done"

# Zip file
(cd dist && zip -q -r - .) > $OUT_ZIP
du -h $OUT_ZIP

exit 0
