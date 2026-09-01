const API_URL = "https://ai-video-generator1.onrender.com";

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

// Naya generic function jo sabhi 4 providers ki keys ko test karega
export async function testProviderKey(provider) {
  try {
    const response = await fetch(`${API_URL}/test-provider`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Runway-Key": localStorage.getItem("runway_api_key") || "",
        "X-Veo-Key": localStorage.getItem("veo_api_key") || "",
        "X-Pixverse-Key": localStorage.getItem("pixverse_api_key") || "",
        "X-Hailuo-Key": localStorage.getItem("hailuo_api_key") || "",
      },
      body: JSON.stringify({ provider }),
    });

    const result = await response.json();

    if (!response.ok || result?.status === "error") {
      throw new Error(result?.message || `${provider} connection test failed`);
    }

    return result;
  } catch (error) {
    throw new Error(getErrorMessage(error, `${provider} connection test failed`));
  }
}

// Purana function backward compatibility ke liye rakha hai
export async function testRunwayKey(apiKey) {
  return testProviderKey("Runway");
}

export async function getGenerationStatus(provider, taskId) {
  try {
    const response = await fetch(`${API_URL}/generation-status/${provider}/${taskId}`, {
      headers: {
        "X-Runway-Key": localStorage.getItem("runway_api_key") || "",
        "X-Veo-Key": localStorage.getItem("veo_api_key") || "",
        "X-Pixverse-Key": localStorage.getItem("pixverse_api_key") || "",
        "X-Hailuo-Key": localStorage.getItem("hailuo_api_key") || "",
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