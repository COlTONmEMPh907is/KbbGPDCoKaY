// 代码生成时间: 2025-10-10 19:59:57
// face_recognition_system.ts
// 一个使用TypeScript和Express框架实现的简单人脸识别系统

import express, { Request, Response } from 'express';
import { createClient } from '@google-cloud/vision';
import { Readable } from 'stream';
import { promisify } from 'util';
import sharp from 'sharp';
import { IFaceDetectionResponse, IFaceDetectionConfig } from './interfaces/faceDetection.interface';

// 初始化Express应用
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 配置Google Cloud Vision API
const visionClient = createClient();

// 处理静态文件（如上传的图片）的中间件
app.use('/images', express.static('uploads'));

// 人脸识别接口
app.post('/api/face-detect', async (req: Request, res: Response<IFaceDetectionResponse>) => {
  try {
    // 从请求中获取图片
    const imageStream = new Readable();
    imageStream.push(req.file.buffer);
    imageStream.push(null);

    // 配置面部检测
    const config = {
      type: 'FACE_DETECTION',
    } as IFaceDetectionConfig;

    // 使用Google Vision API进行面部检测
    const [result] = await visionClient.annotateImage({
      image: { content: imageStream.read(0).toString('base64') },
      features: [{ type: config.type, maxResults: 3 }],
    });

    // 处理返回结果
    const detections = result.responses[0].annotateImage?.faceAnnotations || [];
    const faces = detections.map((face) => (
      {
        joy: face.joyLikelihood,
        anger: face.angerLikelihood,
        sorrow: face.sorrowLikelihood,
        surprise: face.surpriseLikelihood,
        bounds: face.bounds,
      }
    ));

    // 返回检测结果
    res.status(200).json({ faces });
  } catch (error) {
    // 错误处理
    console.error('Error during face detection:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 文件上传接口
app.post('/api/upload', express.urlencoded({ extended: true }), (req, res) => {
  // 处理文件上传
  const upload = req.files?.image;
  if (!upload) {
    return res.status(400).send('No files were uploaded.');
  }

  // 保存文件并返回文件URL
  upload.mv('uploads/' + upload.name, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send('File uploaded!');
  });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// 接口文档
/**
 * @swagger
 * components:
 *   schemas:
 *     FaceDetectionResponse:
 *       type: object
 *       properties:
 *         faces:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               joy:
 *                 type: string
 *               anger:
 *                 type: string
 *               sorrow:
 *                 type: string
 *               surprise:
 *                 type: string
 *               bounds:
 *                 type: object
 *                 properties:
 *                   x:
 *                     type: number
 *                   y:
 *                     type: number
 *                   width:
 *                     type: number
 *                   height:
 *                     type: number
 * */