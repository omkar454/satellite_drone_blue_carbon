import express from "express";
import multer from "multer";
import { uploadToPinata } from "../controllers/ipfsController.js";

const router = express.Router();
const upload = multer();

router.post("/upload", upload.single("file"), uploadToPinata);

export default router;
