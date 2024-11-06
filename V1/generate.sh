#!/bin/bash

cat <<'EOL' > index.html
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>demo</title>
    <style>
        body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            font-family: Arial, sans-serif;
        }

        /* 主容器布局 */
        .container {
            display: flex;
            height: 100vh;
        }

        /* 侧边栏样式 */
        .sidebar {
            width: 20%;
            background-color: #333;
            color: white;
            padding: 20px;
            box-sizing: border-box;
            overflow-y: auto;
            position: relative;
        }

        .sidebar h2 {
            text-align: center;
            margin-bottom: 20px;
        }

        .sidebar ul {
            list-style-type: none;
            padding: 0;
            margin: 0;
        }

        .sidebar ul li {
            padding: 10px;
            margin-bottom: 10px;
            background-color: #555;
            text-align: center;
            border-radius: 5px;
            cursor: pointer;
            position: relative;
        }

        .sidebar ul li:hover {
            background-color: #666;
        }

        .sidebar ul li ul {
            list-style-type: none;
            padding: 0;
            margin: 0;
            display: none; /* 隐藏子菜单 */
        }

        .sidebar ul li ul li {
            background-color: #666;
            padding: 8px;
            margin: 5px 0;
            text-align: left;
        }

        /* 中间可变内容区域 */
        .main-content {
            flex: 1;
            padding: 20px;
            background-color: #f4f4f4;
            box-sizing: border-box;
            overflow-y: auto;
        }

        /* 右侧固定内容区域 */
        .fixed-content {
            width: 20%;
            background-color: #555;
            color: white;
            padding: 20px;
            box-sizing: border-box;
            overflow-y: auto;
            position: relative;
        }

        .fixed-content h2 {
            text-align: center;
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse; /* 合并边框 */
            margin: 20px auto; /* 居中显示 */
            font-family: Arial, sans-serif; /* 字体样式 */
        }

        /* 设置表头样式 */
        th {
            background-color: #555; /* 背景色 */
            color: white; /* 文字颜色 */
            padding: 10px; /* 内边距 */
            text-align: center; /* 居中对齐 */
        }

        /* 设置表格数据单元格样式 */
        td {
            border: 1px solid #ddd; /* 边框 */
            padding: 10px; /* 内边距 */
            text-align: center; /* 居中对齐 */
        }

        /* 设置表格行的背景色交替效果 */
        tr:nth-child(even) {
            background-color: #f2f2f2; /* 偶数行背景色 */
            color: black;
        }
        tr:nth-child(odd) {
            
            
            background-color: #555;
            color: white; /* Set text color for dark background */
        }
        /* 设置表格行在鼠标悬停时的效果 */
        tr:hover {
            background-color: #ddd; /* 悬停背景色 */
        }
        
        input[type="checkbox"] {
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            width: 18px;
            height: 18px;
            border: 2px solid #ffffff;
            border-radius: 4px;
            background-color: #fff;
            cursor: pointer;
            outline: none;
            position: relative;
            display: inline-block;
            vertical-align: middle;
            margin-right: 8px;
        }

        /* 自定义选中状态，显示打钩图标 */
        input[type="checkbox"]:checked {
            background-color: #ddd;
            border-color: #ddd;
        }

        input[type="checkbox"]:checked::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 6px;
            height: 12px;
            border: solid white;
            border-width: 0 2px 2px 0;
            transform: translate(-50%,-50%)rotate(45deg);
        }

        /* 鼠标悬停时的效果 */
        input[type="checkbox"]:hover {
            border-color: #333;
        }

        /* 设置复选框和文字的间距 */
        label {
            display: inline-flex;
            align-items: center;
            font-size: 14px;
            color: #555;
            cursor: pointer;
        }
        li {
    text-align: center; /* 水平居中对齐文本 */
    list-style-type: none; /* 去掉列表前的默认符号 */
}

.upload-container {
    text-align: center;
    margin: 20px 0;
}

/* Hide the actual file input */
input[type="file"] {
    display: none;
}

/* Style the custom upload button */


