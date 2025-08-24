from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView

from common.ai_service import get_ai_answer
from .models import Doubt, ChatSession
from .serializers import DoubtSerializer, ChatSessionSerializer


# ===========================
#   ASK A DOUBT (AI ANSWER)
# ===========================
class AskDoubtView(generics.CreateAPIView):
    """
    POST /api/doubts/
    Body: { question: str, session: optional int }
    """
    serializer_class = DoubtSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        question = request.data.get("question", "").strip()
        if not question:
            return Response({"error": "No question provided"}, status=400)

        session_id = request.data.get("session")
        session = None

        if session_id:
            session = get_object_or_404(ChatSession, pk=session_id, user=request.user)

        # Call AI service
        answer = get_ai_answer(question)

        # Save doubt in DB
        doubt = Doubt.objects.create(
            user=request.user,
            question=question,
            answer=answer,
            session=session,
        )
        return Response(DoubtSerializer(doubt).data, status=201)


# ===========================
#   DOUBT HISTORY
# ===========================
class DoubtHistoryView(generics.ListAPIView):
    """
    GET /api/doubts/history/?page=&page_size=&session_id=
    """
    serializer_class = DoubtSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        try:
            page = int(request.GET.get('page', 1))
            page_size = int(request.GET.get('page_size', 20))
            if page < 1: page = 1
            if page_size < 1 or page_size > 100: page_size = 20
        except ValueError:
            page, page_size = 1, 20

        qs = Doubt.objects.filter(user=request.user)
        session_id = request.GET.get("session_id")
        if session_id:
            qs = qs.filter(session_id=session_id)

        qs = qs.order_by("-created_at")
        total = qs.count()
        start = (page - 1) * page_size
        end = start + page_size
        items = qs[start:end]

        return Response({
            'results': DoubtSerializer(items, many=True).data,
            'page': page,
            'page_size': page_size,
            'total': total,
            'has_more': end < total,
        })


# ===========================
#   DELETE A SINGLE DOUBT
# ===========================
class DeleteDoubtView(generics.DestroyAPIView):
    """
    DELETE /api/doubts/history/<pk>/
    """
    serializer_class = DoubtSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Doubt.objects.filter(user=self.request.user)


# ===========================
#   CLEAR ALL DOUBTS
# ===========================
class ClearAllDoubtsView(generics.GenericAPIView):
    """
    DELETE /api/doubts/clear-all/
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        Doubt.objects.filter(user=request.user).delete()
        return Response({'message': 'All doubts cleared'}, status=status.HTTP_200_OK)


# ===========================
#   CHAT SESSION VIEWS
# ===========================
class ChatSessionListCreateView(generics.ListCreateAPIView):
    """
    GET/POST /api/doubts/sessions/
    """
    serializer_class = ChatSessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ChatSession.objects.filter(user=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ChatSessionDetailView(generics.DestroyAPIView):
    """
    DELETE /api/doubts/sessions/<pk>/
    """
    serializer_class = ChatSessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ChatSession.objects.filter(user=self.request.user)
