import mongoose from "mongoose";

const assessmentResponseSchema = new mongoose.Schema(
  {
    assessmentId: {
      type: mongoose.Schema.Types.Mixed, // ObjectId or string from frontend
      ref: "Assessment",
      required: true,
    },
    candidateId: {
      type: String, // ObjectId string or 'candidate-temp' for previews
      required: true,
    },
    responses: {
      type: mongoose.Schema.Types.Mixed, // Record<string, any>
      default: {},
    },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model(
  "AssessmentResponse",
  assessmentResponseSchema
);