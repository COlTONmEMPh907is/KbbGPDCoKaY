// 代码生成时间: 2025-08-27 17:26:07
import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import formidable from 'formidable';
const app = express();
const port = 3000;
const backupDir = 'backups/';  // Directory to store backups

// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to handle file uploads
app.use('/upload', express.static('uploads'));

// Ensure the backup directory exists
fs.mkdir(backupDir, { recursive: true })
    .then(() => console.log('Backup directory created or already exists.'))
    .catch(err => console.error('Error creating backup directory:', err));

// Endpoint to create a backup
app.post('/backup', async (req, res) => {
    try {
        // Dummy data to backup
        const data = 'Data to backup';
        const fileName = `backup_${new Date().toISOString()}.txt`;
        const filePath = path.join(backupDir, fileName);
        await fs.writeFile(filePath, data);
        res.status(201).json({ message: 'Backup created successfully', fileName });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create backup', message: error.message });
    }
});

// Endpoint to restore a backup
app.post('/restore/:fileName', async (req, res) => {
    const { fileName } = req.params;
    const filePath = path.join(backupDir, fileName);
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        res.status(200).json({ message: 'Restore successful', data });
    } catch (error) {
        if (error.code === 'ENOENT') {
            res.status(404).json({ error: 'Backup file not found', message: error.message });
        } else {
            res.status(500).json({ error: 'Failed to restore backup', message: error.message });
        }
    }
});

// Endpoint to upload a file for backup
app.post('/upload', (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({ error: 'File upload failed', message: err.message });
        }
        const file = files.file;
        const filePath = path.join('uploads', file.name);
        fs.rename(file.path, filePath)
            .then(() => res.status(201).json({ message: 'File uploaded successfully', fileName: file.name }))
            .catch(err => res.status(500).json({ error: 'File upload failed', message: err.message }));
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Backup and restore service is running on port ${port}`);
});