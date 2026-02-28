import { Router } from "express";
import Job from "../models/Job.js";

const router = Router();

// GET /api/jobs (with optional pagination: page, pageSize, search, status, sort)
router.get("/", async (req, res) => {
  try {
    const {
      search = "",
      status = "",
      page = "1",
      pageSize = "10",
      sort = "order",
    } = req.query as Record<string, string>;

    let query: Record<string, unknown> = {};
    if (status) query.status = status;

    let jobs = await Job.find(query)
      .sort(sort === "order" ? { order: 1 } : { createdAt: -1 })
      .lean();

    if (search) {
      const s = search.toLowerCase();
      jobs = jobs.filter(
        (job: any) =>
          job.title?.toLowerCase().includes(s) ||
          (Array.isArray(job.tags) && job.tags.some((t: string) => t.toLowerCase().includes(s)))
      );
    }

    const total = jobs.length;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const size = Math.min(100, Math.max(1, parseInt(pageSize, 10) || 10));
    const start = (pageNum - 1) * size;
    const data = jobs.slice(start, start + size);

    // Send id for frontend (Mongo uses _id)
    const normalized = data.map((j: any) => ({
      ...j,
      id: j._id?.toString(),
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

// GET /api/jobs/:id
router.get("/:id", async (req, res) => {
  const job = await Job.findById(req.params.id).lean();
  if (!job) return res.status(404).json({ message: "Not found" });
  const j = job as any;
  res.json({ ...j, id: j._id?.toString() });
});

// POST /api/jobs
router.post("/", async (req, res) => {
  try {
    const job = await Job.create(req.body);
    const j = job.toObject();
    res.status(201).json({ ...j, id: j._id?.toString() });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/jobs/:id
router.put("/:id", async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).lean();
    if (!job) return res.status(404).json({ message: "Not found" });
    const j = job as any;
    res.json({ ...j, id: j._id?.toString() });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH /api/jobs/:id (same as PUT for partial updates)
router.patch("/:id", async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).lean();
    if (!job) return res.status(404).json({ message: "Not found" });
    const j = job as any;
    res.json({ ...j, id: j._id?.toString() });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH /api/jobs/:id/reorder
router.patch("/:id/reorder", async (req, res) => {
  try {
    const { fromOrder, toOrder } = req.body as { fromOrder: number; toOrder: number };
    const id = req.params.id;
    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ message: "Not found" });

    await Job.findByIdAndUpdate(id, { order: toOrder });
    const delta = fromOrder < toOrder ? -1 : 1;
    await Job.updateMany(
      {
        _id: { $ne: id },
        order: fromOrder < toOrder
          ? { $gte: fromOrder + 1, $lte: toOrder }
          : { $gte: toOrder, $lte: fromOrder - 1 },
      },
      { $inc: { order: delta } }
    );

    const updated = await Job.findById(id).lean();
    const j = updated as any;
    res.json({ ...j, id: j._id?.toString() });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/jobs/:id
router.delete("/:id", async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export default router;