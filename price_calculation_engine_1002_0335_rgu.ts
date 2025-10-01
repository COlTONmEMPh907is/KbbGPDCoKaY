// 代码生成时间: 2025-10-02 03:35:21
import express from 'express';
import { Request, Response } from 'express';

// Define the type for the price calculation request
interface PriceCalculationRequest {
  basePrice: number;
  discountRate: number;
  quantity: number;
}

// Define the type for the price calculation response
interface PriceCalculationResponse {
  totalCost: number;
  discountAmount: number;
  finalPrice: number;
}

class PriceCalculationEngine {
  // Calculate the total cost after applying discount
  public calculatePrice(basePrice: number, discountRate: number, quantity: number): PriceCalculationResponse {
    const discountAmount = basePrice * discountRate;
    const finalPrice = basePrice - discountAmount;
    const totalCost = finalPrice * quantity;

    return {
      totalCost: totalCost,
      discountAmount: discountAmount * quantity,
      finalPrice: finalPrice,
    };
  }
}

// Create a new express application
const app = express();

// Middleware to parse JSON body
app.use(express.json());

// Define the endpoint for price calculation
app.post('/calculate-price', (req: Request, res: Response) => {
  try {
    // Validate the request body
    const { basePrice, discountRate, quantity } = req.body;
    if (typeof basePrice !== 'number' || typeof discountRate !== 'number' || typeof quantity !== 'number') {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    // Create an instance of the price calculation engine
    const engine = new PriceCalculationEngine();

    // Perform the price calculation
    const result = engine.calculatePrice(basePrice, discountRate, quantity);

    // Send back the result as a response
    res.json(result);
  } catch (error) {
    // Handle any unexpected errors
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Set the port and start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Price Calculation Engine running on port ${PORT}`);
});