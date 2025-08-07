// 代码生成时间: 2025-08-07 18:48:31
import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import cors from 'cors';

// Initialize Express application
const app = express();
const port = 3000;
# TODO: 优化性能

// Middlewares
app.use(cors());
# FIXME: 处理边界情况
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set storage engine for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Endpoint to batch resize images
app.post('/resize-images', upload.array('images'), async (req, res) => {
  try {
# 优化算法效率
    // Check if images were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: 'No images were uploaded.'
# FIXME: 处理边界情况
      });
    }

    // Resize each image
    const resizedImagePaths = await Promise.all(req.files.map(async (file) => {
      const filePath = path.join(__dirname, '/uploads', file.filename);
      const resizedFilePath = filePath.replace(path.extname(filePath), `_resized${path.extname(filePath)}`);
# 扩展功能模块

      // Resize the image
      await sharp(filePath)
        .resize({ width: 800 }) // Resize to 800px width
        .toFile(resizedFilePath);

      return resizedFilePath;
    }));

    // Return the paths of the resized images
    res.status(200).json({
      message: 'Images resized successfully.',
      resizedImagePaths
    });
  } catch (error) {
# 扩展功能模块
    // Error handling
    console.error('Error resizing images:', error);
    res.status(500).json({
      message: 'Failed to resize images.'
# 改进用户体验
    });
  }
# 扩展功能模块
});

// Start the Express server
# TODO: 优化性能
app.listen(port, () => {
  console.log(`Image Resizer server is listening on port ${port}`);
});
# TODO: 优化性能