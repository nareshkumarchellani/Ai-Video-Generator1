const button = document.getElementById("generate");

button.addEventListener("click", async () => {

    const prompt = document.getElementById("prompt").value;
    const duration = Number(document.getElementById("duration").value);
    const statusEl = document.getElementById("status");

    if (prompt.trim() === "") {
        alert("Please enter a prompt.");
        return;
    }

    statusEl.innerText = "Generating...";
    button.disabled = true;

    try {

        const response = await fetch(
            "https://ai-video-generator1.onrender.com/generate",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    prompt,
                    duration
                })
            }
        );

        const data = await response.json();

        if (!response.ok || data.status === "error") {
            throw new Error(data.message || "Video generation failed");
        }

        statusEl.innerText =
            `Task started. ID: ${data.job_id}`;

    } catch (error) {

        console.error("API Error:", error);

        statusEl.innerText = `Error: ${error.message}`;
        alert(error.message);

    } finally {

        button.disabled = false;

    }
});