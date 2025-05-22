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
    status: {
      type: String,
      enum: ["New", "Excellent", "Very Good", "Good", "Fair", "Poor"],
      default: "Good",
    },
    details: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

// Define schema for additional images with order information
const AdditionalImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
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
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    model: {
      type: String,
      required: [true, "Please provide a model"],
      trim: true,
    },
    modelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WatchModel",
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
      default: { hasBox: false, hasPapers: false, status: "Good" },
    },
    price: {
      type: String,
      required: [true, "Please provide a price"],
    },
    discountedPrice: {
      type: String,
    },
    originalPrice: {
      type: String,
    },
    discount: {
      type: String,
    },
    rrpStatus: {
      type: String,
      enum: ["Regular", "Discounted", "Discontinued", "Hidden"],
      default: "Regular",
    },
    description: {
      type: String,
      trim: true,
    },
    subdescription: {
      type: String,
      trim: true,
    },
    pageTitle: {
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
      type: [AdditionalImageSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ["live", "archive", "draft", "sold_out", "reserved", "in_stock"],
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
      unique: true,
    },
    caseSize: {
      type: String,
      default: "",
    },
    caseMaterial: {
      type: String,
      default: "",
    },
    dialColour: {
      type: String,
      default: "",
    },
    bracelet: {
      type: String,
      default: "",
    },
    braceletLength: {
      type: String,
      trim: true,
    },
    movement: {
      type: String,
      default: "",
    },
    waterResistance: {
      type: Boolean,
      default: false,
    },
    depth: {
      type: String,
      default: "100m",
    },
    depthCustom: {
      type: String,
      trim: true,
    },
    // New fields
    extra: {
      type: String,
      trim: true,
    },
    // Private CRM fields (not shown to customers)
    purchasePrice: {
      type: String,
      trim: true,
    },
    serialNumber: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
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
