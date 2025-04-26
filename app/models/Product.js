import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: [true, "Please provide a brand"],
      trim: true,
    },
    model: {
      type: String,
      required: [true, "Please provide a model"],
      trim: true,
    },
    reference: {
      type: String,
      trim: true,
    },
    year: {
      type: Number,
    },
    condition: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Please provide a price"],
    },
    originalPrice: {
      type: Number,
    },
    discount: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, "Please provide an image URL"],
    },
    backsideImageUrl: {
      type: String,
    },
    additionalImages: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["live", "archive", "draft"],
      default: "draft",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Check if the model is already defined to prevent overwriting during hot reloads
export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
