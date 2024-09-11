import express from 'express';
import { createProduct } from '../api/product';

const router = express.Router();

router.post('/create', createProduct);
// Add other CRUD routes (e.g., update, delete, get) as needed

export default router;
