import express, { Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import csv from 'csv-parser';
import {prisma} from '../db'; // Ensure prisma is correctly imported

// Define upload storage with Multer
const upload = multer({ dest: 'uploads/' });
const router = express.Router();

// interface MulterRequest extends Request {
//   file?: Express.Multer.File;
// }

router.post('/upload', upload.single('file'), async (req, res: Response) => {
  const products: { code: string; name: string; description?: string; price: number }[] = [];
  const file = req.file ? `${req.file.destination}/${req.file.filename}` : undefined;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    fs.createReadStream(file)
      .pipe(csv())
      .on('data', (data) => {
        products.push({
          code: data.code,
          name: data.name,
          description: data.description,
          price: parseFloat(data.price),
        });
      })
      .on('end', async () => {
        for (const product of products) {
          try {
            const existingProduct = await prisma.product.findUnique({
              where: { code: product.code },
            });

            if (existingProduct) {
              await prisma.product.update({
                where: { code: product.code },
                data: {
                  name: product.name,
                  description: product.description,
                  price: product.price,
                },
              });
            } else {
              await prisma.product.create({
                data: {
                  code: product.code,
                  name: product.name,
                  description: product.description,
                  price: product.price,
                  user: { connect: { id: 1 } }, // Replace with correct user association
                },
              });
            }
          } catch (err) {
            console.error(`Error processing product ${product.code}:`, err);
          }
        }

        res.status(200).json({ message: 'Bulk upload processed successfully.' });
      });
  } catch (error) {
    console.error('Failed to process the bulk upload:', error);
    res.status(500).json({ error: 'Failed to process the bulk upload.' });
  }
});

export default router;
