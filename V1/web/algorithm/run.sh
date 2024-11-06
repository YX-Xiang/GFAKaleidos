#!/bin/bash

INPUT_GFA=$1
OUTPUT_PATH="web/data"

make clean > build.log 2>&1
make -j >> build.log 2>&1

web/algorithm/gfaGlimpse.exe ${INPUT_GFA} -o ${OUTPUT_PATH} -t 16
