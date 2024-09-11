import express from 'express';
import multer from 'multer';
import { bulkUploadProducts } from '../api/bulkUpload';

const router = express.Router();

// Setup multer for file handling
const upload = multer({ dest: 'uploads/' });

router.post('/products', upload.single('file'), bulkUploadProducts);

export default router;
