import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
    },
    tags: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    description: { type: String },
    location: { type: String },
    department: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);