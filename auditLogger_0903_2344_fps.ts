// 代码生成时间: 2025-09-03 23:44:44
import express from 'express';
import fs from 'fs';
import path from 'path';
import util from 'util';

// 定义一个异步函数来写日志，避免阻塞主线程
const writeFile = util.promisify(fs.writeFile);

// 中间件函数，用于记录请求日志
const auditMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        // 记录请求信息
        const logEntry = {
            timestamp: new Date().toISOString(),
            method: req.method,
            url: req.originalUrl,
            body: req.body
        };
        
        // 将日志信息写入文件
        await writeFile(path.join(__dirname, 'logs', 'audit.log'),
            JSON.stringify(logEntry) + '
',
            { flag: 'a' });
        
        next();
    } catch (error) {
        // 错误处理
        console.error('Error writing audit log:', error);
        next(error);
    }
};

// 创建一个Express应用
const app = express();

// 使用中间件解析请求体
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 使用安全审计日志中间件
app.use(auditMiddleware);

// 定义一个简单的路由
app.get('/', (req, res) => {
    res.send('Hello, Audit Logger!');
});

// 定义一个POST路由来接收数据
app.post('/api/data', (req, res) => {
    // 这里可以处理接收到的数据
    res.status(200).send('Data received successfully!');
});

// 错误处理中间件
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    // 将错误信息记录到控制台
    console.error(err.message);
    res.status(500).send('Internal Server Error');
});

// 设置端口并启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
