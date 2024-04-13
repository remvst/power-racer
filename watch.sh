#!/bin/sh

which entr || brew install entr

find src | entr bash -c "./build.sh"
