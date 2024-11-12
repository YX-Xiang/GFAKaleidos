function uploadFile() {
const fileInput = document.getElementById('fileInput');
const file = fileInput.files[0]; // 获取选中的文件
            if (!file) {
                alert("请选择一个文件!");
                return;
            }

// 创建 FormData 对象并将文件添加进去
const formData = new FormData();
formData.append('file', file);

// 隐藏 Logo 并显示加载状态（可选）
const logoPlaceholder = document.getElementById('logo-placeholder');
logoPlaceholder.style.display = 'none';

axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // 设置请求头，表明是文件上传
                }
            })
            .then(function (response) {
                // 成功回调
                alert('文件上传成功！');
                const filePath = response.data.filePath;
                runcommand(filePath);
            })
            .catch(function (error) {
                // 错误回调
                console.error('文件上传失败:', error);
                alert('文件上传失败');

                // 上传失败时恢复 Logo 显示，隐藏表格
                logoPlaceholder.style.display = 'flex'; // 恢复占位元素显示
            });
}

function runcommand(filePath){
    axios.get('/api/gfaKaleidos', {
    params: {
        uploadPath: filePath  // 将文件路径作为查询参数传递
    }
})
.then(function (response) {
    // 成功回调
    console.log('命令执行输出:', response.data);
    loadAllData();
    loadGFAData('web/data/gfa/basicStatistics.txt');
})
.catch(function (error) {
    // 错误回调
    console.error('命令执行失败:', error);
    loadAllData();
    loadGFAData('web/data/gfa/basicStatistics.txt');
    
});
}

const graphData = {
    bidirectedGraph: {},
    biedgedGraph: {},
    dibigraph: {},
    digraph: {},
};

const GFAData={};

const fileMap = {
    bidirectedGraph: ['web/data/bidirectedGraph/basicStatistics.txt',
    'web/data/bidirectedGraph/bubbleChainLength.txt',
    'web/data/bidirectedGraph/vertexval.txt'],
    biedgedGraph: ['web/data/biedgedGraph/basicStatistics.txt'],
    dibigraph: ['web/data/dibigraph/basicStatistics.txt',
    'web/data/dibigraph/bubbleChainLength.txt'],
    digraph:['web/data/digraph/basicStatistics.txt',
    'web/data/digraph/cycle.txt',
    'web/data/digraph/vertexval.txt']
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
        .catch(error => console.error(`Error: Loading data from ${filePath}:`, error));
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
                    // console.log(line);
                    const cleanedLine = line.replace(/^#/, '').trim();
                    const [key, value] = cleanedLine.split(/\s+/).filter(Boolean);
                    if (key && value) {
                        GFAData[key] = value;
                    }
                });
        })
        .catch(error => console.error(`Error: Loading data from ${filePath}:`, error));
}

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

// 检查文件是否已上传
function isFileUploaded() {
    const fileInput = document.getElementById('fileInput');
    return fileInput.files.length > 0; // 如果文件已上传，返回 true
}

// 监听复选框状态并填充表格
function toggleTableRow(checkbox) {
    const rowId = checkbox.id;
    const row = document.querySelector(`#${rowId}Row`);

    // 检查是否已上传文件
    if (!isFileUploaded()) {
        alert("Error: Please upload the file first!");
        checkbox.checked = false; // 取消选中状态
        return;
    }

    if (checkbox.checked) {
        // 填充每个图类型对应的表格单元格
        row.style.display = '';
        if(rowId == 'file_size' || rowId == 'segments' || rowId == 'links' || rowId == 'paths' || rowId == 'single_direction_segment' || rowId == 'bidirectional_direction_segment'){
            row.querySelectorAll('td').forEach((cell, index) => {
                if(index === 0){
                    return;
                }
                cell.textContent = GFAData[rowId] || '/';
            });
        } else if(rowId == 'DegreeDistribution'){
            DegreeFunction();
        } else if(rowId =='LoopLength'){
            loopFunction();
        } else if(rowId =='CycleDistribution'){
            cycleFunction();
        } else if(rowId == 'NestedBubbles'){
            NestedBubblesFunction();
        } else if(rowId =='BubbleChains'){
            BubbleChainsFunction();
        } else if(rowId =='Coverage'){
            return ;
        } else{
            row.querySelectorAll('td').forEach((cell, index) => {
                if(index === 0){
                    return;
                }
                const graphType = cell.getAttribute('data-graph');
                cell.textContent = graphData[graphType][rowId] || '/';
            });
        }
    } else {
        // 清空对应的表格单元格
        row.querySelectorAll('td').forEach((cell, index) => {
            if(index === 0) return;
            cell.textContent = '';
        });
        row.style.display = 'none';
    }
}

