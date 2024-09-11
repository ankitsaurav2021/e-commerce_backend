async function createVariant(req, res) {
  const { productId, variantName, variantValue, priceModifier } = req.body;

  try {
    const variant = await prisma.variant.create({
      data: {
        productId,
        variantName,
        variantValue,
        priceModifier,
      },
    });
    res.status(201).json(variant);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create variant.' });
  }
}
