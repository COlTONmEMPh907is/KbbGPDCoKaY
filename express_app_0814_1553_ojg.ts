// 代码生成时间: 2025-08-14 15:53:25
import express, { Request, Response, NextFunction } from 'express';
import { Product } from './models/Product';

// Create an instance of the Express application
const app = express();
const port = 3000;

// Middleware to parse request bodies
app.use(express.json());

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Define a route to create a new product
app.post('/products', async (req: Request, res: Response) => {
  try {
    const product = new Product(req.body.name, req.body.price);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Failed to create product' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

/*
 * Product.ts
 * A simple model representing a product.
 */

import mongoose from 'mongoose';

interface ProductInterface {
  name: string;
  price: number;
}

const productSchema = new mongoose.Schema<ProductInterface>({
  name: { type: String, required: true },
  price: { type: Number, required: true }
});

// Export the model
export const Product = mongoose.model<ProductInterface>('Product', productSchema);