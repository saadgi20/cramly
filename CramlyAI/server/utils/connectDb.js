import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URI || process.env.MONGODB_URL;

    if (!mongoUrl) {
      throw new Error("MONGODB_URL is missing from server/.env");
    }

    await mongoose.connect(mongoUrl);

    console.log("DB Connected");
  } catch (error) {
    console.error("DB Error:", error.message);
  }
};

export default connectDb;
