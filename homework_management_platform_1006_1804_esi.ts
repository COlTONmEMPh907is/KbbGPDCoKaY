// 代码生成时间: 2025-10-06 18:04:53
import express, { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';

// Define the port for the server
const PORT = process.env.PORT || 3000;

// Initialize the Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Define a HomeWork class to represent homework assignments
class Homework {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  
  constructor(id: string, title: string, description: string, dueDate: Date) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
  }
}

// In-memory store for homework assignments
const homeworks: Record<string, Homework> = {};

// Helper function to generate a unique ID
function generateId(): string {
  return 'id' + Math.random().toString(36).substr(2, 9);
}

// Route to get all homework assignments
app.get('/homeworks', (req: Request, res: Response) => {
  res.status(200).json(Object.values(homeworks));
});

// Route to get a single homework assignment by ID
app.get('/homeworks/:id', (req: Request, res: Response, next: NextFunction) => {
  const homeworkId = req.params.id;
  if (homeworks[homeworkId]) {
    res.status(200).json(homeworks[homeworkId]);
  } else {
    res.status(404).send('Homework not found');
  }
});

// Route to create a new homework assignment
app.post('/homeworks', (req: Request, res: Response) => {
  try {
    const { title, description, dueDate } = req.body;
    const newHomework = new Homework(generateId(), title, description, new Date(dueDate));
    homeworks[newHomework.id] = newHomework;
    res.status(201).json(newHomework);
  } catch (error) {
    next(error);
  }
});

// Route to update an existing homework assignment
app.put('/homeworks/:id', (req: Request, res: Response, next: NextFunction) => {
  const homeworkId = req.params.id;
  if (!homeworks[homeworkId]) {
    res.status(404).send('Homework not found');
    return;
  }
  try {
    const { title, description, dueDate } = req.body;
    homeworks[homeworkId] = new Homework(homeworkId, title, description, new Date(dueDate));
    res.status(200).json(homeworks[homeworkId]);
  } catch (error) {
    next(error);
  }
});

// Route to delete a homework assignment
app.delete('/homeworks/:id', (req: Request, res: Response, next: NextFunction) => {
  const homeworkId = req.params.id;
  if (homeworks[homeworkId]) {
    delete homeworks[homeworkId];
    res.status(204).send();
  } else {
    res.status(404).send('Homework not found');
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
createServer(app).listen(PORT, () => {
  console.log(`Homework management platform is running on port ${PORT}`);
});