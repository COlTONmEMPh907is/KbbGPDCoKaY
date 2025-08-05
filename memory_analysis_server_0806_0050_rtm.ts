// 代码生成时间: 2025-08-06 00:50:22
import express from 'express';
import os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

// Promisify the exec function for better error handling and async/await support
const execAsync = promisify(exec);

const app = express();
const port = 3000;

// Endpoint to get memory usage statistics
app.get('/memory', async (req, res) => {
  try {
    // Get the total memory and free memory in bytes
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;

    // Get the memory usage percentage
    const memoryUsagePercentage = (usedMemory / totalMemory) * 100;

    // Prepare the response object
    const memoryInfo = {
      totalMemory,
      freeMemory,
      usedMemory,
      memoryUsagePercentage
    };

    // Send the memory usage statistics as a JSON response
    res.json(memoryInfo);
  } catch (error) {
    console.error('Error retrieving memory usage:', error);
    // Return a 500 Internal Server Error response in case of exceptions
    res.status(500).json({ error: 'Failed to retrieve memory usage' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Memory analysis server listening at http://localhost:${port}`);
});

// Function to retrieve detailed memory usage
async function getDetailedMemoryUsage() {
  try {
    // Execute the 'top' command to get detailed memory usage
    const { stdout, stderr } = await execAsync('top -b -n 1 | head -n 5');

    // If there's an error in executing the command, throw an error
    if (stderr) {
      throw new Error(`Error executing command: ${stderr}`);
    }

    // Return the output of the command as a string
    return stdout;
  } catch (error) {
    throw error;
  }
}

// Endpoint to get detailed memory usage
app.get('/memory/detailed', async (req, res) => {
  try {
    // Retrieve detailed memory usage using the function
    const detailedMemoryUsage = await getDetailedMemoryUsage();

    // Send the detailed memory usage as a plain text response
    res.type('txt').send(detailedMemoryUsage);
  } catch (error) {
    console.error('Error retrieving detailed memory usage:', error);
    // Return a 500 Internal Server Error response in case of exceptions
    res.status(500).json({ error: 'Failed to retrieve detailed memory usage' });
  }
});