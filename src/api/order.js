import { PrismaClient } from './prisma/prismaClient.js';
const prisma = new PrismaClient();

// Function to create an order
export async function createOrder(req, res) {
  const { userId, items } = req.body; // userId and items are expected from the request body

  if (!userId || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Invalid order data' });
  }

  try {
    // Fetch user to ensure the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const { productId, variantId, quantity } = item;

      // Find the product and variant
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { variants: true },
      });

      if (!product) {
        return res.status(404).json({ error: `Product with ID ${productId} not found` });
      }

      // Check if a variant is selected and fetch its price
      let price = product.price;
      if (variantId) {
        const variant = await prisma.variant.findUnique({
          where: { id: variantId },
        });

        if (!variant || variant.productId !== productId) {
          return res.status(404).json({ error: `Variant with ID ${variantId} not found for the product` });
        }

        // Adjust price based on the variant
        price += variant.priceModifier;
      }

      totalAmount += price * quantity;

      // Prepare the order item
      orderItems.push({
        productId,
        variantId,
        quantity,
        price: price * quantity,
      });
    }

    // Create the order with items
    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        orderItems: {
          create: orderItems,
        },
      },
      include: {
        orderItems: true,
      },
    });

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create order' });
  }
}

// Function to cancel an order
export async function cancelOrder(req, res) {
  const { orderId, userId } = req.body; // orderId and userId are expected from the request body

  if (!orderId || !userId) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  try {
    // Fetch the order to ensure it exists
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if the order belongs to the user and is still pending
    if (order.userId !== userId) {
      return res.status(403).json({ error: 'You can only cancel your own orders' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Order cannot be canceled after acceptance' });
    }

    // Update the order status to canceled
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'cancelled' },
    });

    res.json({ message: 'Order canceled successfully', order: updatedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
}
