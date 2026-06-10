from abc import ABC, abstractmethod
from typing import List, Dict, Any

class BaseLLMProvider(ABC):
    @property
    @abstractmethod
    def name(self) -> str:
        """Name of the provider (e.g. 'groq', 'gemini')"""
        pass

    @abstractmethod
    async def generate_quiz_questions(
        self, 
        system_prompt: str, 
        user_prompt: str, 
        num_questions: int
    ) -> List[Dict[str, Any]]:
        """Generates quiz questions based on the prompts.
        
        Returns a list of dicts matching:
        [
          {
            "question": "...",
            "options": ["A", "B", "C", "D"],
            "correct_answer": "A", // 'A', 'B', 'C', or 'D'
            "explanation": "...",
            "source_text": "..." // ground truth citation
          }
        ]
        """
        pass
class LLMGenerationError(Exception):
    """Exception raised when an LLM provider fails to generate a valid response."""
    pass
