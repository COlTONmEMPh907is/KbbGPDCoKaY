// 代码生成时间: 2025-10-03 18:45:46
import express, { Request, Response } from 'express';
import { Pool } from './pool'; // Import the Pool model

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Define the mining pool routes
const poolRouter = express.Router();

// Add a new mining pool
poolRouter.post('/pools', async (req: Request, res: Response) => {
  try {
    const pool = new Pool(req.body.name, req.body.capacity, req.body.hashrate);
    await pool.save();
    res.status(201).json(pool);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all mining pools
poolRouter.get('/pools', async (req: Request, res: Response) => {
  try {
    const pools = await Pool.find();
    res.status(200).json(pools);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific mining pool by ID
poolRouter.get('/pools/:id', async (req: Request, res: Response) => {
  try {
    const pool = await Pool.findById(req.params.id);
    if (!pool) {
      res.status(404).json({ message: 'Pool not found' });
      return;
    }
    res.status(200).json(pool);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a mining pool
poolRouter.put('/pools/:id', async (req: Request, res: Response) => {
  try {
    const pool = await Pool.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pool) {
      res.status(404).json({ message: 'Pool not found' });
      return;
    }
    res.status(200).json(pool);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a mining pool
poolRouter.delete('/pools/:id', async (req: Request, res: Response) => {
  try {
    const pool = await Pool.findByIdAndDelete(req.params.id);
    if (!pool) {
      res.status(404).json({ message: 'Pool not found' });
      return;
    }
    res.status(200).json({ message: 'Pool deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Use the pool routes
app.use('/api', poolRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
