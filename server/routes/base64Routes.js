import express from "express";
const router = express.Router();

import main from "../apiFunctions/generator.js";

router.post("/upload-base64", async function (req, res) {
  const { imageData, selectedStyle } = req.body;

  if (!imageData) {
    return res.status(400).json({ message: "No image data provided" });
  } else {
    const { absoluteURL, relativeURL } = await main(imageData, selectedStyle);

    res
      .status(200)
      .json({
        message: "Image uploaded",
        aiImg: relativeURL,
        aiPreview: absoluteURL,
      });
  }
});

export default router;
