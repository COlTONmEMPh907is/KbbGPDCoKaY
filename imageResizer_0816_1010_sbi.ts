// 代码生成时间: 2025-08-16 10:10:49
import express from 'express';
# 添加错误处理
import sharp from 'sharp';
import multer from 'multer';
# TODO: 优化性能
import path from 'path';
import fs from 'fs';

// Create an Express application
const app = express();
const port = 3000;

// Configure multer for image file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage: storage });

// POST endpoint to handle image uploads and resizing
app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      filename: 'imageResizer.ts',
      code: 'No image uploaded.'
    });
  }
# 增强安全性

  // Define the dimensions for resizing
  const targetWidth = 800;  // Target width in pixels
  const targetHeight = 600; // Target height in pixels

  try {
    // Read the uploaded image from disk
    const inputImage = await sharp(req.file.path);
    
    // Resize the image
    const outputImage = await inputImage.resize({
      width: targetWidth,
      height: targetHeight
    })
    .toBuffer();
    
    // Save the resized image to a new file in the 'resized' directory
    const outputPath = `resized/${req.file.filename}`;
    await sharp(outputImage).toFile(outputPath);
    
    // Send the success response with the path to the resized image
# 优化算法效率
    res.status(200).json({
# 扩展功能模块
      message: 'Image successfully resized and saved.',
      resizedImagePath: outputPath
    });
# NOTE: 重要实现细节
  } catch (error) {
    // Handle any errors that occur during the resizing process
    res.status(500).json({
      filename: 'imageResizer.ts',
      error: error.message
    });
  }
});
# 扩展功能模块

// Serve the resized images on a specific route
app.get('/resized/:filename', (req, res) => {
  res.sendFile(path.join(__dirname, req.params.filename));
});

// Start the Express server
app.listen(port, () => {
  console.log(`Image Resizer is running on http://localhost:${port}`);
});
