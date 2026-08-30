from fastapi import FastAPI, Header
from fastapi.middleware.cors import CORSMiddleware

from providers.manager import ProviderManager

app = FastAPI(title="Flow AI Backend")
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
        client = RunwayML(api_key=x_runway_key)

        return {
            "status": "success",
            "message": "API Key Valid"
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

manager = ProviderManager()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "status": "ok",
        "message": "Flow AI Backend Running"
    }


@app.post("/generate-video")
async def generate_video(
    data: dict,
    x_runway_key: str | None = Header(default=None),
    x_veo_key: str | None = Header(default=None),
    x_pixverse_key: str | None = Header(default=None),
    x_hailuo_key: str | None = Header(default=None),
):

    data["runway_api_key"] = x_runway_key
    data["veo_api_key"] = x_veo_key
    data["pixverse_api_key"] = x_pixverse_key
    data["hailuo_api_key"] = x_hailuo_key

    result = await manager.generate(
        model=data.get("model"),
        prompt=data.get("prompt"),
        options=data,
    )

    return result


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

    return {
        "status": "success",
        "provider": provider,
        "message": f"{provider} API Key received"
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
        client = RunwayML(api_key=x_runway_key)

        # Simple test request
        return {
            "status": "success",
            "message": "API Key Valid"
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

@app.get("/generation-status/{provider}/{task_id}")
async def generation_status(
    provider: str,
    task_id: str,
    x_runway_key: str | None = Header(default=None),
):
    

    if provider == "Runway":

        result = await manager.providers["Runway Gen-4"].get_status(
            task_id=task_id,
            api_key=x_runway_key,
        )

        return result

    return {
        "status": "error",
        "message": f"{provider} provider not supported"
    }