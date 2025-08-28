// 代码生成时间: 2025-08-28 18:44:27
import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';

// Define the type for the available themes
type Theme = 'light' | 'dark';

// Define the possible themes
const AVAILABLE_THEMES: Theme[] = ['light', 'dark'];

// Create an Express application
const app = express();
const port = 3000;

// Middleware to parse cookies
app.use(cookieParser());

// Middleware to set the default theme to 'light' if no theme is set
app.use((req: Request, res: Response, next: Function) => {
  const theme = req.cookies.theme as Theme | undefined;
  if (!theme) {
    res.cookie('theme', 'light', { maxAge: 900000, httpOnly: true });
  }
  next();
});

// Set the theme middleware
app.use((req: Request, res: Response, next: Function) => {
  const theme = req.cookies.theme as Theme;
  res.locals.theme = theme;
  next();
});

// Route to handle theme switching
app.post('/api/switch-theme', (req: Request, res: Response) => {
  const theme: Theme = req.body.theme;
  if (!AVAILABLE_THEMES.includes(theme)) {
    return res.status(400).json({
      error: 'Invalid theme',
      message: 'The requested theme is not supported.'
    });
  }
  res.cookie('theme', theme, { maxAge: 900000, httpOnly: true });
  res.status(200).json({
    message: 'Theme switched successfully.',
    currentTheme: theme
  });
});

// Route to display the current theme
app.get('/api/current-theme', (req: Request, res: Response) => {
  const theme: Theme = req.cookies.theme as Theme;
  res.status(200).json({
    currentTheme: theme
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Theme switcher app listening at http://localhost:${port}`);
});
