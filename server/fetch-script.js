// const fetch = require('node-fetch');
// const fs = require('fs');
// const path = require('path');

import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function downloadImageStream(url, savePath) {
  const response = await fetch(url);
  console.log(response);
  if (!response.ok)
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);

  const fileStream = fs.createWriteStream(savePath);
  return new Promise((resolve, reject) => {
    response.body.pipe(fileStream);
    response.body.on("error", (err) => {
      reject(err);
    });
    fileStream.on("finish", () => {
      resolve();
    });
  });
}

// Usage
// const imageUrl =
//   "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/2010-kodiak-bear-1.jpg/1200px-2010-kodiak-bear-1.jpg";
// const saveDirectory = path.join(__dirname, "images");
// const savePath = path.join(saveDirectory, "kodiak-bear-stream.jpg");

// // Ensure the directory exists
// if (!fs.existsSync(saveDirectory)) {
//   fs.mkdirSync(saveDirectory);
// }

// downloadImageStream(imageUrl, savePath)
//   .then(() => console.log("Image saved successfully using stream"))
//   .catch((err) => console.error("Error downloading image:", err));

export { downloadImageStream };
