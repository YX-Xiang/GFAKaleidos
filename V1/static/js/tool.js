let fileUploaded = false;
var flag ="";
let graphData = {
    bidirectedGraph: {},
    biedgedGraph: {},
    dibigraph: {},
    digraph: {},
};

let GFAData={};

let fileMap = {};

let ip;

function runcommand(filePath) {
    return new Promise((resolve, reject) => {
        axios.get('/api/gfaKaleidos', {
            params: {
                uploadPath: filePath  // 将文件路径作为查询参数传递
            }
        })
        .then(function (response) {
            // 成功回调
            console.log('命令执行输出:', response.data);
            resolve();  // Resolve the promise when the command succeeds
        })
        .catch(function (error) {
            // 错误回调
            console.error('命令执行失败:', error);
            reject(error);  // Reject the promise when the command fails
        });
    });
}


// =======================================================
//                        文件上传
// =======================================================
function updateProgressBar(progress) {
    // 确保进度在0-100之间
    progress = Math.max(0, Math.min(100, progress));
    
    // 更新进度条宽度
    document.getElementById('progressBar').style.width = progress + '%';
    
    // 更新进度文本
    document.getElementById('progressText').textContent = progress + '%';
}

function uploadGFAFile() {
    console.log('Upload initiated');

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert("Error: Please select a valid file!");
        return;
    }

    const uploadUrl = '/api/upload';
    const formData = new FormData();
    formData.append('file', file);
    const uploadProgressArea = document.getElementById('uploadProgressArea');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const logoPlaceholder = document.getElementById('logo-placeholder');

    uploadProgressArea.style.display = 'block';
    logoPlaceholder.style.display = 'none';

    // 显示加载覆盖层函数
    const displayLoadingOverlay = () => {  
        const loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.style.position = 'fixed';
        loadingOverlay.style.top = '0';
        loadingOverlay.style.left = '0';
        loadingOverlay.style.width = '100%';
        loadingOverlay.style.height = '100%';
        loadingOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        loadingOverlay.style.display = 'flex';
        loadingOverlay.style.alignItems = 'center';
        loadingOverlay.style.justifyContent = 'center';
        loadingOverlay.style.zIndex = '9999';

        const loadingText = document.createElement('div');
        loadingText.style.color = 'white';
        loadingText.style.fontSize = '24px';
        loadingText.innerText = 'Processing... Please wait...';

        loadingOverlay.appendChild(loadingText);
        document.body.appendChild(loadingOverlay);
        return loadingOverlay;
    };

    // 移除加载覆盖层函数
    const removeLoadingOverlay = (overlay) => {
        if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
    };

    axios.post(uploadUrl, formData, {
        
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
            const fileLoaded = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
            // 最大显示 99%
            const displayProgress = fileLoaded >= 100 ? 99 : fileLoaded;
            progressBar.style.width = displayProgress + "%";
            progressText.textContent = displayProgress + "%";
        }
    })
    .then((response) => {
        // 手动将进度条更新为 100%
        progressBar.style.width = "100%";
        progressText.textContent = "100%";

        // 提示上传完成
        alert('Successfully uploaded!'); 
        uploadProgressArea.style.display = 'none';

        // 显示加载覆盖层
        const loadingOverlay = displayLoadingOverlay();
        
        const filePath = response.data.filePath;
        // console.log(filePath);
        ip = filePath.split('/')[4];
        const FileName = filePath.split('/').pop().split('.').slice(0, -1).join('.');
        fileUploaded = true;
        flag = FileName;
        // 后台任务
        runcommand(filePath)
            .then(() => {
                openTab(FileName);
                addCheckbox(FileName);
                setTimeout(() => {
                    removeLoadingOverlay(loadingOverlay);
                    selectAllCheckboxes();
                }, 3000);
            })
            .catch((error) => {
                console.error('Error running command:', error);
                removeLoadingOverlay(loadingOverlay); // 即使出错也移除覆盖层
                alert('Error during processing. Please try again.');
            });
    })
    .catch((error) => {
        console.error('Upload error:', error);
        alert('Error: Upload failed.');
        logoPlaceholder.style.display = 'flex';
    });
}

function uploadZIPFile() {
    const fileInput = document.getElementById('fileInput2');
    const file = fileInput.files[0]; // 获取选中的文件

    if (!file) {
        alert("Error: Please select a valid file!");
        return;
    }

    // const fileExtension = file.name.split('.').pop().toLowerCase();
    let uploadUrl, onSuccess, onFailure;

    uploadUrl = '/api/uploadZip';
    onSuccess = (response) => {
        const data = response.data; // 获取响应数据
        const fileName = data.fileName;
        fileUploaded = true;
        openTab(fileName);
        addCheckbox(fileName);
    };
    onFailure = (error) => {
        console.error('Error:', error);
        const status = document.getElementById('status');
        // 处理错误
        if (error.response) {
            // 如果服务器返回了错误响应
            status.textContent = `Upload failed: ${error.response.data.message || 'Unknown server error'}`;
        } else if (error.request) {
            // 如果请求没有收到响应
            status.textContent = 'Upload failed. No response from server.';
        } else {
            // 其他错误
            status.textContent = 'Upload failed. Please try again.';
        }
    };

    // 创建 FormData 对象并将文件添加进去
    const formData = new FormData();
    formData.append('file', file);

    // 更新文件名显示
    document.getElementById("fileName").textContent = file.name;
    // 隐藏 Logo 并显示加载状态
    const logoPlaceholder = document.getElementById('logo-placeholder');
    logoPlaceholder.style.display = 'none';

    // 取消显示进度条区域
    const uploadProgressArea = document.getElementById('uploadProgressArea');
    uploadProgressArea.style.display = 'none';  // 隐藏进度条区域

    // 不再使用进度条和进度文本元素
    // const progressBar = document.getElementById('progressBar');
    // const progressText = document.getElementById('progressText');

    axios.post(uploadUrl, formData, {
        headers: {
            'Content-Type': 'multipart/form-data' // 设置请求头，表明是文件上传
        },
        // 移除 onUploadProgress 事件处理
    })
    .then(onSuccess)
    .catch(onFailure);
}


// 上传样例文件
function uploadExampleFile(filePath) {
    ip = "example";
    // 文件未上传时弹出提示
    if (!filePath) {
        alert("Error: Please select a valid example file path!");
        return;
    }
    
    var selDom = $("#menu-list a[FileName='" + filePath.split('/').pop().split('.')[0] + "']");//menu-list是标签栏

    // 隐藏 Logo 并显示加载状态
    const logoPlaceholder = document.getElementById('logo-placeholder');
    logoPlaceholder.style.display = 'none';

    
    if (selDom.length === 0) { // 如果标签页不存在，则创建新的标签
        alert('Successfully uploaded!');
        fileUploaded = true;

        // 创建一个加载框
        const loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.style.position = 'fixed';
        loadingOverlay.style.top = '0';
        loadingOverlay.style.left = '0';
        loadingOverlay.style.width = '100%';
        loadingOverlay.style.height = '100%';
        loadingOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        loadingOverlay.style.display = 'flex';
        loadingOverlay.style.alignItems = 'center';
        loadingOverlay.style.justifyContent = 'center';
        loadingOverlay.style.zIndex = '9999';

        const loadingText = document.createElement('div');
        loadingText.style.color = 'white';
        loadingText.style.fontSize = '24px';
        loadingText.innerText = 'Loading... Please wait...';

        loadingOverlay.appendChild(loadingText);
        document.body.appendChild(loadingOverlay);

        // 执行异步命令并在命令完成后关闭加载框
        runcommand(filePath).then(() => {
            // 在命令执行完后移除加载框
            document.body.removeChild(loadingOverlay);
            setTimeout(() => {
                selectAllCheckboxes();
            }, 1000);
        }).catch((error) => {
            // 如果命令失败，显示错误并关闭加载框
            console.error('Error running command:', error);
            document.body.removeChild(loadingOverlay);
        });

        const FileName = filePath.split('/').pop().split('.')[0];
        flag = FileName;
        openTab(FileName);
        addCheckbox(FileName);
    }
    else{
        flag = filePath.split('/')[2].split('.')[0];
        openTab(flag);
        selectAllCheckboxes();
    }
   
}




// =======================================================
//                        文件下载
// =======================================================


function ShowAllCoverage(){
    const tr = document.getElementById('CoverageRow');
    var canvases = tr.querySelectorAll('canvas');
    canvases.forEach(canvas=>{
        canvas.style.display="";
    })
    
}

function NotShowAllCoverage(){
    const tr = document.getElementById('CoverageRow');
    var canvases = tr.querySelectorAll('canvas');
    canvases.forEach(canvas=>{
        canvas.style.display="none";
    })
}

// 下载pdf
function downloadPage() {
    const buttons = document.querySelectorAll(".download-btn");
    const button = buttons[0];

    if (button.classList.contains("active")) {
        // console.log("Button is already active"); // 检查是否已经激活
        return;
    }

    // 激活动画
    button.classList.add("active");

    // 启动下载进度条动画，模拟下载过程
    setTimeout(() => {
        // console.log("Starting download"); // 检查是否进入下载流程
        // 模拟进度条动画完成，开始下载
        startDownload();
    }, 1000); // 动画时长1秒
    
    if (typeof ShowAllCoverage === "function") {
        ShowAllCoverage();
    } else {
        console.error("ShowAllCoverage function is not defined"); // 检查函数是否存在
    }

    // 启动页面下载
    function startDownload() {
        const middleSection = document.getElementById('main-content');  // 获取中间部分的 DOM 元素
        // console.log("Middle section element: ", middleSection); // 输出中间部分元素，检查是否正确获取
        middleSection.style.overflowY = "";
        middleSection.style.overflowX = "";  // 保存原始高度
        
        if (typeof ShowAllCoverage === "function") {
            ShowAllCoverage();
        } else {
            console.error("ShowAllCoverage function is not defined"); // 检查函数是否存在
        }

        const { jsPDF } = window.jspdf;

        if (!jsPDF) {
            console.error("jsPDF is not loaded"); // 检查jsPDF是否加载
            return;
        }

        const doc = new jsPDF({
            unit: 'px',  // 使用像素单位
            format: [2800, 5000]  // 使用适当的页面尺寸
        });

        doc.html(document.body, {
            callback: function (doc) {
                // console.log("PDF generated"); // 检查PDF是否生成
                doc.save('webpage.pdf');
                middleSection.style.overflowY = "auto";  // 恢复原始高度
                middleSection.style.overflowX = "auto";
                
                if (typeof NotShowAllCoverage === "function") {
                    NotShowAllCoverage();
                } else {
                    console.error("NotShowAllCoverage function is not defined"); // 检查函数是否存在
                }
            },
            autoPaging: true,
            html2canvas: {
                backgroundColor: '#ffffff',
            },
        });

        // 下载完成后修改按钮状态
        setTimeout(() => {
            // 修改图标和按钮文字
            button.querySelector(".icon-image").src = "static/styles/icon-arrival.png";
            const buttonText = button.querySelector("span");
            if (buttonText) {
                buttonText.innerText = "Completed"; // 修改文字内容
                buttonText.style.fontSize = "12px";  // 修改字体大小
            }
            button.classList.remove("active"); // 移除动画

            // 恢复按钮状态为“Download”
            setTimeout(() => {
                button.querySelector(".icon-image").src = "static/styles/icon_download.png";
                button.querySelector("span").innerText = "PDF";
                button.querySelector("span").style.fontSize = "16px";
            }, 3000); // 设置5秒延迟来恢复按钮文本和图标
        }, 10); // 0.001秒后执行下载完成的操作
    }
}

