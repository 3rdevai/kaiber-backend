import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connectDB = await mongoose.connect(process.env.MONGO_URL);
    console.log(`connected to ${connectDB.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};
