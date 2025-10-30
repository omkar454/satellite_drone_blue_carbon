import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import polygonRoutes from "./routes/polygonRoutes.js";
import ndviRoutes from "./routes/ndviRoutes.js";
import ipfsRoutes from "./routes/ipfsRoutes.js";

// Load environment variables
dotenv.config({ path: "../.env" });

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/polygons", polygonRoutes);
app.use("/api/ndvi", ndviRoutes);
app.use("/api/ipfs", ipfsRoutes);

// Serve frontend (React build)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../public")));

app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../public", "index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
