from fastapi import FastAPI
from pydantic import BaseModel
import uuid

from providers.hf_provider import HuggingFaceProvider

provider = HuggingFaceProvider()

app = FastAPI(
    title="Flow AI",
    version="1.0.0",
    description="Free AI Video Generator"
)

# Temporary storage
jobs = {}

# Request Model
class VideoRequest(BaseModel):
    prompt: str
    duration: int = 5


@app.get("/")
def home():
    return {"message": "Welcome to Flow AI"}


@app.get("/health")
def health():
    return {"status": "OK"}


@app.post("/generate")
def generate(request: VideoRequest):

    job_id = str(uuid.uuid4())

    # Provider ko call karo
    result = provider.generate_video(
        request.prompt,
        request.duration
    )

    # Job save karo
    jobs[job_id] = {
        "status": result["status"],
        "provider": result["provider"],
        "model": result["model"],
        "prompt": request.prompt,
        "duration": request.duration,
        "video": result["video"]
    }

    return {
        "job_id": job_id,
        "status": result["status"]
    }


@app.get("/status/{job_id}")
def status(job_id: str):

    if job_id not in jobs:
        return {"error": "Job not found"}

    return jobs[job_id]