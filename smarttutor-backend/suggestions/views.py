from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from common.ai_service import suggest_course

@api_view(["POST"])
def course_suggestion_api(request):
    """
    Generate a compact course suggestion based on weak topics.
    """
    weak_topics = request.data.get("weak_topics", [])

    if not weak_topics or not isinstance(weak_topics, list):
        return Response(
            {"error": "Please provide a list of weak_topics"},
            status=status.HTTP_400_BAD_REQUEST
        )

    course_data = suggest_course(weak_topics)
    return Response(course_data, status=status.HTTP_200_OK)
