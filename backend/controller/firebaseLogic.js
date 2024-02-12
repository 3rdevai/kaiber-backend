// import axios from "axios";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import fs from "fs";
import path from "path";
import firebaseApp from "../config/firebase.js";
import express from "express";
import nodemailer from "nodemailer";
import ClientModel from "../models/ClientModel.js";

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
  host: "smtp.postmarkapp.com",
  port: 2525,
  secure: false,
  auth: {
    user: "375c0274-22c1-4046-922d-b76805ef4fd7",
    pass: "375c0274-22c1-4046-922d-b76805ef4fd7"
  }
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
    const clientUniqueId = req.query["file_name"];

    const client = await ClientModel.findOne({
      uniqueId: clientUniqueId,
    });
    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

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
      from: "marketing@kaiber.ai",
      to: client.emailAddress,
      subject: "NBALAB X Kaiber",
      html: `
      <div class="email-container" style="background-color: white; max-width: 640px; position: fixed; font-family: Helvetica; color: black;">
        <div class="header">
          <img src="cid:headerImg" alt="" style="width: 30rem;"/>
        </div>
        <div class="email-img">
          <img src="cid:emailImg" alt="" style="width: 40rem;"/>
        </div>
        <div class="email-words" style="margin: 0rem 2rem;">
          <h1 style="font-size: 32px;">Hey ${client.clientName},</h1>
          <p style="margin: 0; font-size: 18px;">
            Thanks for checking out our booth at the NBA Crossover Event! We've attached your video from our live experience to this email. Enjoy the rest of the event! You can learn more about Kaiber at our website, Kaiber.ai.
          </p>
          <p class="kaiber-description" style="color: #7c7c7c; font-size: 12px; margin: 2rem 0rem;">
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
        {
          filename: "emailHeader.png",
          path: "../backend/assets/emailHeader.png",
          cid: "headerImg",
        },
        {
          filename: "emailImage.jpg",
          path: "../backend/assets/emailImage.jpg",
          cid: "emailImg",
        },
      ],
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
        console.log(`Email sent to ${client.emailAddress}`)
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
