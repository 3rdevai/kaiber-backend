import ClientModel from "../models/ClientModel.js";
import axios from "axios";

export const createClient = async (req, res) => {
  const { clientName, emailAddress } = req.body;
  console.log(req.body);

  if (!clientName || !emailAddress) {
    res.status(400);
    throw new Error("fields are required");
  }

  try {
    const client = await ClientModel.create({
      clientName,
      emailAddress,
    });


    let uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    // TODO: CREATE MONGODB RECORD HERE
    // somthing like mongo.addRecord(id: uniqueId, name: clientName, email: emailAddress)


    try {
      // touchdesigner is running on localhost 9980
      await axios.post("http://localhost:9980", {
        video_id: uniqueId
      });
      res.status(200).send("successful")
    } catch (error) {
      console.error("Error creating video:", error);
      res.status(500).json({ error: "Internal server error" });
    }

  } catch (error) {
    console.log(error);
    res.status(400);
    throw error;
  }
};