window.onload = function() {
    document.getElementById('file_sizeRow').style.display = 'none';
    document.getElementById('segmentsRow').style.display = 'none';
    document.getElementById('linksRow').style.display = 'none';
    document.getElementById('pathsRow').style.display = 'none';
    document.getElementById('single_direction_segmentRow').style.display = 'none';
    document.getElementById('bidirectional_direction_segmentRow').style.display = 'none';
};

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
                td = row.querySelector('td:nth-child(2)');
            }
            else if(graph === 'bidirectedGraph'){
                td = row.querySelector('td:nth-child(3)');
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
            let td = row.querySelector('td:nth-child(3)');
            var canvas = document.createElement('canvas');
            canvas.id = 'firstdegreeCanvas';
            canvas.width = 200;  // Set the width of the canvas
            canvas.height = 150; // Set the height of the canvas
            td.appendChild(canvas);

            const graphdata =[];
            const lines = data.split('\n');
            let totalSum = 0;

            lines.forEach(line => {
                console.log(line);
                const cleanedLine = line.replace(/^#/, '').trim();
                let [value1, value2] = cleanedLine.split(/\s+/).filter(Boolean);
                value1 = Number(value1);
                value2 = Number(value2);
                // value2 = Math.log2(value2 + 1);
                if (value1 && value2) {
                    totalSum += value2; // 累加真实数量
                    graphdata.push([value1, value2]);
                }
            });

            const formattedData = graphdata.map(item => ({
                x: item[0],
                y: (item[1] / totalSum), // 计算占比
                originalValue: item[1] // 保留真实数量用于悬停显示
            }));

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
                            stepSize: 1 // 每隔 1 个显示一个标签
                        },
                        title: {
                            display: true,
                            text: 'Degree'
                        },
                    },
                    y: {
                        type: 'linear', // 使用线性刻度显示百分比
                        min: 0,
                        max: 1,
                        title: {
                            display: true,
                            text: 'Proportion'
                        }
                    },
                },
                plugins: {
                    legend: {
                        display: false  // 这会隐藏整个图例（包括任何标签）
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const dataPoint = context.raw;
                                return `Number: ${dataPoint.originalValue}`;
                            }
                        }
                    }
                },
                responsive: false  // 防止图表响应容器尺寸变化
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
            let td = row.querySelector('td:nth-child(4)');
            var canvas = document.createElement('canvas');
            canvas.id = 'seconddegreeCanvas';
            canvas.width = 200;  // Set the width of the canvas
            canvas.height = 150; // Set the height of the canvas
            td.appendChild(canvas);

            const graphdata =[];
            const lines = data.split('\n');
            let totalSum = 0;

            lines.forEach(line => {
                //console.log(line);
                const cleanedLine = line.replace(/^#/, '').trim();
                let [value1, value2] = cleanedLine.split(/\s+/).filter(Boolean);
                value1 = Number(value1);
                value2 = Number(value2);
                // value2 = Math.log2(value2 + 1);
                if (value1 && value2) {
                    totalSum += value2; // 累加真实数量
                    graphdata.push([value1, value2]);
                }
            });

            const formattedData = graphdata.map(item => ({
                x: item[0],
                y: (item[1] / totalSum), // 计算占比
                originalValue: item[1] // 保留真实数量用于悬停显示
            }));

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
                            stepSize: 1 // 每隔 1 个显示一个标签
                        },
                        title: {
                            display: true,
                            text: 'Degree'
                        },
                    },
                    y: {
                        type: 'linear', // 使用线性刻度显示百分比
                        min: 0,
                        max: 1,
                        title: {
                            display: true,
                            text: 'Proportion'
                        }
                    },
                },
                plugins: {
                    legend: {
                        display: false  // 这会隐藏整个图例（包括任何标签）
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const dataPoint = context.raw;
                                return `Number: ${dataPoint.originalValue}`;
                            }
                        }
                    }
                },
                responsive: false,
            }
        });
            return formattedData;
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
            let td = row.querySelector('td:nth-child(2)');
            var canvas = document.createElement('canvas');
            canvas.id = 'degreeCanvas';
            canvas.width = 200;  // Set the width of the canvas
            canvas.height = 150; // Set the height of the canvas
            td.appendChild(canvas);

            const graphdata1 =[];
            const lines = data1.split('\n');
            let totalSum1 = 0;
            let totalSum2 = 0;

            lines.forEach(line => {
                //console.log(line);
                const cleanedLine = line.replace(/^#/, '').trim();
                let [value1, value2] = cleanedLine.split(/\s+/).filter(Boolean);
                value1 = Number(value1);
                value2 = Number(value2);
                if (value1 && value2) {
                    graphdata1.push([Number(value1),Number(value2)]);
                    totalSum1 += value2;
                }
            });
            const formattedData1 = graphdata1.map(item => ({
                x: item[0],
                y: (item[1] / totalSum1), // 计算占比
                originalValue: item[1] // 保留真实数量用于悬停显示
            }));

            const graphdata2 =[];
            const lines2 = data2.split('\n');
            lines.forEach(line => {
                const cleanedLine = line.replace(/^#/, '').trim();
                let [value1, value2] = cleanedLine.split(/\s+/).filter(Boolean);
                value1 = Number(value1);
                value2 = Number(value2);
                if (value1 && value2) {
                    graphdata2.push([Number(value1),Number(value2)]);
                    totalSum2 += value2;
                }
            });
            const formattedData2 = graphdata2.map(item => ({
                x: item[0],
                y: (item[1] / totalSum2), // 计算占比
                originalValue: item[1] // 保留真实数量用于悬停显示
            }));
            
            var ctx = document.getElementById('degreeCanvas').getContext('2d');  
            var degreeCanvas = new Chart(ctx, {
            type: 'bar',
            data: {
                datasets: [
                    {
                        label:'In-degree',
                        data: formattedData1,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    },
                    {
                        label:'Out-degree',
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
                        },
                        title: {
                            display: true,
                            text: 'Degree'
                        },
                    },
                    y: {
                        type: 'linear', // 使用线性刻度显示百分比
                        min: 0,
                        max: 1,
                        title: {
                            display: true,
                            text: 'Proportion'
                        }
                    },
                },
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            boxWidth: 10, // 控制图例框的宽度
                            padding: 10, // 控制图例项之间的间距
                        }
                    },
                    tooltip: {  // 自定义 Tooltip 配置
                        // callbacks: {
                        //     label: function(context) {
                        //         const label = context.datasetIndex === 0 ? 'In-degree' : 'Out-degree';  // 根据数据集索引定义
                        //         return `${label}`;
                        //     }
                        // }
                        callbacks: {
                            label: function(context) {
                                const dataPoint = context.raw;
                                return `Number: ${dataPoint.originalValue}`;
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
    loaddegree1GraphData('web/data/bidirectedGraph/degree.txt');
    loaddegree2GraphData('web/data/biedgedGraph/degree.txt');
    //loaddegree3GraphData('web/data/dibigraph/degree.txt');
    loaddegree4GraphData('web/data/digraph/inDegree.txt','web/data/digraph/outDegree.txt');
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
            index = Number(index) + 1;
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
            index = Number(index) + 1;
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
            index = Number(index) + 1;
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
            index = Number(index) + 1;
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
    loadcycledata(1,'web/data/digraph/cycle.txt');
    loadcycledata(4,'web/data/dibigraph/cycle.txt');
}

function NestedBubblesFunction(){
    loadNestedBubblesdata(2,'web/data/bidirectedGraph/nestedBubblesLevel.txt');
    loadNestedBubblesdata(4,'web/data/dibigraph/nestedBubblesLevel.txt');
}

function BubbleChainsFunction(){
    loadBubbleChainsdata(2,'web/data/bidirectedGraph/bubbleChainLength.txt');
    loadBubbleChainsdata(4,'web/data/dibigraph/bubbleChainLength.txt');
}
function loopFunction(){
    pathsum = [
    'web/data/digraph/loop.txt',
    'web/data/bidirectedGraph/loop.txt',
    'web/data/biedgedGraph/loop.txt',
    'web/data/dibigraph/loop.txt',
    ]
    pathsum.forEach((filepath,index)=>{
        loadloopdata(index+1,filepath);
    })
}


// 初始化：加载所有数据
function toggleMenu(menuId, iconId) {
    var menu = document.getElementById(menuId);
    const icon = document.getElementById(iconId);

    if (menu.style.display === "block") {
        menu.style.display = "none";
        icon.src = "static/styles/add.png"; // 更改为收起图标
        icon.title = "Click to collapse"; // 更新图标标题
    } else {
        menu.style.display = "block";
        icon.src = "static/styles/reduce.png"; // 更改为展开图标
        icon.title = "Click to expand"; // 更新图标标题
    }
}

function selectAllCheckboxes() {
    // 检查是否已上传文件
    if (!isFileUploaded()) {
        alert("Error: Please upload the file first!");
        return; // 文件未上传时，停止执行后续操作
    }

    // 获取所有复选框元素
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    
    // 遍历每个复选框并设置为选中状态
    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked == false) {
            checkbox.checked = true;
            toggleTableRow(checkbox); // 调用你现有的 toggleTableRow 函数，处理勾选框的变化
        }
    });
}

function toggleMenuCheckbox(menuId, checkbox) {
    // 文件未上传时，停止执行后续操作
    if (!isFileUploaded()) {
        setTimeout(() => {
            checkbox.checked = false;
        }, 0);
        alert("Error: Please upload the file first!");
        return;
    }

    const menuItems = document.querySelectorAll(`#${menuId} input[type="checkbox"]`);

    menuItems.forEach(function(item) {
        if (item.checked == false) {
            item.checked = true;
            toggleTableRow(item); // 调用 toggleTableRow 函数处理每个复选框的变化
        }
    });
}