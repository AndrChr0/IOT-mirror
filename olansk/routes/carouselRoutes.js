import express from "express";
const router = express.Router();
import { getAllArt } from "../../backend/controllers/carouselController.js";

router.get("/", getAllArt);

export { router };
