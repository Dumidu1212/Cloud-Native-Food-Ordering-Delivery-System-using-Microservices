import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import logger, { errorHandler } from "./utils/logger.js";

dotenv.config();
console.log("🔍 Loaded MONGODB_URI:", process.env.MONGODB_URI); // debug log

const app = express();
const { info, error } = logger;

app.use(cors());
app.use(express.json());

// Health-check
app.get("/health", (_req, res) => res.sendStatus(200));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users/admin", adminRoutes);

// Global error handler
app.use(errorHandler);

// Connect and start
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    info("🗄️ Connected to MongoDB");
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => info(`👤 User Service listening on port ${PORT}`));
  })
  .catch((err) => {
    error("❌ Mongo connection error:", err);
    process.exit(1);
  });

export default app;
