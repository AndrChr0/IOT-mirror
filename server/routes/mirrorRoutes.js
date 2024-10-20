import express from "express";
import { createAiArt, getAllAiArt } from "../controllers/mirrorController.js";

const router = express.Router();

// POST request to create a new AI art entry
router.post("/", createAiArt);

// GET request to fetch all AI art entries
router.get("/", getAllAiArt);

export default router;
