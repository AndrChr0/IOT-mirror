import express from "express";
const router = express.Router();
import { getAllArt } from "../controllers/carouselController.js";

router.get("/", getAllArt);

export { router };
