import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import videoRoutes from "./routes/videoRoute.js";
import clientRoutes from "./routes/clientRoute.js";
import nodemailer from "nodemailer";

dotenv.config();

// express
const app = express();
const port = process.env.PORT || 8080;

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/api/clients", clientRoutes);

app.use("/send-email", async (req, res) => {
  try {
    const { firstName, email } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "brian.kyounghoon.kim@gmail.com",
        pass: "nzws cjsq yapl gcfw",
      },
    });

    await transporter.sendMail({
      from: "brian.kyounghoon.kim@gmail.com",
      to: email,
      subject: "Hello world",
      text: `Hello ${firstName},\n\nThis is a test email.`,
    });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.use("/api/videos", videoRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/clients", (req, res) => {
  res.json(req.body);
});

// listen to request
app.listen(port, () => {
  connectDB();
  console.log("server started", port);
});
