import type {
  DetectResponse,
  SelectTargetResponse,
  TrainResponse,
  UploadResponse,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail ?? "Request failed");
  }
  return response.json();
}

export async function uploadDataset(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/api/upload`, {
    method: "POST",
    body: formData,
  });

  return handleResponse<UploadResponse>(response);
}

export async function detectDataset(file: File): Promise<DetectResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/api/detect`, {
    method: "POST",
    body: formData,
  });

  return handleResponse<DetectResponse>(response);
}

export async function selectTarget(
  sessionId: string,
  targetColumn: string
): Promise<SelectTargetResponse> {
  const response = await fetch(`${API_BASE}/api/select-target`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, target_column: targetColumn }),
  });

  return handleResponse<SelectTargetResponse>(response);
}

export async function trainModel(sessionId: string): Promise<TrainResponse> {
  const response = await fetch(`${API_BASE}/api/train`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId }),
  });

  return handleResponse<TrainResponse>(response);
}

export async function getResult(sessionId: string): Promise<TrainResponse> {
  const response = await fetch(`${API_BASE}/api/result/${sessionId}`);
  return handleResponse<TrainResponse>(response);
}
