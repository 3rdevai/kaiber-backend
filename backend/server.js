import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import videoRoutes from "./routes/videoRoute.js";
import clientRoutes from "./routes/clientRoute.js";
import videoControlRouter from "./controller/firebaseLogic.js";
import nodemailer from "nodemailer";
import ClientModel from "./models/ClientModel.js";
import axios from "axios";

dotenv.config();

// express
const app = express();
const port = process.env.PORT || 8080;

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/api/clients", clientRoutes);

app.use("/upload-video", videoControlRouter);

app.use("/send-video", async (req, res) => {
  console.log(req.query);

  res.status(200).send("success");
});

app.use("/create-video", async (req, res) => {
  console.log(req.body.video_id);
  try {
    // touchdesigner is running on localhost 9980
    await axios.post("http://localhost:9980", {
      video_id: req.body.video_id,
    });
    res.status(200).send("successful");
  } catch (error) {
    console.error("Error creating video:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.use("/api/videos", videoRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

// listen to request
app.listen(port, () => {
  connectDB();
  console.log("server started", port);
});