// 下载html
function downloadhtml(){
    const buttons = document.querySelectorAll(".download-btn");
    const button = buttons[1];

    if (button.classList.contains("active")) {
        // console.log("Button is already active"); // 检查是否已经激活
        return;
    }

    // 激活动画
    button.classList.add("active");
    
    const zip = new JSZip();
    var content = document.getElementById('graphTable').outerHTML;
    var sidebar = document.getElementById('sidebar').outerHTML;
    let Data ={
        digraph:{
            DegreeDistribution:[],
            Coverage:[],
            LoopLength:[],
            CycleDistribution:[]
        },
        bidirectedGraph:{
            DegreeDistribution:[],
            Coverage:[],
            LoopLength:[],
            NestedBubbles:[],
            BubbleChains:[]
        },
        biedgedGraph:{
            DegreeDistribution:[],
            LoopLength:[]
        }
    };
    const allPath = {

                        digraph:{
                            DegreeDistribution:[`../../data/${ip}/${flag}/digraph/inDegree.txt`,`../../data/${ip}/${flag}/digraph/outDegree.txt`],
                            LoopLength:[`../../data/${ip}/${flag}/digraph/loop.txt`],
                            CycleDistribution:[`../../data/${ip}/${flag}/digraph/cycle.txt`]
                        },
                        bidirectedGraph:{
                            DegreeDistribution:[`../../data/${ip}/${flag}/bidirectedGraph/degree.txt`],
                            LoopLength:[`../../data/${ip}/${flag}/bidirectedGraph/loop.txt`],
                            NestedBubbles:[`../../data/${ip}/${flag}/bidirectedGraph/nestedBubblesLevel.txt`],
                            BubbleChains:[`../../data/${ip}/${flag}/bidirectedGraph/bubbleChainLength.txt`]
                        },
                        biedgedGraph:{
                            DegreeDistribution:[`../../data/${ip}/${flag}/biedgedGraph/degree.txt`],
                            LoopLength:[`../../data/${ip}/${flag}/biedgedGraph/loop.txt`]
                        }
                    };
                    const CoveragePath=[`../../data/${ip}/${flag}/digraph/coverage.txt`,`../../data/${ip}/${flag}/bidirectedGraph/coverage.txt`];
                    CoveragePath.forEach((path,index)=>{
                        fetch(path)
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error(`HTTP error! status: ${response.status}`);
                                }
                                return response.text();
                            })
                            .then(data => {
                                const bpdata =[];
                                const nodedata =[];
                                const edgedata =[];
                                const lines = data.split('\n');
                                lines.forEach(line => {
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
                                    let bpformattedData = bpdata.map(item => ({ x: item[0], y: item[1] }));
                                    let nodeformattedData = nodedata.map(item => ({ x: item[0], y: item[1] }));
                                    let edgeformattedData = edgedata.map(item => ({ x: item[0], y: item[1] }));
                                    if(index ==0){
                                        Data['digraph']['Coverage'].push(bpformattedData);
                                        Data['digraph']['Coverage'].push(nodeformattedData);
                                        Data['digraph']['Coverage'].push(edgeformattedData);
                                    }
                                    else{
                                        Data['bidirectedGraph']['Coverage'].push(bpformattedData);
                                        Data['bidirectedGraph']['Coverage'].push(nodeformattedData);
                                        Data['bidirectedGraph']['Coverage'].push(edgeformattedData);
                                    }
                            })
                        }) 
    Object.entries(allPath).forEach(([type, attributes]) => {
        Object.entries(attributes).forEach(([attribute, paths]) => {
            if (paths.length > 1) {
                // 如果有多个路径
                Promise.all(paths.map(path => fetch(path).then(res => res.text())))  // 如果返回的是文本数据，可以使用 .text()
                    .then(data => {
                        const graphData1 = parseData(data[0]);
                        const graphData2 = parseData(data[1]);
                        Data[type][attribute].push(graphData1);
                        Data[type][attribute].push(graphData2);
                    })
                    .catch(error => console.error('Error fetching multiple paths:', error));
            } else {
                // 如果只有一个路径
                fetch(paths[0])  // 只传递单一路径
                    .then(res => res.text())  // 如果返回的是文本数据，可以使用 .text()
                    .then(data => {
                        const graphData = parseData(data);
                        Data[type][attribute].push(graphData);
                    })
                    .catch(error => console.error('Error fetching single path:', error));
            }
        });
    });

    // 获取页面的 CSS 样式
    var styles = '';
    var styleLinks = document.querySelectorAll('link[rel="stylesheet"]');
    var linkCount = styleLinks.length;
    var fetchedStyles = 0;

    // 加载所有外部样式表
    styleLinks.forEach(function(link) {
        var href = link.href;
        if (href) {
            // 对每个外部 CSS 文件执行 fetch 请求
            fetch(href)
                .then(response => response.text())
                .then(cssText => {
                    styles += `<style>${cssText}</style>`;
                    fetchedStyles++;

                    // 如果所有样式表都加载完成，执行下载
                    if (fetchedStyles === linkCount) {
                        downloadHTML();
                    }
                })
                .catch(error => console.error('加载 CSS 时发生错误:', error));
        }
    });

    // 启动下载进度条动画，模拟下载过程
    setTimeout(() => {
        // console.log("Starting download"); // 检查是否进入下载流程
        // 模拟进度条动画完成，开始下载
        downloadHTML();
    }, 1000); // 动画时长1秒
    
    function downloadHTML() {
        var dataString = JSON.stringify(Data);
        // 拼接完整的 HTML 文件内容
        var htmlContent = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>下载的网页部分</title>
                ${styles}
            </head>
            <body>
            <div class="container">
                ${sidebar}
                <div class="main-content" id="main-content" style="overflow-y:auto;overflow-x: auto;">
                ${content}
                <div>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/chart.js"><\/script>
            <script>
            Data=${dataString};
            console.log(Data);
            function toggleTableRow(checkbox) {
            
                const rowId = checkbox.id;
                const row = document.getElementById(\`\${rowId}Row\`);
                
                if (checkbox.checked) {
                    // 填充每个图类型对应的表格单元格
                    row.style.display = '';
                    if(rowId == 'DegreeDistribution'){

                        draw(rowId);
                    } else if(rowId =='LoopLength'){
                        draw(rowId);
                    } else if(rowId =='CycleDistribution'){
                        draw(rowId);
                    } else if(rowId == 'NestedBubbles'){
                        draw(rowId);
                    } else if(rowId =='BubbleChains'){
                        draw(rowId);
                    } else if(rowId =='Coverage'){
                        return;
                    }
                }
                else {
                    row.style.display = 'none';
                }
            }
            function toggleMenu(menuId, iconId) {
                var menu = document.getElementById(menuId);
                const icon = document.getElementById(iconId);

                if (menu.style.display === 'none' || menu.style.display === '') {
                    menu.style.display = "block";
                    icon.src = "static/styles/reduce.png"; // 更改为展开图标
                    icon.title = "Click to expand"; // 更新图标标题
                } else {
                    menu.style.display = "none";
                    icon.src = "static/styles/add.png"; // 更改为收起图标
                    icon.title = "Click to collapse"; // 更新图标标题
                }
            }
            function selectAllCheckboxes() {
                // 检查是否已上传文件
                
                const allMenus = document.querySelectorAll('ul[id^="menu"]');  // 获取所有菜单（每个菜单的ID以 "menu" 开头）
                
                let f=0;
                allMenus.forEach(function(menu) {
                    const subCheckboxes = menu.querySelectorAll('input[type="checkbox"]');  // 获取该菜单下所有子复选框
                    
                    subCheckboxes.forEach(function(subCheckbox) {
                        if (subCheckbox.checked == false) {
                            f=1;
                        }
                    });
                });
                
                if(f){
                    allMenus.forEach(function(menu) {
                        const subCheckboxes = menu.querySelectorAll('input[type="checkbox"]');  // 获取该菜单下所有子复选框
                        
                        subCheckboxes.forEach(function(subCheckbox) {
                            if (subCheckbox.checked == false) {
                                subCheckbox.checked = true; // 选中子复选框
                                toggleTableRow(subCheckbox); // 调用toggleTableRow处理每个复选框的变化
                            }
                        });
                    });
                
                    const checkboxes = document.querySelectorAll('.Check');
                
                    checkboxes.forEach(function(checkbox) {
                        if (checkbox.checked == false) {
                            checkbox.checked = true;  // 设置复选框为选中
                        }
                    });
                }
                else{
                    allMenus.forEach(function(menu) {
                        const subCheckboxes = menu.querySelectorAll('input[type="checkbox"]');  // 获取该菜单下所有子复选框
                        
                        subCheckboxes.forEach(function(subCheckbox) {
                            // if (subCheckbox.checked == false) {
                                subCheckbox.checked = false; // 选中子复选框
                                toggleTableRow(subCheckbox); // 调用toggleTableRow处理每个复选框的变化
                            // }
                        });
                    });
                
                    const checkboxes = document.querySelectorAll('.Check');
                
                    checkboxes.forEach(function(checkbox) {
                        // if (checkbox.checked == false) {
                            checkbox.checked = false;  // 设置复选框为选中
                        // }
                    });
                }
            }
            // 单个图类型复选框全选
            function toggleMenuCheckbox(menuId, checkbox) {
                // 文件未上传时，停止执行后续操作
               
                const menuItems = document.querySelectorAll(\`#\${menuId} input[type="checkbox"]\`);

                menuItems.forEach(function(item) {
                    if (checkbox.checked == true) {
                        if (item.checked == false) {
                            item.checked = true;
                            toggleTableRow(item); // 调用 toggleTableRow 函数处理每个复选框的变化
                        }
                    } else {
                        if (item.checked == true) {
                            item.checked = false;
                            toggleTableRow(item);
                        }
                    }
                });
            }    

            function showcoverageGraph(graph,type){
                const row = document.querySelector(\`#CoverageRow\`);
                let td;
                let index ;
                if (graph === 'digraph')
                {
                    td = row.querySelector('td:nth-child(2)');
                }
                else if(graph === 'bidirectedGraph'){
                    td = row.querySelector('td:nth-child(3)');
                }
                const canvases = td.querySelectorAll('canvas');
                canvases.forEach(function(canvas) {
                    canvas.remove();  // 删除该 <canvas> 元素
                });
                var canvas = document.createElement('canvas');
                canvas.id = graph +type;
                canvas.width = 200;  // Set the width of the canvas
                canvas.height = 150; // Set the height of the canvas
                td.appendChild(canvas);
                var ctx = document.getElementById( graph +type).getContext('2d'); 
                if(type == 'bp')
                    index = 0;
                else if(type == 'Node')
                    index = 1;
                else
                    index = 2;

                var cycleCanvas = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        datasets: [{
                            label:'',
                            data: Data[graph]['Coverage'][index],
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
                })
                
            }

            function draw(type){
                graphList =['digraph','bidirectedGraph','biedgedGraph'];
                const row = document.querySelector(\`#\${type}Row\`);
                const tds = row.querySelectorAll('td');
                tds.forEach((td,index)=>{
                    if(index ==0){
                        return;
                    }
                    else{
                        if(Data[graphList[index-1]][type] == null){
                            return;
                        }
                        const canvases = td.querySelectorAll('canvas');
                        canvases.forEach(function(canvas) {
                            canvas.remove();  // 删除该 <canvas> 元素
                        });
                        var canvas = document.createElement('canvas');
                        canvas.id = index +type;
                        canvas.width = 200;  // Set the width of the canvas
                        canvas.height = 150; // Set the height of the canvas
                        td.appendChild(canvas);
                        var ctx = document.getElementById(index +type).getContext('2d'); 
                        if(Data[graphList[index-1]][type].length == 2 ){
                            new Chart(ctx, {
                                type: 'bar',
                                data: {
                                    datasets: [
                                        {
                                            label: 'In-degree',
                                            data: Data[graphList[index-1]][type][0],
                                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                            borderColor: 'rgba(54, 162, 235, 1)',
                                            borderWidth: 1
                                        },
                                        {
                                            label: 'Out-degree',
                                            data: Data[graphList[index-1]][type][1],
                                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                            borderColor: 'rgba(255, 99, 132, 1)',
                                            borderWidth: 1
                                        }
                                    ]
                                },
                                options: {
                                    scales: {
                                        x: {
                                            type: 'linear',
                                            position: 'bottom',
                                            ticks: {
                                                maxRotation: 0,
                                                minRotation: 0,
                                                stepSize: 2
                                            },
                                            title: { display: true, text: 'Degree' }
                                        },
                                        y: {
                                            type: 'linear',
                                            min: 0,
                                            max: 1,
                                            title: { display: true, text: 'Proportion' }
                                        }
                                    },
                                    plugins: {
                                        legend: {
                                            display: true,
                                            labels: { boxWidth: 10, padding: 10 }
                                        },
                                        // tooltip: {
                                        //     callbacks: {
                                        //         // label: function(context) {
                                        //         //     const dataPoint = context.raw;
                                        //         //     return \`Number: \${dataPoint.originalValue}\`;
                                        //         // }
                                        //     }
                                        // }
                                    },
                                    responsive: false
                                }
                            });
                        } 
                        else if(Data[graphList[index-1]][type].length == 1 && type=="DegreeDistribution"){
                             var cycleCanvas = new Chart(ctx, {
                                type: 'bar',
                                data: {
                                    datasets: [{
                                        label:'',
                                        data: Data[graphList[index-1]][type][0],
                                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                        borderColor: 'rgba(54, 162, 235, 1)',
                                        borderWidth: 1
                                    }]
                                },
                                options: {
                                    scales: {
                                        x: {
                                            type: 'linear',
                                            position: 'bottom',
                                            ticks: {
                                                maxRotation: 0,
                                                minRotation: 0,
                                                stepSize: 2
                                            },
                                            title: { display: true, text: 'Degree' }
                                        },
                                        y: {
                                            type: 'linear',
                                            min: 0,
                                            max: 1,
                                            title: { display: true, text: 'Proportion' }
                                        }
                                    },
                                    plugins: {
                                        legend: {
                                            display: false,
                                            labels: { boxWidth: 10, padding: 10 }
                                        },
                                        // tooltip: {
                                        //     callbacks: {
                                        //         // label: function(context) {
                                        //         //     const dataPoint = context.raw;
                                        //         //     return \`Number: \${dataPoint.originalValue}\`;
                                        //         // }
                                        //     }
                                        // }
                                    },
                                    responsive: false
                                }
                            })
                        }
                        else if(Data[graphList[index-1]][type].length == 1){
                        
                            var cycleCanvas = new Chart(ctx, {
                                type: 'bar',
                                data: {
                                    datasets: [{
                                        label:'',
                                        data: Data[graphList[index-1]][type][0],
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
                            })
                        }
                        else{
                            return;
                        }

                    }
                })
            }
            window.onload = selectAllCheckboxes();
            <\/script>
            
            </body>
            </html>`;
        zip.file("index.html",htmlContent);
        // 创建 Blob 对象
        // var blob = new Blob([htmlContent], { type: 'text/html' });

        // // 创建临时下载链接
        // var link = document.createElement('a');
        // link.href = URL.createObjectURL(blob);
        // link.download = 'downloaded_part.html'; // 下载文件名

        // // 触发点击事件开始下载
        // link.click();
        // const imageFiles =['../styles/icon_56x57.png','../styles/check.png','../styles/reduce.png',
        //     '../styles/add.png','../styles/detail.png','../styles/dig.png','../styles/bidig.png','../styles/bieg.png'];
        const imageFiles =['icon_56x57.png','check.png','reduce.png',
            'add.png','detail.png','dig.png','bidig.png','bieg.png'];
        const imageFolder = zip.folder("static/styles");
        imageFiles.forEach((imageName) => {
            // 读取每个图片文件并添加到 ZIP 文件中
            fetch(imageName)
                .then(response => response.blob())
                .then(blob => {
                    imageFolder.file(imageName, blob);
                });
        });
        Promise.all(imageFiles.map(imageName => {
            return fetch(imageName)
                .then(response => response.blob())
                .then(blob => {
                    imageFolder.file(imageName, blob);
                })
                .catch(error => console.error(`Error loading image: ${imageName}`, error));
        })).then(() => {
            // 生成并下载 ZIP 文件
            zip.generateAsync({ type: "blob" }).then(function (content) {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(content);
                link.download = "website.zip";
                link.click();
            });
        });
    }

    // 下载完成后修改按钮状态
    setTimeout(() => {
        // 修改图标和按钮文字
        button.querySelector(".icon-image").src = "static/styles/icon-arrival.png";
        const buttonText = button.querySelector("span");
        if (buttonText) {
            buttonText.innerText = "Completed"; // 修改文字内容
            buttonText.style.fontSize = "12px";  // 修改字体大小
        }
        button.classList.remove("active"); // 移除动画

        // 恢复按钮状态为“Download”
        setTimeout(() => {
            button.querySelector(".icon-image").src = "static/styles/icon_download.png";
            button.querySelector("span").innerText = "HTML";
            button.querySelector("span").style.fontSize = "16px";
        }, 3000); // 设置5秒延迟来恢复按钮文本和图标
    }, 10); // 0.001秒后执行下载完成的操作
}

function downloadZip() {
    const buttons = document.querySelectorAll(".download-btn");
    const button = buttons[2];

    // 防止多次点击
    if (button.classList.contains("active")) {
        return;
    }

    // 激活动画
    button.classList.add("active");

    // 启动下载进度条动画，模拟下载过程
    setTimeout(() => {
        // 模拟进度条动画完成，开始下载
        startDownload();
    }, 1000); // 动画时长1秒
    ShowAllCoverage();

    function startDownload() {
        const buttons = document.querySelectorAll(".download-btn");
        const button = buttons[2];
        
        // 发送请求并处理下载
        if(flag.includes('+')) {
            return;  // 防止不必要的重复请求
        }

        axios.get('/api/downloadZip', {
            params: {
                userIp: ip,
                flag: flag  // 将文件路径作为查询参数传递
            }
        })
        .then(function (response) {
            console.log(`./${flag}.zip`);
            window.location.href = `../data/${ip}/${flag}/${flag}.zip`;  // 触发文件下载
            console.log('命令执行输出:', response.data);

            // 下载完成后修改按钮状态
            setTimeout(() => {
                // 修改图标和按钮文字
                button.querySelector(".icon-image").src = "static/styles/icon-arrival.png";
                const buttonText = button.querySelector("span");
                if (buttonText) {
                    buttonText.innerText = "Completed"; // 修改文字内容
                    buttonText.style.fontSize = "12px";  // 修改字体大小
                }
                button.classList.remove("active"); // 移除动画

                // 调用删除函数
                deleteZip();

                // 恢复按钮状态为“Download”
                setTimeout(() => {
                    button.querySelector(".icon-image").src = "static/styles/icon_download.png";
                    button.querySelector("span").innerText = "ZIP";
                    button.querySelector("span").style.fontSize = "16px";
                }, 3000); // 设置5秒延迟来恢复按钮文本和图标
            }, 10); // 0.001秒后执行下载完成的操作
        })
        .catch(function (error) {
            // 错误回调
            console.error('命令执行失败:', error);
            // 错误时恢复按钮状态
            setTimeout(() => {
                button.querySelector(".icon-image").src = "static/styles/icon-failed.png";
                const buttonText = button.querySelector("span");
                if (buttonText) {
                    buttonText.innerText = "Failed"; // 修改文字内容
                    buttonText.style.fontSize = "12px";  // 修改字体大小
                }
                button.classList.remove("active");
            }, 3000);
        });
    }
}

function deleteZip(){
    axios.get('/api/deleteZip', {
        params: {
            flag: flag  // 将文件路径作为查询参数传递
        }
    })
    .then(function (response) {
        // console.log(`./${flag}.zip`);
        console.log('命令执行输出:', response.data);
        
    })
    .catch(function (error) {
        // 错误回调
        console.error('命令执行失败:', error);
    });
}




// =======================================================
//                  绘制左侧栏复选框
// =======================================================

// 添加包含标签和四个复选框的表格行
function addCheckbox(labelText) {
    // 获取固定的插入位置
    const container = document.getElementById('checkbox-container');
    const tds =container.querySelectorAll('td');
    tds.forEach(td=>{
        if(td.textContent && td.textContent == labelText)
            return;
    })
    const row = document.createElement('tr');
    const nameLabel = document.createElement('td');
    const name = `${labelText}`; 
    nameLabel.textContent = name;

    for (let i = 0; i < 4; i++) {
        const checkboxCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = `${labelText}-${i}`; // 唯一 name 属性
        checkboxCell.appendChild(checkbox);
        row.appendChild(checkboxCell);
    }
    row.insertBefore(nameLabel, row.firstChild);
    container.appendChild(row);
}

// 单个图类型栏展开/折叠
function toggleMenu(menuId, iconId) {
    var menu = document.getElementById(menuId);
    const icon = document.getElementById(iconId);

    if (menu.style.display === 'none' || menu.style.display === '') {
        menu.style.display = "block";
        icon.src = "static/styles/reduce.png"; // 更改为展开图标
        icon.title = "Click to expand"; // 更新图标标题
    } else {
        menu.style.display = "none";
        icon.src = "static/styles/add.png"; // 更改为收起图标
        icon.title = "Click to collapse"; // 更新图标标题
    }
}

// 默认展开菜单
document.addEventListener('DOMContentLoaded', function() {
    toggleMenu('menu1', 'icon-toggle1'); // 调用 toggleMenu 以展开菜单
});

// 复选框全选按钮
function selectAllCheckboxes() {
    // 检查是否已上传文件
    if (!isFileUploaded()) {
        alert("Error: Please upload the file first!");
        return; // 文件未上传时，停止执行后续操作
    }

    const allMenus = document.querySelectorAll('ul[id^="menu"]');  // 获取所有菜单（每个菜单的ID以 "menu" 开头）
    
    let f=0;
    allMenus.forEach(function(menu) {
        const subCheckboxes = menu.querySelectorAll('input[type="checkbox"]');  // 获取该菜单下所有子复选框
        
        subCheckboxes.forEach(function(subCheckbox) {
            if (subCheckbox.checked == false) {
                f=1;
            }
        });
    });
    
    if(f){
        allMenus.forEach(function(menu) {
            const subCheckboxes = menu.querySelectorAll('input[type="checkbox"]');  // 获取该菜单下所有子复选框
            
            subCheckboxes.forEach(function(subCheckbox) {
                if (subCheckbox.checked == false) {
                    subCheckbox.checked = true; // 选中子复选框
                    toggleTableRow(subCheckbox); // 调用toggleTableRow处理每个复选框的变化
                }
            });
        });
    
        const checkboxes = document.querySelectorAll('.Check');
    
        checkboxes.forEach(function(checkbox) {
            if (checkbox.checked == false) {
                checkbox.checked = true;  // 设置复选框为选中
            }
        });
    }
    else{
        allMenus.forEach(function(menu) {
            const subCheckboxes = menu.querySelectorAll('input[type="checkbox"]');  // 获取该菜单下所有子复选框
            
            subCheckboxes.forEach(function(subCheckbox) {
                // if (subCheckbox.checked == false) {
                    subCheckbox.checked = false; // 选中子复选框
                    toggleTableRow(subCheckbox); // 调用toggleTableRow处理每个复选框的变化
                // }
            });
        });
    
        const checkboxes = document.querySelectorAll('.Check');
    
        checkboxes.forEach(function(checkbox) {
            // if (checkbox.checked == false) {
                checkbox.checked = false;  // 设置复选框为选中
            // }
        });
    }
}

// 单个图类型复选框全选
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
        if (checkbox.checked == true) {
            if (item.checked == false) {
                item.checked = true;
                toggleTableRow(item); // 调用 toggleTableRow 函数处理每个复选框的变化
            }
        } else {
            if (item.checked == true) {
                item.checked = false;
                toggleTableRow(item);
            }
        }
    });
}

