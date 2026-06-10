import logging
import json
import asyncio
from typing import List, Dict, Any
import google.generativeai as genai
from app.config import settings
from app.services.llm.base import BaseLLMProvider, LLMGenerationError

logger = logging.getLogger(__name__)

class GeminiProvider(BaseLLMProvider):
    @property
    def name(self) -> str:
        return "gemini"

    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.is_configured = (
            self.api_key 
            and self.api_key != "your_gemini_api_key_here" 
            and not self.api_key.startswith("your_")
        )
        if self.is_configured:
            genai.configure(api_key=self.api_key)
            # Use gemini-2.5-flash or gemini-1.5-flash
            self.model_name = "gemini-2.5-flash"
        else:
            self.model_name = None

    async def generate_quiz_questions(
        self, 
        system_prompt: str, 
        user_prompt: str, 
        num_questions: int
    ) -> List[Dict[str, Any]]:
        if not self.is_configured or not self.model_name:
            logger.warning("Gemini API key is not configured or is a placeholder. Skipping Gemini.")
            raise LLMGenerationError("Gemini API key is not configured.")

        try:
            logger.info("Sending quiz generation request to Gemini...")
            model = genai.GenerativeModel(model_name=self.model_name)
            
            # Combine system prompt and user prompt to support older SDK versions
            full_prompt = f"{system_prompt}\n\n{user_prompt}"
            
            # Set a timeout of 15 seconds for Gemini
            response = await asyncio.wait_for(
                model.generate_content_async(full_prompt),
                timeout=15.0
            )

            content = response.text
            if not content:
                raise LLMGenerationError("Gemini returned an empty response.")

            # Strip code fences if present (e.g. ```json ... ```)
            clean_content = content.strip()
            if clean_content.startswith("```"):
                lines = clean_content.splitlines()
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines and lines[-1].strip() == "```":
                    lines = lines[:-1]
                clean_content = "\n".join(lines).strip()

            data = json.loads(clean_content)
            # Standardize format
            if isinstance(data, dict) and "questions" in data:
                questions = data["questions"]
            elif isinstance(data, list):
                questions = data
            elif isinstance(data, dict):
                lists = [v for v in data.values() if isinstance(v, list)]
                if lists:
                    questions = lists[0]
                else:
                    questions = [data]
            else:
                raise LLMGenerationError("Gemini response is not in a recognized JSON structure.")

            return questions

        except asyncio.TimeoutError:
            logger.error("Gemini API request timed out.")
            raise LLMGenerationError("Gemini API request timed out.")
        except json.JSONDecodeError as e:
            logger.error(f"Gemini response failed to parse as JSON: {e}")
            raise LLMGenerationError("Gemini response failed to parse as JSON.")
        except Exception as e:
            logger.error(f"Error calling Gemini API: {e}")
            raise LLMGenerationError(f"Error calling Gemini API: {e}")
