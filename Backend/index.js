import fs from "fs";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const imagePath = "Backend/ng.png";
const imageMimeType = "image/png"; // Adjust if your image is a different type

// Read and encode the image as Base64
const imageBase64 = fs.readFileSync(imagePath, { encoding: "base64" });

// Construct the data URL
const imageDataUrl = `data:${imageMimeType};base64,${imageBase64}`;

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

async function main() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Updated model name
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
      // Optionally, set max_tokens if needed
      max_tokens: 500,
    });

    console.log(response.choices[0].message.content);

    const imageDescription = response.choices[0].message.content;

    await generateImage(imageDescription);
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
