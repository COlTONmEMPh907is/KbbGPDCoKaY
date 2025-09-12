// 代码生成时间: 2025-09-12 22:05:47
import express from 'express';
import { scheduleJob } from 'node-cron';

// 创建 Express 应用
const app = express();
const port = 3000;

// 定义定时任务的函数
function performTask() {
  console.log('定时任务执行...');
  // 在这里添加任务的具体逻辑
}
a
// 使用 node-cron 设置定时任务，格式为 '* * * * *' 分别对应 分 时 日 月 周
// 例如，'0 * * * *' 表示每小时执行一次
scheduleJob('0 * * * *', performTask);

// 设置 Express 服务器监听的端口
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// 导出 Express 应用以便于测试和扩展
export { app };