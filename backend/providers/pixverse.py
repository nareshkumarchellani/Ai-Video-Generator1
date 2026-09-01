import asyncio
import re
import uuid

import requests

from .base import BaseProvider

# Official PixVerse Platform API.
# Docs: https://docs.platform.pixverse.ai/
API_BASE = "https://app-api.pixverse.ai/openapi/v2"

# status: 1 = success, 5 = processing/queued,
# 7 = content moderation failure, 8 = generation failed
STATUS_MAP = {
    1: "success",
    5: "processing",
    7: "failed",
    8: "failed",
}


def _parse_duration(options: dict) -> int:
    raw = str(options.get("duration", "5 sec"))
    match = re.search(r"\d+", raw)
    seconds = int(match.group()) if match else 5
    return 8 if seconds >= 8 else 5


class PixVerseProvider(BaseProvider):

    async def generate(self, prompt, options):

        api_key = options.get("pixverse_api_key", "")
        if not api_key:
            return {
                "status": "error",
                "provider": "PixVerse",
                "message": "PixVerse API Key not provided"
            }

        payload = {
            "aspect_ratio": options.get("ratio", "16:9"),
            "duration": _parse_duration(options),
            "model": "v6",
            "prompt": prompt,
            "quality": "720p",
            "seed": 0,
        }

        try:
            data = await asyncio.to_thread(self._create_task, api_key, payload)

            if data.get("ErrCode"):
                return {
                    "status": "error",
                    "provider": "PixVerse",
                    "message": data.get("ErrMsg", "Failed to start generation"),
                }

            video_id = data.get("Resp", {}).get("video_id")

            return {
                "status": "accepted",
                "provider": "PixVerse",
                "task_id": str(video_id),
                "message": "Generation Started",
            }

        except Exception as e:
            return {
                "status": "error",
                "provider": "PixVerse",
                "message": str(e),
            }

    def _create_task(self, api_key, payload):
        response = requests.post(
            f"{API_BASE}/video/text/generate",
            headers={
                "API-KEY": api_key,
                "Ai-trace-id": str(uuid.uuid4()),
                "Content-Type": "application/json",
            },
            json=payload,
            timeout=30,
        )
        return response.json()

    async def get_status(self, task_id, api_key):

        if not api_key:
            return {
                "status": "error",
                "provider": "PixVerse",
                "message": "PixVerse API Key missing",
            }

        try:
            data = await asyncio.to_thread(self._get_result, api_key, task_id)

            if data.get("ErrCode"):
                return {
                    "status": "error",
                    "provider": "PixVerse",
                    "task_id": task_id,
                    "message": data.get("ErrMsg", "Status check failed"),
                }

            resp = data.get("Resp", {})
            raw_status = resp.get("status")
            status = STATUS_MAP.get(raw_status, "processing")

            if status == "success":
                return {
                    "status": "success",
                    "provider": "PixVerse",
                    "task_id": task_id,
                    "video": resp.get("url"),
                }

            if status == "failed":
                return {
                    "status": "failed",
                    "provider": "PixVerse",
                    "task_id": task_id,
                    "message": "Video generation failed or was blocked by content moderation",
                }

            return {
                "status": "processing",
                "provider": "PixVerse",
                "task_id": task_id,
                "video": None,
            }

        except Exception as e:
            return {
                "status": "error",
                "provider": "PixVerse",
                "message": str(e),
            }

    def _get_result(self, api_key, task_id):
        response = requests.get(
            f"{API_BASE}/video/result/{task_id}",
            headers={"API-KEY": api_key},
            timeout=30,
        )
        return response.json()
