import dotenv from "dotenv";
dotenv.config({ path: "../.env" }); // Use the actual path to your .env

import nodemailer from "nodemailer";

// Create a transporter using Gmail SMTP
export const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  port: process.env.PORT,// Use 465 for secure connections
  secure: true, // Use true for port 465, otherwise false
  auth: {
    user: process.env.USER,
    pass: process.env.PASS
  },
})