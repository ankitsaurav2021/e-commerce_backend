import express from 'express';
import { register, login, users, editPassword } from '../api/user';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/edit', users);
router.put('/edit-password', editPassword);

export default router;
