import mongoose from "mongoose";

const candidateTimelineSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "stage_change",
        "note_added",
        "assessment_completed",
        "interview_scheduled",
      ],
      required: true,
    },
    fromStage: { type: String },
    toStage: { type: String },
    description: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model(
  "CandidateTimeline",
  candidateTimelineSchema
);