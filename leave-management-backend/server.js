import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./src/routes/authRoutes.js";
import leaveRoutes from "./src/routes/leaveRoutes.js";
import notificationRoutes from "./src/routes/notificationRoutes.js";

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(bodyParser.json());

// Set default content type for all responses
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/notifications", notificationRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Leave Management System Backend Running" });
});

// Start server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

