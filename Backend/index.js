import fs from "fs";
import OpenAI from "openai";
import dotenv from "dotenv";
import express from "express";
import {connectDB} from "./utils/connectDB.js";

dotenv.config();

// Set up express server
const PORT = process.env.PORT || 3101;
const app = express();
app.use(express.json());
connectDB();

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const imagePath = "./ng.png";
const imageMimeType = "image/png";

// Read and encode the image as Base64
const imageBase64 = fs.readFileSync(imagePath, { encoding: "base64" });

// Construct the data URL
const imageDataUrl = `data:${imageMimeType};base64,${imageBase64}`;

// Function to generate an image from a the image description
async function generateImage(description) {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: description,
      n: 1,
      size: "1024x1024",
    });
    const image_url = response.data[0].url;
    console.log(image_url);
  } catch (error) {
    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Data:", error.response.data);
    } else {
      console.log("Error:", error.message);
    }
  }
}

// function to generate a description of the image
async function main() {
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
                url: imageDataUrl,
                detail: "high",
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    console.log(response.choices[0].message.content);

    const imageDescription = response.choices[0].message.content;

    await generateImage(imageDescription); // Generate an image from the description
  } catch (error) {
    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Data:", error.response.data);
    } else {
      console.log("Error:", error.message);
    }
  }
}

main();
