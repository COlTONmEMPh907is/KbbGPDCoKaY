// 代码生成时间: 2025-09-07 13:00:13
import express from 'express';
import { createGunzip, pipeline } from 'stream';
import { promisify } from 'util';
import { createWriteStream } from 'fs';
import path from 'path';
import mime from 'mime-types';

// 定义HTTP服务器端口
const PORT = 3000;

// 创建Express应用
const app = express();

// 解压工具的路由
app.post('/unzip', async (req, res) => {
  // 检查是否有文件被上传
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ error: 'No files were uploaded.' });
  }

  // 获取上传的文件
  const file = req.files.file;

  try {
    // 确保文件存在
    if (!file) {
      return res.status(400).json({ error: 'No file provided.' });
    }

    // 创建解压后的文件路径
    const outputPath = path.join(__dirname, 'uploads', file.name);

    // 创建一个Gunzip流来解压文件
    const gunzip = createGunzip();
    // 创建文件写入流
    const writeStream = createWriteStream(outputPath);

    // 使用pipeline来处理流，这样可以更好地处理错误和完成事件
    await promisify(pipeline)(file.data, gunzip, writeStream);

    // 返回成功消息和文件信息
    res.json({
      message: 'File successfully unzipped.',
      filename: file.name,
      mimetype: mime.lookup(file.name),
      size: file.size
    });
  } catch (error) {
    // 错误处理
    res.status(500).json({ error: 'An error occurred during unzipping.' });
  }
});

// 配置上传文件的中间件
const fileUpload = (req, res, next) => {
  if (!req.is('application/octet-stream')) {
    return res.status(400).json({ error: 'Only .zip files are accepted.' });
  }
  next();
};

app.use(fileUpload);
app.use(express.urlencoded({ extended: true }));
app.use(express.multipart({ uploadDir: './uploads' }));

// 启动服务器
app.listen(PORT, () => {
  console.log(`Unzip tool server is running on port ${PORT}`);
});