/* Style the submit button */
input[type="submit"] {
    padding: 10px 20px;
    background-color: #333;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

input[type="submit"]:hover {
    background-color: #555;
}

    </style>
</head>
<body>
    <div class="container">
        <!-- 侧边栏 -->
        <div class="sidebar">
            <h2>MENU</h2>
            <ul>
                <li onclick="toggleMenu('menu2')">Vertices on the graph
                    <ul id="menu2" onclick="event.stopPropagation();">
                        <li ><input type="checkbox" id = "vertices" onchange="toggleTableRow(this)"> the number of vertices </li>
                        <li ><input type="checkbox" id = "total_length" onchange="toggleTableRow(this)"> Total Length</li>
                        <li ><input type="checkbox" id = "N50" onchange="toggleTableRow(this)"> N50</li>
                        <li ><input type="checkbox" id = "L50" onchange="toggleTableRow(this)"> L50</li>
                        <li ><input type="checkbox" id = "U50" onchange="toggleTableRow(this)"> U50</li>
                        <li ><input type="checkbox" id = "DegreeDistribution" onchange="toggleTableRow(this)"> Degree Distribution</li>
                        <li ><input type="checkbox" id = "dead_ends" onchange="toggleTableRow(this)"> Dead Ends</li>
                        <li ><input type="checkbox" id = "start_ends" onchange="toggleTableRow(this)"> Start Ends</li>
                        <li ><input type="checkbox" id = "Coverage" onchange="toggleTableRow(this)"> Coverage</li>
                    </ul>
                </li>
                <li onclick="toggleMenu('menu3')">Edges on the graph
                    <ul id="menu3" onclick="event.stopPropagation();">
                        <li ><input type="checkbox" id = "edges" onchange="toggleTableRow(this)"> the number of edges</li>
                        <li ><input type="checkbox" id = "loops" onchange="toggleTableRow(this)"> Loops</li>
                        <li ><input type="checkbox" id = "LoopLength" onchange="toggleTableRow(this)"> Loop Length</li>
                        <li ><input type="checkbox" id = "cycles" onchange="toggleTableRow(this)"> Cycles</li>
                        <li ><input type="checkbox" id = "minimum_weight_cycle_without_loop" onchange="toggleTableRow(this)"> Minimum Weight Cycle</li>
                        <li ><input type="checkbox" id = "CycleDistribution" onchange="toggleTableRow(this)"> Cycle Distribution</li>
                    </ul>
                </li>
                <li onclick="toggleMenu('menu4')">Subgraphs on the graph
                    <ul id="menu4" onclick="event.stopPropagation();">
                        <li ><input type="checkbox" id = "cuts" onchange="toggleTableRow(this)"> Cuts</li>
                        <li ><input type="checkbox" id = "connected_components" onchange="toggleTableRow(this)"> Connected Components</li>
                        <li ><input type="checkbox" id = "weak_connected_components" onchange="toggleTableRow(this)"> Weak Connected Components</li>
                        <li ><input type="checkbox" id = "strongly_connected_components" onchange="toggleTableRow(this)"> Strongly Connected Components</li>
                        <li ><input type="checkbox" id = "supperbubbles" onchange="toggleTableRow(this)"> Supperbubbles</li>
                        <li ><input type="checkbox" id = "simple_bubbles" onchange="toggleTableRow(this)"> Simple Bubbles</li>
                        <li ><input type="checkbox" id = "NestedBubbles" onchange="toggleTableRow(this)"> Nested Bubbles</li>
                        <li ><input type="checkbox" id = "BubbleChains" onchange="toggleTableRow(this)"> Bubble Chains</li>
                        <li ><input type="checkbox" id = "sequence_coverage_of_chains" onchange="toggleTableRow(this)"> sequence_coverage_of_chains</li>
                        <li ><input type="checkbox" id = "node_coverage_of_chains" onchange="toggleTableRow(this)"> node_coverage_of_chains</li>
                        <li ><input type="checkbox" id = "longest_chain_seq_wise" onchange="toggleTableRow(this)">longest_chain_seq_wise</li>
                        <li ><input type="checkbox" id = "longest_chain_bubble_wise" onchange="toggleTableRow(this)"> longest_chain_bubble_wise</li>
                    </ul>

                </li>
            </ul>
        </div>

        <!-- 中间可变内容区域 -->
        <div class="main-content" id="main-content">
            
            <table id="graphTable">
                <thead>
                    <tr>
                        <th>digraph</th>
                        <th>bidirectedGraph</th>
                        <th>biedgedGraph</th>
                        <th>dibigraph</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="display: none;" style="visibility: hidden;">
                        <td colspan="4" >the number of vertices</td>
                    </tr>
                    <tr id="verticesRow" style="display: none;" style="visibility: hidden;">
                        <td data-graph="digraph"></td>
                        <td data-graph="bidirectedGraph"></td>
                        <td data-graph="biedgedGraph"></td>
                        <td data-graph="dibigraph"></td>
                    </tr>
                    <tr style="display: none;" style="visibility: hidden;">
                        <td colspan="4" >Total Length</td>
                    </tr>
                    <tr id="total_lengthRow" style="display: none;" style="visibility: hidden;">
                        <td data-graph="digraph"></td>
                        <td data-graph="bidirectedGraph"></td>
                        <td data-graph="biedgedGraph"></td>
                        <td data-graph="dibigraph"></td>
                    </tr>
                    <tr style="display: none;" style="visibility: hidden;">
                        <td colspan="4" >N50</td>
                    </tr>
                    <tr id="N50Row" style="display: none;" style="visibility: hidden;">
                        <td data-graph="digraph"></td>
                        <td data-graph="bidirectedGraph"></td>
                        <td data-graph="biedgedGraph"></td>
                        <td data-graph="dibigraph"></td>
                    </tr>
                    <tr style="display: none;" style="visibility: hidden;">
                        <td colspan="4" >L50</td>
                    </tr>
                    <tr id="L50Row"  style="display: none;" style="visibility: hidden;">
                        <td data-graph="digraph"></td>
                        <td data-graph="bidirectedGraph"></td>
                        <td data-graph="biedgedGraph"></td>
                        <td data-graph="dibigraph"></td>
                    </tr>
                    <tr style="display: none;" style="visibility: hidden;">
                        <td colspan="4" >U50</td>
                    </tr>
                    <tr id="U50Row" style="display: none;" style="visibility: hidden;">
                        <td data-graph="digraph"></td>
                        <td data-graph="bidirectedGraph"></td>
                        <td data-graph="biedgedGraph"></td>
                        <td data-graph="dibigraph"></td>
                    </tr>
                    <tr style="display: none;" style="visibility: hidden;">
                        <td colspan="4" >Degree Distribution</td>
                    </tr>
                    <tr id="DegreeDistributionRow" style="display: none;" style="visibility: hidden;">
                        <td data-graph="digraph"></td>
                        <td data-graph="bidirectedGraph"></td>
                        <td data-graph="biedgedGraph"></td>
                        <td data-graph="dibigraph">
                            <button onclick="showdegree('web/gfaGlimpse/data/dibigraph/degree.txt','segment')">segment</button>
                            <button onclick="showdegree('web/gfaGlimpse/data/dibigraph/degree.txt','link')">link</button>
                        </td>
                    </tr>
                    <tr style="display: none;" style="visibility: hidden;">
                        <td colspan="4" >the number of DeadEnds</td>
                    </tr>
                    <tr id="dead_endsRow" style="display: none;"  style="visibility: hidden;">
                        <td data-graph="digraph"></td>
                        <td data-graph="bidirectedGraph"></td>
                        <td data-graph="biedgedGraph"></td>
                        <td data-graph="dibigraph"></td>
                    </tr>
                    <tr style="display: none;" style="visibility: hidden;">
                        <td colspan="4" >the number of StartEnds</td>
                    </tr>
                    <tr id="start_endsRow" style="display: none;"  style="visibility: hidden;">
                        <td data-graph="digraph"></td>
                        <td data-graph="bidirectedGraph"></td>
                        <td data-graph="biedgedGraph"></td>
                        <td data-graph="dibigraph"></td>
                    </tr>
                    <tr style="display: none;" style="visibility: hidden;">
                        <td colspan="4" >Coverage</td>
                    </tr>
                    <tr id="CoverageRow" style="display: none;"  style="visibility: hidden;">
                        <td data-graph="digraph"> 
                            <button onclick="showcoverageGraph('digraph','web/gfaGlimpse/data/digraph/coverage.txt','bp')">bp</button>
                            <button onclick="showcoverageGraph('digraph','web/gfaGlimpse/data/digraph/coverage.txt','Node')">Node</button>
                            <button onclick="showcoverageGraph('digraph','web/gfaGlimpse/data/digraph/coverage.txt','Edge')">Edge</button>
                        </td>
                        <td data-graph="bidirectedGraph">
                            <button onclick="showcoverageGraph('bidirectedGraph','web/gfaGlimpse/data/bidirectedGraph/coverage.txt','bp')">bp</button>
                            <button onclick="showcoverageGraph('bidirectedGraph','web/gfaGlimpse/data/bidirectedGraph/coverage.txt','Node')">Node</button>
                            <button onclick="showcoverageGraph('bidirectedGraph','web/gfaGlimpse/data/bidirectedGraph/coverage.txt','Edge')">Edge</button>
                        </td>
                        <td data-graph="biedgedGraph">\</td>
                        <td data-graph="dibigraph">\</td>
                    </tr>
                    
                    <tr style="display: none;" style="visibility: hidden;">
                        <td colspan="4" >the number of edges</td>
                    </tr>
                    <tr id="edgesRow" style="display: none;" style="visibility: hidden;">
                        <td data-graph="digraph"></td>
                        <td data-graph="bidirectedGraph"></td>
                        <td data-graph="biedgedGraph"></td>
                        <td data-graph="dibigraph"></td>
                    </tr>
                    <tr style="display: none;" style="visibility: hidden;">
                        <td colspan="4" >the number of loops</td>
                    </tr>
                    <tr id="loopsRow" style="display: none;" style="visibility: hidden;">
                        <td data-graph="digraph"></td>
                        <td data-graph="bidirectedGraph"></td>
                        <td data-graph="biedgedGraph"></td>
                        <td data-graph="dibigraph"></td>
                    </tr>
                    <tr style="display: none;" style="visibility: hidden;">
                        <td colspan="4" >Loop Length</td>
                    </tr>
                    <tr id="LoopLengthRow" style="display: none;" style="visibility: hidden;">
                        <td data-graph="digraph"></td>
                        <td data-graph="bidirectedGraph"></td>
                        <td data-graph="biedgedGraph"></td>
                        <td data-graph="dibigraph"></td>
                    </tr>
                    <tr style="display: none;" style="visibility: hidden;">
                        <td colspan="4" >the number of Cycles</td>
                    </tr>
                    <tr id="cyclesRow" style="display: none;" style="visibility: hidden;">
                        <td data-graph="digraph"></td>
                        <td data-graph="bidirectedGraph"></td>
                        <td data-graph="biedgedGraph"></td>
                        <td data-graph="dibigraph"></td>
                    </tr>
                    <tr style="display: none;" style="visibility: hidden;">
                        <td colspan="4" >Minimum Weight Cycle Without Loop</td>
                    </tr>
                    <tr id="minimum_weight_cycle_without_loopRow" style="display: none;" style="visibility: hidden;">
                        <td data-graph="digraph"></td>
                        <td data-graph="bidirectedGraph"></td>
                        <td data-graph="biedgedGraph"></td>
                        <td data-graph="dibigraph"></td>
                    </tr>
                    <tr style="display: none;" style="visibility: hidden;">
                        <td colspan="4" > Cycle Distribution</td>
                    </tr>
                    <tr id="CycleDistributionRow" style="display: none;" style="visibility: hidden;">
                        <td data-graph="digraph"></td>
                        <td data-graph="bidirectedGraph">\</td>
                        <td data-graph="biedgedGraph">\</td>
                        <td data-graph="dibigraph"></td>
                    </tr>
                   
                    <tr style="display: none;" style="visibility: hidden;">
                        <td colspan="4" >the number of cuts</td>
                    </tr>
                    <tr id="cutsRow" style="display: none;" style="visibility: hidden;">
                        <td data-graph="digraph"></td>
                        <td data-graph="bidirectedGraph"></td>
                        <td data-graph="biedgedGraph"></td>
                        <td data-graph="dibigraph"></td>
                    </tr>
                    <tr style="display: none;" style="visibility: hidden;">
                        <td colspan="4" >the number of connected_components </td>
                    </tr>
                    <tr id="connected_componentsRow"  style="display: none;" style="visibility: hidden;">
                        <td data-graph="digraph"></td>
                        <td data-graph="bidirectedGraph"></td>
                        <td data-graph="biedgedGraph"></td>
                        <td data-graph="dibigraph"></td>
                    </tr >
                    <tr style="display: none;" style="visibility: hidden;">
                        <td colspan="4" >the number of weak_connected_components </td>
                    </tr>
                    <tr id="weak_connected_componentsRow"  style="display: none;" style="visibility: hidden;">
                        <td data-graph="digraph"></td>
                        <td data-graph="bidirectedGraph"></td>
                        <td data-graph="biedgedGraph"></td>
                        <td data-graph="dibigraph"></td>
                    </tr >
                    <tr style="display: none;" style="visibility: hidden;">
                        <td colspan="4" >the number of strongly_connected_components </td>
                    </tr>
                    <tr id="strongly_connected_componentsRow"  style="display: none;" style="visibility: hidden;">
                        <td data-graph="digraph"></td>
                        <td data-graph="bidirectedGraph"></td>
                        <td data-graph="biedgedGraph"></td>
                        <td data-graph="dibigraph"></td>
                    </tr >
                    <tr style="display: none;" style="visibility: hidden;">
                        <td colspan="4" >the number of supperbubbles</td>
                    </tr>
                    <tr id="supperbubblesRow" style="display: none;" style="visibility: hidden;">
                        <td data-graph="digraph"></td>
                        <td data-graph="bidirectedGraph"></td>
                        <td data-graph="biedgedGraph"></td>
                        <td data-graph="dibigraph"></td>
                    </tr>
                    <tr style="display: none;" style="visibility: hidden;">
                        <td colspan="4" >the number of simplebubbles</td>
                    </tr>
                    <tr id="simple_bubblesRow" style="display: none;" style="visibility: hidden;">
                        <td data-graph="digraph"></td>
                        <td data-graph="bidirectedGraph"></td>
                        <td data-graph="biedgedGraph"></td>
                        <td data-graph="dibigraph"></td>
                    </tr>
                    
                    <tr style="display: none;" style="visibility: hidden;">
                        <td colspan="4" >Nested Bubbles Level</td>
                    </tr>
                    <tr id="NestedBubblesRow" style="display: none;" style="visibility: hidden;">
                        <td data-graph="digraph"></td>
                        <td data-graph="bidirectedGraph"></td>
                        <td data-graph="biedgedGraph"></td>
                        <td data-graph="dibigraph"></td>
                    </tr>
                    <tr style="display: none;" style="visibility: hidden;">
                        <td colspan="4" >Bubble Chains Distribution</td>
                    </tr>
                    <tr id="BubbleChainsRow" style="display: none;" style="visibility: hidden;">
                        <td data-graph="digraph"></td>
                        <td data-graph="bidirectedGraph"></td>
                        <td data-graph="biedgedGraph"></td>
                        <td data-graph="dibigraph"></td>
                    </tr>
                    
                    <tr style="display: none;" style="visibility: hidden;">
                        <td colspan="4" >sequence_coverage_of_chains</td>
                    </tr>
                    <tr id="sequence_coverage_of_chainsRow" style="display: none;" style="visibility: hidden;">
                        <td data-graph="digraph"></td>
                        <td data-graph="bidirectedGraph"></td>
                        <td data-graph="biedgedGraph"></td>
                        <td data-graph="dibigraph"></td>
                    </tr>
                    <tr style="display: none;" style="visibility: hidden;">
                        <td colspan="4" >node_coverage_of_chains</td>
                    </tr>
                    <tr id="node_coverage_of_chainsRow" style="display: none;" style="visibility: hidden;">
                        <td data-graph="digraph"></td>
                        <td data-graph="bidirectedGraph"></td>
                        <td data-graph="biedgedGraph"></td>
                        <td data-graph="dibigraph"></td>
                    </tr>
                    <tr style="display: none;" style="visibility: hidden;">
                        <td colspan="4" >longest_chain_seq_wise</td>
                    </tr>
                    <tr id="longest_chain_seq_wiseRow" style="display: none;" style="visibility: hidden;">
                        <td data-graph="digraph"></td>
                        <td data-graph="bidirectedGraph"></td>
                        <td data-graph="biedgedGraph"></td>
                        <td data-graph="dibigraph"></td>
                    </tr>
                    <tr style="display: none;" style="visibility: hidden;">
                        <td colspan="4" >longest_chain_bubble_wise</td>
                    </tr>
                    <tr id="longest_chain_bubble_wiseRow" style="display: none;" style="visibility: hidden;">
                        <td data-graph="digraph"></td>
                        <td data-graph="bidirectedGraph"></td>
                        <td data-graph="biedgedGraph"></td>
                        <td data-graph="dibigraph"></td>
                    </tr>
                    
                    
                </tbody>
            </table>
            
        </div>
        
        <!-- 右侧固定内容区域 -->
        <div class="fixed-content">
            <table>
                <thead>
                    <tr>
                        <th>GFA file</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td >FileSize</td>
                    </tr>
                    <tr>
                        <td id = "file_size"></td>
                    </tr>
                    <tr>
                        <td>the number of segments</td>
                    </tr>
                    <tr>
                        <td id = "segments"></td>
                    </tr>
                    <tr>
                        <td>the number of links</td>
                    </tr>
                    <tr>
                        <td id = "links"></td>
                    </tr>
                    <tr>
                        <td>the number of paths</td>
                    </tr>
                    <tr>
                        <td id = "paths"></td>
                    </tr>
                    <tr>
                        <td>the number of single_direction_segment </td>
                    </tr>
                    <tr>
                        <td id = "single_direction_segment"></td>
                    </tr>
                    <tr>
                        <td>the number of bidirectional_direction_segment</td>
                    </tr>
                    <tr>
                        <td id ="bidirectional_direction_segment"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    
        
<script>

const graphData = {
    bidirectedGraph: {},
    biedgedGraph: {},
    dibigraph: {},
    digraph: {},
};

const GFAData={};

const fileMap = {
    bidirectedGraph: ['web/gfaGlimpse/data/bidirectedGraph/basicStatistics.txt',
    'web/gfaGlimpse/data/bidirectedGraph/bubbleChainLength.txt',
    'web/gfaGlimpse/data/bidirectedGraph/vertexval.txt'],
    biedgedGraph: ['web/gfaGlimpse/data/biedgedGraph/basicStatistics.txt'],
    dibigraph: ['web/gfaGlimpse/data/dibigraph/basicStatistics.txt',
    'web/gfaGlimpse/data/dibigraph/bubbleChainLength.txt'],
    digraph:['web/gfaGlimpse/data/digraph/basicStatistics.txt',
    'web/gfaGlimpse/data/digraph/cycle.txt',
    'web/gfaGlimpse/data/digraph/vertexval.txt']
};

function loadFileData(graphType, filePath) {
    return fetch(filePath)
    .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const lines = data.split('\n');
            lines.forEach(line => {
                //console.log(line);
                const cleanedLine = line.replace(/^#/, '').trim();
                const [key, value] = cleanedLine.split(/\s+/).filter(Boolean);
                if (key && value) {
                    graphData[graphType][key] = value; // 将数据存储到对应的图类型中
                }
            });
        })
        .catch(error => console.error(`Error loading data from ${filePath}:`, error));
}

