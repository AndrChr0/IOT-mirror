import mongoose from "mongoose";

const aiArtSchema = new mongoose.Schema({
  generation_date: {
    type: Date,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  art_style: {
    type: String,
    required: true,
  },
});

// module.exports = mongoose.model("aiArt", aiArtSchema);
export default mongoose.model("aiArt", aiArtSchema);