// 取消页面上所有复选框的选中状态
function unselectAllCheckboxes() {
    // 获取所有复选框元素
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    // 遍历每个复选框并设置为未选中状态
    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked == true) {
            checkbox.checked = false;
            if(checkbox.id)
                toggleTableRow(checkbox); // 调用现有的 toggleTableRow 函数，处理复选框状态变化
        }
    });
}


// =======================================================
//                        标签页栏
// =======================================================

var scrollSetp = 500,
operationWidth = 90,
leftOperationWidth = 30,
animatSpeed = 150,
linkframe = function(FileName) {
    $("#menu-list a.active").each(function(){
        if($(this).text().includes("+")){
            $(this).remove();
        }
    })
    $("#menu-list a.active").removeClass("active");
    $("#menu-list a[FileName='" + FileName + "']").addClass("active");
    // $("#menu-all-ul li.active").removeClass("active");
    // $("#menu-all-ul li[FileName='" + FileName + "']").addClass("active");
    flag = FileName;
    if(!flag.includes('+')){
        const headRow=document.querySelector('#headRow');
        const ths = headRow.querySelectorAll('th');
        ths.forEach(th=>{
            th.style.display="";
            th.setAttribute('colspan',1);
        })
        const GFARow = document.querySelector('#GFARow');
        GFARow.style.display ="none";
        const GFANameRow = document.querySelector('#GFANameRow');
        GFANameRow.style.display ="none";
        const TypeNameRow = document.querySelector('#TypeNameRow');
        TypeNameRow.style.display ="none";
        const tds = document.querySelectorAll('td.append');
        tds.forEach(td=>{
            td.parentNode.removeChild(td);
        })

    }
    unselectAllCheckboxes();
    load();
},
move = function(selDom) {
    var nav = $("#menu-list");
    var releft = selDom.offset().left;
    var wwidth = parseInt($("#page-tab").width());
    var left = parseInt(nav.css("margin-left"));
    if (releft < 0 && releft <= wwidth) {
        nav.animate({
            "margin-left": (left - releft + leftOperationWidth) + "px"
        },
        animatSpeed)
    } else {
        if (releft + selDom.width() > wwidth - operationWidth) {
            nav.animate({
                "margin-left": (left - releft + wwidth - selDom.width() - operationWidth) + "px"
            },
            animatSpeed)
        }
    }
},
createmove = function() {
    var nav = $("#menu-list");
    var wwidth = parseInt($("#page-tab").width());
    var navwidth = parseInt(nav.width());
    if (wwidth - operationWidth < navwidth) {
        nav.animate({
            "margin-left": "-" + (navwidth - wwidth + operationWidth) + "px"
        },
        animatSpeed)
    }
},
closemenu = function() {
    $(this.parentElement).animate({
        "width": "0",
        "padding": "0"
    },
    0,
    function() {
        // 清理选中状态
        flag = "";
        unselectAllCheckboxes();

        // 如果菜单项有类 "active"，找到下一个或上一个项并触发点击
        var jthis = $(this);
        if (jthis.hasClass("active")) {
            var linext = jthis.next();
            if (linext.length > 0) {
                linext.click();
                move(linext)
            } else {
                var liprev = jthis.prev();
                if (liprev.length > 0) {
                    liprev.click();
                    move(liprev)
                }
            }
        }
        // 删除当前菜单项
        this.remove();
    });
    event.stopPropagation()
}

