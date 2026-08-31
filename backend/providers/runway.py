import asyncio
import re

from runwayml import RunwayML

from .base import BaseProvider

RATIO_MAP = {
    "16:9": "1280:720",
    "9:16": "720:1280",
    "1:1": "960:960",
    "21:9": "1584:672",
}


def _parse_duration(options: dict) -> int:
    raw = str(options.get("duration", "5 sec"))
    match = re.search(r"\d+", raw)
    seconds = int(match.group()) if match else 5
    return max(5, min(seconds, 10))


def _parse_ratio(options: dict) -> str:
    ratio = options.get("ratio", "16:9")
    return RATIO_MAP.get(ratio, "1280:720")


class RunwayProvider(BaseProvider):

    async def generate(self, prompt, options):

        api_key = options.get("runway_api_key", "")

        if not api_key:
            return {
                "status": "error",
                "message": "Runway API Key not provided"
            }

        duration = _parse_duration(options)
        ratio = _parse_ratio(options)

        try:
            task = await asyncio.to_thread(
                self._create_task,
                api_key,
                prompt,
                duration,
                ratio,
            )

            return {
                "status": "accepted",
                "provider": "Runway",
                "task_id": task.id,
                "message": "Generation Started"
            }

        except Exception as e:
            return {
                "status": "error",
                "provider": "Runway",
                "message": str(e)
            }

    def _create_task(self, api_key, prompt, duration, ratio):
        client = RunwayML(api_key=api_key)
        return client.text_to_video.create(
            model="gen4.5",
            prompt_text=prompt,
            duration=duration,
            ratio=ratio,
        )

    async def get_status(self, task_id, api_key):

        if not api_key:
            return {
                "status": "error",
                "message": "Runway API Key missing"
            }

        try:
            result = await asyncio.to_thread(
                self._retrieve_task,
                api_key,
                task_id,
            )

            video_url = None
            if hasattr(result, "output") and result.output:
                video_url = result.output[0]

            status = str(result.status)

            if status == "SUCCEEDED":
                return {
                    "status": "success",
                    "provider": "Runway",
                    "task_id": task_id,
                    "video": video_url,
                }

            if status == "FAILED":
                return {
                    "status": "failed",
                    "provider": "Runway",
                    "task_id": task_id,
                    "message": "Video generation failed"
                }

            return {
                "status": status.lower(),
                "provider": "Runway",
                "task_id": task_id,
                "video": None,
            }

        except Exception as e:
            return {
                "status": "error",
                "provider": "Runway",
                "message": str(e)
            }

    def _retrieve_task(self, api_key, task_id):
        client = RunwayML(api_key=api_key)
        return client.tasks.retrieve(task_id)
