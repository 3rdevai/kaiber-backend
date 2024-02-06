import mongoose from "mongoose";

// let uniqueId =
//   Date.now().toString(36) + Math.random().toString(36).substring(2);

const clientSchema = new mongoose.Schema(
  {
    uniqueId: {
      type: String,
      unique: true, // Ensure uniqueness
      required: true,
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

clientSchema.pre("save", function (next) {
  if (!this.uniqueId) {
    this.uniqueId =
      Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
  next();
});

export default mongoose.model("clients", clientSchema);
