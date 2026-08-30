import sys
from pathlib import Path

# backend folder ko Python path me add karo
sys.path.append(str(Path(__file__).resolve().parent.parent))

from config import RUNWAY_API_KEY

print("RUNWAY KEY:", RUNWAY_API_KEY)