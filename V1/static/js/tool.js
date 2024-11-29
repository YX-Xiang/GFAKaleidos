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

function runcommand(filePath){
    axios.get('/api/gfaKaleidos', {
    params: {
        uploadPath: filePath  // 将文件路径作为查询参数传递
    }
})
.then(function (response) {
    // 成功回调
    const FileName = filePath.split('/')[1].split('.')[0];
    console.log('命令执行输出:', response.data);
})
.catch(function (error) {
    // 错误回调
    const FileName = filePath.split('/')[1].split('.')[0];
    console.error('命令执行失败:', error);
});
}



// =======================================================
//                        文件上传
// =======================================================

// 上传文件
function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0]; // 获取选中的文件

    if (!file) {
        alert("Error: Please select a valid example file path!");
        return;
    }
    var selDom = $("#menu-list a[FileName='" + file.name.split('.')[0] + "']");//menu-list是标签栏
    if (selDom.length === 0) { // 如果标签页不存在，则创建新的标签
        // 创建 FormData 对象并将文件添加进去
        const formData = new FormData();
        formData.append('file', file);

        // 更新文件名显示
        document.getElementById("fileName").textContent = file.name;
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
            alert('The file upload was successful!');
            const filePath = response.data.filePath;
            fileUploaded = true;
            runcommand(filePath);
            const FileName = filePath.split('/')[1].split('.').slice(0, -1).join('.');
            openTab(FileName);
            flag = FileName;
            addCheckbox(FileName);
        })
        .catch(function (error) {
            // 错误回调
            console.error('The file upload failed: ', error);
            alert('Error: The file upload failed.');

            // 上传失败时恢复 Logo 显示，隐藏表格
            logoPlaceholder.style.display = 'flex'; // 恢复占位元素显示
        });
    }
    else{
        flag = file.name;
        openTab(file.name.split('.')[0]);
    }

}

