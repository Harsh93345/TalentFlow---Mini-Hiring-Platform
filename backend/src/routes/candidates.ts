import { Router } from "express";
import Candidate from "../models/Candidate.js";
import CandidateTimeline from "../models/CandidateTimeline.js";

const router = Router();

// GET /api/candidates (with optional pagination and filters: page, pageSize, search, stage)
router.get("/", async (req, res) => {
  try {
    const {
      search = "",
      stage = "",
      page = "1",
      pageSize = "50",
    } = req.query as Record<string, string>;

    const filter: Record<string, unknown> = {};
    if (stage) filter.stage = stage;

    let candidates = await Candidate.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    if (search) {
      const s = search.toLowerCase();
      candidates = candidates.filter(
        (c: any) =>
          c.name?.toLowerCase().includes(s) ||
          c.email?.toLowerCase().includes(s)
      );
    }

    const total = candidates.length;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const size = Math.min(100, Math.max(1, parseInt(pageSize, 10) || 50));
    const start = (pageNum - 1) * size;
    const data = candidates.slice(start, start + size);

    const normalized = data.map((c: any) => ({
      ...c,
      id: c._id?.toString(),
      jobId: c.jobId?.toString?.() ?? c.jobId,
    }));

    res.json({
      data: normalized,
      total,
      page: pageNum,
      pageSize: size,
      totalPages: Math.ceil(total / size),
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/candidates/:id/timeline (must be before /:id)
router.get("/:id/timeline", async (req, res) => {
  const items = await CandidateTimeline.find({ candidateId: req.params.id })
    .sort({ createdAt: -1 })
    .lean();
  const normalized = items.map((e: any) => ({
    ...e,
    id: e._id?.toString(),
    candidateId: e.candidateId?.toString?.() ?? e.candidateId,
  }));
  res.json(normalized);
});

// GET /api/candidates/:id
router.get("/:id", async (req, res) => {
  const candidate = await Candidate.findById(req.params.id).lean();
  if (!candidate) return res.status(404).json({ message: "Not found" });
  const c = candidate as any;
  res.json({
    ...c,
    id: c._id?.toString(),
    jobId: c.jobId?.toString?.() ?? c.jobId,
  });
});

// POST /api/candidates
router.post("/", async (req, res) => {
  try {
    const candidate = await Candidate.create(req.body);
    const c = candidate.toObject() as any;
    res.status(201).json({
      ...c,
      id: c._id?.toString(),
      jobId: c.jobId?.toString?.() ?? c.jobId,
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/candidates/:id
router.put("/:id", async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).lean();
    if (!candidate) return res.status(404).json({ message: "Not found" });
    const c = candidate as any;
    res.json({
      ...c,
      id: c._id?.toString(),
      jobId: c.jobId?.toString?.() ?? c.jobId,
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH /api/candidates/:id (updates stage and optionally adds timeline entry)
router.patch("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body as Record<string, unknown>;
    const candidate = await Candidate.findById(id);
    if (!candidate) return res.status(404).json({ message: "Not found" });

    const prevStage = candidate.stage;
    if (updates.stage && updates.stage !== prevStage) {
      await CandidateTimeline.create({
        candidateId: id,
        type: "stage_change",
        fromStage: prevStage,
        toStage: updates.stage as string,
        description: `Moved from ${prevStage} to ${updates.stage}`,
      });
    }

    const updated = await Candidate.findByIdAndUpdate(id, updates, {
      new: true,
    }).lean();
    const c = updated as any;
    res.json({
      ...c,
      id: c._id?.toString(),
      jobId: c.jobId?.toString?.() ?? c.jobId,
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/candidates/:id
router.delete("/:id", async (req, res) => {
  await Candidate.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export default router;
