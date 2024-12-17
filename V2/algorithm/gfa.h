#ifndef __GFA_H__
#define __GFA_H__


#include <string>
#include <utility>
#include <unordered_map>
#include <fstream>
#include <ostream>
#include <sstream>
#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>
#include <vector>
#include <iomanip>
#include <filesystem>
#include <chrono>

#include "graph.h"
#include "vertex.h"
#include "edge.h"
#include "path.h"
#include "connectivity.h"
#include "bubble.h"


class Gfa {
    public:
        size_t fileSize;
        int numThreads;
        long long segmentNumber, linkNumber;
        int pathNumber;
        long long singleDirectionSegmentCount, biDirectionalSegmentCount;
        std::unordered_map <std::string, long long> segmentID;

        Gfa(int);
        ~Gfa();

        void gfa2Graph(const std::string&, const std::string&, DiGraph&, BiedgedGraph&, BiedgedGraph&);
        void printDigraphInfo(const std::string&, const std::string&, DiGraph&);
        void printBigraphInfo(const std::string&, const std::string&, DiGraph&, BiedgedGraph&);
};


#endif