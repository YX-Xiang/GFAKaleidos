#!/bin/bash

source $6

input_seqfile=$1
ref=$2
out_name=$3
threads=$4
output_folder=$5
job_store_folder=${output_folder}/js

if [ -d "$output_folder" ]; then
    rm -rf "$output_folder"
    echo "Folder cleared: $output_folder"
fi

mkdir -p "$output_folder"
echo "Folder created: $output_folder"

> ${output_folder}/TimeMemory.txt

# /usr/bin/time --format="%e\t%M" \
#     -a -o ${output_folder}/TimeMemory.txt \
#     cactus-pangenome ${job_store_folder} ${input_seqfile} \
#     --outDir ${output_folder} --outName ${out_name} \
#     --reference ${ref} \
#     --mgCores ${threads} --mapCores ${threads} --consCores ${threads} --indexCores ${threads} \
#     --vcf --giraffe --gfa --gbz \
#     > ${output_folder}/log 2>&1

outputGFA=${output_folder}/${out_name}.sv.gfa
outputPAF=${output_folder}/${out_name}.paf
chrom_path=${output_folder}/chroms
chrom_alignments=${output_folder}/chrom-alignments

echo -n "Minigraph: " >> ${output_folder}/TimeMemory.txt
/usr/bin/time --format="%e\t%M" -a -o ${output_folder}/TimeMemory.txt \
    cactus-minigraph ${job_store_folder} ${input_seqfile} \
    ${outputGFA} --reference ${ref} \
    --mgCores ${threads} \
    > ${output_folder}/log_minigraph 2>&1

echo -n "Graphmap: " >> ${output_folder}/TimeMemory.txt
/usr/bin/time --format="%e\t%M" -a -o ${output_folder}/TimeMemory.txt \
    cactus-graphmap ${job_store_folder} ${input_seqfile} \
    ${outputGFA} ${outputPAF} --reference ${ref} \
    --outputFasta ${outputGFA}.fa \
    --mapCores ${threads} \
    > ${output_folder}/log_graphmap 2>&1

echo -n "Graphmap-split: " >> ${output_folder}/TimeMemory.txt
/usr/bin/time --format="%e\t%M" -a -o ${output_folder}/TimeMemory.txt \
    cactus-graphmap-split ${job_store_folder} ${input_seqfile} \
    ${outputGFA} ${outputPAF} --reference ${ref} --outDir ${chrom_path} \
    > ${output_folder}/log_split 2>&1

echo -n "Cactus-align: " >> ${output_folder}/TimeMemory.txt
/usr/bin/time --format="%e\t%M" -a -o ${output_folder}/TimeMemory.txt \
    cactus-align ${job_store_folder} ${chrom_path}/chromfile.txt ${chrom_alignments} \
    --batch --pangenome --reference ${ref} --outVG \
    --consCores ${threads} \
    > ${output_folder}/log_align 2>&1

echo -n "Graphmap-join: " >> ${output_folder}/TimeMemory.txt
/usr/bin/time --format="%e\t%M" -a -o ${output_folder}/TimeMemory.txt \
    cactus-graphmap-join ${job_store_folder} \
    --vg ${chrom_alignments}/*.vg --hal ${chrom_alignments}/*.hal \
    --outDir ${output_folder} --outName ${out_name} --reference ${ref} \
    --vcf --giraffe --gfa --gbz \
    --indexCores ${threads} \
    > ${output_folder}/log_join 2>&1


deactivate