function loadGFAData(filePath) {
    return fetch(filePath)
    .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
                const lines = data.split('\n');
                lines.forEach(line => {
                    console.log(line);
                    const cleanedLine = line.replace(/^#/, '').trim();
                    const [key, value] = cleanedLine.split(/\s+/).filter(Boolean);
                    if (key && value) {
                        GFAData[key] = value; 
                        const cell = document.querySelector(`#${key}`);
                        if(cell)
                        cell.textContent = value || '/';
                    }
                });
        })            
        .catch(error => console.error(`Error loading data from ${filePath}:`, error));
}

loadGFAData('web/gfaGlimpse/data/gfa/basicStatistics.txt');

// 批量加载每个图的数据
function loadAllData() {
    const loadPromises = [];
    for (const graphType in fileMap) {
        //console.log(graphType);
        fileMap[graphType].forEach(filePath => {
          //  console.log(filePath);
            loadPromises.push(loadFileData(graphType, filePath));
        });
    }
    return Promise.all(loadPromises);
}

loadAllData();

// 监听复选框状态并填充表格
function toggleTableRow(checkbox) {
    const rowId = checkbox.id;
    const descriptionRow = document.querySelector(`#${rowId}Row`).previousElementSibling;
    const row = document.querySelector(`#${rowId}Row`);
    if (checkbox.checked) {
        // 填充每个图类型对应的表格单元格
        descriptionRow.style.display = '';
        row.style.display = '';
        if(rowId == 'DegreeDistribution'){
            DegreeFunction();
        }
        else if(rowId =='LoopLength'){
            loopFunction();
        }
        else if(rowId =='CycleDistribution'){
            cycleFunction();
        }
        else if(rowId == 'NestedBubbles'){
            NestedBubblesFunction();
        }
        else if(rowId =='BubbleChains'){
            BubbleChainsFunction();
        }
        else if(rowId =='Coverage'){
            return ;
        }
        else{
            row.querySelectorAll('td').forEach(cell => {
                const graphType = cell.getAttribute('data-graph');
                cell.textContent = graphData[graphType][rowId] || '/';
            });
        }
    }
    else {
        // 清空对应的表格单元格
        row.querySelectorAll('td').forEach(cell => {
            cell.textContent = '';
        });
        descriptionRow.style.display = 'none';
        row.style.display = 'none';
    }
}


