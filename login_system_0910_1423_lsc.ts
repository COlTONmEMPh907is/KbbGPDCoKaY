// 代码生成时间: 2025-09-10 14:23:40
import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";

// Middleware to validate login data
const validateLogin = [
    check("username").isLength({ min: 5 }).withMessage("Username must be at least 5 characters long"),
    check("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
];

// Sample user object for demonstration purposes
const userDatabase = {
    "user1": "password123"
};

const app = express();

// Define the port number
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Define the login route
app.post("/login", validateLogin, (req: Request, res: Response) => {
    // Extract the username and password from the request body
    const { username, password } = req.body;

    // Check if the username and password are valid
    if (userDatabase[username] && userDatabase[username] === password) {
        res.status(200).json({ message: "Login successful" });
    } else {
        res.status(401).json({ message: "Invalid username or password" });
    }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: Function) => {
    // Check if the error is from express-validator
    if (err.name === "ValidationError") {
        // Format the error messages from express-validator
        const errors = validationResult(req).array().map((error) => error.msg);
        res.status(400).json({ errors });
    } else {
        // For any other errors, send a 500 status code
        res.status(500).json({ message: "Internal server error" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
