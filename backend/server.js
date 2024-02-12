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

// const sendEmail = () => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: "brian.kyounghoon.kim@gmail.com",
//       pass: "nzws cjsq yapl gcfw",
//     },
//   });

//   const mailOptions = {
//     from: "brain@gmail.com",
//     to: "brian.kyounghoon.kim@gmail.com",
//     // to: client.emailAddress,
//     subject: "NBALAB X Kaiber",
//     html: `
//     <div class="email-container" style="background-color: white; max-width: 640px; position: fixed; font-family: Helvetica; color: black;">
//         <div class="header">
//           <img src="cid:headerImg" alt="" style="margin: .75rem 2.25rem;  width: 16rem; "/>
//         </div>
//         <div class="email-img">
//           <img src="cid:emailImg" alt="" style="width: 40rem;"/>
//         </div>
//         <div class="email-words" style="margin: 0rem 2rem;">
//           <h1 style="font-size: 32px;">Hey You,</h1>
//           <p style="margin: 0; font-size: 18px;">
//           Thanks for checking out our booth at NBA Crossover! We've attached your video from our live experience to this email. Enjoy the rest of the event! You can learn more about Kaiber at Kaiber.ai and learn more about NBALAB at NBALAB.com.
//           </p>
//           <p class="kaiber-description" style="color: #7c7c7c; font-size: 12px; margin: 2rem 0rem;">
//             Kaiber is an AI creative lab on a mission to empower people everywhere to
//             discover the artist within. We help creatives tell stories in a whole new
//             way through our generative art platform and creative studio. From music
//             videos and social media content to live event visuals and beyond, Kaiber
//             can transform your ideas into captivating multimedia experiences with
//             ease.
//           </p>
//           <p class="kaiber-description" style="color: #7c7c7c; font-size: 12px; margin: 2rem 0rem;">
//             NBALAB is a disruptive research and development incubator focused on innovative design, imaginative concepts and strategic partnerships. The NBALAB experiments with a variety of consumer goods and collaborates with hand-picked companies and individuals who are making noise in their respective fields.
//           </p>
//         </div>
//       </div>
//       `,
//     attachments: [
//       // {
//       //   filename: "NBALABxKAIBER.mp4",
//       //   path: downloadURL,
//       // },
//       {
//         filename: "emailLogo.jpg",
//         path: "./assets/emailLogo.jpg",
//         cid: "headerImg",
//       },
//       {
//         filename: "emailImage.jpg",
//         path: "./assets/emailImage.jpg",
//         cid: "emailImg",
//       },
//     ],
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

// app.use("/create-video", async (req, res) => {
//   console.log(req.body.video_id);
//   try {
//     // touchdesigner is running on localhost 9980
//     await axios.post("http://localhost:9980", {
//       video_id: req.body.video_id,
//     });
//     res.status(200).send("successful");
//   } catch (error) {
//     console.error("Error creating video:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

app.use("/api/videos", videoRoutes);

// static html
app.use(express.static("./dist"));

// listen to request
app.listen(port, () => {
  connectDB();
  console.log("server started", port);
});
