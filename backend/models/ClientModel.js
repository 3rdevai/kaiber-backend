import mongoose from "mongoose";
import { nanoid } from "nanoid";

// let uniqueId =
//   Date.now().toString(36) + Math.random().toString(36).substring(2);

const clientSchema = new mongoose.Schema(
  {
    uniqueId: {
      type: String,
      required: true,
      default: () => nanoid(7),
      index: { unique: true },
    },
    clientName: {
      type: String,
      required: true,
    },
    emailAddress: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("clients", clientSchema);
