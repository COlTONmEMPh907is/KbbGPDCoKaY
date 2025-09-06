// 代码生成时间: 2025-09-06 10:51:34
import express, { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

// 创建一个简单的表单验证器中间件
const formValidatorMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req); // 获取验证结果
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); // 如果有错误，返回400状态码和错误信息
  }
  next(); // 如果没有错误，继续执行后续中间件
};

// 定义一个简单的表单数据验证函数
const validateForm = [
  // 验证字段'username'非空且不小于3个字符
  check('username').not().isEmpty().withMessage('Username is required')
    .bail()
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),

  // 验证字段'email'非空且为有效的电子邮件格式
  check('email').not().isEmpty().withMessage('Email is required')
    .bail()
    .isEmail().withMessage('Email must be a valid email address'),

  // 验证字段'age'非空且为正整数
  check('age').not().isEmpty().withMessage('Age is required')
    .bail()
    .isInt({ min: 0 }).withMessage('Age must be a positive integer'),
];

// 创建一个Express应用
const app = express();

// 使用表单验证中间件
app.use(formValidatorMiddleware);

// 设置POST路由，接收表单数据
app.post('/api/submit-form', validateForm, (req: Request, res: Response) => {
  // 通过req.body访问验证后的表单数据
  const { username, email, age } = req.body;
  res.status(200).json({
    message: 'Form submitted successfully!',
    data: { username, email, age },
  });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Helper function to use express-validator checks
function check(value: string) {
  return req.check(value);
}
