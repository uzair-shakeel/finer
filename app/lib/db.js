import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  console.log("Connecting to MongoDB...");
  
  if (cached.conn) {
    console.log("Using cached database connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log("Creating new database connection");
    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("MongoDB connected successfully");
        return mongoose;
      })
      .catch((err) => {
        console.error("MongoDB connection error:", err);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("Failed to connect to MongoDB:", e);
    throw e;
  }

  return cached.conn;
}

export default connectDB;
