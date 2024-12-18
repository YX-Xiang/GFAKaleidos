#include "gfa.h"


Gfa::Gfa(int numThreads): numThreads(numThreads) {
    segmentNumber = 0;
    linkNumber = 0;
    pathNumber = 0;
    singleDirectionSegmentCount = 0;
    biDirectionalSegmentCount = 0;
    segmentID = std::unordered_map <std::string, long long> ();
}


Gfa::~Gfa() {}

void printMemoryUsage() {
    std::ifstream proc("/proc/self/status");
    std::string line;
    while (std::getline(proc, line)) {
        if (line.find("VmRSS:") == 0 || line.find("VmSize:") == 0) {
            // 提取数值并转换为 GB
            std::string label = line.substr(0, line.find(":"));
            long memoryKB = std::stol(line.substr(line.find_last_of("\t") + 1, line.find(" kB")));
            double memoryGB = memoryKB / 1024.0 / 1024.0;  // 转换为 GB
            std::cout << label << ": " << memoryGB << " GB" << std::endl;
        }
    }
}


void Gfa::gfa2Graph (const std::string& gfaFile, const std::string& outputFolderPath, DiGraph& diGraph, BiedgedGraph& biedgedGraph, BiedgedGraph& diBiedgedGraph) {
    std::cerr << "+++ Load gfa file from " << gfaFile << std::endl;

    biedgedGraph.directed = 0;
    diBiedgedGraph.directed = 1;
    
    // 获取文件大小
    struct stat info;
    stat(gfaFile.c_str(), &info);
    fileSize = info.st_size;

    const char* units[] = { "B", "KB", "MB", "GB", "TB" };
    double size = static_cast<double>(fileSize);
    int unitIndex = 0;

    // 每次除以 1024，直到大小在 1 到 1000 之间，或者达到 TB（index == 4）
    while (size >= 1024 && unitIndex < 4) {
        size /= 1024;
        ++unitIndex;
    }

    std::ifstream ifs(gfaFile);
    std::vector <std::string> tempLine = std::vector <std::string> ();

    if(!ifs.is_open()) {
        std::cerr << "!!! Error: failed to open " << gfaFile << std::endl;
        return;
    }

    auto start = std::chrono::high_resolution_clock::now();
    while (!ifs.eof()) {
        std::string line;
        std::getline(ifs, line);
 
        if (line[0] == 'S') {
            segmentNumber ++;

            std::istringstream iss(line);
            std::vector <std::string> tokens;
            std::string token;

            while (std::getline(iss, token, '\t')) {
                tokens.push_back(token);
            }

            segmentID[tokens[1]] = segmentNumber;
            // std::cout << tokens[1] << "-" << segmentNumber << "\n";
            
            // biedgedGraph加segment型边
            long long rnode = (segmentNumber << 1), lnode = rnode - 1;
            Biedge newBiedge;
            newBiedge.to = rnode;
            newBiedge.value = tokens[2].size();

            biedgedGraph.edge.push_back(std::set <Biedge> ());
            biedgedGraph.edge.push_back(std::set <Biedge> ());
            biedgedGraph.edge[lnode].insert(newBiedge);

            newBiedge.to = lnode;
            biedgedGraph.edge[rnode].insert(newBiedge);
            // std::cout << lnode << " " << rnode << " " << newBiedge.value << std::endl;

        } else if(line[0] == 'L') {
            linkNumber ++;
            tempLine.push_back(line);

        } else if(line[0] == 'P' || line[0] == 'W') {
            pathNumber ++;
        }
    }
    ifs.close();
    printMemoryUsage();
    auto end = std::chrono::high_resolution_clock::now();
    std::chrono::duration<double> duration = end - start;
    std::cout << "Execution time: " << duration.count() << " seconds" << std::endl;

    // std::cout << segmentNumber << " " << linkNumber << std::endl;
    diGraph.edge = std::vector <std::set <long long> > ((segmentNumber << 1) + 1, std::set <long long>());
    diBiedgedGraph.edge = std::vector <std::set <Biedge> > ((segmentNumber << 1) + 1, std::set <Biedge> ());
    diBiedgedGraph.redge = std::vector <std::set <Biedge> > ((segmentNumber << 1) + 1, std::set <Biedge> ());    //reverse edge

    std::vector <std::set <char> > segmentDirection = std::vector <std::set <char> > (segmentNumber + 1, std::set <char>());

    start = std::chrono::high_resolution_clock::now();
    for(auto line: tempLine) {
        std::istringstream iss(line);
        std::vector <std::string> tokens;
        std::string token;

        while (std::getline(iss, token, '\t')) {
            tokens.push_back(token);
        }

        long long lseg, rseg, lnode, rnode, lvertex, rvertex;
        if (segmentID.count(tokens[1])) {
            lseg = segmentID[tokens[1]];
            segmentDirection[lseg].insert(tokens[2][0]);
        } else {
            std::cerr << "!!! Error: failed to find the segment " << tokens[1] << std::endl;
            continue;
        }
        
        if (segmentID.count(tokens[3])) {
            rseg = segmentID[tokens[3]];
            segmentDirection[rseg].insert(tokens[4][0]);
        } else {
            std::cerr << "!!! Error: failed to find the segment " << tokens[3] << std::endl;
            continue;
        }

        if (tokens[2] == "+") {
            lnode = (lseg << 1);
            lvertex = (lseg << 1) - 1;

            // directed biedged graph加segment型边
            Biedge newBiedge;
            newBiedge.to = lnode;
            newBiedge.value = (biedgedGraph.edge[lnode - 1].begin() -> value);
            diBiedgedGraph.edge[lnode - 1].insert(newBiedge);
        
        } else {
            lnode = (lseg << 1) - 1;
            lvertex = (lseg << 1);

            Biedge newBiedge;
            newBiedge.to = lnode;
            newBiedge.value = (biedgedGraph.edge[lnode + 1].begin() -> value);
            diBiedgedGraph.edge[lnode + 1].insert(newBiedge);
        }

        if(tokens[4] == "+") {
            rnode = (rseg << 1) - 1;
            rvertex = (rseg << 1) - 1;

            Biedge newBiedge;
            newBiedge.to = rnode + 1;
            newBiedge.value = (biedgedGraph.edge[rnode].begin() -> value);
            diBiedgedGraph.edge[rnode].insert(newBiedge);
        } else {
            rnode = (rseg << 1);
            rvertex = (rseg << 1);

            Biedge newBiedge;
            newBiedge.to = rnode - 1;
            newBiedge.value = (biedgedGraph.edge[rnode].begin() -> value);
            diBiedgedGraph.edge[rnode].insert(newBiedge);
        }
        // std::cout << line << std::endl;
        // std::cout << lnode << " " << rnode << std::endl;

        // diGraph赋点权，加边
        diGraph.vertexVal[lvertex] = biedgedGraph.edge[lvertex].begin() -> value;
        diGraph.vertexVal[rvertex] = biedgedGraph.edge[rvertex].begin() -> value;
        diGraph.edge[lvertex].insert(rvertex);
        diGraph.inDegree[rvertex] ++;
        diGraph.outDegree[lvertex] ++;

        // biedgedGraph加link型边
        Biedge newBiedge;
        newBiedge.to = rnode;
        biedgedGraph.edge[lnode].insert(newBiedge);

        newBiedge.to = lnode;
        biedgedGraph.edge[rnode].insert(newBiedge);

        // directed biedged graph加link型边
        newBiedge.to = rnode;
        diBiedgedGraph.edge[lnode].insert(newBiedge);

        // directed biedged graph加link型边 的反向边    
        newBiedge.to=lnode;                             //
        diBiedgedGraph.redge[rnode].insert(newBiedge);  //
    }

    diGraph.vertexNumber = diGraph.vertexVal.size();
    biedgedGraph.vertexNumber = (segmentNumber << 1);
    diBiedgedGraph.vertexNumber = (segmentNumber << 1);

    std::cout << "+++ Loading complete! +++" << std::endl;

    end = std::chrono::high_resolution_clock::now();
    duration = end - start;
    std::cout << "Execution time: " << duration.count() << " seconds" << std::endl;

    // 统计segment的复用率
    for (long long seg = 1; seg <= segmentNumber; seg ++) {
        if (segmentDirection[seg].size() == 1) {
            singleDirectionSegmentCount ++;
        } else if (segmentDirection[seg].size() == 2) {
            biDirectionalSegmentCount ++;
        }
    }
    printMemoryUsage();

    std::cout << "+++ The gfa file has " 
        << segmentNumber << " segments (" 
        << singleDirectionSegmentCount << " unidirectional segments and "
        << biDirectionalSegmentCount << " bidirectional segments) and " 
        << linkNumber << " links, with a total size of " 
        << std::fixed << std::setprecision(2) << size << " " << units[unitIndex] << ". +++\n";

    std::string outputFile;
    if (!outputFolderPath.empty() && outputFolderPath.back() == '/') {
        std::filesystem::create_directories(outputFolderPath + "gfa");
        outputFile = outputFolderPath + "gfa/basicStatistics.txt";
    } else {
        std::filesystem::create_directories(outputFolderPath + "/gfa");
        outputFile = outputFolderPath + "/gfa/basicStatistics.txt";
    }
    std::ofstream outFile(outputFile);

    if (!outFile.is_open()) {
        std::cerr << "Error opening file: " << outputFile << std::endl;
        return;
    }

    outFile << "file_size\t" << std::fixed << std::setprecision(2) << size << units[unitIndex] 
            << "\n#segments\t" << segmentNumber 
            << "\n#links\t\t" << linkNumber 
            << "\n#paths\t\t" << pathNumber 
            << "\n#single_direction_segment\t\t\t" << singleDirectionSegmentCount 
            << "\n#bidirectional_direction_segment\t" << biDirectionalSegmentCount << '\n';

    outFile.close();
}


