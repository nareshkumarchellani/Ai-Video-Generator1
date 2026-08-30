from runwayml import RunwayML

from .base import BaseProvider


class RunwayProvider(BaseProvider):

    async def generate(self, prompt, options):

        print("========== RUNWAY PROVIDER ==========")

        # API key frontend headers se aayegi
        api_key = options.get("runway_api_key", "")

        if not api_key:
            return {
                "status": "error",
                "message": "Runway API Key not provided"
            }

        try:

            client = RunwayML(api_key=api_key)

            print("Creating Runway Task...")

            task = client.text_to_video.create(
                model="gen4.5",
                prompt_text=prompt,
                duration=5,
                ratio="1280:720",
            )

            print("Task Created:", task.id)

            # Don't wait here.
            # Return task id immediately.
            return {
                "status": "accepted",
                "provider": "Runway",
                "task_id": task.id,
                "message": "Generation Started"
            }

        except Exception as e:

            print("========== RUNWAY ERROR ==========")
            print(e)

            return {
                "status": "error",
                "provider": "Runway",
                "message": str(e)
            }

    async def get_status(
        self,
        task_id,
        api_key,
    ):

        if not api_key:
            return {
                "status": "error",
                "message": "Runway API Key missing"
            }

        try:

            client = RunwayML(api_key=api_key)

            result = client.tasks.retrieve(task_id)

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

            elif status == "FAILED":

                return {
                    "status": "failed",
                    "provider": "Runway",
                    "task_id": task_id,
                    "message": "Video generation failed"
                }

            else:

                return {
                    "status": status.lower(),
                    "provider": "Runway",
                    "task_id": task_id,
                    "video": None,
                }

        except Exception as e:

            print("========== STATUS ERROR ==========")
            print(e)

            return {
                "status": "error",
                "provider": "Runway",
                "message": str(e)
            }