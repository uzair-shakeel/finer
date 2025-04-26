import mongoose from "mongoose";

const PriceHistorySchema = new mongoose.Schema({
  price: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const ConditionSchema = new mongoose.Schema(
  {
    hasBox: {
      type: Boolean,
      default: false,
    },
    hasPapers: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

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
      type: String,
      trim: true,
    },
    condition: {
      type: ConditionSchema,
      default: { hasBox: false, hasPapers: false },
    },
    price: {
      type: String,
      required: [true, "Please provide a price"],
    },
    originalPrice: {
      type: String,
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
    // Specification fields
    itemCode: {
      type: String,
      trim: true,
    },
    caseSize: {
      type: [String],
      default: [],
    },
    caseMaterial: {
      type: [String],
      default: [],
    },
    dialColour: {
      type: [String],
      default: [],
    },
    bracelet: {
      type: [String],
      default: [],
    },
    movement: {
      type: [String],
      default: [],
    },
    waterResistance: {
      type: Boolean,
      default: false,
    },
    priceHistory: {
      type: [PriceHistorySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Check if the model is already defined to prevent overwriting during hot reloads
export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
