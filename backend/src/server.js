import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import polygonRoutes from "./routes/polygonRoutes.js";
import ndviRoutes from "./routes/ndviRoutes.js";
import ipfsRoutes from "./routes/ipfsRoutes.js";

dotenv.config(
    {
        path:"../.env"
    }
); // no need for custom path unless .env is outside root
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/polygons", polygonRoutes);
app.use("/api/ndvi", ndviRoutes);
app.use("/api/ipfs", ipfsRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
