try:
    from config import MODEL
except ImportError:
    from backend.config import MODEL

class HuggingFaceProvider:

    def generate_video(self, prompt, duration):

        print("=" * 40)
        print("Provider : HuggingFace")
        print("Model    :", MODEL)
        print("Prompt   :", prompt)
        print("Duration :", duration)
        print("=" * 40)

        return {
            "status": "processing",
            "provider": "huggingface",
            "model": MODEL,
            "video": None
        }