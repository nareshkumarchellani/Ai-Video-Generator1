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
        const response = await fetch("http://127.0.0.1:8000/generate-video", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt,
                model: "Runway Gen-4",
                duration: `${duration} sec`,
                ratio: "16:9",
            })
        });

        const data = await response.json();

        if (!response.ok || data.status === "error") {
            throw new Error(data.message || "Video generation failed");
        }

        if (data.status === "accepted") {
            statusEl.innerText = `Task started. ID: ${data.task_id}`;
            return;
        }

        statusEl.innerText = data.message || "Request sent";

    } catch (error) {
        statusEl.innerText = `Error: ${error.message}`;
        alert(error.message);
    } finally {
        button.disabled = false;
    }

});
