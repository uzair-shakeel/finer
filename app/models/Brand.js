import mongoose from "mongoose";

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a brand name"],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: [true, "Please provide a slug"],
      trim: true,
      unique: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

// Check if the model is already defined to prevent overwriting during hot reloads
export default mongoose.models.Brand || mongoose.model("Brand", BrandSchema);
