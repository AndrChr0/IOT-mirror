import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Connects to mongoDB Atlas, using the connection link in the .env file
        const conn = await mongoose.connect(process.env.MONGO_URI, console.log("Connected to MongoDB"));
    } catch (error) {
        console.log("Error connecting to MongoDB", error);
        // Exit process with failure
        process.exit(1);
    }
};


export {connectDB};