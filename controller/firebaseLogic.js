// import axios from "axios";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import multer from "multer";
import express from "express";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: `${process.env.FIREBASE_API_KEY}`,
  authDomain: "kaiber-upload-video.firebaseapp.com",
  projectId: "kaiber-upload-video",
  storageBucket: "kaiber-upload-video.appspot.com",
  messagingSenderId: "788658960989",
  appId: "1:788658960989:web:b9d3168a16a1ad4909abb4",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const router = express.Router();

const storage = getStorage(firebaseApp);

// handle multer as middleware to upload videos
const upload = multer({ storage: multer.memoryStorage() });

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

router.post("/", upload.single("filename"), async (req, res) => {
  try {
    const dateTime = giveCurrentDateTime();

    const storageRef = ref(
      storage,
      `files/${req.file.originalname + "       " + dateTime}`
    );

    // Create file metadata including the content type
    const metadata = {
      contentType: req.file.mimetype,
    };

    // Upload the file in the bucket storage
    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );
    //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

    // Grab the public url
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log("File successfully uploaded.");
    return res.send({
      message: "file uploaded to firebase storage",
      name: req.file.originalname,
      type: req.file.mimetype,
      downloadURL: downloadURL,
    });
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

export default router;
