// 代码生成时间: 2025-09-14 06:45:12
import { Request, Response, NextFunction } from 'express';

// Import a library for sanitizing input to protect against XSS
// For example, using 'xss' npm package
import { sanitize } from 'xss';

// Middleware function to sanitize user inputs
function xssProtectionMiddleware(req: Request, res: Response, next: NextFunction): void {
    try {
        // Sanitize all request parameters to prevent XSS
        for (const key in req.params) {
            req.params[key] = sanitize(req.params[key]);
        }
        for (const key in req.query) {
            req.query[key] = sanitize(req.query[key]);
        }
        for (const key in req.body) {
            req.body[key] = sanitize(req.body[key]);
        }
        // Continue to the next middleware
        next();
    } catch (error) {
        // Handle any errors that occur during sanitization
        console.error('Error sanitizing input:', error);
        res.status(500).send('Internal Server Error');
    }
}

// Export the middleware function
export default xssProtectionMiddleware;