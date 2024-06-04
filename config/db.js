import mongoose from "mongoose";
import logger from "./logger.js";

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGODB_URI}`);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  
  } catch (err) {
    console.error(err);
    logger.error(err.message);
  }
};

export default connectDb;
