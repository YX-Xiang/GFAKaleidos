#ifndef __PATH_H__
#define __PATH_H__


#include <cstdlib>
#include <iterator>
#include <sstream>

#include "graph.h"


class Coverage {
    public:
        Coverage(const std::string& , const int, const std::unordered_map <std::string, long long>&);
        ~Coverage();

        void statCoverage(const DiGraph&, const BiedgedGraph&);
        void print2File(const std::string&, int);

    private:
        int pathNumber;
        std::vector <long long> vertexCoverage, edgeCoverage, bpCoverage, vertexCoverage2, edgeCoverage2, bpCoverage2;
        std::string pathFileName;
        const std::unordered_map <std::string, long long>& segmentID;
};


class Growth {
    public:
        //const std::vector <std::vector <std::pair <int, char> > >& path;
        int numThreads;
        std::string outputPath;

        Growth(const std::string&);
        ~Growth();

        void statGrowth(const std::string&);
        // void statGrowth(const DiGraph&);
        // void statGrowth(const BiedgedGraph&);
        void print2File(const std::string&);

    /*
    private:
        // common (≥5% of all non-reference haplotypes) and core (≥95% of all non-reference haplotypes)
        std::vector <int> vertexGrowth, vertexCommonGrowth, vertexCoreGrowth;
        std::vector <int> edgeGrowth, edgeCommonGrowth, edgeCoreGrowth;
        std::vector <long long> bpGrowth, bpCommonGrowth, bpCoreGrowth;
    */
};

#endif