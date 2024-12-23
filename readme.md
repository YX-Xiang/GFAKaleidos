# GFA Kaleidos

## Description
```GFA Kaleidos``` is a tool designed to analyze graph statistics using GFA format input. We characterized the GFA file by modeling it with 3 different graph representations: **directed graph, bidirected graph, and biedged graph**. For each model, we computed statistics on vertices, edges, and subgraphs.

![Different Graph Models](./model.png)

## Requirements on GFA file:
The tool supports GFA format versions **v1.0** and **v1.1**. Certain indicators may not function without path or walk information. 

Currently, the software performs well on graphs generated by ```pggb``` and ```minigraph-cactus```. If you encounter compatibility issues with graphs generated by other software, feel free to reach out to us.

## Installation
The command-line version is now fully implemented. You can clone the repository, compile the code, and run it locally.

```shell
git clone git@github.com:YX-Xiang/GFAKaleidos.git
cd GFAKaleidos/V1
make -C ./algorithm clean
make -C ./algorithm -j
./algorithm/gfaKaleidos.exe INPUT_GFA -o OUTPUT_PATH -t THREAD_NUM
zip ZIP_NAME.zip OUTPUT_PATH
```

1. ```INPUT_GFA```: The file path of the GFA file that the user wants to analyze.

2. ```OUTPUT_PATH```: The output directory path where the results will be saved. This should be a folder.

3. ```THREAD_NUM```: The number of threads to use for the analysis. The default value is 1.

4. ```ZIP_NAME```: The file path for the compressed output result in .zip format (optional). If further interaction with the website is required, this parameter must be specified.

## Online Interaction (option)
Upload ZIP_NAME.zip to <a href='https://combiopt.nankai.edu.cn/gfakaleidos'>web server</a>, which offers a user-friendly interface with clear guidance. Visual outputs can be exported to HTML or PDF formats, facilitating sharing and dissemination.

![Web server](./GFAKaleidos.png)