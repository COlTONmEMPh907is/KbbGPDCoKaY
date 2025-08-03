// 代码生成时间: 2025-08-04 06:33:46
import express, { Request, Response } from 'express';
import { randomBytes } from 'crypto';

// Define the range for the random number generator
const MIN = 1;
const MAX = 100;

// Create an Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// API endpoint to generate a random number
app.get('/random', (req: Request, res: Response) => {
    // Extract the range from the query parameters
    const min = req.query.min ? parseInt(req.query.min as string) : MIN;
    const max = req.query.max ? parseInt(req.query.max as string) : MAX;

    // Error handling for invalid range
    if (min > max || min < MIN || max > MAX || isNaN(min) || isNaN(max)) {
        return res.status(400).json({ error: 'Invalid range. Please ensure min is less than max and within the range of 1 to 100.' });
    }

    // Generate a random number within the specified range
    const randomNumber = generateRandomNumber(min, max);
    
    // Send the random number as a JSON response
    res.json({ randomNumber });
});

// Helper function to generate a random number within a given range
function generateRandomNumber(min: number, max: number): number {
    // Generate a random byte and use it as a seed for the random number
    const buffer = randomBytes(1);
    const seed = buffer[0];
    const range = max - min + 1;
    const randomNumber = Math.floor(seed / 256 * range) + min;
    return randomNumber;
}

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Random number generator server running on port ${PORT}`);
});