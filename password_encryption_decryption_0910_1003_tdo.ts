// 代码生成时间: 2025-09-10 10:03:09
import express from 'express';
import bodyParser from 'body-parser';
import crypto from 'crypto';

// Define the app
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Function to encrypt a password
function encryptPassword(password: string): string {
    const cipher = crypto.createCipher('aes256', 'password');
    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// Function to decrypt a password
function decryptPassword(encryptedPassword: string): string {
    const decipher = crypto.createDecipher('aes256', 'password');
    let decrypted = decipher.update(encryptedPassword, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// Route to encrypt a password
app.post('/encrypt', (req, res) => {
    const { password } = req.body;
    if (!password) {
        return res.status(400).json({ error: 'Password is required' });
    }
    try {
        const encrypted = encryptPassword(password);
        res.json({ encrypted });
    } catch (error) {
        res.status(500).json({ error: 'Encryption failed' });
    }
});

// Route to decrypt a password
app.post('/decrypt', (req, res) => {
    const { encryptedPassword } = req.body;
    if (!encryptedPassword) {
        return res.status(400).json({ error: 'Encrypted password is required' });
    }
    try {
        const decrypted = decryptPassword(encryptedPassword);
        res.json({ decrypted });
    } catch (error) {
        res.status(500).json({ error: 'Decryption failed' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

// Start the server
app.listen(port, () => {
    console.log(`Password encryption and decryption tool running on port ${port}`);
});