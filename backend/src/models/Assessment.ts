import mongoose from "mongoose";

const assessmentQuestionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "single-choice",
        "multi-choice",
        "short-text",
        "long-text",
        "numeric",
        "file-upload",
      ],
      required: true,
    },
    question: { type: String, required: true },
    description: { type: String },
    required: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    options: { type: [String] },
    validation: {
      min: { type: Number },
      max: { type: Number },
      maxLength: { type: Number },
    },
    conditionalLogic: {
      dependsOnQuestionId: { type: String },
      showWhen: { type: mongoose.Schema.Types.Mixed },
    },
  },
  { _id: false }
);

const assessmentSectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    questions: { type: [assessmentQuestionSchema], default: [] },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const assessmentSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.Mixed, // ObjectId or string (e.g. 'job-1')
      ref: "Job",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    sections: { type: [assessmentSectionSchema], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Assessment", assessmentSchema);