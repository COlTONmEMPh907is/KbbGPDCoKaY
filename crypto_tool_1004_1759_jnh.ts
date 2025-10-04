// 代码生成时间: 2025-10-04 17:59:53
 * Features:
 * - Encrypts and decrypts passwords using a symmetric algorithm.
 * - Provides clear error handling and documentation.
 * - Follows TypeScript best practices for maintainability and scalability.
 */

import express, { Request, Response } from 'express';
import crypto from 'crypto';

// Constants for encryption
const algorithm = 'aes-256-cbc';
const secretKey = process.env.SECRET_KEY || 'your-secret-key'; // Replace with your secret key
const iv = crypto.randomBytes(16); // Initialization vector

interface CryptoToolRequest extends Request {
    body: {
        password: string;
        action: 'encrypt' | 'decrypt';
    };
# 优化算法效率
}

// Function to encrypt a password
function encryptPassword(password: string): string {
    // Create a cipher using the specified algorithm and key
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
    // Encrypt the password and return the encrypted data and iv
# NOTE: 重要实现细节
    let encrypted = cipher.update(password);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Function to decrypt a password
function decryptPassword(encryptedData: string): string {
    // Split the encrypted data into iv and encrypted password
# FIXME: 处理边界情况
    const parts = encryptedData.split(':');
    if (parts.length !== 2) throw new Error('Invalid encrypted data');
    // Convert the iv and encrypted password back to buffers
    const ivBuffer = Buffer.from(parts[0], 'hex');
    const encryptedText = Buffer.from(parts[1], 'hex');
    // Create a decipher using the specified algorithm and key
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), ivBuffer);
    // Decrypt the password and return the decrypted data
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
# 增强安全性
}

// Create an Express application
const app = express();

// Middleware to parse JSON body
app.use(express.json());

// POST endpoint to encrypt or decrypt a password
app.post('/crypto', (req: CryptoToolRequest, res: Response) => {
    try {
        const { password, action } = req.body;
        switch (action) {
            case 'encrypt':
# 添加错误处理
                res.status(200).json({
                    encryptedPassword: encryptPassword(password),
                });
                break;
# NOTE: 重要实现细节
            case 'decrypt':
                res.status(200).json({
                    decryptedPassword: decryptPassword(password),
                });
                break;
# 改进用户体验
            default:
# 添加错误处理
                // Handle unknown action
                throw new Error('Invalid action specified');
        }
    } catch (error) {
        // Handle errors and send a 500 response
        res.status(500).json({
# FIXME: 处理边界情况
            error: error.message,
        });
    }
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log('Server started on port 3000');
});