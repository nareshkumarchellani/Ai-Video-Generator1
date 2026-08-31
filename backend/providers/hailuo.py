from .base import BaseProvider


class HailuoProvider(BaseProvider):

    async def generate(self, prompt, options):

        api_key = options.get("hailuo_api_key", "")
        if not api_key:
            return {
                "status": "error",
                "provider": "Hailuo",
                "message": "Hailuo API Key not provided"
            }

        return {
            "status": "error",
            "provider": "Hailuo",
            "message": "Hailuo provider is not implemented yet"
        }

    async def get_status(self, task_id, api_key):

        return {
            "status": "error",
            "provider": "Hailuo",
            "message": "Status API not implemented yet"
        }
