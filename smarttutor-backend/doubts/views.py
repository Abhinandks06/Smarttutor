from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Doubt
from .serializers import DoubtSerializer
from .ai_service import get_ai_answer

class AskDoubtView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        question = request.data.get("question", "").strip()
        if not question:
            return Response({"error": "No question provided"}, status=400)

        # Get AI-generated answer
        answer = get_ai_answer(question)

        # Save to database
        doubt = Doubt.objects.create(
            user=request.user,
            question=question,
            answer=answer
        )

        # Return saved record
        return Response(DoubtSerializer(doubt).data)


class DoubtHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        doubts = Doubt.objects.filter(user=request.user).order_by("-created_at")
        return Response(DoubtSerializer(doubts, many=True).data)
