import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDb = async (): Promise<void> => {
  try {
    const connectionString = process.env.CONNECTION_STRING;
    if (!connectionString) {
      throw new Error(
        "CONNECTION_STRING is not defined in environment variables"
      );
    }

    console.log("Attempting to connect to MongoDB...");
    console.log("Connection string (masked):", connectionString.split('@')[1]); // Log without credentials
    
    const connect = await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
      family: 4, // Use IPv4, skip trying IPv6
      maxPoolSize: 10,
      retryWrites: true,
    });

    console.log(
      `Database connected: ${connect.connection.host}, ${connect.connection.name}`
    );
  } catch (error) {
    console.error("Database connection error:");
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    } else {
      console.error("Unknown error:", error);
    }
    process.exit(1);
  }
};

export default connectDb;