"""LLM service for Gemini API interactions"""
import json
import time
import re
import os
from typing import Optional, Dict, Any
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

if API_KEY:
    genai.configure(api_key=API_KEY)


class LLMService:
    """Service for interacting with Gemini LLM"""

    @staticmethod
    def call_model(
        prompt: str,
        response_format: Optional[str] = None,
        max_retries: int = 2,
        timeout: int = 60,
    ) -> str:
        """
        Call Gemini API with retry logic and timeout handling.
        
        Args:
            prompt: The prompt to send to the model
            response_format: Optional hint about expected format ("json" or None)
            max_retries: Number of retries on failure
            timeout: Timeout in seconds
            
        Returns:
            Model response text
            
        Raises:
            Exception: If all retries fail
        """
        if not API_KEY:
            raise ValueError("GEMINI_API_KEY not set")

        retry_delays = [2, 5]  # exponential backoff: 2s, 5s
        last_error = None

        for attempt in range(max_retries + 1):
            try:
                if response_format == "json":
                    full_prompt = f"{prompt}\n\nRespond with valid JSON only. No markdown, no code blocks."
                else:
                    full_prompt = prompt

                model = genai.GenerativeModel(MODEL)
                response = model.generate_content(
                    full_prompt,
                    generation_config=genai.types.GenerationConfig(
                        temperature=0.7,
                        max_output_tokens=4096,
                    ),
                )

                return response.text

            except Exception as e:
                last_error = e
                if attempt < max_retries:
                    delay = retry_delays[attempt]
                    time.sleep(delay)
                continue

        raise Exception(f"LLM call failed after {max_retries + 1} attempts: {last_error}")

    @staticmethod
    def extract_json(text: str) -> Dict[str, Any]:
        """
        Extract JSON from text that may contain markdown code blocks.
        
        Args:
            text: Text potentially containing JSON
            
        Returns:
            Parsed JSON dictionary
            
        Raises:
            json.JSONDecodeError: If no valid JSON found
        """
        # Remove markdown code blocks
        text = re.sub(r"```json\s*", "", text)
        text = re.sub(r"```\s*$", "", text)
        text = text.strip()

        # Try to parse directly
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            pass

        # Try to find JSON object in text
        json_match = re.search(r"\{.*\}", text, re.DOTALL)
        if json_match:
            try:
                return json.loads(json_match.group())
            except json.JSONDecodeError:
                pass

        raise json.JSONDecodeError("No valid JSON found in response", text, 0)

    @staticmethod
    def call_model_json(
        prompt: str,
        max_retries: int = 2,
        timeout: int = 60,
    ) -> Dict[str, Any]:
        """
        Call model with JSON response expected, with automatic extraction and validation.
        
        Args:
            prompt: The prompt
            max_retries: Number of retries
            timeout: Timeout in seconds
            
        Returns:
            Parsed JSON response
        """
        text = LLMService.call_model(
            prompt,
            response_format="json",
            max_retries=max_retries,
            timeout=timeout,
        )
        return LLMService.extract_json(text)
