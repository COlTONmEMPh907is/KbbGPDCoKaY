// 代码生成时间: 2025-07-31 20:00:34
import express, { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

// Define a type for user permissions
type UserPermission = 'read' | 'write' | 'delete';

// Mock data for users and their permissions
const users: Record<string, UserPermission[]> = {
  alice: ['read', 'write'],
  bob: ['read'],
  charlie: ['write', 'delete'],
};

// Middleware to check user permissions
function checkPermission(requiredPermission: UserPermission) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.body;
    if (!username || !users[username]) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: 'User not found or not authorized',
      });
    }
    if (!users[username].includes(requiredPermission)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: 'Insufficient permissions',
      });
    }
    next();
  };
}

// Initialize express app
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// Define a route to create a new user with permissions
app.post('/users', (req: Request, res: Response) => {
  const { username, permissions } = req.body;
  // Simple validation
  if (!username || !permissions) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: 'Username and permissions are required',
    });
  }
  // Assign permissions to the new user
  users[username] = permissions as unknown as UserPermission[];
  res.status(StatusCodes.CREATED).json({
    message: `User ${username} created with permissions: ${permissions.join(', ')}`,
  });
});

// Define a route to perform an action that requires read permission
app.get('/read', checkPermission('read'), (req: Request, res: Response) => {
  res.json({
    message: 'You have read access',
  });
});

// Define a route to perform an action that requires write permission
app.post('/write', checkPermission('write'), (req: Request, res: Response) => {
  res.json({
    message: 'You have write access',
  });
});

// Define a route to perform an action that requires delete permission
app.delete('/delete', checkPermission('delete'), (req: Request, res: Response) => {
  res.json({
    message: 'You have delete access',
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: 'An unexpected error occurred',
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});