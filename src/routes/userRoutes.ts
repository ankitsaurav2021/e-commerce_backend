import express from "express";
// import { register, login, users, editPassword } from "../api/user";
import { prisma } from "../db";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/edit", users);

router.put("/edit-password/:id", async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,16}$/;

  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({ error: "Password does not meet criteria." });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  try {
    await prisma.user.update({
      where: { id: parseInt(id) },
      data: { password: passwordHash },
    });
    res.json({ message: "Password updated successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to update password." });
  }
});

export default router;
