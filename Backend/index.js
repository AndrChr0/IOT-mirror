// import dotenv from "dotenv";

// dotenv.config();

// // Retrieve the OpenAI API key correctly
// const apiKey = process.env.OPENAI_API_KEY;

// console.log("OpenAI API key:", apiKey);
// console.log("Loaded environment variables:", process.env);

import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// const apiKey = process.env.API_KEY;

console.log("OpenAI API key:", process.env.API_KEY);

async function main() {
  //   const prompt = "A white siamese cat"; // Replace this with your desired prompt

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "a spooky ghost in the shape of a pumpkin",
      n: 1,
      size: "1024x1024",
    });

    let image_url = response.data[0].url;
    console.log(response.data[0]);
    console.log("Generated image URL:", image_url);
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
