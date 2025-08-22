// 代码生成时间: 2025-08-22 08:46:16
// file_backup_sync_tool.ts
// This is a simple file backup and sync tool built with TypeScript and Express framework.

import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { createWriteStream } from 'fs';
import { Readable } from 'stream';

// Define the port for the Express server
const port = 3000;

// Create an Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Define the routes for the backup and sync operations
app.post('/backup', (req: Request, res: Response) => {
  const { sourcePath, backupPath } = req.body;

  // Check if sourcePath and backupPath are provided
  if (!sourcePath || !backupPath) {
    return res.status(400).json({
      error: 'Source path and backup path must be provided.'
    });
  }

  // Read the file from sourcePath
  fs.readFile(sourcePath, (err, data) => {
    if (err) {
      return res.status(500).json({
        error: `Error reading file from source path: ${err.message}`
      });
    }

    // Write the file to backupPath
    const writeStream = fs.createWriteStream(backupPath);
    writeStream.write(data);
    writeStream.on('finish', () => {
      writeStream.close(
        () => res.status(200).json({
          message: 'File backed up successfully.'
        })
      );
    });
    writeStream.on('error', (error) => {
      res.status(500).json({
        error: `Error writing file to backup path: ${error.message}`
      });
    });
  });
});

app.post('/sync', (req: Request, res: Response) => {
  const { sourcePath, destinationPath } = req.body;

  // Check if sourcePath and destinationPath are provided
  if (!sourcePath || !destinationPath) {
    return res.status(400).json({
      error: 'Source path and destination path must be provided.'
    });
  }

  // Create a readable stream from the source file
  const readStream = fs.createReadStream(sourcePath);
  // Create a writable stream to the destination file
  const writeStream = fs.createWriteStream(destinationPath);

  // Pipe the read stream to the write stream
  readStream.pipe(writeStream);

  writeStream.on('finish', () => {
    res.status(200).json({
      message: 'File synced successfully.'
    });
  });
  writeStream.on('error', (error) => {
    res.status(500).json({
      error: `Error syncing file: ${error.message}`
    });
  });
  readStream.on('error', (error) => {
    res.status(500).json({
      error: `Error reading file from source path: ${error.message}`
    });
  });
});

// Start the Express server
app.listen(port, () => {
  console.log(`File backup and sync tool running on port ${port}`);
});
