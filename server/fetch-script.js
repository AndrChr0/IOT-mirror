import fetch from "node-fetch";
import fs from "fs";

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

export { downloadImageStream };
