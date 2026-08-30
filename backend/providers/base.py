from abc import ABC, abstractmethod


class BaseProvider(ABC):

    @abstractmethod
    async def generate(self, prompt, options):
        """
        Create a generation task.
        """
        pass

    @abstractmethod
    async def get_status(self, task_id, api_key):
        """
        Get generation status.
        """
        pass