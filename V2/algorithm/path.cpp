#include "path.h"


Coverage::Coverage(const std::string& gfaFile, int paths, const std::unordered_map <std::string, long long>& segmentID): 
    pathFileName(gfaFile), segmentID(segmentID) {
        pathNumber = paths;
        vertexCoverage = std::vector <long long> (paths + 1, 0);
        edgeCoverage = std::vector <long long> (paths + 1, 0);
        bpCoverage = std::vector <long long> (paths + 1, 0);
        vertexCoverage2 = std::vector <long long> (paths + 1, 0);
        edgeCoverage2 = std::vector <long long> (paths + 1, 0);
        bpCoverage2 = std::vector <long long> (paths + 1, 0);
}


Coverage::~Coverage() {}


void Coverage::statCoverage(const DiGraph& diGraph, const BiedgedGraph& biedgedGraph) {
    long long vertexMaxNumber = diGraph.edge.size();
    long long vertexMaxNumber2 = (biedgedGraph.vertexNumber >> 1) + 1;
    std::vector <std::set <int> > vertexTravelledPathList = std::vector <std::set <int> > (vertexMaxNumber, std::set <int> ());
    std::vector <std::set <int> > vertexTravelledPathList2 = std::vector <std::set <int> > (vertexMaxNumber2, std::set <int> ());
    std::map <std::pair <std::pair <long long, char>, std::pair <long long, char> >, std::set <int> > edgeTravelledPathList = std::map <std::pair <std::pair <long long, char>, std::pair <long long, char> >, std::set <int> > ();
    std::map <std::pair <std::pair <long long, char>, std::pair <long long, char> >, std::set <int> > edgeTravelledPathList2 = std::map <std::pair <std::pair <long long, char>, std::pair <long long, char> >, std::set <int> > ();

    std::ifstream gfaFile(pathFileName);
    if (!gfaFile.is_open()) {
        throw std::runtime_error("Failed to open GFA path file: " + pathFileName);
    }

    std::string line;
    int pathID = 0;
    while (std::getline(gfaFile, line)) {
        if (line.empty()) continue;

        std::vector<std::pair<long long, char>> pathElement;

        if (line[0] == 'P') {
            // 处理 P 行
            std::istringstream iss(line);
            std::vector<std::string> tokens;
            std::string token;
            while (std::getline(iss, token, '\t')) {
                tokens.push_back(token);
            }

            if (tokens.size() < 3) continue; // 跳过无效行

            std::string segmentName;
            for (char c : tokens[2]) {
                if (c == ',') {
                    segmentName.clear();
                } else if (c == '+' || c == '-') {
                    if (segmentID.count(segmentName)) {
                        pathElement.emplace_back(segmentID.at(segmentName), c);
                    } else {
                        std::cerr << "!!! Error: failed to find the segment " << segmentName
                                  << " in the path " << tokens[1] << std::endl;
                    }
                } else {
                    segmentName.push_back(c);
                }
            }
        } else if (line[0] == 'W') {
            // 处理 W 行
            std::istringstream iss(line);
            std::vector<std::string> tokens;
            std::string token;
            while (std::getline(iss, token, '\t')) {
                tokens.push_back(token);
            }

            if (tokens.size() < 7) continue; // 跳过无效行

            const std::string& pathData = tokens[6];
            int length = pathData.size();
            for (int i = 0; i < length; ++i) {
                if (pathData[i] == '>' || pathData[i] == '<') {
                    char direction = pathData[i];
                    int j = i + 1;

                    // 找到段名称
                    while (j < length && pathData[j] >= '!' && pathData[j] <= '~' &&
                           pathData[j] != '>' && pathData[j] != '<') {
                        ++j;
                    }

                    std::string_view segmentName(&pathData[i + 1], j - i - 1);
                    i = j - 1;

                    if (segmentID.count(std::string(segmentName))) {
                        pathElement.emplace_back(segmentID.at(std::string(segmentName)), direction == '>' ? '+' : '-');
                    } else {
                        std::cerr << "!!! Error: failed to find the segment " << std::string(segmentName)
                                  << " in the path." << std::endl;
                    }
                }
            }
        }

        // 统计digraph覆盖率
        for (size_t p = 0; p < pathElement.size(); ++p) {
            long long id = pathElement[p].first;
            char direction = pathElement[p].second;

            if (direction == '+') {
                vertexTravelledPathList[(id << 1) - 1].insert(pathID);
            } else {
                vertexTravelledPathList[(id << 1)].insert(pathID);
            }

            if (p > 0) {
                auto edgeKey = std::make_pair(pathElement[p - 1], pathElement[p]);
                edgeTravelledPathList[edgeKey].insert(pathID);
            }
        }

        // 统计bidirected graph覆盖率
        for (size_t p = 0; p < pathElement.size(); ++p) {
            long long id = pathElement[p].first;
            vertexTravelledPathList2[id].insert(pathID);

            if (p) {
                std::pair <long long, char> fi, se;
                if (pathElement[p - 1].first == pathElement[p].first) {
                    if (pathElement[p - 1].second == pathElement[p].second) {
                        fi.first = se.first = pathElement[p - 1].first;
                        fi.second = se.second = '+';
                    } else {
                        fi = pathElement[p - 1];
                        se = pathElement[p];
                    }
                } else if (pathElement[p - 1].first < pathElement[p].first) {
                    fi = pathElement[p - 1];
                    se = pathElement[p];
                } else {
                    fi.first = pathElement[p].first;
                    if (pathElement[p].second == '-') {
                        fi.second = '+';
                    } else {
                        fi.second = '-';
                    }

                    se.first = pathElement[p - 1].first;
                    if (pathElement[p - 1].second == '-') {
                        se.second = '+';
                    } else {
                        se.second = '-';
                    }
                }

                if (! edgeTravelledPathList.count({fi, se})) {
                    edgeTravelledPathList2[{fi, se}] = std::set <int> ();
                }
                edgeTravelledPathList2[{fi, se}].insert(pathID);
            }
        }

        ++pathID;
    }

    gfaFile.close();

    // 统计digraph顶点覆盖率
    for (long long vertexID = 1; vertexID < vertexMaxNumber; vertexID ++) {
        //std::cout << vertexID << " " << vertexTravelledPathList[vertexID].size() << std::endl;
        if (diGraph.vertexVal.count(vertexID)) {
            vertexCoverage[vertexTravelledPathList[vertexID].size()] ++;
            bpCoverage[vertexTravelledPathList[vertexID].size()] += diGraph.vertexVal.at(vertexID);
        }
    }

    // 统计digraph边覆盖率
    for (const auto& edge : edgeTravelledPathList) {
        edgeCoverage[edge.second.size()]++;
    }

    // 统计bidirected graph顶点覆盖率
    for (long long vertexID = 1; vertexID < vertexMaxNumber2; vertexID ++) {
        vertexCoverage2[vertexTravelledPathList2[vertexID].size()] ++;
        bpCoverage2[vertexTravelledPathList2[vertexID].size()] += (biedgedGraph.edge[(vertexID << 1)].begin() -> value);
    }

    // 统计bidirected graph边覆盖率
    for (auto e: edgeTravelledPathList2) {
        edgeCoverage2[e.second.size()] ++;
    }

}


