// 代码生成时间: 2025-09-30 01:49:23
import express, { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken'; // 假设使用jsonwebtoken进行token验证

// 定义用户接口
interface UserPayload {
    id: string;
    role: string;
}

// 创建Express应用
const app = express();

// 端口号
const PORT = process.env.PORT || 3000;

// 中间件：验证JWT Token
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({
            error: 'Authentication token is missing.'
        });
    }
    try {
        const payload = verify(token, process.env.JWT_SECRET!); // 假设JWT_SECRET存储在环境变量中
        if (payload) {
            req.user = payload as UserPayload;
            next();
        }
    } catch (error) {
        return res.status(401).json({
            error: 'Invalid authentication token.'
        });
    }
};

// API路由
app.get('/api/protected', authMiddleware, (req: Request, res: Response) => {
    // 访问权限控制
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            error: 'Access denied. Admin role required.'
        });
    }
    res.json({
        message: 'You have accessed a protected route.',
        user: req.user
    });
});

// 错误处理中间件
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'An internal error occurred.'
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});