void Gfa::printDigraphInfo(const std::string& gfaFile, const std::string& outputFolderPath, DiGraph& diGraph) {
    std::string digraphFolder;
    if (!outputFolderPath.empty() && outputFolderPath.back() == '/') {
        digraphFolder = outputFolderPath + "digraph";
    } else {
        digraphFolder = outputFolderPath + "/digraph";
    }
    std::filesystem::create_directories(digraphFolder);

    std::string basicStatisticsFile = digraphFolder + "/basicStatistics.txt";
    std::ofstream basicStatistics(basicStatisticsFile);
    if (!basicStatistics.is_open()) {
        std::cerr << "Error opening file: " << basicStatisticsFile << std::endl;
        return;
    }

    // **输出 vertex 的信息**
    Vertex vertex;
    vertex.statVertex(diGraph);

    std::string vertexvalFile = digraphFolder + "/vertexval.txt";
    std::string indegreeFile = digraphFolder + "/inDegree.txt";
    std::string outdegreeFile = digraphFolder + "/outDegree.txt";

    basicStatistics << "#vertices\t\t" << diGraph.vertexNumber 
        << "\ntotal_length\t" << vertex.totalLen 
        << "\nN50\t\t\t\t" << vertex.N50 
        << "\nL50\t\t\t\t" << vertex.L50 
        << "\nU50\t\t\t\t" << vertex.U50 
        << "\n#dead_ends\t\t" << vertex.deadEnd 
        << "\n#start_ends\t\t" << vertex.startEnd << "\n";
    diGraph.vertexvalStat(vertexvalFile);
    vertex.printInDegree2File(indegreeFile);
    vertex.printOutDegree2File(outdegreeFile);


    // **输出 edge 的信息**
    std::string cycleFile = digraphFolder + "/cycle.txt";
    std::string loopFile = digraphFolder + "/loop.txt";

    Edge edge;
    edge.stat(diGraph);

    auto start = std::chrono::system_clock::now();

    Connectivity diConnectivity = Connectivity(diGraph.vertexNumber);
	std::vector <DiGraph> diSubgraphList = std::vector <DiGraph>();
	diConnectivity.edgeCompress(diGraph);
    diConnectivity.findWCC(diGraph);
	diConnectivity.findSCC(diGraph);
    auto end = std::chrono::system_clock::now();
    std::chrono::duration<double> elapsed_seconds = end - start;
    std::cout << "求连通分量的时间: " << elapsed_seconds.count() << " 秒" << std::endl;

	diConnectivity.SCC2Subgraph(diGraph, diSubgraphList);
	// 只需要在上一步分离出的SCC中统计cycle相关指标，大大降低时间复杂度

    start = std::chrono::system_clock::now();

	Cycle cycle(numThreads);
	cycle.work(diSubgraphList, edge.loopLen);
    edge.print2File(loopFile, 1);
	cycle.print2File(cycleFile, edge.loopCount);

    end = std::chrono::system_clock::now();
    elapsed_seconds = end - start;
    std::cout << "求 cycle 的程序运行时间: " << elapsed_seconds.count() << " 秒" << std::endl;

    basicStatistics << "#edges\t\t\t" << edge.edgeCount 
        << "\n#loops\t\t\t" << edge.loopCount
        << "\n#cycles\t\t\t" << cycle.cycleCount + edge.loopCount
        << "\nminimum_weight_cycle_without_loop\t" << cycle.minCycleLen << "\n";

    
    // **输出 subgraph 的信息**
    basicStatistics << "#weak_connected_components\t\t\t" << diConnectivity.wccCount
        << "\n#strongly_connected_components\t\t" << diConnectivity.sccCount << "\n";
    

    std::cerr << "+++ The statistics on the digraph are complete." << std::endl << std::endl;
}


