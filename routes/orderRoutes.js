import express from 'express';
import { createOrder } from '../api/order';

const router = express.Router();

router.post('/create', createOrder);
// Add other CRUD routes (e.g., update, delete, get) as needed

export default router;
