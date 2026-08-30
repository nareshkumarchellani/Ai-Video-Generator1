from fastapi import APIRouter
from services.video_service import generate_video_service

router = APIRouter()


@router.post("/generate-video")
async def generate_video(data: dict):
    return await generate_video_service(data)