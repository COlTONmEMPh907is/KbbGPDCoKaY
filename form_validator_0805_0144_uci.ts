// 代码生成时间: 2025-08-05 01:44:46
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

// 定义一个接口，用于描述要验证的表单数据结构
interface IFormData {
    username: string;
    email: string;
    age: number;
}

// 定义验证中间件，使用express-validator库进行数据验证
const validateFormData = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // 如果存在验证错误，返回400错误和错误信息
        return res.status(400).json({
            error: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

// 定义具体的验证规则
const validateRules = () => {
    return [
        // 验证用户名是否非空且长度在1到20个字符之间
        (req: Request, res: Response, next: NextFunction) => {
            req.check('username').notEmpty().withMessage('Username is required').isLength({ min: 1, max: 20 }).withMessage('Username must be between 1 and 20 characters');
            next();
        },
        // 验证邮箱是否非空且符合邮箱格式
        (req: Request, res: Response, next: NextFunction) => {
            req.check('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Email must be a valid email address');
            next();
        },
        // 验证年龄是否非空且为数字，年龄范围在1到120之间
        (req: Request, res: Response, next: NextFunction) => {
            req.check('age').notEmpty().withMessage('Age is required').isInt({ min: 1, max: 120 }).withMessage('Age must be an integer between 1 and 120');
            next();
        },
        // 使用验证中间件处理验证结果
        validateFormData
    ];
};

// 导出验证规则和中间件
export { validateRules, validateFormData };
