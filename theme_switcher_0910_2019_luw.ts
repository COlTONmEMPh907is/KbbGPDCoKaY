// 代码生成时间: 2025-09-10 20:19:09
import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

// Define a types for request and response
type ThemeRequest = Request<{ sessionId: string }, any, { theme?: string }, { error?: string }>;
type ThemeResponse = Response;

// Define the default themes available
const defaultThemes = ['light', 'dark'];

// In-memory store for user session and theme mapping
const themeStore: Record<string, string> = {};

// Generate a unique session ID for each user
function generateSessionId(): string {
  return uuidv4();
}

// Set the user's theme
function setTheme(sessionId: string, theme: string): void {
  if (!defaultThemes.includes(theme)) {
    throw new Error('Invalid theme');
  }
  themeStore[sessionId] = theme;
}

// Get the user's current theme
function getTheme(sessionId: string): string | undefined {
  return themeStore[sessionId];
}

// Express application setup
const app = express();
app.use(express.json());

// Middleware to extract session ID from the request header
app.use((req: ThemeRequest, res: ThemeResponse, next) => {
  const sessionId = req.headers['x-session-id'] as string;
  if (!sessionId) {
    req.sessionId = generateSessionId();
  } else {
    req.sessionId = sessionId;
  }
  next();
});

// Route to switch the theme
app.post('/api/switch-theme', (req: ThemeRequest, res: ThemeResponse) => {
  try {
    const { theme } = req.body;
    if (!theme) {
      throw new Error('Theme not provided');
    }
    setTheme(req.sessionId, theme);
    res.json({ message: 'Theme switched successfully', theme });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Route to get the current theme
app.get('/api/get-theme', (req: ThemeRequest, res: ThemeResponse) => {
  const theme = getTheme(req.sessionId);
  if (!theme) {
    return res.status(404).json({ message: 'Theme not found' });
  }
  res.json({ theme });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Theme Switcher server listening on port ${PORT}`);
});