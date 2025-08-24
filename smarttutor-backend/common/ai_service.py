import os
import json
from groq import Groq

# Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# 1. Doubt solving
def get_ai_answer(question: str) -> str:
    """
    Ask AI for an answer to a doubt/question.
    """
    try:
        response = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": "You are a helpful AI tutor."},
                {"role": "user", "content": question}
            ],
            max_tokens=300,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Error: {str(e)}"


# 2. Quiz generation
import re

def generate_quiz(topic: str, difficulty: str = "medium", num_questions: int = 5) -> dict:
    """
    Generate a multiple-choice quiz in JSON format for a given topic.
    Includes difficulty level and number of questions.
    """
    prompt = f"""
    Create a multiple-choice quiz on the topic: "{topic}".
    Difficulty: {difficulty}.
    Number of questions: {num_questions}.
    Return valid JSON only. Do not include explanations or extra text.
    Format strictly as:
    {{
      "title": "string",
      "difficulty": "{difficulty}",
      "questions": [
        {{
          "text": "string",
          "options": ["option1", "option2", "option3", "option4"],
          "answer": "correct option text"
        }}
      ]
    }}
    """

    try:
        response = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": "You are a helpful AI tutor that ONLY returns valid JSON."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=800,
        )

        quiz_text = response.choices[0].message.content.strip()
        print("🔍 Raw AI response (quiz):", quiz_text)  # debug

        # Extract JSON block if extra text is added
        match = re.search(r"\{.*\}", quiz_text, re.DOTALL)
        if match:
            quiz_text = match.group(0)

        quiz_data = json.loads(quiz_text)

        if "questions" not in quiz_data or not isinstance(quiz_data["questions"], list):
            raise ValueError("Invalid quiz format")

        return quiz_data

    except Exception as e:
        return {
            "title": f"Quiz on {topic}",
            "difficulty": difficulty,
            "error": str(e),
            "raw_response": quiz_text if 'quiz_text' in locals() else None,
            "questions": []
        }


def suggest_course(weak_topics: list[str]) -> dict:
    """
    Suggest a compact course for a student weak in specific topics.
    Returns valid JSON with lessons.
    """
    topics_str = ", ".join(weak_topics)
    prompt = f"""
    Suggest a compact learning course for a student weak in {topics_str}.
    Return ONLY valid JSON in this exact format:
    {{
      "title": "string",
      "description": "string",
      "lessons": [
        {{
          "title": "string",
          "summary": "string",
          "content": "string (optional)"
        }}
      ]
    }}
    """

    try:
        response = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[
                {"role": "system", "content": "You are a helpful AI tutor that ONLY returns valid JSON."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=1000,
            temperature=0.7
        )

        course_text = response.choices[0].message.content.strip()
        print("🔍 Raw AI response (course):", course_text)  # Debugging

        # Extract JSON block safely
        match = re.search(r"\{.*\}", course_text, re.DOTALL)
        if match:
            course_text = match.group(0)

        course_data = json.loads(course_text)

        # Validate structure
        if "lessons" not in course_data or not isinstance(course_data["lessons"], list):
            raise ValueError("Invalid course format")

        return course_data

    except Exception as e:
        return {
            "error": str(e),
            "raw_response": course_text if 'course_text' in locals() else None,
            "title": "",
            "description": "",
            "lessons": []
        }