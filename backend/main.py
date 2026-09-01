import asyncio

import requests
from fastapi import FastAPI, Header
from fastapi.middleware.cors import CORSMiddleware

from providers.manager import ProviderManager
from api.generate import router as generate_router

app = FastAPI(title="Flow AI Backend")

manager = ProviderManager()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Sabhi Vercel links aur origins ko allow karne ke liye
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


def _check_veo_key(api_key: str):
    response = requests.get(
        "https://generativelanguage.googleapis.com/v1beta/models",
        headers={"x-goog-api-key": api_key},
        params={"pageSize": 1},
        timeout=15,
    )
    if response.status_code == 200:
        return {"status": "success", "message": "Veo API Key Valid"}
    try:
        message = response.json().get("error", {}).get("message", "Invalid API Key")
    except Exception:
        message = f"Request failed with status {response.status_code}"
    return {"status": "error", "message": message}


def _check_pixverse_key(api_key: str):
    import uuid

    response = requests.get(
        "https://app-api.pixverse.ai/openapi/v2/account/balance",
        headers={"API-KEY": api_key, "Ai-trace-id": str(uuid.uuid4())},
        timeout=15,
    )
    try:
        data = response.json()
    except Exception:
        return {"status": "error", "message": f"Request failed with status {response.status_code}"}

    if data.get("ErrCode") == 0:
        return {"status": "success", "message": "PixVerse API Key Valid"}
    return {"status": "error", "message": data.get("ErrMsg", "Invalid API Key")}


def _check_hailuo_key(api_key: str):
    # Cheap call: an invalid task_id still authenticates the key first.
    # status_code 1004/2049 => bad key. Anything else => key is valid.
    response = requests.get(
        "https://api.minimax.io/v1/query/video_generation",
        headers={"Authorization": f"Bearer {api_key}"},
        params={"task_id": "0"},
        timeout=15,
    )
    try:
        data = response.json()
    except Exception:
        return {"status": "error", "message": f"Request failed with status {response.status_code}"}

    status_code = data.get("base_resp", {}).get("status_code", 0)
    if status_code in (1004, 2049):
        return {
            "status": "error",
            "message": data.get("base_resp", {}).get("status_msg", "Invalid API Key"),
        }
    return {"status": "success", "message": "Hailuo API Key Valid"}


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

    try:
        if provider == "Runway":
            result = await runway_account(x_runway_key=key)
        elif provider == "Veo":
            result = await asyncio.to_thread(_check_veo_key, key)
        elif provider == "PixVerse":
            result = await asyncio.to_thread(_check_pixverse_key, key)
        elif provider == "Hailuo":
            result = await asyncio.to_thread(_check_hailuo_key, key)
        else:
            result = {"status": "error", "message": f"Unknown provider '{provider}'"}

        return {**result, "provider": provider}

    except Exception as e:
        return {"status": "error", "provider": provider, "message": str(e)}


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
