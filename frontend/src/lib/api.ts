const API_BASE = "/api";

async function handleRes(res: Response) {
  if (!res.ok) {
    const msg = (await res.json().catch(() => ({})))?.message || res.statusText;
    throw new Error(msg || "Request failed");
  }
  return res.json();
}

// ——— Jobs ———
export async function fetchJobs(params?: {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
}) {
  const q = new URLSearchParams();
  if (params?.search) q.set("search", params.search);
  if (params?.status) q.set("status", params.status);
  if (params?.page != null) q.set("page", String(params.page));
  if (params?.pageSize != null) q.set("pageSize", String(params.pageSize));
  if (params?.sort) q.set("sort", params.sort);
  const url = q.toString() ? `${API_BASE}/jobs?${q}` : `${API_BASE}/jobs`;
  return fetch(url).then(handleRes);
}

export async function fetchJob(id: string) {
  return fetch(`${API_BASE}/jobs/${id}`).then(handleRes);
}

export async function createJob(body: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleRes(res);
}

export async function updateJob(id: string, body: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/jobs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleRes(res);
}

export async function patchJob(id: string, body: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/jobs/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleRes(res);
}

export async function reorderJob(
  id: string,
  body: { fromOrder: number; toOrder: number }
) {
  const res = await fetch(`${API_BASE}/jobs/${id}/reorder`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleRes(res);
}

export async function deleteJob(id: string) {
  const res = await fetch(`${API_BASE}/jobs/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete job");
}

// ——— Candidates ———
export async function fetchCandidates(params?: {
  search?: string;
  stage?: string;
  jobId?: string;
  page?: number;
  pageSize?: number;
}) {
  const q = new URLSearchParams();
  if (params?.search) q.set("search", params.search);
  if (params?.stage) q.set("stage", params.stage);
  if (params?.jobId) q.set("jobId", params.jobId);
  if (params?.page != null) q.set("page", String(params.page));
  if (params?.pageSize != null) q.set("pageSize", String(params.pageSize));
  const url = q.toString()
    ? `${API_BASE}/candidates?${q}`
    : `${API_BASE}/candidates`;
  return fetch(url).then(handleRes);
}

export async function fetchCandidate(id: string) {
  return fetch(`${API_BASE}/candidates/${id}`).then(handleRes);
}

export async function fetchCandidateTimeline(candidateId: string) {
  return fetch(`${API_BASE}/candidates/${candidateId}/timeline`).then(
    handleRes
  );
}

export async function createCandidate(body: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/candidates`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleRes(res);
}

export async function updateCandidate(
  id: string,
  body: Record<string, unknown>
) {
  const res = await fetch(`${API_BASE}/candidates/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleRes(res);
}

export async function patchCandidate(
  id: string,
  body: Record<string, unknown>
) {
  const res = await fetch(`${API_BASE}/candidates/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleRes(res);
}

export async function deleteCandidate(id: string) {
  const res = await fetch(`${API_BASE}/candidates/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete candidate");
}

// ——— Assessments ———
export async function fetchAssessments(jobId?: string) {
  const url = jobId
    ? `${API_BASE}/assessments?jobId=${encodeURIComponent(jobId)}`
    : `${API_BASE}/assessments`;
  return fetch(url).then(handleRes);
}

export async function fetchAssessmentById(id: string) {
  return fetch(`${API_BASE}/assessments/${id}`).then(handleRes);
}

export async function fetchAssessmentByJobId(jobId: string) {
  const res = await fetch(`${API_BASE}/assessments/by-job/${jobId}`);
  return res.json();
}

export async function upsertAssessmentByJobId(
  jobId: string,
  body: Record<string, unknown>
) {
  const res = await fetch(`${API_BASE}/assessments/by-job/${jobId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleRes(res);
}

export async function createAssessment(body: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/assessments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleRes(res);
}

export async function updateAssessment(
  id: string,
  body: Record<string, unknown>
) {
  const res = await fetch(`${API_BASE}/assessments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleRes(res);
}

export async function deleteAssessment(id: string) {
  const res = await fetch(`${API_BASE}/assessments/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete assessment");
}

// ——— Assessment responses ———
export async function fetchAssessmentResponses(params?: {
  assessmentId?: string;
  candidateId?: string;
}) {
  const q = new URLSearchParams();
  if (params?.assessmentId) q.set("assessmentId", params.assessmentId);
  if (params?.candidateId) q.set("candidateId", params.candidateId);
  const url = q.toString()
    ? `${API_BASE}/assessment-responses?${q}`
    : `${API_BASE}/assessment-responses`;
  return fetch(url).then(handleRes);
}

export async function createAssessmentResponse(body: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/assessment-responses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleRes(res);
}

export async function updateAssessmentResponse(
  id: string,
  body: Record<string, unknown>
) {
  const res = await fetch(`${API_BASE}/assessment-responses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleRes(res);
}
