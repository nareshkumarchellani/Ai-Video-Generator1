from .base import BaseProvider


class HailuoProvider(BaseProvider):

    async def generate(self, prompt, options):

        print("Hailuo Provider")

        return {
            "status": "success",
            "video": None,
            "provider": "Hailuo",
        }

    async def get_status(self, task_id, api_key):

        return {
            "status": "error",
            "provider": "Hailuo",
            "message": "Status API not implemented yet"
        }