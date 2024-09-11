import csv from 'csv-parser';
import fs from 'fs';

async function bulkUpload(req, res) {
  const file = req.file.path; // Assuming file is uploaded via middleware

  const products = [];
  fs.createReadStream(file)
    .pipe(csv())
    .on('data', (row) => products.push(row))
    .on('end', async () => {
      try {
        for (const product of products) {
          const existingProduct = await prisma.product.findUnique({
            where: { productCode: product.productCode },
          });

          if (existingProduct) {
            await prisma.product.update({
              where: { productCode: product.productCode },
              data: { name: product.name, price: parseFloat(product.price) },
            });
          } else {
            await prisma.product.create({
              data: {
                sellerId: parseInt(product.sellerId),
                productCode: product.productCode,
                name: product.name,
                description: product.description,
                price: parseFloat(product.price),
              },
            });
          }
        }
        res.json({ message: 'Bulk upload completed successfully.' });
      } catch (error) {
        res.status(500).json({ error: 'Bulk upload failed.' });
      }
    });
}
