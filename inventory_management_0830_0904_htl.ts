// 代码生成时间: 2025-08-30 09:04:03
import express from 'express';
import { Request, Response } from 'express';

// 创建库存管理的Express应用
const app = express();
const PORT = process.env.PORT || 3000;

// 库存数据，用于演示，实际应用中应使用数据库
interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
}

const inventory: InventoryItem[] = [
  { id: 1, name: 'Widget', quantity: 100 },
  { id: 2, name: 'Gadget', quantity: 50 },
];

// 获取所有库存项
app.get('/api/inventory', (req: Request, res: Response) => {
  try {
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ error: 'Unable to retrieve inventory' });
  }
});

// 获取单个库存项
app.get('/api/inventory/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const item = inventory.find(i => i.id.toString() === id);
  if (!item) {
    res.status(404).json({ error: 'Item not found' });
  } else {
    res.status(200).json(item);
  }
});

// 添加库存项
app.post('/api/inventory', (req: Request, res: Response) => {
  const newItem: InventoryItem = req.body;
  try {
    if (!newItem.name || newItem.quantity <= 0) {
      res.status(400).json({ error: 'Invalid item data' });
      return;
    }
    newItem.id = inventory.length + 1;
    inventory.push(newItem);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Unable to add item to inventory' });
  }
});

// 更新库存项
app.put('/api/inventory/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const itemIndex = inventory.findIndex(i => i.id.toString() === id);
  if (itemIndex === -1) {
    res.status(404).json({ error: 'Item not found' });
  } else {
    const updatedItem = req.body;
    try {
      inventory[itemIndex] = {
        ...inventory[itemIndex],
        ...updatedItem,
      };
      res.status(200).json(inventory[itemIndex]);
    } catch (error) {
      res.status(500).json({ error: 'Unable to update item' });
    }
  }
});

// 删除库存项
app.delete('/api/inventory/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const itemIndex = inventory.findIndex(i => i.id.toString() === id);
  if (itemIndex === -1) {
    res.status(404).json({ error: 'Item not found' });
  } else {
    inventory.splice(itemIndex, 1);
    res.status(200).json({ message: 'Item removed' });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Inventory Management System running on port ${PORT}`);
});
