// import axios from "axios";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import fs from "fs";
import firebaseApp from "../config/firebase.js";
import express from "express";
import nodemailer from "nodemailer";
import ClientModel from "../models/ClientModel.js";
import headerImg from "../assets/emailHeader.png";
import emailImg from "../assets/emailImage.jpg";

// Initialize Firebase

const router = express.Router();

const storage = getStorage(firebaseApp);

const giveCurrentDateTime = () => {
  const today = new Date();
  const date = `${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDay()}`;
  const time = `${today.getHours()}-${
    today.getMinutes() + 1
  }-${today.getSeconds()}`;
  const dateTime = `${date} ${time}`;

  return dateTime;
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "brian.kyounghoon.kim@gmail.com",
    pass: "nzws cjsq yapl gcfw",
  },
});

function toArrayBuffer(buffer) {
  const arrayBuffer = new ArrayBuffer(buffer.length);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return arrayBuffer;
}

router.get("/", async (req, res) => {
  try {
    console.log("made it!!!");
    const clientUniqueId = req.query["file_name"];

    console.log(clientUniqueId);

    const client = await ClientModel.findOne({
      uniqueId: clientUniqueId,
    });
    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    console.log(req.query);
    const filePath = req.query["video_path"];
    const dateTime = giveCurrentDateTime();
    const fileName = req.query["file_name"];
    const fileData = fs.readFileSync(filePath);
    const storageRef = ref(
      storage,
      `snapshots/${fileName + "_" + dateTime + ".mp4"}`
    );

    // Create file metadata including the content type
    const metadata = {
      contentType: "video/mp4",
    };

    const fileDataBuffer = toArrayBuffer(fileData);
    // Upload the file in the bucket storage
    const snapshot = await uploadBytesResumable(storageRef, fileDataBuffer);
    //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel
    // Grab the public url
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log("File successfully uploaded.");

    // QUERY MONGODB USING THE "ID" FIELD. FROM CLIENTCONTROLLER.JS L20.

    const mailOptions = {
      from: "brain@gmail.com",
      // to: "brian.kyounghoon.kim@gmail.com",
      to: client.emailAddress,
      subject: "NBALAB X Kaiber",
      html: `
      <style>
    .email-container {
  background: white;
  color: black;
  max-width: 640px;
  font-family: Arial, Helvetica, sans-serif;
  }

  .header {
  img {
  width: 30rem;
  }
  }

  .email-img {
  img {
  width: 40rem;
  margin: 0;
  }
  }
  .email-words {
  margin: 0rem 2rem;

  h1 {
  font-size: 36px;
  }
  p {
  margin: 0;
  font-size: 18px;
  }

  .kaiber-description {
  color: #7c7c7c;
  font-size: 12px;
  margin: 2rem 0rem;
  }
  }
</style>
<div class="email-container">
  <div class="header">
    <img src=${headerImg} alt="" />
  </div>
  <div class="email-img">
    <img src=${emailImg} alt="" />
  </div>
  <div class="email-words">
    <h1>Hey ${client.clientName},</h1>
    <p>Thank you for your experience with Kaiber snapshot!</p>
    <br />
    <p>
      We've attached your video to this email. Hope you enjoy the video and
      visit our site Kaiber.ai!
    </p>

    <p class="kaiber-description">
      Kaiber is an AI creative lab on a mission to empower people everywhere to
      discover the artist within. We help creatives tell stories in a whole new
      way through our generative art platform and creative studio. From music
      videos and social media content to live event visuals and beyond, Kaiber
      can transform your ideas into captivating multimedia experiences with
      ease.
    </p>
  </div>
</div>

      `,
      attachments: [
        {
          filename: "NBALABxKAIBER.mp4",
          path: downloadURL,
        },
      ],
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    return res.send({
      message: "file uploaded to firebase storage",
      // name: req.file.originalname,
      // type: req.file.mimetype,
      downloadURL: downloadURL,
    });
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

export default router;
