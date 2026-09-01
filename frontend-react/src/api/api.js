const API_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "");

function getErrorMessage(error, fallback = "Request failed") {
  if (error instanceof Error && error.message) {
    if (error.message === "Failed to fetch") {
      return `Network error: could not reach ${API_URL}. Check the backend URL, server status, and CORS configuration.`;
    }

    return error.message;
  }

  return fallback;
}

export async function generateVideo(data) {
  try {
    const response = await fetch(`${API_URL}/generate-video`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Runway-Key": localStorage.getItem("runway_api_key") || "",
        "X-Veo-Key": localStorage.getItem("veo_api_key") || "",
        "X-Pixverse-Key": localStorage.getItem("pixverse_api_key") || "",
        "X-Hailuo-Key": localStorage.getItem("hailuo_api_key") || "",
      },
      body: JSON.stringify(data),
    });

    let result = null;

    try {
      const text = await response.text();
      result = text ? JSON.parse(text) : null;
    } catch {
      result = { message: "Unexpected server response." };
    }

    if (!response.ok) {
      const backendMessage =
        result?.detail ||
        result?.message ||
        `Request failed with status ${response.status}`;
      throw new Error(backendMessage);
    }

    if (result?.status === "error") {
      throw new Error(result.message || "Video generation failed");
    }

    return result;
  } catch (error) {
    const message = getErrorMessage(error, "Video generation failed");
    console.error("API Error:", error);
    throw new Error(message);
  }
}

export async function testRunwayKey(apiKey) {
  try {
    const response = await fetch(`${API_URL}/runway/account`, {
      headers: {
        "X-Runway-Key": apiKey || localStorage.getItem("runway_api_key") || "",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.message || "Runway account check failed");
    }

    return result;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Runway account check failed"));
  }
}

export async function getGenerationStatus(provider, taskId) {
  try {
    const response = await fetch(`${API_URL}/generation-status/${provider}/${taskId}`, {
      headers: {
        "X-Runway-Key": localStorage.getItem("runway_api_key") || "",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.message || "Could not fetch generation status");
    }

    return result;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Could not fetch generation status"));
  }
}
