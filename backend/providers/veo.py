from .base import BaseProvider


class VeoProvider(BaseProvider):

    async def generate(self, prompt, options):

        api_key = options.get("veo_api_key", "")
        if not api_key:
            return {
                "status": "error",
                "provider": "Veo",
                "message": "Veo API Key not provided"
            }

        return {
            "status": "error",
            "provider": "Veo",
            "message": "Veo provider is not implemented yet"
        }

    async def get_status(self, task_id, api_key):

        return {
            "status": "error",
            "provider": "Veo",
            "message": "Status API not implemented yet"
        }
