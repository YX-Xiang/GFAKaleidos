#!/bin/bash

source conda.sh
conda activate pggb

file_list=$1
seq_number=$2
out_name=$3
threads=$4
output_folder=$5
input=${output_folder}/${out_name}.fa

if [ -d "$output_folder" ]; then
    rm -rf "$output_folder"
    echo "Folder cleared: $output_folder"
fi
mkdir "$output_folder"
echo "Folder created: $output_folder"

input_files=""

while IFS= read -r line || [[ -n $line ]]; do
   input_files="$input_files $line"
done < $file_list

> ${input}
cat $input_files > ${input}
samtools faidx ${input}
echo "Sequences are already Prepared!"

/usr/bin/time --format="%e\t%M" -a -o ${output_folder}/TimeMemory.txt pggb -i ${input} \
    -p 98 -s 20000 -n ${seq_number} \
    -A -D ${output_folder}/tmp \
    -k 47 -G 1303,1337 -O 0.03 \
    -t ${threads} -T ${threads} -Z -o ${output_folder} > ${output_folder}/log

gzip -d ${output_folder}/*.gfa.gz

conda deactivate