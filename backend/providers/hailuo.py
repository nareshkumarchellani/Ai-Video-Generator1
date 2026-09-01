import asyncio
import re

import requests

from .base import BaseProvider

# Official MiniMax (Hailuo) Platform API.
# Docs: https://platform.minimax.io/docs/api-reference/video-generation-intro
API_BASE = "https://api.minimax.io/v1"

STATUS_MAP = {
    "Success": "success",
    "Fail": "failed",
    "Processing": "processing",
    "Preparing": "processing",
    "Queueing": "processing",
}


def _parse_duration(options: dict) -> int:
    raw = str(options.get("duration", "6 sec"))
    match = re.search(r"\d+", raw)
    seconds = int(match.group()) if match else 6
    return 10 if seconds >= 8 else 6


class HailuoProvider(BaseProvider):

    async def generate(self, prompt, options):

        api_key = options.get("hailuo_api_key", "")
        if not api_key:
            return {
                "status": "error",
                "provider": "Hailuo",
                "message": "Hailuo API Key not provided"
            }

        payload = {
            "model": "MiniMax-Hailuo-2.3",
            "prompt": prompt,
            "duration": _parse_duration(options),
        }

        try:
            data = await asyncio.to_thread(self._create_task, api_key, payload)

            base_resp = data.get("base_resp", {})
            if base_resp.get("status_code", 0) != 0:
                return {
                    "status": "error",
                    "provider": "Hailuo",
                    "message": base_resp.get("status_msg", "Failed to start generation"),
                }

            return {
                "status": "accepted",
                "provider": "Hailuo",
                "task_id": data.get("task_id"),
                "message": "Generation Started",
            }

        except Exception as e:
            return {
                "status": "error",
                "provider": "Hailuo",
                "message": str(e),
            }

    def _create_task(self, api_key, payload):
        response = requests.post(
            f"{API_BASE}/video_generation",
            headers={
                "Authorization": f"Bearer {api_key}",
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
                "provider": "Hailuo",
                "message": "Hailuo API Key missing",
            }

        try:
            data = await asyncio.to_thread(self._query_task, api_key, task_id)

            base_resp = data.get("base_resp", {})
            if base_resp.get("status_code", 0) != 0:
                return {
                    "status": "error",
                    "provider": "Hailuo",
                    "task_id": task_id,
                    "message": base_resp.get("status_msg", "Status check failed"),
                }

            raw_status = data.get("status")
            status = STATUS_MAP.get(raw_status, "processing")

            if status == "success":
                file_id = data.get("file_id")
                video_url = await asyncio.to_thread(
                    self._get_download_url, api_key, file_id
                )
                return {
                    "status": "success",
                    "provider": "Hailuo",
                    "task_id": task_id,
                    "video": video_url,
                }

            if status == "failed":
                return {
                    "status": "failed",
                    "provider": "Hailuo",
                    "task_id": task_id,
                    "message": "Video generation failed",
                }

            return {
                "status": "processing",
                "provider": "Hailuo",
                "task_id": task_id,
                "video": None,
            }

        except Exception as e:
            return {
                "status": "error",
                "provider": "Hailuo",
                "message": str(e),
            }

    def _query_task(self, api_key, task_id):
        response = requests.get(
            f"{API_BASE}/query/video_generation",
            headers={"Authorization": f"Bearer {api_key}"},
            params={"task_id": task_id},
            timeout=30,
        )
        return response.json()

    def _get_download_url(self, api_key, file_id):
        response = requests.get(
            f"{API_BASE}/files/retrieve",
            headers={"Authorization": f"Bearer {api_key}"},
            params={"file_id": file_id},
            timeout=30,
        )
        data = response.json()
        return data.get("file", {}).get("download_url")
