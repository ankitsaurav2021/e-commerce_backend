import express from "express";
import { prisma } from "../db";
import bcrypt from "bcryptjs";

const router = express.Router();

router.put("/edit", async (req, res) => {
  const { id, role } = req.body;

  try {
    const updatedUser = await prisma.user.update({

      where: { id: parseInt(id) },
      data: { id, role },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user details.' });
  }
}
);


export default router;