// 标签页栏左右翻页按钮
function init() {
    $("#page-prev").bind("click",
        function() {
            var nav = $("#menu-list");
            var left = parseInt(nav.css("margin-left"));
            if (left !== 0) {
                nav.animate({
                    "margin-left": (left + scrollSetp > 0 ? 0 : (left + scrollSetp)) + "px"
                },
                animatSpeed)
            }
        });
        $("#page-next").bind("click",
        function() {
            var nav = $("#menu-list");
            var left = parseInt(nav.css("margin-left"));
            var wwidth = parseInt($("#page-tab").width());
            var navwidth = parseInt(nav.width());
            var allshowleft = -(navwidth - wwidth + operationWidth);
            if (allshowleft !== left && navwidth > wwidth - operationWidth) {
                var temp = (left - scrollSetp);
                nav.animate({
                    "margin-left": (temp < allshowleft ? allshowleft: temp) + "px"
                },
                animatSpeed)
            }
        });
}

// 如果标签页已经存在，则将其激活；如果不存在，则创建新的标签页并显示
function openTab(FileName) {
    init();
    var selDom = $("#menu-list a[FileName='" + FileName + "']"); // menu-list是标签栏
    if (selDom.length === 0) { // 如果标签页不存在，则创建新的标签
        var iel = $("<img>", { // i是关闭的标签
            "src": "static/styles/closehover.png",
            "style":"width: 15px; height: 15px; vertical-align: middle;margin-left: 5px;"  //标签页的叉
        }).bind("click", closemenu);
        $("<a>", { // a是标签页
            "html": FileName,
            "href": "javascript:void(0);",
            "FileName": FileName,
        }).bind("click", function() {
            linkframe(FileName);
        }).append(iel).appendTo("#menu-list");
        createmove();
    } else {
        move(selDom);
    }
    
    linkframe(FileName);
}





// =======================================================
//                    单GFA文件表格数据加载
// =======================================================

// 加载所有图数据
function loadAllData() {
    const loadPromises = [];
    for (const graphType in fileMap) {
        fileMap[graphType].forEach(filePath => {
            // console.log(1);
            // console.log(filePath);
            loadPromises.push(loadFileData(graphType, filePath));
        });
    }
    return Promise.all(loadPromises);
}

// 加载对应的图数据
function loadFileData(graphType, filePath) {
    // console.log(2);
    // console.log(graphType);
    // console.log(filePath);
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
                    graphData[graphType][key] = value; // 将数据存储到对应的图类型中
                }
            });
        })
        .catch(error => console.error(`Error: Loading data from ${filePath}:`, error));
}

