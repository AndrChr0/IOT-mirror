import express from "express";
import { createAiArt, getAllAiArt, getLatestArt } from "../controllers/mirrorController.js";

const router = express.Router();

// POST request to create a new AI art entry
router.post("/", createAiArt);

// GET request to fetch all AI art entries
router.get("/", getAllAiArt);

// GET request to fetch latest AI art entry
router.get("/new", getLatestArt);

export default router;
