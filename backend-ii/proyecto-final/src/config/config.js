import dotenv from "dotenv";

dotenv.config();

export const config = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  NODEMAILER_PASSWORD: process.env.NODEMAILER_PASSWORD,
};
