import express from "express";
// import { register, login, users, editPassword } from "../api/user";
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
router.post("/login", async (req, res) =>{
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  // Generate JWT or session handling
  res.json({ message: 'Login successful', user });
}
);
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
