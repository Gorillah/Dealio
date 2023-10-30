import mongoose from "mongoose";

let isConnected = false; // Variable to track connection status

export const connectDB = async () => {
  mongoose.set("strictQuery", true);
  // mongoose.set("bufferTimeoutMS", 30000);

  if (!process.env.MONGODB_URI) return console.log("MongoDB URI not found");

  if (isConnected) return console.log("using existing connection");

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("Connected to db");
  } catch (error) {
    console.log(error);
  }
};