// 加载GFA文件数据
function loadGFAData(filePath) {
    // console.log(filePath);
    return fetch(filePath)
    .then(response => {
        // console.log(response);    
        if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            // console.log(123);
                const lines = data.split('\n');
                lines.forEach(line => {
                    // console.log(line);
                    const cleanedLine = line.replace(/^#/, '').trim();
                    const [key, value] = cleanedLine.split(/\s+/).filter(Boolean);
                    // console.log(cleanedLine);
                    if (key && value) {
                        GFAData[key] = value;
                    }
                });
        })
        .catch(error => console.error(`Error: Loading data from ${filePath}:`, error));
}

// 根据地址加载对应数据
function load(){
    if(flag.includes('+')){
        graphData ={
            bidirectedGraph: {},
            biedgedGraph: {},
            dibigraph: {},
            digraph: {},
        };
        GFAData ={};
        return;
    }
    fileMap={
        bidirectedGraph: [`../../data/${ip}/${flag}/bidirectedGraph/basicStatistics.txt`],
        biedgedGraph: [`../../data/${ip}/${flag}/biedgedGraph/basicStatistics.txt`],
        digraph:[`../../data/${ip}/${flag}/digraph/basicStatistics.txt`]
    };
    loadAllData();
    loadGFAData(`../../data/${ip}/${flag}/gfa/basicStatistics.txt`);
}

// 检查文件是否已上传
function isFileUploaded() {
    return fileUploaded;
}

// 监听复选框状态并填充表格
function toggleTableRow(checkbox) {
    if(flag.includes('+')){
        const rowId = checkbox.id;
        const row = document.querySelector(`#${rowId}Row`);

        // 检查是否已上传文件
        if (!isFileUploaded()) {
            alert("Error: Please upload the file first!");
            checkbox.checked = false; // 取消选中状态
            return;
        }

        if (checkbox.checked) {
            row.style.display = '';
        }
        else{
            row.style.display = 'none';
        }
        return;
    }
    else {
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
            const tds = row.querySelectorAll('td');
            tds.forEach(td =>{
                if(td.style)
                    td.style.display = "";
            });
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
                const tds = row.querySelectorAll('td');
                tds.forEach((td, index) => {
                    if (index > 1) { 
                        td.textContent = '/';
                    }
                });
            } else if(rowId == 'NestedBubbles'){
                NestedBubblesFunction();
                const tds = row.querySelectorAll('td');
                tds.forEach((td, index) => {
                    if (index == 1 || index == 3) { 
                        td.textContent = '/';
                    }
                });
            } else if(rowId =='BubbleChains'){
                BubbleChainsFunction();
                const tds = row.querySelectorAll('td');
                tds.forEach((td, index) => {
                    if (index == 1 || index == 3) { 
                        td.textContent = '/';
                    }
                });
            } else if(rowId =='Coverage'){
                const digraph = row.querySelector('[data-graph="digraph"]');
                digraph.innerHTML = `
                <button onclick="showcoverageGraph('digraph','bp')">bp</button>
                <button onclick="showcoverageGraph('digraph','Node')">Node</button>
                <button onclick="showcoverageGraph('digraph','Edge')">Edge</button>
               
            `;
                const bidirectedGraph = row.querySelector('[data-graph="bidirectedGraph"]');
                bidirectedGraph.innerHTML = `
                <button onclick="showcoverageGraph('bidirectedGraph','bp')">bp</button>
                <button onclick="showcoverageGraph('bidirectedGraph','Node')">Node</button>
                <button onclick="showcoverageGraph('bidirectedGraph','Edge')">Edge</button>
                
            `;
                GetAllCoverage();
                
                
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
}

// // 当页面加载完成后，隐藏页面上的一些特定表格行
// window.onload = function() {
//     document.getElementById('file_sizeRow').style.display = 'none';
//     document.getElementById('segmentsRow').style.display = 'none';
//     document.getElementById('linksRow').style.display = 'none';
//     document.getElementById('pathsRow').style.display = 'none';
//     document.getElementById('single_direction_segmentRow').style.display = 'none';
//     document.getElementById('bidirectional_direction_segmentRow').style.display = 'none';
// };







// =======================================================
//                    组合文件表格数据加载
// =======================================================

// 文件组合界面，根据用户选择的复选框动态更新表格的显示内容
function CheckData(){
    const array = new Array(4).fill(0);
    var tab="";
    const checkboxes = document.querySelectorAll('#custom-table input[type="checkbox"]:checked');
    const name =[];
    const type =[];
    let index = 0;
    const groupedData ={};
    checkboxes.forEach(checkbox => {
        const checkboxName = checkbox.name;
        const [TabName,typename] = checkboxName.split('-');
        // const TabName = checkboxName.split('-')[0];
        // const typename = checkboxName.split('-')[1];
        if (checkbox.checked){
            if (!groupedData[typename]) {
                groupedData[typename] = []; // 初始化数组
            }
            groupedData[typename].push(TabName); // 将前缀添加到对应后缀的数组中
            array[typename]++;
            if(!type.includes(typename)){
                type.push(typename);
            }
            if(!name.includes(TabName)){
                name.push(TabName);
                if (index == 0)
                    tab +=  TabName;
                else 
                    tab += "+" + TabName;
                index ++;
            }
        }
    });
    // console.log(array);
    flag = tab;
    openTab(tab);
    const row = document.getElementById('headRow');
    row.style.display = "none";  
    const ths = row.querySelectorAll('th');
    for(let i = 0; i < 4 ; ++i){
        ths[i].style.display ="none";
    }
    const GFAcell = document.getElementById('GFARow');
    const GFANameRow = document.getElementById('GFANameRow');
    const TypeNameRow = document.getElementById('TypeNameRow');
    GFAcell.style.display ="none";
    const table = document.getElementById('graphTable');
    const tableHead = table.tHead;
    const tableBody = table.tBodies[0];
    const GFAtds=GFANameRow.querySelectorAll('td');
    GFAtds.forEach(td =>{
        if(td.textContent){
            td.style.display ="none";
        }
    })
    const Typetds=TypeNameRow.querySelectorAll('td');
    Typetds.forEach(td =>{
        if(td.textContent){
            td.style.display ="none";
        }
    })
    const alltds=table.querySelectorAll('td');
    alltds.forEach(x=>{
        if (x.id.includes('Cell')||x.getAttribute('data-graph')||x.id =="GFARow") {
            x.style.display = "none";
        }
    })
    const tds = document.querySelectorAll('td.append');
        tds.forEach(td=>{
            td.parentNode.removeChild(td);
        })

    if(type.includes('0')){
        GFAcell.style.display ="";
        GFANameRow.style.display ="";
        // console.log(array[0]+1);
        GFAcell.setAttribute('colspan',Math.max(array[1]+array[2]+array[3]+1,array[0]+1));

    }
    if(type.includes('1')){
        TypeNameRow.style.display="";
        row.style.display = "";  
        ths[0].style.display ="";
        ths[1].style.display ="";
        ths[1].setAttribute('colspan',array[1]);
    }
    if(type.includes('2')){
        TypeNameRow.style.display="";
        row.style.display = "";  
        ths[0].style.display ="";
        ths[2].style.display ="";
        ths[2].setAttribute('colspan',array[2]);
    }
    if(type.includes('3')){
        TypeNameRow.style.display="";
        row.style.display = "";  
        ths[0].style.display ="";
        ths[3].style.display ="";
        ths[3].setAttribute('colspan',array[3]);
    }
    for (const key in groupedData) {
        if (groupedData.hasOwnProperty(key)) { // 确保 key 是对象自身的属性
            groupedData[key].forEach(value => {
                const img = document.createElement('img');
                // 设置 img 的属性
                img.src = 'static/styles/file.png'; // 图片的 URL
                img.width = 16; // 设置图片的宽度
                img.height = 16; // 设置图片的高度
                img.style.verticalAlign = "middle";
                const newtd = document.createElement('td');
                newtd.appendChild(img);
                newtd.appendChild(document.createTextNode(value));
                
                if(key =='0'){
                    if(array[1]||array[2]||array[3])
                        newtd.setAttribute('colspan',(array[1]+array[2]+array[3])/array[0]);
                    newtd.style.display ="";
                    newtd.style.backgroundColor =  "#ffffff";
                    GFANameRow.appendChild(newtd);
                }
                else if(key =='1'){
                    newtd.style.display ="";
                    newtd.style.backgroundColor =   "rgba(229, 19, 0, 0.3)";
                    TypeNameRow.appendChild(newtd);
                }
                else if(key =='2'){
                    newtd.style.display ="";
                    newtd.style.backgroundColor =  "rgba(240, 150, 9, 0.3)";
                    TypeNameRow.appendChild(newtd);
                }
                else if(key =='3'){
                    newtd.style.display ="";
                    newtd.style.backgroundColor =  "rgba(27, 161, 226, 0.3)";
                    TypeNameRow.appendChild(newtd);
                }
            });
        }
    }
    const typetrs = tableBody.querySelectorAll('tr');
    typetrs.forEach((tr,index)=>{
        for(let i = 0; i < array[1];++i){
            const newtd = document.createElement('td');
            if (index % 2 === 0) {
                newtd.style.backgroundColor = "rgba(229, 19, 0, 0.2)";
            } else {
                newtd.style.backgroundColor = "rgba(229, 19, 0, 0.3)";
            }
            newtd.classList.add('append');
            tr.appendChild(newtd);
        }
        for(let i = 0; i < array[2];++i){
            const newtd = document.createElement('td');
            if(index %2 ===0 ){
                newtd.style.backgroundColor = "rgba(240, 150, 9, 0.2)";
            }
            else{
                newtd.style.backgroundColor =  "rgba(240, 150, 9, 0.3)";
            }
            newtd.classList.add('append');
            tr.appendChild(newtd);
        }
        for(let i = 0; i < array[3];++i){
            const newtd = document.createElement('td');
            if(index %2 === 0){
                newtd.style.backgroundColor = "rgba(27, 161, 226, 0.2)";
            }
            else{
                newtd.style.backgroundColor =  "rgba(27, 161, 226, 0.3)";
            }
            newtd.classList.add('append');
            tr.appendChild(newtd);
        }
    });

    
    for (const key in groupedData) {
        if (groupedData.hasOwnProperty(key)) { // 确保 key 是对象自身的属性
            groupedData[key].forEach((value,position) => {
                // console.log(key+value);//value是每个文件的名字
                if(key =='0'){
                    const trs = tableHead.querySelectorAll('tr');
                    // console.log(value);
                    GFAData={};
                    loadGFAData(`../../data/${ip}/${value}/gfa/basicStatistics.txt`)
                        .then(() => {
                            // console.log(GFAData);
                            trs.forEach((item,index) =>{
                                if(item.id && item.id !='GFANameRow' && item.id !='TypeNameRow' && item.id !='headRow'){
                                    const newtd = document.createElement('td');
                                    const realId = item.id.replace(/Row/g, '');
                                    newtd.textContent = GFAData[realId] || '/';
                                    if(index %2 ===0){
                                        newtd.style.backgroundColor = "rgba(249, 217, 234, 1)";
                                    }
                                    else{
                                        newtd.style.backgroundColor =  "#ffffff";
                                    }
                                    if(array[1]||array[2]||array[3])
                                        newtd.setAttribute('colspan',(array[1]+array[2]+array[3])/array[0]);
                                    newtd.classList.add('append');
                                    item.appendChild(newtd);
                                    }
                            });
                        })
                        .catch(error => {
                            console.error("Error loading GFA data:", error);
                        });
                    
                }
                else if(key == '1'){
                    const trs = tableBody.querySelectorAll('tr');
                    graphData = {
                        bidirectedGraph: {},
                        biedgedGraph: {},
                        dibigraph: {},
                        digraph: {},
                    };
                    fetch(`../../data/${ip}/${value}/digraph/basicStatistics.txt`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`Failed to load the file: ${response.statusText}`);
                            }
                            return response.text(); // 解析为文本
                        })
                        .then(data => {
                            // 将文本数据按行分割
                            const lines = data.split('\n');
                            // 逐行处理数据
                            lines.forEach(line => {
                                // console.log(line);
                                const cleanedLine = line.replace(/^#/, '').trim(); // 去除注释
                                const [key, value] = cleanedLine.split(/\s+/).filter(Boolean);
                                // console.log(key);
                                // console.log(value);
                                if (key && value) {
                                    graphData['digraph'][key] = value; // 存储到 digraph
                                }
                            });
                            // console.log(graphData);
                            // 处理完数据后继续执行其他操作
                            trs.forEach((item, index) => {
                                if (item.id) {
                                    if (item.id == 'DegreeDistributionRow') {
                                        appenddegree(position,`../../data/${ip}/${value}/digraph/inDegree.txt`, `../../data/${ip}/${value}/digraph/outDegree.txt`);
                                    } else if (item.id == 'LoopLengthRow') {
                                        appendLoop(position+4,`../../data/${ip}/${value}/digraph/loop.txt`);
                                    } else if (item.id == 'CycleDistributionRow') {
                                        appendcycle(position+4,`../../data/${ip}/${value}/digraph/cycle.txt`);
                                    } else if (item.id == 'NestedBubblesRow' || item.id == 'BubbleChainsRow') {
                                        item.children[position+4].textContent="/";
                                    } else if( item.id == 'CoverageRow'){
                                        const td = item.children[position+4];
                                        const button1 =document.createElement('button');
                                        const button2 =document.createElement('button');
                                        const button3=document.createElement('button');
                                        button1.textContent = 'bp';
                                        button2.textContent = 'Node';
                                        button3.textContent = 'Edge';
                                        button1.onclick = function(){
                                            appendcoverageGraph(position+4,'bp');
                                        }
                                        button2.onclick = function(){
                                            appendcoverageGraph(position+4,'Node');
                                        }
                                        button3.onclick = function(){
                                            appendcoverageGraph(position+4,'Edge')
                                        }
                                        td.appendChild(button1);
                                        td.appendChild(button2);
                                        td.appendChild(button3);
                                        const coveragePath = `../../data/${ip}/${value}/digraph/coverage.txt`;
                                        const TypeList=['bp','Node','Edge'];
                                        fetch(coveragePath)
                                            .then(response => {
                                                if (!response.ok) {
                                                    throw new Error(`HTTP error! status: ${response.status}`);
                                                }
                                                return response.text();
                                            })
                                            .then(data => {
                                                const div = document.createElement('div');
                                                div.style.display="margin-top: 10px";
                                                td.appendChild(div);
                                                const bpdata =[];
                                                const nodedata =[];
                                                const edgedata =[];
                                                const lines = data.split('\n');
                                                lines.forEach(line => {
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
                                                TypeList.forEach(type=>{
                                                    if(type === 'bp'){
                                                        formattedData = bpdata.map(item => ({ x: item[0], y: item[1] }));
                                                    }
                                                    else if(type === 'Node'){
                                                        formattedData = nodedata.map(item => ({ x: item[0], y: item[1] }));
                                                    }
                                                    else if(type === 'Edge'){
                                                        formattedData = edgedata.map(item => ({ x: item[0], y: item[1] }));
                                                    }
                                                    var canvas = document.createElement('canvas');
                                                    canvas.id = 'coverageCanvas'+(position+4)+type;
                                                    canvas.width = 200;  // Set the width of the canvas
                                                    canvas.height = 150; // Set the height of the canvas
                                                    div.appendChild(canvas);
                                                    var ctx = document.getElementById('coverageCanvas'+(position+4)+type).getContext('2d');  
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
                                                                    },
                                                                    y: {
                                                                        type: 'linear', // 修改为线性坐标系
                                                                        position: 'left',
                                                                        ticks: {
                                                                            callback: function (value) {
                                                                                if (Number.isInteger(value)) {
                                                                                    return value;  // 只显示整数刻度
                                                                                }
                                                                                return null;  // 隐藏非整数刻度
                                                                            }
                                                                        },
                                                                        title: { display: true, text: 'Number (Log)' } // 修改标题文本
                                                                    }
                                                                }
                                                            },
                                                            plugins: {
                                                                legend: {
                                                                    display: false  // 这会隐藏整个图例（包括任何标签）
                                                                },
                                                                tooltip: {
                                                                    callbacks: {
                                                                        label: function (context) {
                                                                            var label = context.dataset.label || '';
                                                                            if (label) {
                                                                                label += ': ';
                                                                            }
                                                                            if (context.parsed.y !== null) {
                                                                                label += context.raw.originalY;  // 显示原始值
                                                                            }
                                                                            return `Number: ${label}`;  // 使用反引号构建字符串
                                                                        }
                                                                    }
                                                                }
                                                            },
                                                            responsive: false,  // 防止图表响应容器尺寸变化
                                
                                                        }
                                                    });
                                                    canvas.style.display = "none";    
                                                })
                                            })
                                    }
                                     else {
                                        const realId = item.id.replace(/Row/g, '');
                                        // console.log(item.children[position+4]);
                                        item.children[position+4].textContent=graphData['digraph'][realId] || '/';
                                    }
                                }
                            });
                        })
                        .catch(error => {
                            console.error('Error loading or processing file:', error);
                        });    
                }
                else if (key =='2'){
                    const trs = tableBody.querySelectorAll('tr');
                    graphData = {
                        bidirectedGraph: {},
                        biedgedGraph: {},
                        dibigraph: {},
                        digraph: {},
                    };
                    fetch(`../../data/${ip}/${value}/bidirectedGraph/basicStatistics.txt`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`Failed to load the file: ${response.statusText}`);
                            }
                            return response.text(); // 解析为文本
                        })
                        .then(data => {
                             // 将文本数据按行分割
                             const lines = data.split('\n');
                             // 逐行处理数据
                             lines.forEach(line => {
                                //  console.log(line);
                                 const cleanedLine = line.replace(/^#/, '').trim(); // 去除注释
                                 const [key, value] = cleanedLine.split(/\s+/).filter(Boolean);
                                 if (key && value) {
                                     graphData['bidirectedGraph'][key] = value; // 存储到 digraph
                                 }
                             });

                            trs.forEach((item,index) =>{
                                if(item.id){
                                    // Array.from(item.children).forEach(x => {
                                    //     if (x.id.includes('raph')) {
                                    //         x.style.display = "none";
                                    //     }
                                    //     else{
                                    //         if(x.style.backgroundColor){
                                    //             item.removeChild(x);
                                    //         }
                                    //     }
                                    // });
                                    if(item.id == 'DegreeDistributionRow'){
                                        appenddegree2('bidirectedGraph',position+4+array[1],`../../data/${ip}/${value}/bidirectedGraph/degree.txt`);
                                    }
                                    else if(item.id == 'LoopLengthRow'){
                                        appendLoop(position+4+array[1],`../../data/${ip}/${value}/bidirectedGraph/loop.txt`);
                                    }
                                    else if(item.id == 'CycleDistributionRow'){
                                        item.children[position+4+array[1]].textContent =  '/';
                                    }
                                    else if(item.id == 'NestedBubblesRow'){
                                        appendNestedBubblesdata(position+4+array[1],`../../data/${ip}/${value}/bidirectedGraph/nestedBubblesLevel.txt`);
                                    }
                                    else if(item.id == 'BubbleChainsRow'){
                                        appendBubbleChainsdata(position+4+array[1],`../../data/${ip}/${value}/bidirectedGraph/bubbleChainLength.txt`);
                                    }
                                    else if(item.id == 'CoverageRow'){
                                        const td = item.children[position+4+array[1]];
                                        const button1 =document.createElement('button');
                                        button1.textContent = 'bp';
                                        button1.onclick = function(){
                                            appendcoverageGraph(position+4+array[1],'bp');
                                        }
                                        const button2 =document.createElement('button');
                                        button2.textContent = 'Node';
                                        button2.onclick = function(){
                                            appendcoverageGraph(position+4+array[1],'Node');
                                        }
                                        const button3=document.createElement('button');
                                        button3.textContent = 'Edge';
                                        button3.onclick = function(){
                                            appendcoverageGraph(position+4+array[1],'Edge');
                                        }
                                        td.appendChild(button1);
                                        td.appendChild(button2);
                                        td.appendChild(button3);
                                        const coveragePath = `../../data/${ip}/${value}/bidirectedGraph/coverage.txt`
                                        const TypeList=['bp','Node','Edge'];
                                        fetch(coveragePath)
                                            .then(response => {
                                                if (!response.ok) {
                                                    throw new Error(`HTTP error! status: ${response.status}`);
                                                }
                                                return response.text();
                                            })
                                            .then(data => {
                                                const div = document.createElement('div');
                                                div.style.display="margin-top: 10px";
                                                td.appendChild(div);
                                                const bpdata =[];
                                                const nodedata =[];
                                                const edgedata =[];
                                                const lines = data.split('\n');
                                                lines.forEach(line => {
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
                                                TypeList.forEach(type=>{
                                                    if(type === 'bp'){
                                                        formattedData = bpdata.map(item => ({ x: item[0], y: item[1] }));
                                                    }
                                                    else if(type === 'Node'){
                                                        formattedData = nodedata.map(item => ({ x: item[0], y: item[1] }));
                                                    }
                                                    else if(type === 'Edge'){
                                                        formattedData = edgedata.map(item => ({ x: item[0], y: item[1] }));
                                                    }
                                                    var canvas = document.createElement('canvas');
                                                    canvas.id = 'coverageCanvas'+(position+4+array[1])+type;
                                                    canvas.width = 200;  // Set the width of the canvas
                                                    canvas.height = 150; // Set the height of the canvas
                                                    div.appendChild(canvas);
                                                    var ctx = document.getElementById('coverageCanvas'+(position+4+array[1])+type).getContext('2d');  
                                                    var coverageCanvas = new Chart(ctx, {
                                                        type: 'bar',
                                                        data: {
                                                            datasets: [{
                                                                label: '',
                                                                data: formattedData,
                                                                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                                                borderColor: 'rgba(54, 162, 235, 1)',
                                                                borderWidth: 1
                                                            }]
                                                        },
                                                        options: {
                                                            scales: {
                                                                x: {
                                                                    type: 'linear',
                                                                    position: 'bottom',
                                                                    ticks: {
                                                                        maxRotation: 0, // 设置为 0 表示水平显示
                                                                        minRotation: 0, // 防止旋转
                                                                        stepSize: 2 // 每隔 2 个显示一个标签
                                                                    }
                                                                },
                                                                y: {
                                                                    type: 'linear', // 修改为线性坐标系
                                                                    position: 'left',
                                                                    ticks: {
                                                                        callback: function (value) {
                                                                            if (Number.isInteger(value)) {
                                                                                return value;  // 只显示整数刻度
                                                                            }
                                                                            return null;  // 隐藏非整数刻度
                                                                        }
                                                                    },
                                                                    title: { display: true, text: 'Number (Log)' } // 修改标题文本
                                                                }
                                                            },
                                                            plugins: {
                                                                legend: {
                                                                    display: false  // 这会隐藏整个图例（包括任何标签）
                                                                },
                                                                tooltip: {
                                                                    callbacks: {
                                                                        label: function (context) {
                                                                            var label = context.dataset.label || '';
                                                                            if (label) {
                                                                                label += ': ';
                                                                            }
                                                                            if (context.parsed.y !== null) {
                                                                                label += context.raw.originalY;  // 显示原始值
                                                                            }
                                                                            return `Number: ${label}`;  // 使用反引号构建字符串
                                                                        }
                                                                    }
                                                                }
                                                            },
                                                            responsive: false,  // 防止图表响应容器尺寸变化
                                                        }
                                                    });
                                                    canvas.style.display = "none";    
                                                })
                                            })
                                        
                                    }
                                    else{
                                        const realId = item.id.replace(/Row/g, '');
                                        // console.log(realId);
                                        item.children[position+4+array[1]].textContent = graphData['bidirectedGraph'][realId] || '/';
                                    }
                                }
                            })
                        })
                        .catch(error => {
                            console.error("Error loading bidirectedGraph data:", error);
                        });
                        
                        
                }
                else{
                    const trs = tableBody.querySelectorAll('tr');
                    graphData = {
                        bidirectedGraph: {},
                        biedgedGraph: {},
                        dibigraph: {},
                        digraph: {},
                    };
                    fetch(`../../data/${ip}/${value}/biedgedGraph/basicStatistics.txt`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Failed to load the file: ${response.statusText}`);
                        }
                        return response.text(); // 解析为文本
                    })
                    .then(data => {
                         // 将文本数据按行分割
                         const lines = data.split('\n');
                        
                         // 逐行处理数据
                         lines.forEach(line => {
                            //  console.log(line);
                             const cleanedLine = line.replace(/^#/, '').trim(); // 去除注释
                             const [key, value] = cleanedLine.split(/\s+/).filter(Boolean);
                             if (key && value) {
                                 graphData['biedgedGraph'][key] = value; // 存储到 digraph
                             }
                         });
                        trs.forEach((item,index) =>{
                            if(item.id){
                                // Array.from(item.children).forEach(x => {
                                //     if (x.id.includes('raph')) {
                                //         x.style.display = "none";
                                //     }
                                //     else{
                                //         if(x.style.backgroundColor){
                                //             item.removeChild(x);
                                //         }
                                //     }
                                // });
                                if(item.id == 'DegreeDistributionRow'){
                                    appenddegree2('biedgedGraph',position+4+array[1]+array[2],`../../data/${ip}/${value}/biedgedGraph/degree.txt`);
                                }
                                else if(item.id == 'LoopLengthRow'){
                                    appendLoop(position+4+array[1]+array[2],`../../data/${ip}/${value}/biedgedGraph/loop.txt`);
                                }
                                else if ( item.id == 'CoverageRow') {
                                    item.children[position+4+array[1]+array[2]].textContent =  '/';
                                }
                                else if(item.id == 'NestedBubblesRow' || item.id == 'BubbleChainsRow'|| item.id == 'CycleDistributionRow'){
                                    item.children[position+4+array[1]+array[2]].textContent =  '/';
                                }
                                else{
                                    const realId = item.id.replace(/Row/g, '');
                                    item.children[position+4+array[1]+array[2]].textContent = graphData['biedgedGraph'][realId]|| '/';
                                }
                                
                            }
                        })
                    })
                    .catch(error => {
                        console.error("Error loading biedgedGraph data:", error);
                    });
                    
                }
            });
        }
    }
}






// =======================================================
//                       表格图像绘制
// =======================================================

// 绘制digraph的度数分布
function createDegreeChart(filePath1, filePath2, canvasId, td) {
    return Promise.all([fetch(filePath1), fetch(filePath2)])
        .then(responses => {
            if (!responses.every(response => response.ok)) {
                throw new Error("Failed to fetch files");
            }
            return Promise.all(responses.map(response => response.text()));
        })
        .then(data => {
            const data1 = data[0];
            const data2 = data[1];
            
            const graphData1 = parseData(data1);
            const graphData2 = parseData(data2);

            var canvas = document.createElement('canvas');
            canvas.id = canvasId;
            canvas.width = 200;
            canvas.height = 150;
            td.appendChild(canvas);

            var ctx = canvas.getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    datasets: [
                        {
                            label: 'In-degree',
                            data: graphData1,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Out-degree',
                            data: graphData2,
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        }
                    ]
                },
                options: getChartOptions()
            });
        })
        .catch(error => console.error(`Error loading data from ${filePath1}:`, error));
}

function parseData(data) {
    const graphData = [];
    const lines = data.split('\n');
    let totalSum = 0;

    lines.forEach(line => {
        const cleanedLine = line.replace(/^#/, '').trim();
        let [value1, value2] = cleanedLine.split(/\s+/).filter(Boolean);
        value1 = Number(value1);
        value2 = Number(value2);
        if (value1 && value2) {
            graphData.push([value1, value2]);
            totalSum += value2;
        }
    });

    return graphData.map(item => ({
        x: item[0],
        y: (item[1] / totalSum),
        originalValue: item[1]
    }));
}

function getChartOptions() {
    return {
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                ticks: {
                    maxRotation: 0,
                    minRotation: 0,
                    stepSize: 2
                },
                title: { display: true, text: 'Degree' }
            },
            y: {
                type: 'linear',
                min: 0,
                max: 1,
                title: { display: true, text: 'Proportion' }
            }
        },
        plugins: {
            legend: {
                display: true,
                labels: { boxWidth: 10, padding: 10 }
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
        responsive: false
    };
}

function appendLoop(index, filepath) {
    return fetch(filepath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            if (!data || data.trim() === "") {
                // 如果文件为空，在表格中显示 "不存在"
                const row = document.querySelector(`#LoopLengthRow`);
                const td = row.children[index];
                td.textContent = "N.A.";
                return;
            }

            const row = document.querySelector(`#LoopLengthRow`);
            const td = row.children[index];
            var canvas = document.createElement('canvas');
            canvas.id = index + 'loopCanvas';
            canvas.width = 200;  // Set the width of the canvas
            canvas.height = 150; // Set the height of the canvas
            td.appendChild(canvas);

            const graphdata = [];
            const lines = data.split('\n');
            lines.forEach(line => {
                const cleanedLine = line.replace(/^#/, '').trim();
                let [value1, value2] = cleanedLine.split(/\s+/).filter(Boolean);
                value1 = Number(value1);
                value2 = Number(value2);
                if (value1 && value2) {
                    graphdata.push({ x: value1, y: Math.log2(value2 + 1), originalY: value2 });
                }
            });

            const formattedData = graphdata.map(item => ({ x: item.x, y: item.y, originalY: item.originalY }));
            const xMax = Math.max(...formattedData.map(item => item.x));
            const stepSize = Math.ceil(xMax / 10);

            var ctx = document.getElementById(index + 'loopCanvas').getContext('2d');
            var loopCanvas = new Chart(ctx, {
                type: 'bar',
                data: {
                    datasets: [{
                        label: '',
                        data: formattedData,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        x: {
                            type: 'linear',
                            position: 'bottom',
                            ticks: {
                                maxRotation: 0, // 设置为 0 表示水平显示
                                minRotation: 0, // 防止旋转
                                stepSize: stepSize,
                                callback: function (value) {
                                    if (Number.isInteger(value)) {
                                        return value;  // 只显示整数刻度
                                    }
                                    return null;  // 隐藏非整数刻度
                                },
                            },
                            title: { display: true, text: 'Loop Length' }
                        },
                        y: {
                            type: 'linear',
                            position: 'left',
                            ticks: {
                                callback: function (value) {
                                    if (Number.isInteger(value)) {
                                        return value;  // 只显示整数刻度
                                    }
                                    return null;  // 隐藏非整数刻度
                                }
                            },
                            title: { display: true, text: 'Number (Log)' }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false  // 这会隐藏整个图例（包括任何标签）
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    var label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        label += context.raw.originalY;  // 显示原始值
                                    }
                                    return `Number: ${label}`;
                                }
                            }
                        }
                    },
                    responsive: false,  // 防止图表响应容器尺寸变化
                }
            });

            return formattedData;
        })
        .catch(error => console.error(`Error loading data from ${filepath}:`, error));
}

