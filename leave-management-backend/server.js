import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./src/routes/authRoutes.js";
import leaveRoutes from "./src/routes/leaveRoutes.js";

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/leave", leaveRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("Leave Management System Backend Running");
});

// Start server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});