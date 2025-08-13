// 代码生成时间: 2025-08-14 03:41:28
import express from 'express';
import { Request, Response } from 'express';

// Define the MathToolkit class with methods for different mathematical operations
class MathToolkit {
  // Add two numbers
  static add(a: number, b: number): number {
    return a + b;
  }

  // Subtract two numbers
  static subtract(a: number, b: number): number {
    return a - b;
  }

  // Multiply two numbers
  static multiply(a: number, b: number): number {
    return a * b;
  }

  // Divide two numbers, with error handling for division by zero
  static divide(a: number, b: number): number | null {
    if (b === 0) {
      throw new Error('Cannot divide by zero');
    }
    return a / b;
  }
}

// Create an Express application
const app = express();

// Define the port number for the server
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Route to handle POST requests for mathematical operations
app.post('/math', (req: Request, res: Response) => {
  // Extract operation and operands from the request body
  const { operation, operand1, operand2 } = req.body;
  
  // Error handling for missing parameters
  if (!operation || operand1 === undefined || operand2 === undefined) {
    return res.status(400).json({
      error: 'Missing parameters'
    });
  }
  
  // Perform the operation based on the request
  let result: number | null = null;
  try {
    switch (operation) {
      case 'add':
        result = MathToolkit.add(operand1, operand2);
        break;
      case 'subtract':
        result = MathToolkit.subtract(operand1, operand2);
        break;
      case 'multiply':
        result = MathToolkit.multiply(operand1, operand2);
        break;
      case 'divide':
        result = MathToolkit.divide(operand1, operand2);
        break;
      default:
        return res.status(400).json({
          error: 'Invalid operation'
        });
    }
    
    // Send back the result of the operation
    res.json({
      result
    });
  } catch (error: any) {
    // Handle errors, such as division by zero
    res.status(500).json({
      error: error.message
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Math Toolkit server is running on port ${PORT}`);
});

// Export the app for testing purposes
export { app };
