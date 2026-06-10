import logging
import asyncio
from typing import List, Dict, Any, Tuple
from app.services.llm.base import BaseLLMProvider, LLMGenerationError
from app.services.llm.groq import GroqProvider
from app.services.llm.gemini import GeminiProvider

logger = logging.getLogger(__name__)

class LLMManager:
    def __init__(self):
        self.groq_provider = GroqProvider()
        self.gemini_provider = GeminiProvider()

    def _get_system_prompt(self, is_grounded: bool) -> str:
        base_prompt = (
            "You are an expert quiz designer. Generate a high-quality multiple-choice quiz.\n"
            "You MUST return a JSON object with a key 'questions' containing a list of questions. "
            "Do not include any markdown styling like ```json or other explanation outside the JSON.\n"
            "Each question object MUST follow this schema exactly:\n"
            "{\n"
            "  \"question\": \"The question text?\",\n"
            "  \"options\": [\"Option A text\", \"Option B text\", \"Option C text\", \"Option D text\"],\n"
            "  \"correct_answer\": \"A\",\n"
            "  \"explanation\": \"A concise explanation of why the correct answer is correct.\",\n"
            "  \"source_text\": \"The exact sentence or content snippet supporting this question.\"\n"
            "}\n"
            "Rule 1: 'options' must be a list containing exactly four options.\n"
            "Rule 2: 'correct_answer' must be one of the characters: 'A', 'B', 'C', or 'D' (where A corresponds to options[0], B to options[1], etc.).\n"
        )
        
        if is_grounded:
            base_prompt += (
                "Rule 3: Try to generate the exact number of questions requested, but if insufficient information exists in the document, prioritize grounding and generate fewer questions instead of hallucinating.\n"
                "\nCRITICAL GROUNDING AND HALLUCINATION PREVENTION RULES:\n"
                "- Generate questions ONLY using facts and information from the provided document.\n"
                "- Do NOT use any external knowledge, external assumptions, or make up facts. If a fact is not explicitly mentioned in the document, it is false and must not be used.\n"
                "- Do NOT infer, extrapolate, or assume facts not explicitly present in the document.\n"
                "- Every generated question must contain a 'source_text' field with the exact sentence(s) or text snippet copied directly from the provided document that supports the question and its correct answer.\n"
                "- If clear evidence is not present in the document to support a question, do NOT create that question.\n"
                "- If insufficient information exists in the document to meet the requested question count, generate fewer questions rather than hallucinating or making up facts.\n"
                "- Explanations must be strictly grounded in the document content and reference the 'source_text' to explain why the correct answer is correct."
            )
        else:
            base_prompt += (
                "Rule 3: You must generate the exact number of questions requested.\n"
                "\nTOPIC RULES:\n"
                "- Generate the quiz using your general training knowledge on the specified topic.\n"
                "- The 'source_text' field should summarize the key concept or fact being tested by the question."
            )
            
        return base_prompt

    def _validate_questions(self, raw_questions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        validated = []
        for idx, q in enumerate(raw_questions):
            try:
                question_text = q.get("question")
                options = q.get("options")
                correct_answer = q.get("correct_answer")
                explanation = q.get("explanation")
                source_text = q.get("source_text") or ""

                if not question_text or not isinstance(question_text, str):
                    logger.warning(f"Question {idx} failed validation: missing or invalid 'question'")
                    continue
                
                if not options or not isinstance(options, list) or len(options) != 4:
                    logger.warning(f"Question {idx} failed validation: 'options' must be a list of 4 elements")
                    continue
                
                # Ensure all option items are strings and not empty
                options = [str(opt).strip() for opt in options]
                if any(not opt for opt in options):
                    logger.warning(f"Question {idx} failed validation: one or more options are empty")
                    continue

                if not correct_answer or str(correct_answer).upper() not in ["A", "B", "C", "D"]:
                    logger.warning(f"Question {idx} failed validation: 'correct_answer' must be A, B, C, or D")
                    continue
                
                if not explanation or not isinstance(explanation, str):
                    explanation = "No explanation provided."

                validated.append({
                    "question": question_text.strip(),
                    "options": options,
                    "correct_answer": str(correct_answer).upper(),
                    "explanation": explanation.strip(),
                    "source_text": str(source_text).strip()
                })
            except Exception as e:
                logger.error(f"Error validating question dict: {e}")
                continue
        return validated

    async def generate_quiz(
        self, 
        prompt_content: str, 
        num_questions: int, 
        difficulty: str, 
        is_grounded: bool = False
    ) -> Tuple[List[Dict[str, Any]], str]:
        """Generates quiz questions. Tries Groq first, and falls back to Gemini on failure.
        
        Returns:
            Tuple of (List of validated questions, provider name used)
        """
        system_prompt = self._get_system_prompt(is_grounded)
        user_prompt = (
            f"Generate exactly {num_questions} questions.\n"
            f"Difficulty: {difficulty}\n"
        )
        if is_grounded:
            user_prompt += f"Study Material Content:\n---\n{prompt_content}\n---"
        else:
            user_prompt += f"Topic: {prompt_content}"

        # Attempt 1: Groq
        try:
            logger.info("Attempting to generate quiz using Groq...")
            raw_questions = await self.groq_provider.generate_quiz_questions(system_prompt, user_prompt, num_questions)
            validated = self._validate_questions(raw_questions)
            if len(validated) > 0:
                logger.info(f"Successfully generated {len(validated)} validated questions using Groq.")
                return validated, "groq"
            else:
                raise LLMGenerationError("Groq generated questions but none passed schema validation.")
        except Exception as e:
            logger.warning(f"Groq provider failed: {e}. Falling back to Gemini...")

        # Attempt 2: Gemini
        try:
            logger.info("Attempting to generate quiz using Gemini (fallback)...")
            raw_questions = await self.gemini_provider.generate_quiz_questions(system_prompt, user_prompt, num_questions)
            validated = self._validate_questions(raw_questions)
            if len(validated) > 0:
                logger.info(f"Successfully generated {len(validated)} validated questions using Gemini.")
                return validated, "gemini"
            else:
                raise LLMGenerationError("Gemini generated questions but none passed schema validation.")
        except Exception as e:
            logger.error(f"Gemini fallback provider also failed: {e}")
            raise LLMGenerationError(f"Failed to generate quiz from any LLM provider. Last error: {e}")
