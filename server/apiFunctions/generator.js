import OpenAI from "openai/index.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { downloadImageStream } from "../fetch-script.js";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function main(base64code, stylePrompt) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "describe the person and their suroundings in the image",
            },
            {
              type: "image_url",
              image_url: {
                url: base64code,
                detail: "high",
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    const imageDescription = response.choices[0].message.content;

    const imgURL = await generateImage(imageDescription, stylePrompt); // Generate an image from the description
    console.log("from main function:", imgURL);
    return imgURL;
  } catch (error) {
    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Data:", error.response.data);
    } else {
      console.log("Error:", error.message);
    }
  }
}

async function generateImage(description, stylePrompt) {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Genarate an image with the following description: ${description} And style it like this: ${stylePrompt}`,
      n: 1,
      size: "1024x1024",
    });

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const image_url = response.data[0].url;

    // Usage
    const dateTtile = Date.now();

    const saveDirectory = path.join(__dirname, "images");
    const savePath = path.join(saveDirectory, dateTtile + ".png");

    // Ensure the directory exists
    if (!fs.existsSync(saveDirectory)) {
      fs.mkdirSync(saveDirectory);
    }

    downloadImageStream(image_url, savePath)
      .then(() => console.log("Image saved successfully using stream"))
      .catch((err) => console.error("Error downloading image:", err));

    return image_url;
  } catch (error) {
    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Data:", error.response.data);
    } else {
      console.log("Error:", error.message);
    }
  }
}
