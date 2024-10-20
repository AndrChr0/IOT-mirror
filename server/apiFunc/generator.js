import OpenAI from "openai/index.js";
import dotenv from "dotenv";
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

    console.log(response.choices[0].message.content);

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
    const image_url = response.data[0].url;
    // console.log(image_url);
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
