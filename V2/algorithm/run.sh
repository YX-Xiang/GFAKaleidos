#!/bin/bash

INPUT_GFA=$1
FILENAME=$(basename "$INPUT_GFA" | sed 's/\.[^.]*$//')

OUTPUT_PATH="/home/yxxiang/GFAKaleidos/V2/result/$FILENAME"

# 如果目录存在，则删除它
if [ -d "$OUTPUT_PATH" ]; then
  rm -rf "$OUTPUT_PATH"
fi

# 创建目录
mkdir -p "$OUTPUT_PATH"


# make  -C ./algorithm clean > build.log 2>&1
# make  -C ./algorithm -j >> build.log 2>&1
make clean > build.log 2>&1
make -j >> build.log 2>&1

/usr/bin/time --format="%e\t%M" -o ${OUTPUT_PATH}/TimeMemory.txt ./gfaKaleidos.exe ${INPUT_GFA} -o ${OUTPUT_PATH} -t 16