function loadloopdata(index, filepath) {
    return fetch(filepath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            if (!data || data.trim() === "") {
                // 如果文件为空，在表格中显示 "不存在"
                const row = document.querySelector(`#LoopLengthRow`);
                const td = row.children[index];
                td.textContent = "N.A.";
                return;
            }

            const row = document.querySelector(`#LoopLengthRow`);
            index = Number(index) + 1;
            let td = row.querySelector(`td:nth-child(${index})`);
            var canvas = document.createElement('canvas');
            canvas.id = index + 'loopCanvas';
            canvas.width = 200;  // Set the width of the canvas
            canvas.height = 150; // Set the height of the canvas
            td.appendChild(canvas);

            const graphdata = [];
            const lines = data.split('\n');
            lines.forEach(line => {
                const cleanedLine = line.replace(/^#/, '').trim();
                let [value1, value2] = cleanedLine.split(/\s+/).filter(Boolean);
                value1 = Number(value1);
                value2 = Number(value2);
                if (value1 && value2) {
                    graphdata.push({ x: value1, y: Math.log2(value2 + 1), originalY: value2 });
                }
            });

            const formattedData = graphdata.map(item => ({ x: item.x, y: item.y, originalY: item.originalY }));
            const xMax = Math.max(...formattedData.map(item => item.x));
            const stepSize = Math.ceil(xMax / 10);

            var ctx = document.getElementById(index + 'loopCanvas').getContext('2d');
            var loopCanvas = new Chart(ctx, {
                type: 'bar',
                data: {
                    datasets: [{
                        label: '',
                        data: formattedData,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        x: {
                            type: 'linear',
                            position: 'bottom',
                            ticks: {
                                maxRotation: 0, // 设置为 0 表示水平显示
                                minRotation: 0, // 防止旋转
                                stepSize: stepSize,
                                callback: function (value) {
                                    if (Number.isInteger(value)) {
                                        return value;  // 只显示整数刻度
                                    }
                                    return null;  // 隐藏非整数刻度
                                },
                            },
                            title: { display: true, text: 'Loop Length' }
                        },
                        y: {
                            type: 'linear',
                            position: 'left',
                            ticks: {
                                callback: function (value) {
                                    if (Number.isInteger(value)) {
                                        return value;  // 只显示整数刻度
                                    }
                                    return null;  // 隐藏非整数刻度
                                }
                            },
                            title: { display: true, text: 'Number (Log)' }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false  // 这会隐藏整个图例（包括任何标签）
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    var label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        label += context.raw.originalY;  // 显示原始值
                                    }
                                    return `Number: ${label}`;
                                }
                            }
                        }
                    },
                    responsive: false,  // 防止图表响应容器尺寸变化
                }
            });

            return formattedData;
        })
        .catch(error => console.error(`Error loading data from ${filepath}:`, error));
}

