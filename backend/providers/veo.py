import asyncio

import requests

from .base import BaseProvider

# Official Gemini API (Google AI Studio) endpoint for Veo.
# Docs: https://ai.google.dev/gemini-api/docs/veo
API_BASE = "https://generativelanguage.googleapis.com/v1beta"
MODEL = "veo-3.1-generate-preview"


class VeoProvider(BaseProvider):

    async def generate(self, prompt, options):

        api_key = options.get("veo_api_key", "")
        if not api_key:
            return {
                "status": "error",
                "provider": "Veo",
                "message": "Veo API Key not provided"
            }

        aspect_ratio = options.get("ratio", "16:9")

        payload = {
            "instances": [{"prompt": prompt}],
            "parameters": {
                "aspectRatio": aspect_ratio,
            },
        }

        try:
            data = await asyncio.to_thread(
                self._create_operation, api_key, payload
            )

            if "name" not in data:
                message = (
                    data.get("error", {}).get("message")
                    or "Failed to start Veo generation"
                )
                return {
                    "status": "error",
                    "provider": "Veo",
                    "message": message,
                }

            # Operation "name" looks like:
            # models/veo-3.1-generate-preview/operations/<id>
            operation_id = data["name"].split("/operations/")[-1]

            return {
                "status": "accepted",
                "provider": "Veo",
                "task_id": operation_id,
                "message": "Generation Started",
            }

        except Exception as e:
            return {
                "status": "error",
                "provider": "Veo",
                "message": str(e),
            }

    def _create_operation(self, api_key, payload):
        response = requests.post(
            f"{API_BASE}/models/{MODEL}:predictLongRunning",
            headers={
                "x-goog-api-key": api_key,
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
                "provider": "Veo",
                "message": "Veo API Key missing",
            }

        try:
            operation_name = f"models/{MODEL}/operations/{task_id}"
            data = await asyncio.to_thread(
                self._poll_operation, api_key, operation_name
            )

            if data.get("error"):
                return {
                    "status": "failed",
                    "provider": "Veo",
                    "task_id": task_id,
                    "message": data["error"].get("message", "Generation failed"),
                }

            if not data.get("done"):
                return {
                    "status": "processing",
                    "provider": "Veo",
                    "task_id": task_id,
                    "video": None,
                }

            samples = (
                data.get("response", {})
                .get("generateVideoResponse", {})
                .get("generatedSamples", [])
            )

            if not samples:
                return {
                    "status": "failed",
                    "provider": "Veo",
                    "task_id": task_id,
                    "message": "No video returned by Veo",
                }

            video_uri = samples[0]["video"]["uri"]
            # The file URI itself requires the API key to be downloaded/played.
            separator = "&" if "?" in video_uri else "?"
            video_url = f"{video_uri}{separator}key={api_key}"

            return {
                "status": "success",
                "provider": "Veo",
                "task_id": task_id,
                "video": video_url,
            }

        except Exception as e:
            return {
                "status": "error",
                "provider": "Veo",
                "message": str(e),
            }

    def _poll_operation(self, api_key, operation_name):
        response = requests.get(
            f"{API_BASE}/{operation_name}",
            headers={"x-goog-api-key": api_key},
            timeout=30,
        )
        return response.json()
