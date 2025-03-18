#!/bin/bash

INPUT_GFA=$1
FILENAME=$(basename "$INPUT_GFA" | sed 's/\.[^.]*$//')

#获取ip
ip=$(echo "$INPUT_GFA" | cut -d'/' -f5)

mkdir -p "data/$ip/$FILENAME"
OUTPUT_PATH="data/$ip/$FILENAME"

make  -C ./algorithm clean > build.log 2>&1
make  -C ./algorithm -j >> build.log 2>&1
# make -C ./algorithm clean
# make -C ./algorithm -j

./algorithm/gfaKaleidos.exe ${INPUT_GFA} -o ${OUTPUT_PATH} -t 6