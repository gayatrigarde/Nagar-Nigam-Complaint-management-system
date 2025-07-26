import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB Connected Successfully");
    console.log("Connected Host:", conn.connection.host); 
  } catch (err) {
    console.error("MongoDB Connection Failed:", err.message);
    process.exit(1); 
  }
};

export default connectDB;
