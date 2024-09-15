import express from 'express';
// import { createOrder } from '../api/order';
import { prisma } from "../db";
const router = express.Router();

// Function to cancel an order
router.post('/cancelOrder', async (req, res) => {

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
})

// Add other CRUD routes (e.g., update, delete, get) as needed

export default router;