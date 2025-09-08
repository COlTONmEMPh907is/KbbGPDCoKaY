// 代码生成时间: 2025-09-08 19:20:19
import express, { Request, Response } from 'express';
const app = express();

// 定义接口路径和处理函数
const ROUTE = '/api/sort';

// 引入排序算法函数
import { sortArray } from './sort_algorithm';

// POST 请求处理排序算法
app.post(ROUTE, (req: Request, res: Response) => {
  try {
    // 校验请求体数据
    if (!req.body || !Array.isArray(req.body.array)) {
      return res.status(400).json({
        error: 'Invalid input: array is required.'
      });
    }
    // 执行排序算法
    const sortedArray = sortArray(req.body.array);
    // 返回排序结果
    return res.status(200).json({
      sortedArray
    });
  } catch (error) {
    // 错误处理
    return res.status(500).json({
      error: 'Internal server error.'
    });
  }
});

// 启动服务器
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// 排序算法实现
// 这里假设我们实现了一个简单的冒泡排序
export function sortArray(array: number[]): number[] {
  // 冒泡排序算法
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      if (array[j] > array[j + 1]) {
        // 交换元素
        const temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
      }
    }
  }
  return array;
}
