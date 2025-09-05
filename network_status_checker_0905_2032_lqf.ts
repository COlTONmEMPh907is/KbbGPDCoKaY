// 代码生成时间: 2025-09-05 20:32:44
import express, { Request, Response } from 'express';
import { createClient } from 'dns';
import { createInterface } from 'readline';
import { createWriteStream } from 'fs';

// Define the port the server will listen on.
const PORT = 3000;

// Create an Express application.
const app = express();

// Middleware to parse JSON bodies.
app.use(express.json());

// Function to check network connectivity by attempting to resolve a DNS record.
const checkNetworkConnectivity = async (hostname: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    createClient().resolve4(hostname, (err) => {
      if (err) {
        console.error('Network connectivity check failed:', err);
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

// Route to handle GET requests and check network connectivity.
app.get('/status', async (req: Request, res: Response) => {
  // Extract hostname from query parameters.
  const { hostname } = req.query;
  
  // Check if hostname is provided and is a string.
  if (typeof hostname !== 'string' || hostname.trim() === '') {
    return res.status(400).json({ error: 'Hostname is required and must be a string.' });
  }
  
  try {
    const isConnected = await checkNetworkConnectivity(hostname);
    res.json({ status: isConnected ? 'connected' : 'disconnected' });
  } catch (error) {
    // Handle any unexpected errors.
    res.status(500).json({ error: 'An error occurred while checking network connectivity.' });
  }
});

// Start the server.
app.listen(PORT, () => {
  console.log(`Network Status Checker server is running on port ${PORT}`);
});