import mongoose from "mongoose";

const candidateNoteSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    mentions: { type: [String], default: [] },
  },
  { timestamps: { createdAt: true, updatedAt: false }, _id: true }
);

const candidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    stage: {
      type: String,
      enum: ["applied", "screen", "tech", "offer", "hired", "rejected"],
      default: "applied",
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    resume: { type: String },
    notes: { type: [candidateNoteSchema], default: [] },
  },
  { timestamps: true }
);

// Expose id for frontend (Mongo uses _id)
candidateSchema.set("toJSON", {
  virtuals: true,
  transform(_doc, ret: Record<string, unknown>) {
    (ret as Record<string, unknown>).id = (ret._id as { toString?: () => string })?.toString?.();
    delete (ret as Record<string, unknown>).__v;
    return ret;
  },
});

export default mongoose.model("Candidate", candidateSchema);
