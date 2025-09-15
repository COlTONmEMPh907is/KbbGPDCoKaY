// 代码生成时间: 2025-09-16 04:27:07
import express from 'express';
import { Request, Response } from 'express';

// Define an interface for user data that includes permissions
interface UserData {
  username: string;
  permissions: string[];
}

// Mock user data
const users: Record<string, UserData> = {
  'admin': {
    username: 'admin',
    permissions: ['read', 'write', 'delete'],
  },
  'user': {
    username: 'user',
    permissions: ['read'],
  },
};

// Function to check if a user has permission to access a route
function hasPermission(user: UserData, requiredPermission: string): boolean {
  return user.permissions.includes(requiredPermission);
}

// Create an Express application
const app = express();

// Middleware to authenticate and authorize users
app.use((req: Request, res: Response, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const username = authHeader.split(':')[0];
  if (!users[username]) {
    return res.status(403).json({ error: 'User not found' });
  }

  req.user = users[username];
  next();
});

// Define a route that requires 'write' permission
app.get('/write', (req: Request, res: Response) => {
  const { user } = req;
  if (!hasPermission(user, 'write')) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }

  res.json({ message: 'You have write access' });
});

// Define a route that requires 'read' permission
app.get('/read', (req: Request, res: Response) => {
  const { user } = req;
  if (!hasPermission(user, 'read')) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }

  res.json({ message: 'You have read access' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Access Control Server is running on port ${PORT}`);
});