// 代码生成时间: 2025-09-20 14:14:11
import express from 'express';
import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';

// 初始化Express应用
const app = express();
const port = 3000;

// 中间件，用于解析JSON和URL编码的请求体
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由：生成Excel文件
app.post('/generate-excel', async (req, res) => {
  // 从请求体中获取数据
  const { data, filename } = req.body;
  if (!data || !filename) {
    return res.status(400).json({ error: 'Missing data or filename' });
  }

  try {
    // 创建一个新的Excel工作簿
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Sheet');

    // 添加数据到工作表
    worksheet.addRow(Object.keys(data[0])); // 假设所有对象具有相同的键集合
    data.forEach((row) => {
      worksheet.addRow(Object.values(row));
    });

    // 将工作簿写入文件
    const filePath = path.join(__dirname, '../', filename);
    await workbook.xlsx.writeFile(filePath);

    // 响应文件路径
    res.json({ message: 'Excel file generated successfully', path: filePath });
  } catch (error) {
    console.error('Error generating Excel file:', error);
    res.status(500).json({ error: 'Error generating Excel file' });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`Excel generator server listening at http://localhost:${port}`);
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 导出Excel文件时的错误处理
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});