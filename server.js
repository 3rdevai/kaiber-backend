import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import videoRoutes from "./routes/videoRoute.js";
import clientRoutes from "./routes/clientRoute.js";
import videoControlRouter from "./controller/firebaseLogic.js";

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

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "brian.kyounghoon.kim@gmail.com",
//     pass: process.env.NODEMAILER_PW,
//   },
// });

// const sendEmail = async () => {
//   const mailOptions = {
//     from: "brain@gmail.com",
//     to: "brian.kyounghoon.kim@gmail.com",
//     subject: "Sending Email using Node.js",
//     text: "That was easy!",
//   };

//   transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log("Email sent: " + info.response);
//     }
//   });
// };

// sendEmail();

app.use("/api/videos", videoRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

// listen to request
app.listen(port, () => {
  connectDB();
  console.log("server started", port);
});
