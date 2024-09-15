import express from "express";
import { prisma } from "../db";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/login", async (req, res) =>{
  const { email, password } = req.body;

 try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ error: "Login failed." });
  }
});

export default router;
