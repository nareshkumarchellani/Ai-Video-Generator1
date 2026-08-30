import asyncio


async def generate_video_service(data: dict):

    print("\n========== FLOW AI REQUEST ==========")
    print(data)
    print("=====================================\n")

    # Future:
    # Runway
    # Veo
    # Hailuo
    # PixVerse

    await asyncio.sleep(2)

    return {
        "status": "success",
        "message": "Video generation started",
        "video": None,
        "received_data": data,
    }