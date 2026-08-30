from .runway import RunwayProvider
from .veo import VeoProvider
from .pixverse import PixVerseProvider
from .hailuo import HailuoProvider


class ProviderManager:

    def __init__(self):

        self.providers = {
            "Runway Gen-4": RunwayProvider(),
            "Runway": RunwayProvider(),
            "Veo 3": VeoProvider(),
            "PixVerse": PixVerseProvider(),
            "Hailuo AI": HailuoProvider(),
        }

    async def generate(self, model, prompt, options):

        provider = self.providers.get(model)

        if provider is None:

            return {
                "status": "error",
                "message": f"Provider '{model}' not supported"
            }

        return await provider.generate(
            prompt=prompt,
            options=options,
        )

    async def get_status(
        self,
        provider,
        task_id,
        api_key,
    ):

        provider = self.providers.get(provider)

        if provider is None:

            return {
                "status": "error",
                "message": "Unknown provider"
            }

        return await provider.get_status(
            task_id,
            api_key,
        )