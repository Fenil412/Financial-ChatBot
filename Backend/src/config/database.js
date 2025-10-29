/**
 * Database Connection Configuration
 * Handles MongoDB connection setup
 */

import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";

/**
 * Connect to MongoDB database
 * @returns {Promise<void>}
 */
const connectDatabase = async () => {
  try {
    // Connect to MongoDB using connection string from environment
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );

    console.log(
      `✅ MongoDB Connected Successfully!`
    );
    console.log(`📍 Database Host: ${connectionInstance.connection.host}`);
    console.log(`📦 Database Name: ${connectionInstance.connection.name}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDatabase;
