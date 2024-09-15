import express from "express";
import { prisma } from "../db";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { id, email, password, name, role } = req.body;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,16}$/;

  // Validation
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ error: 'Password does not meet criteria.' });
  }

  // Hash Password
  const passwordHash = await bcrypt.hash(password, 10);

  // Create User
  try {
    const user = await prisma.user.create({
      data: {
        id,
        email,
        password,
        name,
        role,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'User registration failed.' });
  }
});

export default router;