function showcoverageGraph(graph,filepath,type){
    return fetch(filepath)
    .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const row = document.querySelector(`#CoverageRow`);
            let td;
            if (graph === 'digraph')
            {
                td = row.querySelector('td:nth-child(1)');
            }
            else if(graph === 'bidirectedGraph'){
                td = row.querySelector('td:nth-child(2)');
            }
            var x =td.getElementsByTagName('canvas');
            if (x.length)
                {
                    Array.from(x).forEach(function(canvas) {
                    canvas.remove(); // 移除单个 canvas 元素
                    });
                }
            var canvas = document.createElement('canvas');
            canvas.id = 'coverageCanvas'+graph;
            canvas.width = 200;  // Set the width of the canvas
            canvas.height = 150; // Set the height of the canvas
            td.appendChild(canvas);

            const bpdata =[];
            const nodedata =[];
            const edgedata =[];
            const lines = data.split('\n');
            lines.forEach(line => {
                //console.log(line);
                if(line.includes('Count')){
                    return;
                }
                let parts = line.trim().split(/\s+/); // 使用正则表达式来拆分每行的数字
                let Count= parseInt(parts[0], 10);
                let bp= parseInt(parts[1], 10);
                bp = Number(bp)
                bp = Math.log2(bp+1);
                let Node= parseInt(parts[2], 10);
                Node = Number(Node)
                Node = Math.log2(Node+1);
                let Edge= parseInt(parts[3], 10);
                Edge = Number(Edge)
                Edge = Math.log2(Edge+1);
                bpdata.push([Number(Count),Number(bp)]);
                nodedata.push([Number(Count),Number(Node)]);
                edgedata.push([Number(Count),Number(Edge)]);
            });
            let formattedData;
            if(type === 'bp'){
                formattedData = bpdata.map(item => ({ x: item[0], y: item[1] }));
            }
            else if(type === 'Node'){
                formattedData = nodedata.map(item => ({ x: item[0], y: item[1] }));
            }
            else if(type === 'Edge'){
                formattedData = edgedata.map(item => ({ x: item[0], y: item[1] }));
            }
            var ctx = document.getElementById('coverageCanvas'+graph).getContext('2d');  
            var coverageCanvas = new Chart(ctx, {
            type: 'bar',
            data: {
                datasets: [{
                    label:'',
                    data: formattedData,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    x: {
                        type:'linear',
                        position:'bottom',
                        ticks:{
                            maxRotation: 0, // 设置为 0 表示水平显示
                            minRotation: 0, // 防止旋转
                            stepSize: 2 // 每隔 2 个显示一个标签
                        }

                    }
                },
                plugins: {
                    legend: {
                        display: false  // 这会隐藏整个图例（包括任何标签）
                    }
                },
                responsive: false,  // 防止图表响应容器尺寸变化

            }
        });
            return formattedData;
        })
        .catch(error => console.error(`Error loading data from ${filepath}:`, error));
}

