import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.log("The DATABASE_URL environment variable is not set.");
  throw new Error("The DATABASE_URL environment variable is not set.");
}

async function connectDatabase() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log("Connected to MongoDB with Mongoose");
  } catch (error) {
    console.log("Error connecting to MongoDB with Mongoose", error);
  }
}

async function disconnectDatabase() {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.log("Error disconnecting from MongoDB", error);
  }
}

export { connectDatabase, disconnectDatabase };
