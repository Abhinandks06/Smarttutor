from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from common.ai_service import generate_quiz


@api_view(["POST"])
def generate_quiz_api(request):
    """
    API endpoint to generate a quiz using AI.
    Expects: { "topic": "string", "difficulty": "easy|medium|hard", "num_questions": int }
    """
    topic = request.data.get("topic")
    difficulty = request.data.get("difficulty", "medium")
    num_questions = int(request.data.get("num_questions", 5))

    if not topic:
        return Response({"error": "Topic is required"}, status=status.HTTP_400_BAD_REQUEST)

    quiz = generate_quiz(topic, difficulty, num_questions)

    return Response(quiz, status=status.HTTP_200_OK)
