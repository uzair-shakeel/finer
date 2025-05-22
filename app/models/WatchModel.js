import mongoose from "mongoose";

const WatchModelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a model name"],
      trim: true,
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: [true, "Please provide a brand ID"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create a compound index to ensure uniqueness of model names within a brand
WatchModelSchema.index({ name: 1, brandId: 1 }, { unique: true });

// Check if the model is already defined to prevent overwriting during hot reloads
export default mongoose.models.WatchModel ||
  mongoose.model("WatchModel", WatchModelSchema);
