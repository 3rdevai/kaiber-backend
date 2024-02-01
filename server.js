import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import videoRoutes from "./routes/videoRoute.js";

dotenv.config();

// express
const app = express();
const port = process.env.PORT || 8080;

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/api/videos", videoRoutes);

// listen to request
app.listen(port, () => {
  connectDB();
  console.log("server started", port);
});
