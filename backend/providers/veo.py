from .base import BaseProvider


class VeoProvider(BaseProvider):

    async def generate(self, prompt, options):

        print("Veo Provider")

        return {
            "status": "success",
            "video": None,
            "provider": "Veo",
        }

    async def get_status(self, task_id, api_key):

        return {
            "status": "error",
            "provider": "Veo",
            "message": "Status API not implemented yet"
        }