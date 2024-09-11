async function createProduct(req, res) {
  const { sellerId, productCode, name, description, price } = req.body;

  try {
    const product = await prisma.product.create({
      data: {
        sellerId,
        productCode,
        name,
        description,
        price,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product.' });
  }
}
