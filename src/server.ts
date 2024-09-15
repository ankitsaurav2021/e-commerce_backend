import express from "express";
import "dotenv/config";
import registerRoutes from "./routes/registerRoutes";
import loginRoutes from "./routes/loginRoutes";
import editRoutes from "./routes/editRoutes";
import editPasswordRoutes from "./routes/editPasswordRoutes";
import productRoutes from "./routes/productRoutes";
import variantRoutes from "./routes/variantRoutes";
import orderRoutes from "./routes/orderRoutes";
import cancelOrderRoutes from "./routes/cancelOrderRoutes";

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
app.use("/register", registerRoutes);
app.use("/login", loginRoutes);
app.use("/edit", editRoutes);
app.use("/editPassword/:id", editPasswordRoutes);
app.use("/create", productRoutes);
app.use("/variants", variantRoutes);
app.use("/orders", orderRoutes);
app.use("/cancelOrders", cancelOrderRoutes);
app.use("/bulk-upload", bulkUploadRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
