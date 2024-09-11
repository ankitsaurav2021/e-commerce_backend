import prisma from '../prisma/schema.prisma'; // Adjust based on your project structure
import bcrypt from 'bcryptjs';

async function registerUser(req, res) {
  const { username, email, password, phoneNumber } = req.body;
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
        username,
        email,
        passwordHash,
        phoneNumber,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'User registration failed.' });
  }
}
