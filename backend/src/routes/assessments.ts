import { Router } from "express";
import Assessment from "../models/Assessment.js";

const router = Router();

// GET /api/assessments?jobId=...
router.get("/", async (req, res) => {
  const { jobId } = req.query as { jobId?: string };

  const filter: Record<string, any> = {};
  if (jobId) filter.jobId = jobId;

  const assessments = await Assessment.find(filter)
    .sort({ createdAt: -1 })
    .lean();

  const normalized = assessments.map((a: any) => ({
    ...a,
    id: a._id?.toString(),
    jobId: a.jobId?.toString?.() ?? a.jobId,
  }));

  res.json(normalized);
});

// GET /api/assessments/by-job/:jobId (single assessment for job - for builder)
router.get("/by-job/:jobId", async (req, res) => {
  const assessment = await Assessment.findOne({ jobId: req.params.jobId }).lean();
  if (!assessment) return res.json(null);
  const a = assessment as any;
  res.json({ ...a, id: a._id?.toString(), jobId: a.jobId?.toString?.() ?? a.jobId });
});

// PUT /api/assessments/by-job/:jobId (upsert assessment for job)
router.put("/by-job/:jobId", async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const data = req.body;
    let assessment = await Assessment.findOneAndUpdate(
      { jobId },
      { ...data, jobId },
      { new: true, upsert: true }
    ).lean();
    const a = assessment as any;
    res.json({ ...a, id: a._id?.toString(), jobId: a.jobId?.toString?.() ?? a.jobId });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/assessments/:id
router.get("/:id", async (req, res) => {
  const assessment = await Assessment.findById(req.params.id).lean();
  if (!assessment) return res.status(404).json({ message: "Not found" });
  const a = assessment as any;
  res.json({ ...a, id: a._id?.toString(), jobId: a.jobId?.toString?.() ?? a.jobId });
});

// POST /api/assessments
router.post("/", async (req, res) => {
  try {
    const assessment = await Assessment.create(req.body);
    const a = assessment.toObject() as any;
    res.status(201).json({ ...a, id: a._id?.toString(), jobId: a.jobId?.toString?.() ?? a.jobId });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/assessments/:id
router.put("/:id", async (req, res) => {
  try {
    const assessment = await Assessment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).lean();
    if (!assessment) return res.status(404).json({ message: "Not found" });
    const a = assessment as any;
    res.json({ ...a, id: a._id?.toString(), jobId: a.jobId?.toString?.() ?? a.jobId });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/assessments/:id
router.delete("/:id", async (req, res) => {
  await Assessment.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export default router;