import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export const connectDB = async () => {
  try {
    const connectDB = await mongoose.connect(
      "mongodb+srv://bkim:nOHpM9uv5SyIQyGJ@cluster0.g9wtbae.mongodb.net/kaiber-snapshot-videos?retryWrites=true&w=majority"
    );
    console.log(`connected to ${connectDB.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};
