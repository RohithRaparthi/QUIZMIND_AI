import logging
import json
import asyncio
from typing import List, Dict, Any
from openai import AsyncOpenAI
from app.config import settings
from app.services.llm.base import BaseLLMProvider, LLMGenerationError

logger = logging.getLogger(__name__)

class GroqProvider(BaseLLMProvider):
    @property
    def name(self) -> str:
        return "groq"

    def __init__(self):
        # Configure AsyncOpenAI for Groq API
        self.api_key = settings.GROQ_API_KEY
        self.model = settings.GROQ_MODEL
        self.is_configured = (
            self.api_key 
            and self.api_key != "your_groq_api_key_here" 
            and not self.api_key.startswith("your_")
        )
        if self.is_configured:
            self.client = AsyncOpenAI(
                api_key=self.api_key,
                base_url="https://api.groq.com/openai/v1"
            )
        else:
            self.client = None

    async def generate_quiz_questions(
        self, 
        system_prompt: str, 
        user_prompt: str, 
        num_questions: int
    ) -> List[Dict[str, Any]]:
        if not self.is_configured or not self.client:
            logger.warning("Groq API key is not configured or is a placeholder. Skipping Groq.")
            raise LLMGenerationError("Groq API key is not configured.")

        try:
            logger.info(f"Sending quiz generation request to Groq ({self.model})...")
            # We set a timeout of 15 seconds for Groq
            response = await asyncio.wait_for(
                self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    response_format={"type": "json_object"},
                    temperature=0.2
                ),
                timeout=15.0
            )
            
            content = response.choices[0].message.content
            if not content:
                raise LLMGenerationError("Groq returned an empty response.")

            data = json.loads(content)
            # The model should return an object containing a list of questions, e.g. {"questions": [...]} or directly a list.
            if isinstance(data, dict) and "questions" in data:
                questions = data["questions"]
            elif isinstance(data, list):
                questions = data
            elif isinstance(data, dict):
                # If it's a dict where values are lists or it just contains a list under some other key
                lists = [v for v in data.values() if isinstance(v, list)]
                if lists:
                    questions = lists[0]
                else:
                    questions = [data]
            else:
                raise LLMGenerationError("Groq response is not in a recognized JSON structure.")

            return questions

        except asyncio.TimeoutError:
            logger.error("Groq API request timed out.")
            raise LLMGenerationError("Groq API request timed out.")
        except json.JSONDecodeError as e:
            logger.error(f"Groq response failed to parse as JSON: {e}")
            raise LLMGenerationError("Groq response failed to parse as JSON.")
        except Exception as e:
            logger.error(f"Error calling Groq API: {e}")
            raise LLMGenerationError(f"Error calling Groq API: {e}")