// 上传样例文件
function uploadExampleFile(filePath) {
    // 文件未上传时弹出提示
    if (!filePath) {
        alert("Error: Please select a valid example file path!");
        return;
    }
    
    var selDom = $("#menu-list a[FileName='" + filePath.split('/')[1].split('.')[0] + "']");//menu-list是标签栏

    // 隐藏 Logo 并显示加载状态（可选）
    const logoPlaceholder = document.getElementById('logo-placeholder');
    logoPlaceholder.style.display = 'none';

    if (selDom.length === 0) { // 如果标签页不存在，则创建新的标签
        alert('The file upload was successful!');
        fileUploaded = true;
        runcommand(filePath);
        const FileName = filePath.split('/')[1].split('.')[0];
        flag = FileName;
        openTab(FileName);
        addCheckbox(FileName);
    }
    else{
        flag = filePath.split('/')[1].split('.')[0];
        openTab(flag);
    }
   
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

// 复选框全选按钮
function selectAllCheckboxes() {
    // 检查是否已上传文件
    if (!isFileUploaded()) {
        alert("Error: Please upload the file first!");
        return; // 文件未上传时，停止执行后续操作
    }

    const allMenus = document.querySelectorAll('ul[id^="menu"]');  // 获取所有菜单（每个菜单的ID以 "menu" 开头）
    
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
        var iel = $("<i>", { // i是关闭的标签
            "class": "menu-close"
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
        bidirectedGraph: [`../../data/${flag}/bidirectedGraph/basicStatistics.txt`],
        biedgedGraph: [`../../data/${flag}/biedgedGraph/basicStatistics.txt`],
        digraph:[`../../data/${flag}/digraph/basicStatistics.txt`]
    };
    loadAllData();
    loadGFAData(`../../data/${flag}/gfa/basicStatistics.txt`);
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
}

// 当页面加载完成后，隐藏页面上的一些特定表格行
window.onload = function() {
    document.getElementById('file_sizeRow').style.display = 'none';
    document.getElementById('segmentsRow').style.display = 'none';
    document.getElementById('linksRow').style.display = 'none';
    document.getElementById('pathsRow').style.display = 'none';
    document.getElementById('single_direction_segmentRow').style.display = 'none';
    document.getElementById('bidirectional_direction_segmentRow').style.display = 'none';
};







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
                const newtd = document.createElement('td');
                newtd.textContent = value;
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
                    loadGFAData(`../../data/${value}/gfa/basicStatistics.txt`)
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
                    fetch(`../../data/${value}/digraph/basicStatistics.txt`)
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
                                        appenddegree(position,`../../data/${value}/digraph/inDegree.txt`, `../../data/${value}/data/digraph/outDegree.txt`);
                                    } else if (item.id == 'LoopLengthRow') {
                                        appendLoop(position+4,`../../data/${value}/digraph/loop.txt`);
                                    } else if (item.id == 'CycleDistributionRow') {
                                        appendcycle(position+4,`../../data/${value}/digraph/cycle.txt`);
                                    } else if (item.id == 'NestedBubblesRow' || item.id == 'BubbleChainsRow') {
                                        item.children[position+4].textContent="/";
                                    } else if( item.id == 'CoverageRow'){
                                        const td = item.children[position+4];
                                        const button1 =document.createElement('button');
                                        button1.textContent = 'bp';
                                        button1.onclick = function(){
                                            appendcoverageGraph(position+4,`../../data/${value}/digraph/coverage.txt`,'bp');
                                        }
                                        const button2 =document.createElement('button');
                                        button2.textContent = 'Node';
                                        button2.onclick = function(){
                                            appendcoverageGraph(position+4,`../../data/${value}/digraph/coverage.txt`,'Node');
                                        }
                                        const button3=document.createElement('button');
                                        button3.textContent = 'Edge';
                                        button3.onclick = function(){
                                            appendcoverageGraph(position+4,`../../data/${value}/digraph/coverage.txt`,'Edge')
                                        }
                                        td.appendChild(button1);
                                        td.appendChild(button2);
                                        td.appendChild(button3);
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
                    fetch(`../../data/${value}/bidirectedGraph/basicStatistics.txt`)
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
                                        appenddegree2('bidirectedGraph',position+4+array[1],`../../data/${value}/bidirectedGraph/degree.txt`);
                                    }
                                    else if(item.id == 'LoopLengthRow'){
                                        appendLoop(position+4+array[1],`../../data/${value}/bidirectedGraph/loop.txt`);
                                    }
                                    else if(item.id == 'CycleDistributionRow'){
                                        appendcycle(position+4+array[1],`../../data/${value}/bidirectedGraph/cycle.txt`);
                                    }
                                    else if(item.id == 'NestedBubblesRow'){
                                        appendNestedBubblesdata(position+4+array[1],`../../data/${value}/bidirectedGraph/nestedBubblesLevel.txt`);
                                    }
                                    else if(item.id == 'BubbleChainsRow'){
                                        appendBubbleChainsdata(position+4+array[1],`../../data/${value}/bidirectedGraph/bubbleChainLength.txt`);
                                    }
                                    else if(item.id == 'CoverageRow'){

                                        const td = item.children[position+4+array[1]];
                                        const button1 =document.createElement('button');
                                        button1.textContent = 'bp';
                                        button1.onclick = function(){
                                            appendcoverageGraph(position+4+array[1],`../../data/${value}/bidirectedGraph/coverage.txt`,'bp');
                                        }
                                        const button2 =document.createElement('button');
                                        button2.textContent = 'Node';
                                        button2.onclick = function(){
                                            appendcoverageGraph(position+4+array[1],`../../data/${value}/bidirectedGraph/coverage.txt`,'Node');
                                        }
                                        const button3=document.createElement('button');
                                        button3.textContent = 'Edge';
                                        button3.onclick = function(){
                                            appendcoverageGraph(position+4+array[1],`../../data/${value}/bidirectedGraph/coverage.txt`,'Edge');
                                        }
                                        td.appendChild(button1);
                                        td.appendChild(button2);
                                        td.appendChild(button3);
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
                    fetch(`../../data/${value}/biedgedGraph/basicStatistics.txt`)
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
                                    appenddegree2('biedgedGraph',position+4+array[1]+array[2],`../../data/${value}/biedgedGraph/degree.txt`);
                                }
                                else if(item.id == 'LoopLengthRow'){
                                    appendLoop(position+4+array[1]+array[2],`../../data/${value}/biedgedGraph/loop.txt`);
                                }
                                else if(item.id == 'CycleDistributionRow'){
                                    appendcycle(position+4+array[1]+array[2],`../../data/${value}/biedgedGraph/cycle.txt`);
                                }
                                else if ( item.id == 'CoverageRow') {
                                    item.children[position+4+array[1]+array[2]].textContent =  '/';
                                }
                                else if(item.id == 'NestedBubblesRow' || item.id == 'BubbleChainsRow'){
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

function appendLoop(index,filepath){
    return fetch(filepath)
    .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const row = document.querySelector(`#LoopLengthRow`);
            const td = row.children[index];
            var canvas = document.createElement('canvas');
            canvas.id = index+'loopCanvas';
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
            var ctx = document.getElementById(index+'loopCanvas').getContext('2d');  
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

function appendcycle(index,filepath){
    return fetch(filepath)
    .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            // console.log(data);
            const row = document.querySelector(`#CycleDistributionRow`);
            const td = row.children[index];
            var canvas = document.createElement('canvas');
            canvas.id = index+'cycleCanvas';
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
            var ctx = document.getElementById(index+'cycleCanvas').getContext('2d');  
            var cycleCanvas = new Chart(ctx, {
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
            // console.log(data);
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
            var cycleCanvas = new Chart(ctx, {
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

function appendBubbleChainsdata(index,filepath){
    return fetch(filepath)
    .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const row = document.querySelector(`#BubbleChainsRow`);
            const td = row.children[index];
            var canvas = document.createElement('canvas');
            canvas.id =index+'BubbleChainsCanvas';
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
            var ctx = document.getElementById(index+'BubbleChainsCanvas').getContext('2d');  
            var BubbleChainsCanvas = new Chart(ctx, {
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
            var BubbleChainsCanvas = new Chart(ctx, {
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

function appendNestedBubblesdata(index,filepath){
    return fetch(filepath)
    .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const row = document.querySelector(`#NestedBubblesRow`);
            const td = row.children[index];
            var canvas = document.createElement('canvas');
            canvas.id = index+'NestedCanvas';
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
            var ctx = document.getElementById(index+'NestedCanvas').getContext('2d');  
            var NestedCanvas = new Chart(ctx, {
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
            var NestedCanvas = new Chart(ctx, {
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
    loadcycledata(1,`../../data/${flag}/digraph/cycle.txt`);
}

function NestedBubblesFunction(){
    loadNestedBubblesdata(2,`../../data/${flag}/bidirectedGraph/nestedBubblesLevel.txt`);
}

function BubbleChainsFunction(){
    loadBubbleChainsdata(2,`../../data/${flag}/bidirectedGraph/bubbleChainLength.txt`);
}
function loopFunction(){
    pathsum = [
    `../../data/${flag}/digraph/loop.txt`,
    `../../data/${flag}/bidirectedGraph/loop.txt`,
    `../../data/${flag}/biedgedGraph/loop.txt`,
    ]
    pathsum.forEach((filepath,index)=>{
        loadloopdata(index+1,filepath);
    })
}




// =======================================================
//                    单GFA文件表格图像绘制
// =======================================================
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

function loaddegree4GraphData(filePath1, filePath2) {
    const row = document.querySelector(`#DegreeDistributionRow`);
    const td = row.querySelector('td:nth-child(2)');
    return createDegreeChart(filePath1, filePath2, 'degreeCanvas', td);
}

function DegreeFunction(){
    loaddegree1GraphData(`../../data/${flag}/bidirectedGraph/degree.txt`);
    loaddegree2GraphData(`../../data/${flag}/biedgedGraph/degree.txt`);
    loaddegree4GraphData(`../../data/${flag}/digraph/inDegree.txt`,`../../data/${flag}/digraph/outDegree.txt`);
}

// =======================================================
//                    组合文件表格图像绘制
// =======================================================
function appendcoverageGraph(index,filepath,type){
    // console.log(filepath);
    return fetch(filepath)
    .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const row = document.querySelector(`#CoverageRow`);
            // console.log(name);
            const td = row.children[index];
            // console.log(td);
            var x =td.getElementsByTagName('canvas');
            if (x.length)
                {
                    Array.from(x).forEach(function(canvas) {
                    canvas.remove(); // 移除单个 canvas 元素
                    });
                }
            var canvas = document.createElement('canvas');
            canvas.id = index+'coverageCanvas';
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
            var ctx = document.getElementById(index+'coverageCanvas').getContext('2d');  
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