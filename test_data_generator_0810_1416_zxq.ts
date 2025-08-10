// 代码生成时间: 2025-08-10 14:16:32
import express from 'express';
import { Request, Response } from 'express';

// Define a basic user interface for the test data
interface User {
  id: number;
  name: string;
  email: string;
}

// TestDataGenerator class responsible for generating test data
class TestDataGenerator {
  private static readonly users: User[] = [];

  constructor() {
    this.seedData();
  }

  // Seed initial data for the generator
  private seedData(): void {
    const initialData: User[] = [
      { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
    ];
    initialData.forEach((user) => {
      this.createUser(user);
    });
  }

  // Generate a new user and add to the array
  public createUser(user: User): void {
    TestDataGenerator.users.push(user);
    console.log('User created:', user);
  }

  // Retrieve all users
  public getAllUsers(res: Response): void {
    res.status(200).json(TestDataGenerator.users);
  }
}

// Create an instance of the Express application
const app = express();
const testGenerator = new TestDataGenerator();

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to get all users
app.get('/users', (req: Request, res: Response) => {
  testGenerator.getAllUsers(res);
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the Express server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});