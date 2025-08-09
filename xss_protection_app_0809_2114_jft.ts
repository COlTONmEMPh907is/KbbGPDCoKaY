// 代码生成时间: 2025-08-09 21:14:37
import express from 'express';
import { sanitize } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// 创建Express应用
const app = express();
const port = 3000;

// 定义一个中间件来处理XSS攻击
const xssProtectionMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const sanitizeBody = sanitize(req.body).trim().escape();
    const sanitizeQuery = sanitize(req.query).trim().escape();
    const sanitizeParams = sanitize(req.params).trim().escape();
    next();
};

// 应用中间件到所有路由
app.use(xssProtectionMiddleware);

// 创建一个示例路由来展示XSS防护
app.get('/', (req: Request, res: Response) => {
    // 响应一个简单的HTML页面
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>XSS Protection Demo</title>
        </head>
        <body>
            <h1>Welcome to the XSS Protection Demo</h1>
            <form action="/xss-test" method="post">
                <label for="userInput">Enter something:</label>
                <input type="text" id="userInput" name="userInput">
                <button type="submit">Submit</button>
            </form>
        </body>
        </html>
    `);
});

// 一个简单的POST路由用于接收用户输入并展示，以测试XSS防护
app.post('/xss-test', (req: Request, res: Response) => {
    try {
        // 使用中间件自动处理XSS
        const userInput = req.body.userInput;
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>XSS Test Result</title>
            </head>
            <body>
                <h1>XSS Test Result</h1>
                <p>You entered: ${userInput}</p>
            </body>
            </html>
        `);
    } catch (error) {
        res.status(500).send('An error occurred while processing your request.');
    }
});

// 启动服务器
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// 以上代码展示了如何使用Express和express-validator来创建一个简单的XSS防护应用程序。
// 通过中间件xssProtectionMiddleware，我们对所有传入的数据进行trim和escape处理，
// 以清理潜在的XSS攻击向量。