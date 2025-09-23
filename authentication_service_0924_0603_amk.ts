// 代码生成时间: 2025-09-24 06:03:58
// Import necessary modules
import express, { Request, Response } from 'express';
import { check } from 'express-validator';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

// Define a secret key for JWT
const JWT_SECRET = 'your_jwt_secret_key';

// Initialize Express application
const app = express();
app.use(express.json());

// Define a user object for demonstration purposes
const user = {
  id: 1,
  username: 'testUser',
  password: 'password',
};

// POST route for user login
app.post('/login',
  // Validate user credentials
  [
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty()
  ],
  async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
      // Simulate user database lookup
      if (user.username === username && user.password === password) {
        // Generate JWT token
        const token = jwt.sign({
          id: user.id,
          username: user.username
        }, JWT_SECRET, { expiresIn: '1h' });

        // Respond with token
        return res.status(200).json({
          success: true,
          message: 'Authentication successful',
          token: token,
        });
      } else {
        // Return an error if credentials are incorrect
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }
    } catch (error) {
      // Handle any unexpected errors
      return res.status(500).json({
        success: false,
        message: 'Server error',
     });
    }
  }
);

// Middleware to protect routes
const authMiddleware = (req: Request, res: Response, next: Function) => {
  const token = req.headers['authorization'];
  if (!token)
    return res.status(401).json({ success: false, message: 'No token provided' });

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Protected route example
app.get('/profile', authMiddleware, (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Profile accessed',
    user: req.user
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
