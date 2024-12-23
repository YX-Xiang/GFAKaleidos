const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const archiver = require('archiver');
const fs = require('fs');
const AdmZip = require('adm-zip');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const userIp = req.body.userIp;
        const uploadPath = path.join('/home/yxxiang/uploads/', userIp.toString());
        
        // 确保目标文件夹存在
        fs.mkdirSync(uploadPath, { recursive: true }); // 创建文件夹，若已存在不会报错
        
        cb(null, uploadPath); // 使用动态路径
    },
    filename: function (req, file, cb) {
        // 使用上传文件的原始文件名来保存文件
        cb(null, file.originalname); // 保持文件原名
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 500 * 1024 * 1024 } // 500 MB
});
const app = express();
const port = 3738;
app.use(cors());
// 允许前端跨域请求
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/api/gfaKaleidos', (req, res) => {
    console.log('852369');
    const uploadPath = req.query.uploadPath;
    console.log(uploadPath);
    exec('bash algorithm/run.sh '+uploadPath, (error, stdout, stderr) => {
    // exec('python3 connect.py '+uploadPath, (error, stdout, stderr) => {
        if (error) {
            console.error(`执行错误: ${error.message}`);
            return res.status(500).send('命令执行失败');
        }
        if (stderr) {
            console.error(`${stderr}`);
        }
        console.log(`命令输出: ${stdout}`);
        res.send(`命令输出: ${stdout}`);
    });
});

app.get('/api/downloadZip', (req, res) => {
    // console.log(7559348578);
    const flag = req.query.flag;
    const folderPath = path.join(__dirname,'data',flag); // 文件夹路径
    if (!fs.existsSync(folderPath)) {
        return res.status(404).send('文件夹不存在');
    }
    console.log(folderPath);
    const zipFilePath = path.join(__dirname, `${flag}.zip`);
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', { zlib: { level: 9 } });

     // 监听完成事件
     output.on('close', () => {
        console.log(`压缩完成，大小: ${archive.pointer()} 字节`);
        res.status(200).json({
            message: '文件压缩完成',
            zipFilePath: zipFilePath
        });
    });

    // 监听错误事件
    archive.on('error', (err) => {
        console.error('压缩出错:', err);
        res.status(500).json({ message: '文件压缩失败', error: err.message });
    });

    // 将压缩包写入文件流
    archive.pipe(output);
    archive.directory(folderPath, false);
    archive.finalize();

    fs.unlink(zipFilePath, (err) => {
        if (err) {
            console.error('删除压缩文件出错:', err);
        } else {
            console.log('压缩文件已删除');
        }
    });
});

app.get('/api/deleteZip', (req, res) => {
    // console.log(7559348578);
    const flag = req.query.flag;
    const zipFilePath = path.join(__dirname, `${flag}.zip`);
    if (fs.existsSync(zipFilePath)) {
        fs.unlink(zipFilePath, (err) => {
            if (err) {
                console.error('文件删除失败:', err.message);
                return res.status(500).json({ message: '文件删除失败' });
            }
            res.json({ message: '文件已成功删除' });
        });
    } else {
        res.status(404).json({ message: '文件不存在' });
    }
});

app.post('/api/upload', upload.single('file'), (req, res) => {
    // console.log('123456');
    if (req.file) {
        const userIp = req.body.userIp;
        const filePath = `/home/yxxiang/uploads/${userIp}/${req.file.filename}`;
      res.send({ message: '文件上传成功', filePath: filePath });
    } else {
      res.status(400).send('文件上传失败');
    }
});

app.post('/api/uploadZip', upload.single('file'), (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    // 标准化文件名
    const zipFilePath = path.join('/home/yxxiang/uploads', file.originalname);
    const outputFolder = path.join(__dirname, 'data', path.parse(file.originalname).name);

    // 确保解压目标文件夹存在
    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true });
    }

    try {
        // 解压缩文件
        const zip = new AdmZip(zipFilePath);
        zip.extractAllTo(outputFolder, true); // 覆盖解压
        console.log(`文件已成功解压到: ${outputFolder}`);

        // 返回成功响应
        res.json({
            success: true,
            message: '文件上传并解压成功',
            fileName: path.parse(file.originalname).name,
            outputFolder: outputFolder,
        });
    } catch (err) {
        console.error('解压失败:', err);
        res.status(500).json({ success: false, message: '文件解压失败', error: err.message });
    }
});

app.listen(port, () => {
    console.log(`服务器正在运行在 http://localhost:${port}`);
});