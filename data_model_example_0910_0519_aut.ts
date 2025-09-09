// 代码生成时间: 2025-09-10 05:19:08
import express, { Request, Response } from 'express';
import { json } from 'express';

// Define the data model interface
interface User {
  id: number;
  name: string;
  email: string;
}

// In-memory data store for demonstration purposes
const users: User[] = [];
let nextId = 1;

// Create a new user
const createUser = (req: Request, res: Response) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const newUser: User = {
    id: nextId++,
    name,
    email
  };

  users.push(newUser);
  res.status(201).json(newUser);
};

// Get all users
const getAllUsers = (req: Request, res: Response) => {
  res.json(users);
};

// Get a user by ID
const getUserById = (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
};

// Update a user by ID
const updateUserById = (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const { name, email } = req.body;
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  user.name = name;
  user.email = email;
  res.json(user);
};

// Delete a user by ID
const deleteUserById = (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  users.splice(userIndex, 1);
  res.status(204).send();
};

// Setup Express app
const app = express();
app.use(json());

// Define routes
app.post('/users', createUser);
app.get('/users', getAllUsers);
app.get('/users/:id', getUserById);
app.put('/users/:id', updateUserById);
app.delete('/users/:id', deleteUserById);

// Start server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});