void Gfa::printBigraphInfo(const std::string& gfaFile, const std::string& outputFolderPath, DiGraph& diGraph, BiedgedGraph& biedgedGraph) {
    std::string digraphFolder, bidirectedGraphFolder, biedgedGraphFolder;
    if (!outputFolderPath.empty() && outputFolderPath.back() == '/') {
        digraphFolder = outputFolderPath + "digraph";
        bidirectedGraphFolder = outputFolderPath + "bidirectedGraph";
        biedgedGraphFolder = outputFolderPath + "biedgedGraph";
    } else {
        digraphFolder = outputFolderPath + "/digraph";
        bidirectedGraphFolder = outputFolderPath + "/bidirectedGraph";
        biedgedGraphFolder = outputFolderPath + "/biedgedGraph";
    }
    std::filesystem::create_directories(bidirectedGraphFolder);
    std::filesystem::create_directories(biedgedGraphFolder);

    std::string bidirectedBasicFile = bidirectedGraphFolder + "/basicStatistics.txt";
    std::string biedgedBasicFile = biedgedGraphFolder + "/basicStatistics.txt";
    std::ofstream bidirectedBasic(bidirectedBasicFile);
    std::ofstream biedgedBasic(biedgedBasicFile);


    // *处理 bidirected graph*
    if (!bidirectedBasic.is_open()) {
        std::cerr << "Error opening file: " << bidirectedBasicFile << std::endl;
        return;
    }

    // **输出 vertex 的信息**
    Vertex vertex;
    vertex.statVertex(biedgedGraph);

    std::string bidirectedVertexvalFile = bidirectedGraphFolder + "/vertexval.txt";
    std::string bidirectedDegreeFile = bidirectedGraphFolder + "/degree.txt";
    std::string diCoverageFile = digraphFolder + "/coverage.txt";
    std::string bidirectedCoverageFile = bidirectedGraphFolder + "/coverage.txt";

    bidirectedBasic << "#vertices\t\t\t\t\t" << (biedgedGraph.vertexNumber >> 1)
        << "\ntotal_length\t\t\t\t" << vertex.totalLen 
        << "\nN50\t\t\t\t\t\t\t" << vertex.N50 
        << "\nL50\t\t\t\t\t\t\t" << vertex.L50 
        << "\nU50\t\t\t\t\t\t\t" << vertex.U50 
        << "\n#dead_ends\t\t\t\t\t" << vertex.deadEnd << "\n";
    biedgedGraph.edgevalStat(bidirectedVertexvalFile);
    vertex.printDegree2File(bidirectedDegreeFile);

    Coverage coverage = Coverage(gfaFile, pathNumber, segmentID);
	coverage.statCoverage(diGraph, biedgedGraph);
    coverage.print2File(diCoverageFile, 1);
    coverage.print2File(bidirectedCoverageFile, 2);

    // **输出 edge 的信息**
    std::string bidirectedLoopFile = bidirectedGraphFolder + "/loop.txt";

    Edge edge;
    edge.stat(biedgedGraph);
    edge.print2File(bidirectedLoopFile, 2);

    bidirectedBasic << "#edges\t\t\t\t\t\t" << edge.linkEdgeCount 
        << "\n#loops\t\t\t\t\t\t" << edge.loopCount << "\n";

    // **输出 subgraph 的信息**
    Connectivity biConnectivity = Connectivity(biedgedGraph.vertexNumber);
	std::vector <BiedgedGraph> diBiSubgraphList = std::vector <BiedgedGraph>();
	biConnectivity.findComponent(biedgedGraph);

    auto start = std::chrono::system_clock::now();

    Bubble biBubble;
	biBubble.findBubble(biedgedGraph, 0);
    biBubble.print2File(bidirectedGraphFolder);

    auto end = std::chrono::system_clock::now();
    std::chrono::duration<double> elapsed_seconds = end - start;
    // std::cout << "bidirected graph 求 bubble 的程序运行时间: " << elapsed_seconds.count() << " 秒" << std::endl;

    bidirectedBasic << "#cuts\t\t\t\t\t\t" << biConnectivity.cutPointCount 
        << "\n#connected_components\t\t" << biConnectivity.ccCount 
        << "\n#supperbubbles\t\t\t\t" << biBubble.superBubbleCount
        << "\nsimple_bubbles\t\t\t\t" << biBubble.simpleBubbleCount 
        << std::fixed << std::setprecision(4)
        << "\nsequence_coverage_of_chains\t" << biBubble.seqCoverage << "%"
        << "\nnode_coverage_of_chains\t\t" << biBubble.nodeCoverage << "%"
        << "\nlongest_chain_seq_wise\t\t" << biBubble.maxChainBp << " bp"
        << "\nlongest_chain_bubble_wise\t" << biBubble.maxChainBubbleCount << " bubble(s)" << "\n";
    bidirectedBasic.close();
    std::cerr << "+++ The statistics on the bidirected graph are complete." << std::endl << std::endl;


    // *处理 biedged graph*
    if (!biedgedBasic.is_open()) {
        std::cerr << "Error opening file: " << biedgedBasicFile << std::endl;
        return;
    }
    
    // **输出 vertex 的信息**
    std::string biedgedDegreeFile = biedgedGraphFolder + "/degree.txt";
    vertex.printLinkDegree2File(biedgedDegreeFile);

    biedgedBasic << "#vertices\t\t" << biedgedGraph.vertexNumber << "\n";

    // **输出 edge 的信息**
    std::string biedgedLoopFile = biedgedGraphFolder + "/loop.txt";
    edge.print2File(biedgedLoopFile, 3);

    biedgedBasic << "#edges\t\t\t" << (biedgedGraph.vertexNumber >> 1) + edge.linkEdgeCount 
        << "\n#loops\t\t\t" << edge.loopCount << "\n";

    // **输出 subgraph 的信息**
    biedgedBasic << "#cuts\t\t\t" << biConnectivity.bridgeCount << "\n";
    biedgedBasic.close();
    std::cerr << "+++ The statistics on the biedged graph are complete." << std::endl << std::endl;
}