import express from "express";
const router = express.Router();
import fs from "fs";

import main from "../apiFunc/generator.js";

router.post("/upload-base64", (req, res) => {
  const { imageData } = req.body;

  if (!imageData) {
    return res.status(400).json({ message: "No image data provided" });
  } else {
    main(imageData);

    res.status(200).json({ message: "Image uploaded" });
  }
});

export default router;
