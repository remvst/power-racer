#!/bin/sh

OUT_DIR=dist/
OUT_JS=$OUT_DIR/main.js

rm -rf $OUT_DIR
mkdir $OUT_DIR

touch $OUT_JS
for file in main.js ; do
    cat src/$file >> $OUT_JS
done

cp src/index.html $OUT_DIR/index.html

exit 0
