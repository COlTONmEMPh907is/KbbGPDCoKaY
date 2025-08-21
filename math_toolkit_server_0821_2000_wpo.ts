// 代码生成时间: 2025-08-21 20:00:11
import express, { Request, Response, NextFunction } from 'express';
import { Router } from 'express-serve-static-core';

// Define the MathToolkitRouter to handle math-related routes.
const mathToolkitRouter: Router = express.Router();

// Define the MathToolkitService to encapsulate math logic.
class MathToolkitService {
    // Adds two numbers.
    public static add(a: number, b: number): number {
        return a + b;
    }

    // Subtracts two numbers.
    public static subtract(a: number, b: number): number {
        return a - b;
    }

    // Multiplies two numbers.
    public static multiply(a: number, b: number): number {
        return a * b;
    }

    // Divides two numbers.
    public static divide(a: number, b: number): number {
        if (b === 0) {
            throw new Error('Division by zero is not allowed.');
        }
        return a / b;
    }
}

// Define the routes for the math toolkit.
mathToolkitRouter.post('/add', (req: Request, res: Response, next: NextFunction) => {
    try {
        const { a, b } = req.body;
        const sum = MathToolkitService.add(a, b);
        res.json({ result: sum });
    } catch (error) {
        next(error);
    }
});

mathToolkitRouter.post('/subtract', (req: Request, res: Response, next: NextFunction) => {
    try {
        const { a, b } = req.body;
        const difference = MathToolkitService.subtract(a, b);
        res.json({ result: difference });
    } catch (error) {
        next(error);
    }
});

mathToolkitRouter.post('/multiply', (req: Request, res: Response, next: NextFunction) => {
    try {
        const { a, b } = req.body;
        const product = MathToolkitService.multiply(a, b);
        res.json({ result: product });
    } catch (error) {
        next(error);
    }
});

mathToolkitRouter.post('/divide', (req: Request, res: Response, next: NextFunction) => {
    try {
        const { a, b } = req.body;
        const quotient = MathToolkitService.divide(a, b);
        res.json({ result: quotient });
    } catch (error) {
        next(error);
    }
});

// Create an Express application.
const app = express();

// Use JSON parser for request bodies.
app.use(express.json());

// Use the math toolkit router.
app.use('/math', mathToolkitRouter);

// Error handling middleware.
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'An internal error occurred.' });
});

// Start the server.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Math Toolkit Server is running on port ${PORT}`);
});