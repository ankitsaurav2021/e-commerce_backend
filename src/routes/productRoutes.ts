import express from 'express';
import { prisma } from "../db";

const router = express.Router();

router.post('/create', async (req, res) => {
  const { code, name, description, price, userId } = req.body; // Ensure userId is provided in the request body

  // Validate the input
  if (!code || !name || !price || !userId) {
    return res.status(400).json({ error: 'Code, name, price, and userId are required.' });
  }

  try {
    // Create a new product with a linked user
    const newProduct = await prisma.product.create({
      data: {
        code,
        name,
        description,
        price,
        user: {
          connect: { id: userId }, // Connect the product to an existing user by their ID
        },
      },
    });

    // Respond with the newly created product
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create product.' });
  }
});
// Add other CRUD routes (e.g., update, delete, get) as needed

export default router;
