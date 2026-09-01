import asyncio

from fastapi import FastAPI, Header
from fastapi.middleware.cors import CORSMiddleware

from providers.manager import ProviderManager
from api.generate import router as generate_router

app = FastAPI(title="Flow AI Backend")

manager = ProviderManager()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Yeh sabhi Vercel links ko automatically allow kar dega
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(generate_router)


@app.get("/")
async def root():
    return {
        "status": "ok",
        "message": "Flow AI Backend Running"
    }


@app.get("/runway/account")
async def runway_account(
    x_runway_key: str | None = Header(default=None),
):
    from runwayml import RunwayML

    if not x_runway_key:
        return {
            "status": "error",
            "message": "Runway API Key Missing"
        }

    try:
        await asyncio.to_thread(
            lambda: RunwayML(api_key=x_runway_key)
        )

        return {
            "status": "success",
            "message": "API Key Valid"
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


@app.post("/test-provider")
async def test_provider(
    data: dict,
    x_runway_key: str | None = Header(default=None),
    x_veo_key: str | None = Header(default=None),
    x_pixverse_key: str | None = Header(default=None),
    x_hailuo_key: str | None = Header(default=None),
):
    provider = data.get("provider", "")

    keys = {
        "Runway": x_runway_key,
        "Veo": x_veo_key,
        "PixVerse": x_pixverse_key,
        "Hailuo": x_hailuo_key,
    }

    key = keys.get(provider)

    if not key:
        return {
            "status": "error",
            "provider": provider,
            "message": f"{provider} API Key not found"
        }

    if provider == "Runway":
        result = await runway_account(x_runway_key=key)

        return {
            **result,
            "provider": provider,
        }

    return {
        "status": "success",
        "provider": provider,
        "message": f"{provider} API Key received"
    }


@app.get("/generation-status/{provider}/{task_id}")
async def generation_status(
    provider: str,
    task_id: str,
    x_runway_key: str | None = Header(default=None),
    x_veo_key: str | None = Header(default=None),
    x_pixverse_key: str | None = Header(default=None),
    x_hailuo_key: str | None = Header(default=None),
):
    api_keys = {
        "Runway": x_runway_key,
        "Veo": x_veo_key,
        "PixVerse": x_pixverse_key,
        "Hailuo": x_hailuo_key,
    }

    return await manager.get_status(
        provider=provider,
        task_id=task_id,
        api_key=api_keys.get(provider),
    )