function appendcycle(index, filepath) {
    return fetch(filepath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            if (!data || data.trim() === "") {
                // 如果文件为空，在表格中显示 "不存在"
                const row = document.querySelector(`#CycleDistributionRow`);
                const td = row.children[index];
                td.textContent = "N.A.";
                return;
            }

            const row = document.querySelector(`#CycleDistributionRow`);
            const td = row.children[index];
            var canvas = document.createElement('canvas');
            canvas.id = index + 'cycleCanvas';
            canvas.width = 200;  // Set the width of the canvas
            canvas.height = 150; // Set the height of the canvas
            td.appendChild(canvas);

            const graphdata = [];
            const lines = data.split('\n');
            lines.forEach(line => {
                const cleanedLine = line.replace(/^#/, '').trim();
                let [value1, value2] = cleanedLine.split(/\s+/).filter(Boolean);
                value1 = Number(value1);
                value2 = Number(value2);
                if (value1 && value2) {
                    graphdata.push({ x: value1, y: Math.log2(value2 + 1), originalY: value2 });
                }
            });

            const formattedData = graphdata.map(item => ({ x: item.x, y: item.y, originalY: item.originalY }));
            const xMax = Math.max(...formattedData.map(item => item.x));
            const stepSize = Math.ceil(xMax / 10);

            var ctx = document.getElementById(index + 'cycleCanvas').getContext('2d');
            var cycleCanvas = new Chart(ctx, {
                type: 'bar',
                data: {
                    datasets: [{
                        label: '',
                        data: formattedData,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        x: {
                            type: 'linear',
                            position: 'bottom',
                            ticks: {
                                maxRotation: 0, // 设置为 0 表示水平显示
                                minRotation: 0, // 防止旋转
                                stepSize: stepSize,
                                callback: function (value) {
                                    if (Number.isInteger(value)) {
                                        return value;  // 只显示整数刻度
                                    }
                                    return null;  // 隐藏非整数刻度
                                },
                            },
                            title: { display: true, text: 'Cycle Length' }
                        },
                        y: {
                            type: 'linear',
                            position: 'left',
                            ticks: {
                                callback: function (value) {
                                    if (Number.isInteger(value)) {
                                        return value;  // 只显示整数刻度
                                    }
                                    return null;  // 隐藏非整数刻度
                                }
                            },
                            title: { display: true, text: 'Number (Log)' }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false  // 这会隐藏整个图例（包括任何标签）
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    var label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        label += context.raw.originalY;  // 显示原始值
                                    }
                                    return `Number: ${label}`;
                                }
                            }
                        }
                    },
                    responsive: false,  // 防止图表响应容器尺寸变化
                }
            });

            return formattedData;
        })
        .catch(error => console.error(`Error loading data from ${filepath}:`, error));
}

function loadcycledata(index, filepath) {
    return fetch(filepath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            if (!data || data.trim() === "") {
                // 如果文件为空，在表格中显示 "不存在"
                const row = document.querySelector(`#CycleDistributionRow`);
                const td = row.children[index];
                td.textContent = "N.A.";
                return;
            }

            const row = document.querySelector(`#CycleDistributionRow`);
            index = Number(index) + 1;
            let td = row.querySelector(`td:nth-child(${index})`);
            var canvas = document.createElement('canvas');
            canvas.id = index + 'cycleCanvas';
            canvas.width = 200;  // Set the width of the canvas
            canvas.height = 150; // Set the height of the canvas
            td.appendChild(canvas);

            const graphdata = [];
            const lines = data.split('\n');
            lines.forEach(line => {
                const cleanedLine = line.replace(/^#/, '').trim();
                let [value1, value2] = cleanedLine.split(/\s+/).filter(Boolean);
                value1 = Number(value1);
                value2 = Number(value2);
                if (value1 && value2) {
                    graphdata.push({ x: value1, y: Math.log2(value2 + 1), originalY: value2 });
                }
            });

            const formattedData = graphdata.map(item => ({ x: item.x, y: item.y, originalY: item.originalY }));
            const xMax = Math.max(...formattedData.map(item => item.x));
            const stepSize = Math.ceil(xMax / 10);

            var ctx = document.getElementById(index + 'cycleCanvas').getContext('2d');
            var cycleCanvas = new Chart(ctx, {
                type: 'bar',
                data: {
                    datasets: [{
                        label: '',
                        data: formattedData,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        x: {
                            type: 'linear',
                            position: 'bottom',
                            ticks: {
                                maxRotation: 0, // 设置为 0 表示水平显示
                                minRotation: 0, // 防止旋转
                                stepSize: stepSize,
                                callback: function (value) {
                                    if (Number.isInteger(value)) {
                                        return value;  // 只显示整数刻度
                                    }
                                    return null;  // 隐藏非整数刻度
                                },
                            },
                            title: { display: true, text: 'Cycle Length' }
                        },
                        y: {
                            type: 'linear',
                            position: 'left',
                            ticks: {
                                callback: function (value) {
                                    if (Number.isInteger(value)) {
                                        return value;  // 只显示整数刻度
                                    }
                                    return null;  // 隐藏非整数刻度
                                }
                            },
                            title: { display: true, text: 'Number (Log)' }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false  // 这会隐藏整个图例（包括任何标签）
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    var label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        label += context.raw.originalY;  // 显示原始值
                                    }
                                    return `Number: ${label}`;
                                }
                            }
                        }
                    },
                    responsive: false,  // 防止图表响应容器尺寸变化
                }
            });

            return formattedData;
        })
        .catch(error => console.error(`Error loading data from ${filepath}:`, error));
}

function appendBubbleChainsdata(index, filepath) {
    return fetch(filepath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            if (!data || data.trim() === "") {
                // 如果文件为空，在表格中显示 "不存在"
                const row = document.querySelector(`#BubbleChainsRow`);
                const td = row.children[index];
                td.textContent = "N.A.";
                return;
            }

            const row = document.querySelector(`#BubbleChainsRow`);
            const td = row.children[index];
            var canvas = document.createElement('canvas');
            canvas.id = index + 'BubbleChainsCanvas';
            canvas.width = 200;  // Set the width of the canvas
            canvas.height = 150; // Set the height of the canvas
            td.appendChild(canvas);

            const graphdata = [];
            const lines = data.split('\n');
            lines.forEach(line => {
                const cleanedLine = line.replace(/^#/, '').trim();
                let [value1, value2] = cleanedLine.split(/\s+/).filter(Boolean);
                value1 = Number(value1);
                value2 = Number(value2);
                if (value1 && value2) {
                    graphdata.push({ label: value1.toString(), value: value2 });
                }
            });

            // 按标签（label）从小到大排序数据
            graphdata.sort((a, b) => a.label - b.label);

            const labels = graphdata.map(item => item.label);
            const values = graphdata.map(item => item.value);

            // 生成颜色函数
            function getRandomColor() {
                const letters = '0123456789ABCDEF';
                let color = '#';
                for (let i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 16)];
                }
                return color;
            }

            // 生成颜色数组
            const backgroundColors = values.map(() => getRandomColor());
            const borderColors = backgroundColors.map(color => color.replace('0.2', '1'));

            var ctx = document.getElementById(index + 'BubbleChainsCanvas').getContext('2d');
            var BubbleChainsCanvas = new Chart(ctx, {
                type: 'doughnut', // 更改图表类型为环形图
                data: {
                    labels: labels,
                    datasets: [{
                        label: '',
                        data: values,
                        backgroundColor: backgroundColors,
                        borderColor: borderColors,
                        borderWidth: 1
                    }]
                },
                options: {
                    plugins: {
                        legend: {
                            display: false,  // 显示图例
                            labels: {
                                generateLabels: function(chart) {
                                    const data = chart.data;
                                    // 按标签（label）从小到大排序图例
                                    return data.labels.map((label, i) => {
                                        const dataset = data.datasets[0];
                                        return {
                                            text: `${label}: ${dataset.data[i]}`,
                                            fillStyle: dataset.backgroundColor[i],
                                            strokeStyle: dataset.borderColor[i],
                                            lineWidth: dataset.borderWidth,
                                            hidden: false,
                                            index: i
                                        };
                                    }).sort((a, b) => a.text.split(': ')[0] - b.text.split(': ')[0]); // 按标签排序图例
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const dataPoint = context.raw;
                                    return `Number: ${dataPoint}`;
                                }
                            }
                        }
                    },
                    responsive: false,  // 防止图表响应容器尺寸变化
                }
            });

            return values;
        })
        .catch(error => console.error(`Error loading data from ${filepath}:`, error));
}

function loadBubbleChainsdata(index, filepath) {
    return fetch(filepath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            if (!data || data.trim() === "") {
                // 如果文件为空，在表格中显示 "不存在"
                const row = document.querySelector(`#BubbleChainsRow`);
                const td = row.children[index];
                td.textContent = "N.A.";
                return;
            }

            const row = document.querySelector(`#BubbleChainsRow`);
            index = Number(index) + 1;
            let td = row.querySelector(`td:nth-child(${index})`);
            var canvas = document.createElement('canvas');
            canvas.id = index + 'BubbleChainsCanvas';
            canvas.width = 200;  // Set the width of the canvas
            canvas.height = 150; // Set the height of the canvas
            td.appendChild(canvas);

            const graphdata = [];
            const lines = data.split('\n');
            lines.forEach(line => {
                const cleanedLine = line.replace(/^#/, '').trim();
                let [value1, value2] = cleanedLine.split(/\s+/).filter(Boolean);
                value1 = Number(value1);
                value2 = Number(value2);
                if (value1 && value2) {
                    graphdata.push({ label: value1.toString(), value: value2 });
                }
            });

            // 按数值从小到大排序数据
            graphdata.sort((a, b) => a.label - b.label);

            const labels = graphdata.map(item => item.label);
            const values = graphdata.map(item => item.value);

            // 生成颜色函数
            function getRandomColor() {
                const letters = '0123456789ABCDEF';
                let color = '#';
                for (let i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 16)];
                }
                return color;
            }

            // 生成颜色数组
            const backgroundColors = values.map(() => getRandomColor());
            const borderColors = backgroundColors.map(color => color.replace('0.2', '1'));

            var ctx = document.getElementById(index + 'BubbleChainsCanvas').getContext('2d');
            var BubbleChainsCanvas = new Chart(ctx, {
                type: 'doughnut', // 更改图表类型为环形图
                data: {
                    labels: labels,
                    datasets: [{
                        label: '',
                        data: values,
                        backgroundColor: backgroundColors,
                        borderColor: borderColors,
                        borderWidth: 1
                    }]
                },
                options: {
                    plugins: {
                        legend: {
                            display: false,  // 显示图例
                            labels: {
                                generateLabels: function(chart) {
                                    const data = chart.data;
                                    return data.labels.map((label, i) => {
                                        const dataset = data.datasets[0];
                                        return {
                                            text: `${label}`,
                                            fillStyle: dataset.backgroundColor[i],
                                            strokeStyle: dataset.borderColor[i],
                                            lineWidth: dataset.borderWidth,
                                            hidden: false,
                                            index: i
                                        };
                                    }).sort((a, b) => a.text.split(': ')[1] - b.text.split(': ')[1]); // 按数值排序图例
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const dataPoint = context.raw;
                                    return `Number: ${dataPoint}`;
                                }
                            }
                        }
                    },
                    responsive: false,  // 防止图表响应容器尺寸变化
                }
            });

            return values;
        })
        .catch(error => console.error(`Error loading data from ${filepath}:`, error));
}