function loaddegree1GraphData(filePath) {
    return fetch(filePath)
    .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const row = document.querySelector(`#DegreeDistributionRow`);
            let td = row.querySelector('td:nth-child(2)');
            var canvas = document.createElement('canvas');
            canvas.id = 'firstdegreeCanvas';
            canvas.width = 200;  // Set the width of the canvas
            canvas.height = 150; // Set the height of the canvas
            td.appendChild(canvas);
            const graphdata =[];
            const lines = data.split('\n');
            lines.forEach(line => {
                //console.log(line);
                const cleanedLine = line.replace(/^#/, '').trim();
                let [value1, value2] = cleanedLine.split(/\s+/).filter(Boolean);
                value1 = Number(value1);
                value2 = Number(value2)
                value2 = Math.log2(value2+1);
                if (value1 && value2) {
                   graphdata.push([Number(value1),Number(value2)]);
                }
            });
            const formattedData = graphdata.map(item => ({ x: item[0], y: item[1] }));
            var ctx = document.getElementById('firstdegreeCanvas').getContext('2d');  
            var firstdegreeCanvas = new Chart(ctx, {
            type: 'bar',
            data: {
                datasets: [{
                    label:'',
                    data: formattedData,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    x: {
                        type:'linear',
                        position:'bottom',
                        ticks:{
                            maxRotation: 0, // 设置为 0 表示水平显示
                            minRotation: 0, // 防止旋转
                            stepSize: 2 // 每隔 2 个显示一个标签
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false  // 这会隐藏整个图例（包括任何标签）
                    }
                },
                responsive: false,  // 防止图表响应容器尺寸变化

            }
        });
            return formattedData;
        })
        .catch(error => console.error(`Error loading data from ${filePath}:`, error));
}

function loaddegree2GraphData(filePath) {
    return fetch(filePath)
    .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const row = document.querySelector(`#DegreeDistributionRow`);
            let td = row.querySelector('td:nth-child(3)');
            var canvas = document.createElement('canvas');
            canvas.id = 'seconddegreeCanvas';
            canvas.width = 200;  // Set the width of the canvas
            canvas.height = 150; // Set the height of the canvas
            td.appendChild(canvas);
            const graphdata =[];
            const lines = data.split('\n');
            lines.forEach(line => {
                //console.log(line);
                const cleanedLine = line.replace(/^#/, '').trim();
                let [value1, value2] = cleanedLine.split(/\s+/).filter(Boolean);
                value1 = Number(value1);
                value2 = Number(value2)
                value2 = Math.log2(value2+1);
                if (value1 && value2) {
                   graphdata.push([Number(value1),Number(value2)]);

                }
            });
           console.log(graphdata);
            const formattedData = graphdata.map(item => ({ x: item[0], y: item[1] }));
           console.log(formattedData);
            var ctx = document.getElementById('seconddegreeCanvas').getContext('2d');  
            var seconddegreeCanvas = new Chart(ctx, {
            type: 'bar',
            data: {
                datasets: [{
                    label:'',
                    data: formattedData,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    x: {
                        type:'linear',
                        position:'bottom', 
                        ticks:{
                            maxRotation: 0, // 设置为 0 表示水平显示
                            minRotation: 0, // 防止旋转
                            stepSize: 2 // 每隔 2 个显示一个标签
                        }

                    }
                },
                plugins: {
                    legend: {
                        display: false  // 这会隐藏整个图例（包括任何标签）
                    }
                },
                responsive: false,  // 防止图表响应容器尺寸变化

            }
        });
            return formattedData;
        })
        .catch(error => console.error(`Error loading data from ${filePath}:`, error));
}

var fourthdegreeCanvas ;

function showdegree(filePath,type){
    return fetch(filePath)
    .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const row = document.querySelector(`#DegreeDistributionRow`);
            let td = row.querySelector('td:nth-child(4)');
            var x =td.getElementsByTagName('canvas');
            console.log(x);
            if (x.length)
                {
                    console.log(111);
                    Array.from(x).forEach(function(canvas) {
                    canvas.remove(); // 移除单个 canvas 元素
                     });
                }
            var canvas = document.createElement('canvas');
            canvas.id = 'fourthdegreeCanvas';
            canvas.width = 200;  // Set the width of the canvas
            canvas.height = 150; // Set the height of the canvas
            td.appendChild(canvas);
            const segmentinData = [];
            const linkinData = [];
            const [inDegreePart, outDegreePart] = data.split("The distribution of out-degree");
            const lines = inDegreePart.split('\n');
            let currentType = '';
            lines.forEach(line => {
                if (line.includes('Segment:')) {
                    currentType = 'segment';
                } else if (line.includes('Link:')) {
                    currentType = 'link';
                }else if(line.includes('degree')){
                    return;
                } 
                else 
                {
                    const cleanedLine = line.replace(/^#/,'').trim();
                    let [value1, value2] = cleanedLine.split(/\s+/).filter(Boolean);
                    value1 = Number(value1);
                    value2 = Number(value2)
                    value2 = Math.log2(value2+1);
                    if (value1 && value2) {
                        if (currentType === 'segment') {
                        segmentinData.push([Number(value1),Number(value2)]);
                    } else if (currentType === 'link') {
                        linkinData.push([Number(value1),Number(value2)]);
                    }
                    }
                    
                }
            });
            const segmentoutData = [];
            const linkoutData = [];
            const lines2 = outDegreePart.split('\n');

            lines2.forEach(line => {
                if (line.includes('Segment:')) {
                    currentType = 'segment';
                } else if (line.includes('Link:')) {
                    currentType = 'link';
                }else if(line.includes('degree')){
                    return;
                } 
                else if (line.trim() !== '') {
                    let parts = line.trim().split(' ');
                    let key = parseInt(parts[0], 10);
                    let value = parseInt(parts[1], 10);
                    value = Number(value);
                    value = Math.log2(value + 1);
                    if (currentType === 'segment') {
                        segmentoutData.push([Number(key),Number(value)]);
                    } else if (currentType === 'link') {
                        linkoutData.push([Number(key),Number(value)]);
                    }
                }
            });
             console.log(segmentoutData);
             console.log(linkoutData);
            if(type === 'segment'){
                    const data1 = segmentinData.map(item => ({ x: item[0], y: item[1] }));
                    const data2 = segmentoutData.map(item => ({ x: item[0], y: item[1] }));
                    var ctx = document.getElementById('fourthdegreeCanvas').getContext('2d'); 
                    if(fourthdegreeCanvas )
                        fourthdegreeCanvas.destroy();
                    fourthdegreeCanvas = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        datasets: [
                            {
                            label:'入度',
                            data: data1,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                            },
                            {
                            label:'出度',
                            data: data2,
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                            }
                    ]
                    },
                    options: {
                        scales: {
                            x: {
                                type:'linear',
                                position:'bottom',
                                 ticks:{
                                    maxRotation: 0, // 设置为 0 表示水平显示
                                    minRotation: 0, // 防止旋转
                                    stepSize: 2 // 每隔 2 个显示一个标签
                                }
 
                            }
                        },
                        plugins: {
                            legend: {
                                display: true  // 这会隐藏整个图例（包括任何标签）
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        const label = context.datasetIndex === 0 ? '入度' : '出度';  // 根据数据集索引定义
                                        return `${label}`;
                                    }
                                }
                            }
                        },
                        responsive: false,  // 防止图表响应容器尺寸变化

                    }
                });
            }
            else if(type == 'link'){
                    const data3 = linkinData.map(item => ({ x: item[0], y: item[1] }));
                    const data4 = linkoutData.map(item => ({ x: item[0], y: item[1] }));
                    
                    var ctx = document.getElementById('fourthdegreeCanvas').getContext('2d'); 
                    if(fourthdegreeCanvas )
                        fourthdegreeCanvas.destroy();
                    var fourthdegreeCanvas = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        datasets: [
                            {
                            label:'入度',
                            data: data3,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                            },
                            {
                            label:'出度',
                            data: data4,
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                            }
                    ]
                    },
                    options: {
                        scales: {
                            x: {
                                type:'linear',
                                position:'bottom',
                                 ticks:{
                                    maxRotation: 0, // 设置为 0 表示水平显示
                                    minRotation: 0, // 防止旋转
                                    stepSize: 2 // 每隔 2 个显示一个标签
                                }
 
                            }
                        },
                        plugins: {
                            legend: {
                                display: true  // 这会隐藏整个图例（包括任何标签）
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        const label = context.datasetIndex === 0 ? '入度' : '出度';  // 根据数据集索引定义
                                        return `${label}`;
                                    }
                                }
                            }
                            
                        },
                        responsive: false,  // 防止图表响应容器尺寸变化

                    }
                });
            }
            
            return segmentoutData;
        })
        .catch(error => console.error(`Error loading data from ${filePath}:`, error));
}
 
