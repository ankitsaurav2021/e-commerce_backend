import express from "express";
import { prisma } from "../db";

const router = express.Router();

router.post("/create", async (req, res) => {
  const { productId, variantName, variantValue, priceModifier } = req.body;

  try {
    const variant = await prisma.variant.create({
      data: {
        productId,
        name: variantName,
        stock: variantValue,
        priceModifier,
      },
    });
    res.status(201).json(variant);
  } catch (error) {
    res.status(500).json({ error: "Failed to create variant." });
  }
});
// Add other CRUD routes (e.g., update, delete, get) as needed

export default router;
