// 代码生成时间: 2025-09-15 21:58:41
import express, { Request, Response } from 'express';
import { InventoryItem } from './models/InventoryItem'; // Assuming an InventoryItem model

// Define the inventory array that will simulate our database
let inventory: InventoryItem[] = [];

// Create an Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// GET endpoint to retrieve all inventory items
app.get('/inventory', (req: Request, res: Response) => {
  try {
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST endpoint to add a new inventory item
app.post('/inventory', (req: Request, res: Response) => {
  try {
    const newItem: InventoryItem = {
      id: inventory.length + 1,
      ...req.body
    };
    inventory.push(newItem);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT endpoint to update an existing inventory item
app.put('/inventory/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const index = inventory.findIndex(item => item.id.toString() === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    inventory[index] = {
      ...inventory[index],
      ...req.body
    };
    res.status(200).json(inventory[index]);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE endpoint to remove an inventory item
app.delete('/inventory/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const index = inventory.findIndex(item => item.id.toString() === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    inventory.splice(index, 1);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Inventory Management System is running on port ${PORT}`);
});

// Export the app for testing purposes
export default app;