function loaddegree4GraphData(filePath1,filePath2) {
    return Promise.all([
        fetch(filePath1),
        fetch(filePath2)
    ])
    .then(responses => {
                // 检查所有响应是否成功
                if (!responses.every(response => response.ok)) {
                    throw new Error("Failed to fetch files");
                }
                return Promise.all(responses.map(response => response.text()));
            })
    .then(data => {
            const data1 = data[0];
            const data2 = data[1];
            const row = document.querySelector(`#DegreeDistributionRow`);
            let td = row.querySelector('td:nth-child(1)');
            var canvas = document.createElement('canvas');
            canvas.id = 'degreeCanvas';
            canvas.width = 200;  // Set the width of the canvas
            canvas.height = 150; // Set the height of the canvas
            td.appendChild(canvas);

            const graphdata1 =[];
            const lines = data1.split('\n');
            lines.forEach(line => {
                //console.log(line);
                const cleanedLine = line.replace(/^#/, '').trim();
                let [value1, value2] = cleanedLine.split(/\s+/).filter(Boolean);
                value1 = Number(value1);
                value2 = Number(value2)
                value2 = Math.log2(value2+1);
                 if (value1 && value2) {
                   graphdata1.push([Number(value1),Number(value2)]);

                }
            });
            const formattedData1 = graphdata1.map(item => ({ x: item[0], y: item[1] }));

            const graphdata2 =[];
            const lines2 = data2.split('\n');
            lines.forEach(line => {
                const cleanedLine = line.replace(/^#/, '').trim();
                 let [value1, value2] = cleanedLine.split(/\s+/).filter(Boolean);
                value1 = Number(value1);
                value2 = Number(value2)
                value2 = Math.log2(value2+1);
                if (value1 && value2) {
                   graphdata2.push([Number(value1),Number(value2)]);

                }
            });
            const formattedData2 = graphdata2.map(item => ({ x: item[0], y: item[1] }));
            
            var ctx = document.getElementById('degreeCanvas').getContext('2d');  
            var degreeCanvas = new Chart(ctx, {
            type: 'bar',
            data: {
                datasets: [
                    {
                        label:'入度',
                        data: formattedData1,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    },
                    {
                        label:'出度',
                        data: formattedData2,
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                scales: {
                    x: {
                        type:'linear',
                        position:'bottom',
                        ticks:{
                            maxRotation: 0, // 设置为 0 表示水平显示
                            minRotation: 0, // 防止旋转
                            stepSize: 2 // 每隔 2 个显示一个标签
                        }

                    }
                },
                plugins: {
                    legend: {
                        display: true  // 这会隐藏整个图例（包括任何标签）
                    },
                    tooltip: {  // 自定义 Tooltip 配置
                        callbacks: {
                            label: function(context) {
                               const label = context.datasetIndex === 0 ? '入度' : '出度';  // 根据数据集索引定义
                               return `${label}`;
                            }
                        }
                    }
                },
                responsive: false,  // 防止图表响应容器尺寸变化
            }
        });
            return formattedData1;
    })
        .catch(error => console.error(`Error loading data from ${filePath1}:`, error));
}       

function DegreeFunction(){
    loaddegree1GraphData('web/gfaGlimpse/data/bidirectedGraph/degree.txt');
    loaddegree2GraphData('web/gfaGlimpse/data/biedgedGraph/degree.txt');
    //loaddegree3GraphData('web/gfaGlimpse/data/dibigraph/degree.txt');
    loaddegree4GraphData('web/gfaGlimpse/data/digraph/inDegree.txt','web/gfaGlimpse/data/digraph/outDegree.txt');
}

function loadloopdata(index,filepath){
    return fetch(filepath)
    .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const row = document.querySelector(`#LoopLengthRow`);
            let td = row.querySelector(`td:nth-child(${index})`);
            var canvas = document.createElement('canvas');
            canvas.id = index +'loopCanvas';
            canvas.width = 200;  // Set the width of the canvas
            canvas.height = 150; // Set the height of the canvas
            td.appendChild(canvas);
            const graphdata =[];
            const lines = data.split('\n');
            lines.forEach(line => {
                //console.log(line);
                const cleanedLine = line.replace(/^#/, '').trim();
                let [value1, value2] = cleanedLine.split(/\s+/).filter(Boolean);
                value1 = Number(value1);
                value2 = Number(value2)
                value2 = Math.log2(value2+1);
                if (value1 && value2) {
                   graphdata.push([Number(value1),Number(value2)]);
                }
            });
            //console.log(graphdata);
            const formattedData = graphdata.map(item => ({ x: item[0], y: item[1] }));
            //console.log(formattedData);
            var ctx = document.getElementById(index +'loopCanvas').getContext('2d');  
            var loopCanvas = new Chart(ctx, {
                type: 'bar',
            data: {
                datasets: [{
                    label:'',
                    data: formattedData,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    x: {
                        type:'linear',
                        position:'bottom',
                        ticks:{
                            maxRotation: 0, // 设置为 0 表示水平显示
                            minRotation: 0, // 防止旋转
                            stepSize: 2 // 每隔 2 个显示一个标签
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false  // 这会隐藏整个图例（包括任何标签）
                    }
                },
                responsive: false,  // 防止图表响应容器尺寸变化

            }
        });
            return formattedData;
        })
        .catch(error => console.error(`Error loading data from ${filepath}:`, error));
}
function loadcycledata(index,filepath){
    return fetch(filepath)
    .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            console.log(data);
            const row = document.querySelector(`#CycleDistributionRow`);
            let td = row.querySelector(`td:nth-child(${index})`);
            var canvas = document.createElement('canvas');
            canvas.id = index +'cycleCanvas';
            canvas.width = 200;  // Set the width of the canvas
            canvas.height = 150; // Set the height of the canvas
            td.appendChild(canvas);
            const graphdata =[];
            const lines = data.split('\n');
            lines.forEach(line => {
                //console.log(line);
                const cleanedLine = line.replace(/^#/, '').trim();
                let [value1, value2] = cleanedLine.split(/\s+/).filter(Boolean);
                value1 = Number(value1);
                value2 = Number(value2)
                value2 = Math.log2(value2+1);
                if (value1 && value2) {
                   graphdata.push([Number(value1),Number(value2)]);
                }
            });
            //console.log(graphdata);
            const formattedData = graphdata.map(item => ({ x: item[0], y: item[1] }));
            //console.log(formattedData);
            var ctx = document.getElementById(index +'cycleCanvas').getContext('2d');  
            var loopCanvas = new Chart(ctx, {
                type: 'bar',
            data: {
                datasets: [{
                    label:'',
                    data: formattedData,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    x: {
                        type:'linear',
                        position:'bottom',
                        ticks:{
                            maxRotation: 0, // 设置为 0 表示水平显示
                            minRotation: 0, // 防止旋转
                            stepSize: 2 // 每隔 2 个显示一个标签
                        }

                    }
                },
                plugins: {
                    legend: {
                        display: false  // 这会隐藏整个图例（包括任何标签）
                    }
                },
                responsive: false,  // 防止图表响应容器尺寸变化

            }
        });
            return formattedData;
        })
        .catch(error => console.error(`Error loading data from ${filepath}:`, error));
}

function loadBubbleChainsdata(index,filepath){
    return fetch(filepath)
    .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const row = document.querySelector(`#BubbleChainsRow`);
            let td = row.querySelector(`td:nth-child(${index})`);
            var canvas = document.createElement('canvas');
            canvas.id = index +'BubbleChainsCanvas';
            canvas.width = 200;  // Set the width of the canvas
            canvas.height = 150; // Set the height of the canvas
            td.appendChild(canvas);
            const graphdata =[];
            const lines = data.split('\n');
            lines.forEach(line => {
                //console.log(line);
                const cleanedLine = line.replace(/^#/, '').trim();
                let [value1, value2] = cleanedLine.split(/\s+/).filter(Boolean);
                value1 = Number(value1);
                value2 = Number(value2)
                value2 = Math.log2(value2+1);
                if (value1 && value2) {
                   graphdata.push([Number(value1),Number(value2)]);
                }
            });
            //console.log(graphdata);
            const formattedData = graphdata.map(item => ({ x: item[0], y: item[1] }));
            //console.log(formattedData);
            var ctx = document.getElementById(index +'BubbleChainsCanvas').getContext('2d');  
            var loopCanvas = new Chart(ctx, {
                type: 'bar',
            data: {
                datasets: [{
                    label:'',
                    data: formattedData,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    x: {
                        type:'linear',
                        position:'bottom',
                        ticks:{
                            maxRotation: 0, // 设置为 0 表示水平显示
                            minRotation: 0, // 防止旋转
                            autoSkip: true
                        }

                    }
                },
                plugins: {
                    legend: {
                        display: false  // 这会隐藏整个图例（包括任何标签）
                    }
                },
                responsive: false,  // 防止图表响应容器尺寸变化

            }
        });
            return formattedData;
        })
        .catch(error => console.error(`Error loading data from ${filepath}:`, error));
}
function loadNestedBubblesdata(index,filepath){
    return fetch(filepath)
    .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const row = document.querySelector(`#NestedBubblesRow`);
            let td = row.querySelector(`td:nth-child(${index})`);
            var canvas = document.createElement('canvas');
            canvas.id = index +'NestedCanvas';
            canvas.width = 200;  // Set the width of the canvas
            canvas.height = 150; // Set the height of the canvas
            td.appendChild(canvas);
            const graphdata =[];
            const lines = data.split('\n');
            lines.forEach(line => {
                //console.log(line);
                const cleanedLine = line.replace(/^#/, '').trim();
                 let [value1, value2] = cleanedLine.split(/\s+/).filter(Boolean);
                value1 = Number(value1);
                value2 = Number(value2)
                value2 = Math.log2(value2+1);
                if (value1 && value2) {
                   graphdata.push([Number(value1),Number(value2)]);
                }
            });
            //console.log(graphdata);
            const formattedData = graphdata.map(item => ({ x: item[0], y: item[1] }));
            //console.log(formattedData);
            var ctx = document.getElementById(index +'NestedCanvas').getContext('2d');  
            var loopCanvas = new Chart(ctx, {
                type: 'bar',
            data: {
                datasets: [{
                    label:'',
                    data: formattedData,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    x: {
                        type:'linear',
                        position:'bottom',
                          ticks:{
                            maxRotation: 0, // 设置为 0 表示水平显示
                            minRotation: 0, // 防止旋转
                            stepSize: 2 // 每隔 2 个显示一个标签
                        }

                    }
                },
                plugins: {
                    legend: {
                        display: false  // 这会隐藏整个图例（包括任何标签）
                    }
                },
                responsive: false,  // 防止图表响应容器尺寸变化

            }
        });
            return formattedData;
        })
        .catch(error => console.error(`Error loading data from ${filepath}:`, error));
}

function cycleFunction(){
    loadcycledata(1,'web/gfaGlimpse/data/digraph/cycle.txt');
    loadcycledata(4,'web/gfaGlimpse/data/dibigraph/cycle.txt');
}

function NestedBubblesFunction(){
    loadNestedBubblesdata(2,'web/gfaGlimpse/data/bidirectedGraph/nestedBubblesLevel.txt');
    loadNestedBubblesdata(4,'web/gfaGlimpse/data/dibigraph/nestedBubblesLevel.txt');
}

function BubbleChainsFunction(){
    loadBubbleChainsdata(2,'web/gfaGlimpse/data/bidirectedGraph/bubbleChainLength.txt');
    loadBubbleChainsdata(4,'web/gfaGlimpse/data/dibigraph/bubbleChainLength.txt');
}
function loopFunction(){
    pathsum = [
    'web/gfaGlimpse/data/digraph/loop.txt',
    'web/gfaGlimpse/data/bidirectedGraph/loop.txt',
    'web/gfaGlimpse/data/biedgedGraph/loop.txt',
    'web/gfaGlimpse/data/dibigraph/loop.txt',
    ]
    pathsum.forEach((filepath,index)=>{
        loadloopdata(index+1,filepath);
    })
}


// 初始化：加载所有数据
function toggleMenu(menuId) {
    var menu = document.getElementById(menuId);
    if (menu.style.display === "block") {
        menu.style.display = "none";
    } else {
        menu.style.display = "block";
    }
}
</script>
</body>
</html>

EOL

echo "网页已生成：$(pwd)/generated_page.html"
