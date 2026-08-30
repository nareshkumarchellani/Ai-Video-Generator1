from .base import BaseProvider


class PixVerseProvider(BaseProvider):

    async def generate(self, prompt, options):

        print("PixVerse Provider")

        return {
            "status": "success",
            "video": None,
            "provider": "PixVerse",
        }

    async def get_status(self, task_id, api_key):

        return {
            "status": "error",
            "provider": "PixVerse",
            "message": "Status API not implemented yet"
        }