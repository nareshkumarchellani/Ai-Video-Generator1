from .base import BaseProvider


class PixVerseProvider(BaseProvider):

    async def generate(self, prompt, options):

        api_key = options.get("pixverse_api_key", "")
        if not api_key:
            return {
                "status": "error",
                "provider": "PixVerse",
                "message": "PixVerse API Key not provided"
            }

        return {
            "status": "error",
            "provider": "PixVerse",
            "message": "PixVerse provider is not implemented yet"
        }

    async def get_status(self, task_id, api_key):

        return {
            "status": "error",
            "provider": "PixVerse",
            "message": "Status API not implemented yet"
        }
