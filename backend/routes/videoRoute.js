import express from "express";
import { createVideo } from "../controller/videoController.js";

const router = express.Router();

router.post("/", createVideo);

export default router;