void Coverage::print2File(const std::string& outputFile, int mode) {
    std::ofstream output(outputFile);
    if (!output.is_open()) {
        std::cerr << "Error opening file: " << outputFile << std::endl;
        return;
    }

    output << "Count\tbp\t\tNode\t\tEdge\n";

    if (mode == 1) {
        for (int haplotype = 1; haplotype <= pathNumber; haplotype ++) {
            output << haplotype << "\t\t" << bpCoverage[haplotype] << "\t\t"
                << vertexCoverage[haplotype] << "\t\t" << edgeCoverage[haplotype] << '\n';
        }
        std::cerr << "--- The coverage of the digraph has been successfully exported to the file: " << outputFile << std::endl;
    } else if (mode == 2) {
        for (int haplotype = 1; haplotype <= pathNumber; haplotype ++) {
            output << haplotype << "\t\t" << bpCoverage2[haplotype] << "\t\t"
                << vertexCoverage2[haplotype] << "\t\t" << edgeCoverage2[haplotype] << '\n';
        }
        std::cerr << "--- The coverage of the bidirected graph has been successfully exported to the file: " << outputFile << std::endl;
    }
    
    output.close();
}


Growth::Growth(const std::string& outputFolderPath) {
    if (!outputFolderPath.empty() && outputFolderPath.back() == '/') {
        outputPath = outputFolderPath + "gfa";
    } else {
        outputPath = outputFolderPath + "/gfa";
    }
}