function appendNestedBubblesdata(index, filepath) {
    return fetch(filepath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            if (!data || data.trim() === "") {
                // 如果文件为空，在表格中显示 "不存在"
                const row = document.querySelector(`#NestedBubblesRow`);
                const td = row.children[index];
                td.textContent = "N.A.";
                return;
            }

            const row = document.querySelector(`#NestedBubblesRow`);
            const td = row.children[index];
            var canvas = document.createElement('canvas');
            canvas.id = index + 'NestedCanvas';
            canvas.width = 200;  // Set the width of the canvas
            canvas.height = 150; // Set the height of the canvas
            // canvas.style.backgroundColor = 'rgb(255, 255, 255)';
            td.appendChild(canvas);

            const graphdata = [];
            const lines = data.split('\n');
            lines.forEach(line => {
                const cleanedLine = line.replace(/^#/, '').trim();
                let [value1, value2] = cleanedLine.split(/\s+/).filter(Boolean);
                value1 = Number(value1);
                value2 = Number(value2);
                if (value1 && value2) {
                    graphdata.push({ x: value1, y: Math.log2(value2 + 1), originalY: value2 });
                }
            });

            const formattedData = graphdata.map(item => ({ x: item.x, y: item.y, originalY: item.originalY }));
            const xMax = Math.max(...formattedData.map(item => item.x));
            const stepSize = Math.ceil(xMax / 10);

            var ctx = document.getElementById(index + 'NestedCanvas').getContext('2d');
            var NestedCanvas = new Chart(ctx, {
                type: 'bar',
                data: {
                    datasets: [{
                        label: '',
                        data: formattedData,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        x: {
                            type: 'linear',
                            position: 'bottom',
                            ticks: {
                                maxRotation: 0, // 设置为 0 表示水平显示
                                minRotation: 0, // 防止旋转
                                stepSize: stepSize,
                                callback: function (value) {
                                    if (Number.isInteger(value)) {
                                        return value;  // 只显示整数刻度
                                    }
                                    return null;  // 隐藏非整数刻度
                                },
                            },
                            title: { display: true, text: 'Bubble Nesting Depth' }
                        },
                        y: {
                            type: 'logarithmic',
                            position: 'left',
                            ticks: {
                                callback: function (value) {
                                    if (Number.isInteger(value)) {
                                        return value;  // 只显示整数刻度
                                    }
                                    return null;  // 隐藏非整数刻度
                                }
                            },
                            title: { display: true, text: 'Number (Log)' }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false  // 这会隐藏整个图例（包括任何标签）
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    var label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        label += context.raw.originalY;  // 显示原始值
                                    }
                                    return `Number: ${label}`;
                                }
                            }
                        }
                    },
                    responsive: false,  // 防止图表响应容器尺寸变化
                }
            });

            return formattedData;
        })
        .catch(error => console.error(`Error loading data from ${filepath}:`, error));
}

function loadNestedBubblesdata(index, filepath) {
    return fetch(filepath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            if (!data || data.trim() === "") {
                // 如果文件为空，在表格中显示 "不存在"
                const row = document.querySelector(`#NestedBubblesRow`);
                const td = row.children[index];
                td.textContent = "N.A.";
                return;
            }

            const row = document.querySelector(`#NestedBubblesRow`);
            index = Number(index) + 1;
            let td = row.querySelector(`td:nth-child(${index})`);
            var canvas = document.createElement('canvas');
            canvas.id = index + 'NestedCanvas';
            canvas.width = 200;  // Set the width of the canvas
            canvas.height = 150; // Set the height of the canvas
            // canvas.style.backgroundColor = 'rgb(255, 255, 255)';
            td.appendChild(canvas);

            const graphdata = [];
            const lines = data.split('\n');
            lines.forEach(line => {
                const cleanedLine = line.replace(/^#/, '').trim();
                let [value1, value2] = cleanedLine.split(/\s+/).filter(Boolean);
                value1 = Number(value1);
                value2 = Number(value2);
                if (value1 && value2) {
                    graphdata.push({ x: value1, y: Math.log2(value2 + 1), originalY: value2 });
                }
            });

            const formattedData = graphdata.map(item => ({ x: item.x, y: item.y, originalY: item.originalY }));
            const xMax = Math.max(...formattedData.map(item => item.x));
            const stepSize = Math.ceil(xMax / 10);

            var ctx = document.getElementById(index + 'NestedCanvas').getContext('2d');
            var NestedCanvas = new Chart(ctx, {
                type: 'bar',
                data: {
                    datasets: [{
                        label: '',
                        data: formattedData,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        x: {
                            type: 'linear',
                            position: 'bottom',
                            ticks: {
                                maxRotation: 0, // 设置为 0 表示水平显示
                                minRotation: 0, // 防止旋转
                                stepSize: stepSize,
                                callback: function (value) {
                                    if (Number.isInteger(value)) {
                                        return value;  // 只显示整数刻度
                                    }
                                    return null;  // 隐藏非整数刻度
                                },
                            },
                            title: { display: true, text: 'Bubble Nesting Depth' }
                        },
                        y: {
                            type: 'logarithmic',
                            position: 'left',
                            ticks: {
                                callback: function (value) {
                                    if (Number.isInteger(value)) {
                                        return value;  // 只显示整数刻度
                                    }
                                    return null;  // 隐藏非整数刻度
                                }
                            },
                            title: { display: true, text: 'Number (Log)' }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false  // 这会隐藏整个图例（包括任何标签）
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    var label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        label += context.raw.originalY;  // 显示原始值
                                    }
                                    return `Number: ${label}`;
                                }
                            }
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
    loadcycledata(1,`../../data/${ip}/${flag}/digraph/cycle.txt`);
}

function NestedBubblesFunction(){
    loadNestedBubblesdata(2,`../../data/${ip}/${flag}/bidirectedGraph/nestedBubblesLevel.txt`);
}

function BubbleChainsFunction(){
    loadBubbleChainsdata(2,`../../data/${ip}/${flag}/bidirectedGraph/bubbleChainLength.txt`);
}
function loopFunction(){
    pathsum = [
    `../../data/${ip}/${flag}/digraph/loop.txt`,
    `../../data/${ip}/${flag}/bidirectedGraph/loop.txt`,
    `../../data/${ip}/${flag}/biedgedGraph/loop.txt`,
    ]
    pathsum.forEach((filepath,index)=>{
        loadloopdata(index+1,filepath);
    })
}




// =======================================================
//                    单GFA文件表格图像绘制
// =======================================================

function GetAllCoverage() {
    const CoveragePath = [`../../data/${ip}/${flag}/digraph/coverage.txt`, `../../data/${ip}/${flag}/bidirectedGraph/coverage.txt`];
    const TypeList = ['bp', 'Node', 'Edge'];

    CoveragePath.forEach((path, index) => {
        fetch(path)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                if (!data || data.trim() === "") {
                    // 如果文件为空，在表格中显示 "不存在"
                    const row = document.querySelector(`#CoverageRow`);
                    let td = (index === 0) ? row.querySelector('td:nth-child(2)') : row.querySelector('td:nth-child(3)');
                    td.textContent = "N.A.";
                    return;
                }

                const row = document.querySelector(`#CoverageRow`);
                let td = (index === 0) ? row.querySelector('td:nth-child(2)') : row.querySelector('td:nth-child(3)');
                const div = document.createElement('div');
                div.style.display = "margin-top: 10px";
                div.style.flexDirection = 'column';
                td.appendChild(div);

                const bpdata = [];
                const nodedata = [];
                const edgedata = [];
                const lines = data.split('\n');
                lines.forEach(line => {
                    if (line.includes('Count')) {
                        return;
                    }
                    let parts = line.trim().split(/\s+/); // 使用正则表达式来拆分每行的数字
                    let Count = parseInt(parts[0], 10);
                    let bp = Math.log2(Number(parts[1]) + 1);
                    let Node = Math.log2(Number(parts[2]) + 1);
                    let Edge = Math.log2(Number(parts[3]) + 1);
                    bpdata.push({ x: Count, y: bp, originalY: Number(parts[1]) });
                    nodedata.push({ x: Count, y: Node, originalY: Number(parts[2]) });
                    edgedata.push({ x: Count, y: Edge, originalY: Number(parts[3]) });
                });

                TypeList.forEach(type => {
                    let formattedData;
                    if (type === 'bp') {
                        formattedData = bpdata;
                    } else if (type === 'Node') {
                        formattedData = nodedata;
                    } else if (type === 'Edge') {
                        formattedData = edgedata;
                    }

                    var canvas = document.createElement('canvas');
                    canvas.id = 'coverageCanvas' + index + type;
                    canvas.width = 200;  // Set the width of the canvas
                    canvas.height = 150; // Set the height of the canvas
                    div.appendChild(canvas);

                    var ctx = document.getElementById('coverageCanvas' + index + type).getContext('2d');
                    var coverageCanvas = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            datasets: [{
                                label: '',
                                data: formattedData,
                                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                borderColor: 'rgba(54, 162, 235, 1)',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                x: {
                                    type: 'linear',
                                    position: 'bottom',
                                    ticks: {
                                        maxRotation: 0, // 设置为 0 表示水平显示
                                        minRotation: 0, // 防止旋转
                                        stepSize: 2 // 每隔 2 个显示一个标签
                                    }
                                },
                                y: {
                                    type: 'linear', // 修改为线性坐标系
                                    position: 'left',
                                    ticks: {
                                        callback: function (value) {
                                            if (Number.isInteger(value)) {
                                                return value;  // 只显示整数刻度
                                            }
                                            return null;  // 隐藏非整数刻度
                                        }
                                    },
                                    title: { display: true, text: 'Number (Log)' } // 修改标题文本
                                }
                            },
                            plugins: {
                                legend: {
                                    display: false  // 这会隐藏整个图例（包括任何标签）
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function (context) {
                                            var label = context.dataset.label || '';
                                            if (label) {
                                                label += ': ';
                                            }
                                            if (context.parsed.y !== null) {
                                                label += context.raw.originalY;  // 显示原始值
                                            }
                                            return `Number: ${label}`;  // 使用反引号构建字符串
                                        }
                                    }
                                }
                            },
                            responsive: false,  // 防止图表响应容器尺寸变化
                        }
                    });

                    canvas.style.display = "none";
                });
            })
            .catch(error => console.error(`Error loading data from ${path}:`, error));
    });
}

function showcoverageGraph(graph,type){
            const row = document.querySelector(`#CoverageRow`);
            let td;
            let index;
            if (graph === 'digraph')
            {
                td = row.querySelector('td:nth-child(2)');
                index = 0;
            }
            else if(graph === 'bidirectedGraph'){
                td = row.querySelector('td:nth-child(3)');
                index = 1;
            }
            var x =td.querySelectorAll('canvas');
            x.forEach(y=>{
                y.style.display = 'none';
                if(y.id == 'coverageCanvas'+index+type){
                    y.style.display = '';
                    coverageflag = 1;
                }
            })
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
                // console.log(line);
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
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            var firstdegreeCanvas = new Chart(ctx, {
                type: 'bar',
                data: {
                    datasets: [{
                        label: '',
                        data: formattedData,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        x: {
                            type: 'linear',
                            position: 'bottom',
                            ticks: {
                                maxRotation: 0,
                                minRotation: 0,
                                stepSize: 1
                            },
                            title: {
                                display: true,
                                text: 'Degree'
                            },
                        },
                        y: {
                            type: 'linear',
                            min: 0,
                            max: 1,
                            title: {
                                display: true,
                                text: 'Proportion'
                            }
                        },
                    },
                    // elements: {
                    //     rectangle: {
                    //         backgroundColor: 'white'  // 设置柱状图背景区域的颜色
                    //     }
                    // },
                    plugins: {
                        legend: {
                            display: false // 隐藏图例
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
                    responsive: false // 禁用响应式
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

function loaddegree4GraphData(filePath1, filePath2) {
    const row = document.querySelector(`#DegreeDistributionRow`);
    const td = row.querySelector('td:nth-child(2)');
    return createDegreeChart(filePath1, filePath2, 'degreeCanvas', td);
}

function DegreeFunction(){
    loaddegree1GraphData(`../../data/${ip}/${flag}/bidirectedGraph/degree.txt`);
    loaddegree2GraphData(`../../data/${ip}/${flag}/biedgedGraph/degree.txt`);
    loaddegree4GraphData(`../../data/${ip}/${flag}/digraph/inDegree.txt`,`../../data/${ip}/${flag}/digraph/outDegree.txt`);
}

// =======================================================
//                    组合文件表格图像绘制
// =======================================================


function appendcoverageGraph(index,type){
    const row = document.querySelector(`#CoverageRow`);
    const td = row.children[index];
    var canvases = td.querySelectorAll('canvas');
    canvases.forEach(canvas=>{
        canvas.style.display='none';
        if(canvas.id == 'coverageCanvas' + index + type){
            canvas.style.display = "";
        }
    })
}

function appenddegree(index, filePath1, filePath2) {
    const row = document.querySelector(`#DegreeDistributionRow`);
    const td = row.children[index + 4];
    return createDegreeChart(filePath1, filePath2, `${index}degreeCanvas`, td);
}

function appenddegree2(type,index,filePath){
    return fetch(filePath)
    .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const row = document.querySelector(`#DegreeDistributionRow`);
            const td = row.children[index];
            var canvas = document.createElement('canvas');
            canvas.id = type+index+'seconddegreeCanvas';
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

            var ctx = document.getElementById(type+index+'seconddegreeCanvas').getContext('2d');  
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

