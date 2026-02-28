import { Router } from "express";
import CandidateTimeline from "../models/CandidateTimeline.js";

const router = Router();

// GET /api/candidate-timeline?candidateId=...
router.get("/", async (req, res) => {
  const { candidateId } = req.query as { candidateId?: string };

  const filter: Record<string, any> = {};
  if (candidateId) filter.candidateId = candidateId;

  const items = await CandidateTimeline.find(filter)
    .sort({ createdAt: -1 })
    .exec();

  res.json(items);
});

// POST /api/candidate-timeline
router.post("/", async (req, res) => {
  try {
    const item = await CandidateTimeline.create(req.body);
    res.status(201).json(item);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/candidate-timeline/:id
router.delete("/:id", async (req, res) => {
  await CandidateTimeline.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export default router;