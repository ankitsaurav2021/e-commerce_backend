import express from 'express';
import { createVariant } from '../api/variant';

const router = express.Router();

router.post('/create', createVariant);
// Add other CRUD routes (e.g., update, delete, get) as needed

export default router;
