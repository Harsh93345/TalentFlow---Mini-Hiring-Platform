import { Router } from "express";
import AssessmentResponse from "../models/AssessmentResponse.js";

const router = Router();

// GET /api/assessment-responses?assessmentId=...&candidateId=...
router.get("/", async (req, res) => {
  const { assessmentId, candidateId } = req.query as {
    assessmentId?: string;
    candidateId?: string;
  };

  const filter: Record<string, any> = {};
  if (assessmentId) filter.assessmentId = assessmentId;
  if (candidateId) filter.candidateId = candidateId;

  const items = await AssessmentResponse.find(filter)
    .sort({ createdAt: -1 })
    .lean();

  const normalized = items.map((e: any) => ({
    ...e,
    id: e._id?.toString(),
    assessmentId: e.assessmentId?.toString?.() ?? e.assessmentId,
    candidateId: e.candidateId?.toString?.() ?? e.candidateId,
  }));

  res.json(normalized);
});

// GET /api/assessment-responses/:id
router.get("/:id", async (req, res) => {
  const item = await AssessmentResponse.findById(req.params.id).lean();
  if (!item) return res.status(404).json({ message: "Not found" });
  const e = item as any;
  res.json({
    ...e,
    id: e._id?.toString(),
    assessmentId: e.assessmentId?.toString?.() ?? e.assessmentId,
    candidateId: e.candidateId?.toString?.() ?? e.candidateId,
  });
});

// POST /api/assessment-responses
router.post("/", async (req, res) => {
  try {
    const item = await AssessmentResponse.create(req.body);
    const e = item.toObject() as any;
    res.status(201).json({
      ...e,
      id: e._id?.toString(),
      assessmentId: e.assessmentId?.toString?.() ?? e.assessmentId,
      candidateId: e.candidateId?.toString?.() ?? e.candidateId,
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/assessment-responses/:id
router.put("/:id", async (req, res) => {
  try {
    const item = await AssessmentResponse.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).lean();
    if (!item) return res.status(404).json({ message: "Not found" });
    const e = item as any;
    res.json({
      ...e,
      id: e._id?.toString(),
      assessmentId: e.assessmentId?.toString?.() ?? e.assessmentId,
      candidateId: e.candidateId?.toString?.() ?? e.candidateId,
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/assessment-responses/:id
router.delete("/:id", async (req, res) => {
  await AssessmentResponse.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export default router;