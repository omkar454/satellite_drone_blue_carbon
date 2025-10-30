import mongoose from "mongoose";
import dotenv from "dotenv";


dotenv.config(
    {
        path:"../.env"
    }
);
const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://omkar454:OmRaut04@cluster0.fz5ewqo.mongodb.net/mrv_polygon"
    );
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
