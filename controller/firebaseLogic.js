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
    console.log("made it!!!")
    console.log(req.query)
    const filePath = req.query['video_path']
    const dateTime = giveCurrentDateTime();
    const fileName = req.query['file_name']
    const fileData = fs.readFileSync(filePath);
    const storageRef = ref(storage, `snapshots/${fileName + "_" + dateTime + ".mp4"}`);

    // Create file metadata including the content type
    const metadata = {
      contentType: "video/mp4",
    };

    const fileDataBuffer = toArrayBuffer(fileData)
    // Upload the file in the bucket storage
    const snapshot = await uploadBytesResumable(storageRef, fileDataBuffer);
    //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel
    // Grab the public url
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log("File successfully uploaded.");

    // const mailOptions = {
    //   from: "brain@gmail.com",
    //   to: "brian.kyounghoon.kim@gmail.com",
    //   subject: "Sending Email using Node.js",
    //   text: `Hey Brian, That was easy!`,
    //   attachments: [
    //     {
    //       filename: req.file.originalname,
    //       path: downloadURL,
    //     },
    //   ],
    // };

    // transporter.sendMail(mailOptions, function (error, info) {
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     console.log("Email sent: " + info.response);
    //   }
    // });

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
