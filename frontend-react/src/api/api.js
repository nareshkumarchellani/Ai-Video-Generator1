const API_URL = "http://127.0.0.1:8000";

export async function generateVideo(data) {

  try {

    const response = await fetch(`${API_URL}/generate-video`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        "X-Runway-Key":
          localStorage.getItem("runway_api_key") || "",

        "X-Veo-Key":
          localStorage.getItem("veo_api_key") || "",

        "X-PixVerse-Key":
          localStorage.getItem("pixverse_api_key") || "",

        "X-Hailuo-Key":
          localStorage.getItem("hailuo_api_key") || "",
      },

      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Video generation failed");
    }

    if (result.status === "error") {
      throw new Error(result.message);
    }

    return result;

  } catch (error) {

    console.error("API Error:", error);
    throw error;

  }
}


export async function testRunwayKey() {
  const response = await fetch(
    `${API_URL}/runway/account`,
    {
      headers: {
        "X-Runway-Key":
          localStorage.getItem("runway_api_key") || "",
      },
    }
  );

  return await response.json();
}

export async function getGenerationStatus(
  provider,
  taskId,
) {

  const response = await fetch(
    `${API_URL}/generation-status/${provider}/${taskId}`,
    {

      headers: {

        "X-Runway-Key":
          localStorage.getItem("runway_api_key") || "",

      },

    }
  );

  return await response.json();

}