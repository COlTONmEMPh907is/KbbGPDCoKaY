// 代码生成时间: 2025-09-03 04:22:36
import express from 'express';
import fs from 'fs';
import path from 'path';
import util from 'util';

// Promisify fs operations for easier error handling
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const readdir = util.promisify(fs.readdir);
const copyFile = util.promisify(fs.copyFile);

// Define the port for the Express server
const PORT = 3000;

// Define the directories for backup and sync
const sourceDir = './source';
const backupDir = './backup';

// Create the Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Route to initiate a backup
app.post('/api/backup', async (req, res) => {
  try {
    // Read the contents of the source directory
    const sourceFiles = await readdir(sourceDir);

    // Loop through each file in the source directory
    for (const file of sourceFiles) {
      const sourceFilePath = path.join(sourceDir, file);
      const backupFilePath = path.join(backupDir, file);

      // Copy each file from source to backup directory
      await copyFile(sourceFilePath, backupFilePath);
    }

    // Return a success message
    res.status(200).json({ message: 'Backup completed successfully' });
  } catch (error) {
    // Handle any errors that occur during the backup process
    res.status(500).json({ error: error.message });
  }
});

// Route to initiate a sync
app.post('/api/sync', async (req, res) => {
  try {
    // Read the contents of both the source and backup directories
    const sourceFiles = await readdir(sourceDir);
    const backupFiles = await readdir(backupDir);

    // Find files that exist in the source but not in the backup
    const filesToSync = sourceFiles.filter(file => !backupFiles.includes(file));

    // Loop through each file that needs to be synced
    for (const file of filesToSync) {
      const sourceFilePath = path.join(sourceDir, file);
      const backupFilePath = path.join(backupDir, file);

      // Copy each file from source to backup directory
      await copyFile(sourceFilePath, backupFilePath);
    }

    // Return a success message
    res.status(200).json({ message: 'Sync completed successfully' });
  } catch (error) {
    // Handle any errors that occur during the sync process
    res.status(500).json({ error: error.message });
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`File Backup and Sync Tool running on port ${PORT}`);
});
