// 代码生成时间: 2025-10-01 02:42:28
import express from 'express';
import { Request, Response } from 'express';

// Define the notification message interface
interface NotificationMessage {
  message: string;
  user: string;
}

// Create an Express application
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: Function) => {
  res.status(500).json({ error: err.message });
});

// Route to send a notification
app.post('/send-notification', (req: Request, res: Response) => {
  try {
    // Validate the request body
    const { message, user } = req.body as NotificationMessage;
    if (!message || !user) {
      throw new Error('Missing required parameters');
    }

    // Simulate sending the notification
    console.log(`Notification sent to ${user}: ${message}`);

    // Respond with success message
    res.status(200).json({
      success: true,
      message: 'Notification sent successfully'
    });
  } catch (error) {
    // Respond with error message
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred'
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Notification system running on port ${port}`);
});