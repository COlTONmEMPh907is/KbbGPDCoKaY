// 代码生成时间: 2025-08-10 04:37:05
import express, { Request, Response } from 'express';
import { URL } from 'url';

// Create an Express application
const app = express();

// Middleware to parse incoming request bodies
app.use(express.json());

// Function to validate a URL
function isValidUrl(urlStr: string): boolean {
    try {
        const url = new URL(urlStr);
        // Check if the protocol is either http or https
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
            return false;
        }
        return true;
    } catch (error) {
        // If parsing the URL fails, it is invalid
        return false;
    }
}

// Endpoint to check URL validity
app.post('/validate-url', (req: Request, res: Response) => {
    const { url } = req.body;
    
    if (!url) {
        // If no URL is provided in the request body, send a bad request response
        return res.status(400).json({
            error: 'No URL provided.'
        });
    }
    
    const isValid = isValidUrl(url);
    
    // Respond with the validation result
    res.json({
        valid: isValid,
        message: isValid ? 'URL is valid.' : 'URL is invalid.'
    });
});

// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});