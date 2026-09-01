from fastapi import APIRouter, Header

from providers.manager import ProviderManager

router = APIRouter()
manager = ProviderManager()


@router.post("/generate-video")
async def generate_video(
    data: dict,
    x_runway_key: str | None = Header(default=None),
    x_veo_key: str | None = Header(default=None),
    x_pixverse_key: str | None = Header(default=None),
    x_hailuo_key: str | None = Header(default=None),
):
    model = data.get("model", "")
    prompt = data.get("prompt", "")

    options = {
        **data,
        "runway_api_key": x_runway_key or "",
        "veo_api_key": x_veo_key or "",
        "pixverse_api_key": x_pixverse_key or "",
        "hailuo_api_key": x_hailuo_key or "",
    }

    return await manager.generate(
        model=model,
        prompt=prompt,
        options=options,
    )
