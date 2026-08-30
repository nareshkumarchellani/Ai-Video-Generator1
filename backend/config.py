import os
from dotenv import load_dotenv

load_dotenv()

RUNWAY_API_KEY = os.getenv("RUNWAY_API_KEY", "")
VEO_API_KEY = os.getenv("VEO_API_KEY", "")
PIXVERSE_API_KEY = os.getenv("PIXVERSE_API_KEY", "")
HAILUO_API_KEY = os.getenv("HAILUO_API_KEY", "")