Growth::~Growth() {}


void Growth::statGrowth(const std::string& gfaFile) {
    std::string path_file = outputPath + "/paths.haplotypes.txt";
    std::ifstream infile(gfaFile);
    std::ofstream outfile(path_file);
    std::string line;

    if (!infile.is_open() || !outfile.is_open()) {
        std::cerr << "Error opening file." << std::endl;
        return;
    }

    while (std::getline(infile, line)) {
        if (line[0] == 'W') {
            std::istringstream iss(line);
            std::string fields[5];
            for (int i = 0; i < 5; ++i) {
                if (!std::getline(iss, fields[i], '\t')) break;
            }
            outfile << fields[0] << "#" << fields[1] << "#" << fields[2] << ":"
                    << fields[3] << "-" << fields[4] << '\n';
        } else if (line[0] == 'P') {
            std::istringstream iss(line);
            std::string field;
            if (std::getline(iss, field, '\t') && std::getline(iss, field, '\t')) {
                outfile << field << '\n';
            }
        }
    }

    std::string htmlFile = outputPath + "/histgrowth.html";
    std::string csvFile = outputPath + "/histgrowth.csv";
    std::string logFile = outputPath + "/histgrowth.log";
    std::string commandHtml = "RUST_LOG=info panacus histgrowth -t"
        + std::to_string(numThreads)
        + " -l 1,2,1,1,1 -q 0,0,1,0.5,0.1 -S -s " 
        + path_file + " -c all -a -o html " + gfaFile + " > " + htmlFile + " 2> " + logFile;
    std::string commandCsv = "RUST_LOG=info panacus histgrowth -t"
        + std::to_string(numThreads)
        + " -l 1,2,1,1,1 -q 0,0,1,0.5,0.1 -S -s " 
        + path_file + " -c all -a " + gfaFile + " > " + csvFile + " 2>> " + logFile;
    FILE* pipe1 = popen(commandHtml.c_str(), "r");
    FILE* pipe2 = popen(commandCsv.c_str(), "r");

    std::ifstream file(csvFile);
    if (pipe2 == NULL) {
        std::cerr << "!!! Error: Unexpected growth calculation. Please check the log file for more details: " << logFile << std::endl;
    } else {
        std::cout << "+++ Growth calculation successful." << std::endl << std::endl;
    }
}   


/*Growth::Growth(const std::vector <std::vector <std::pair <int, char> > >& gfaPath): 
    path(gfaPath) {
        vertexGrowth = std::vector <int> (path.size() + 1, 0);
        vertexCommonGrowth = std::vector <int> (path.size() + 1, 0);
        vertexCoreGrowth = std::vector <int> (path.size() + 1, 0);
        edgeGrowth = std::vector <int> (path.size() + 1, 0);
        edgeCommonGrowth = std::vector <int> (path.size() + 1, 0);
        edgeCoreGrowth = std::vector <int> (path.size() + 1, 0);
        bpGrowth = std::vector <long long> (path.size() + 1, 0);
        bpCommonGrowth = std::vector <long long> (path.size() + 1, 0);
        bpCoreGrowth = std::vector <long long> (path.size() + 1, 0);
}


Growth::~Growth() {}


void Growth::statGrowth(const std::string& gfaFile) {
    // T. B. C.
}


void Growth::statGrowth(const BiedgedGraph& biedgedGraph) {
    // T. B. C.
}


void Growth::print2File(const std::string&) {
    // T. B. C.
}*/