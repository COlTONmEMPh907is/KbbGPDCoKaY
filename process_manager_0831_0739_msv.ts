// 代码生成时间: 2025-08-31 07:39:12
import express from 'express';
import { exec } from 'child_process';
import * as os from 'os';

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to list all processes
app.get('/processes', (req, res) => {
    exec('ps aux', (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({
                error: 'Failed to execute process list command',
                message: error.message
            });
        }
        if (stderr) {
            return res.status(500).json({
                error: 'Failed to execute process list command',
                message: stderr
            });
        }
        res.json({
            processes: stdout.split(os.EOL)
        });
    });
});

// Endpoint to terminate a process
app.post('/processes/:pid/terminate', (req, res) => {
    const { pid } = req.params;
    try {
        const processToTerminate = parseInt(pid, 10);
        if (isNaN(processToTerminate)) {
            return res.status(400).json({
                error: 'Invalid process ID'
            });
        }
        exec(`kill ${pid}`, (error, stdout, stderr) => {
            if (error) {
                return res.status(500).json({
                    error: 'Failed to terminate process',
                    message: error.message
                });
            }
            if (stderr) {
                return res.status(500).json({
                    error: 'Failed to terminate process',
                    message: stderr
                });
            }
            res.json({
                message: `Process with ID ${pid} terminated successfully`
            });
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Process manager listening at http://localhost:${port}`);
});
