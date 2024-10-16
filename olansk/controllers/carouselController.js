import aiArt from "../models/aiArt.js";

const getAllArt = async (req, res) => {
  try {
    const showAiArt = await aiArt.find();
    if (!showAiArt) {
      return res.status(404).send("No art found");
    }
    res.status(200).json(showAiArt);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export { getAllArt };
