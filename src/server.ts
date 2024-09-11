import express from "express";
import "dotenv/config";
// import prisma from './prisma/prismaClient'; // Assume you have your Prisma client setup
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import variantRoutes from "./routes/variantRoutes";
import orderRoutes from "./routes/orderRoutes";
import bulkUploadRoutes from "./routes/bulkUploadRoutes";

const app = express();

// Middleware to parse JSON
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ msg: "Hello!!!" });
});

app.get("/try/:id", (req, res) => {
  return res.status(201).json({ msg: "User created" });
});

// Routes
app.use("/api", userRoutes);
app.use("/api/login", userRoutes);
app.use("/api/edit", userRoutes);
app.use("/api/edit-password", userRoutes);
app.use("/api/create", productRoutes);
app.use("/api/variants", variantRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/bulk-upload", bulkUploadRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
