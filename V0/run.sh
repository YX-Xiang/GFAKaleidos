#!/bin/bash

# INPUT_GFA="./data/test.gfa"
# INPUT_GFA="/home/yxxiang/data/gfaGlimpse/benchmark/data/01_dm_pggb.gfa"
# INPUT_GFA="/home/yxxiang/data/gfaGlimpse/benchmark/data/02_dm_mc.gfa"
INPUT_GFA="/home/yxxiang/data/gfaGlimpse/benchmark/data/03_at_pggb.gfa"
# INPUT_GFA="/home/yxxiang/data/gfaGlimpse/benchmark/data/04_at_mc.gfa"
# INPUT_GFA="/home/yxxiang/data/gfaGlimpse/benchmark/data/06_hs_mc.gfa"
# INPUT_GFA="/home/yxxiang/data/gfaGlimpse/benchmark/data/08_hs_mc.gfa"
OUTPUT_PATH="./data"

make clean
make -j

./gfaGlimpse.exe ${INPUT_GFA} -o ${OUTPUT_PATH}