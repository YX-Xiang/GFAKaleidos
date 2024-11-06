const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // 文件保存的目录
    },
    filename: function (req, file, cb) {
        // 使用上传文件的原始文件名来保存文件
        cb(null, file.originalname); // 保持文件原名
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 50 MB
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

app.get('/api/gfaGlimpse', (req, res) => {
    const uploadPath = req.query.uploadPath;
    console.log(789);
    console.log(uploadPath);
    exec('bash web/algorithm/run.sh '+uploadPath, (error, stdout, stderr) => {
        if (error) {
            console.error(`执行错误: ${error.message}`);
            return res.status(500).send('命令执行失败');
        }
        if (stderr) {
            console.error(`错误输出: ${stderr}`);
            return res.status(500).send('命令执行失败');
        }
        console.log(`命令输出: ${stdout}`);
        res.send(`命令输出: ${stdout}`);
    });
});



app.post('/api/upload', upload.single('file'), (req, res) => {
    console.log('123456');
    if (req.file) {
        const filePath = `uploads/${req.file.filename}`;
      res.send({ message: '文件上传成功！', filePath: filePath });
    } else {
      res.status(400).send('文件上传失败');
    }
  });

app.listen(port, () => {
    console.log(`服务器正在运行在 http://localhost:${port}`);
});
