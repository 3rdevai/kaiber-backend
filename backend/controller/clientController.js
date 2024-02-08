import ClientModel from "../models/ClientModel.js";
import axios from "axios";
import { nanoid } from "nanoid";

export const createClient = async (req, res) => {
  const { clientName, emailAddress } = req.body;
  console.log(req.body);

  if (!clientName || !emailAddress) {
    res.status(400);
    throw new Error("fields are required");
  }

  try {
    let uniqueId = nanoid(7);
    
    const client = await ClientModel.create({
      clientName: clientName,
      emailAddress: emailAddress,
      uniqueId: uniqueId,
    });

    try {
      // touchdesigner is running on localhost 9980
      await axios.post("http://localhost:9980", {
        video_id: uniqueId,
      });
      res.status(200).send("successful");
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
