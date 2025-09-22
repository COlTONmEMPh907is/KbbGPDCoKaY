// 代码生成时间: 2025-09-22 15:22:42
 * Author: [Your Name]
 * Date: [Today's Date]
 */

import express from 'express';
import fs from 'fs';
import path from 'path';
import { createWriteStream } from 'fs';
import { promisify } from 'util';
import { pipeline } from 'stream';
import { Readable } from 'stream';

// Promisify fs.copyFile and fs.remove for better error handling
const copyFileAsync = promisify(fs.copyFile);
const removeAsync = promisify(fs.remove);

// Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Define route for file backup
app.post('/backup', async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        error: 'No files were uploaded.'
      });
    }

    const file = req.files.file;
    const backupPath = path.join(__dirname, 'backups', file.name);

    // Ensure backups directory exists
    await fs.promises.mkdir(path.join(__dirname, 'backups'), { recursive: true });

    // Copy file to backup directory
    await copyFileAsync(file.tempFilePath, backupPath);
    res.json({
      message: 'File backup successful.',
      backupPath
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to backup file.'
    });
  }
});

// Define route for file synchronization
app.post('/sync', async (req, res) => {
  try {
    const sourcePath = req.body.sourcePath;
    const destinationPath = req.body.destinationPath;

    if (!fs.existsSync(sourcePath)) {
      return res.status(400).json({
        error: `Source path ${sourcePath} does not exist.`
      });
    }

    // Create a readable stream from the source file
    const readStream = fs.createReadStream(sourcePath);

    // Create a writable stream to the destination file
    const writeStream = createWriteStream(destinationPath);

    // Pipe the read stream to the write stream
    await new Promise((resolve, reject) => {
      pipeline(readStream, writeStream, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    res.json({
      message: 'File synchronization successful.',
      sourcePath,
      destinationPath
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to synchronize file.'
    });
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
