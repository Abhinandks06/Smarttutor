from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Doubt, ChatSession
from .serializers import DoubtSerializer, ChatSessionSerializer
from .ai_service import get_ai_answer
from django.shortcuts import get_object_or_404


# existing AskDoubtView — add session handling
class AskDoubtView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        question = request.data.get("question", "").strip()
        if not question:
            return Response({"error": "No question provided"}, status=400)

        # Optional session
        session_id = request.data.get("session_id")
        session = None
        if session_id:
            try:
                session = ChatSession.objects.get(pk=session_id, user=request.user)
            except ChatSession.DoesNotExist:
                return Response({"error": "Session not found"}, status=404)

        answer = get_ai_answer(question)

        doubt = Doubt.objects.create(
            user=request.user,
            question=question,
            answer=answer,
            session=session
        )

        return Response(DoubtSerializer(doubt).data)


# history view with pagination + optional session filter
class DoubtHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            page = int(request.GET.get('page', 1))
            page_size = int(request.GET.get('page_size', 10))
            if page < 1:
                page = 1
            if page_size < 1 or page_size > 100:
                page_size = 10
        except ValueError:
            page = 1
            page_size = 10

        qs = Doubt.objects.filter(user=request.user)
        session_id = request.GET.get("session_id")
        if session_id:
            qs = qs.filter(session_id=session_id)

        qs = qs.order_by("-created_at")
        total = qs.count()
        start = (page - 1) * page_size
        end = start + page_size
        items = qs[start:end]
        serializer = DoubtSerializer(items, many=True)
        has_more = end < total
        return Response({
            'results': serializer.data,
            'page': page,
            'page_size': page_size,
            'total': total,
            'has_more': has_more,
        })


# delete a single doubt
class DeleteDoubtView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Doubt.objects.all()
    serializer_class = DoubtSerializer

    def get_queryset(self):
        # ensure user can only delete own doubts
        return Doubt.objects.filter(user=self.request.user)


# ChatSession endpoints (list/create, delete)
class ChatSessionListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChatSessionSerializer

    def get_queryset(self):
        return ChatSession.objects.filter(user=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ChatSessionDetailView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChatSessionSerializer

    def get_queryset(self):
        return ChatSession.objects.filter(user=self.request.user)


# --- Added delete single doubt and clear all doubts ---
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .models import Doubt
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

class DeleteDoubtView(APIView):
    permission_classes = [IsAuthenticated]
    def delete(self, request, pk):
        try:
            doubt = Doubt.objects.get(pk=pk, user=request.user)
            doubt.delete()
            return Response({'message': 'Deleted successfully'}, status=status.HTTP_200_OK)
        except Doubt.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

class ClearAllDoubtsView(APIView):
    permission_classes = [IsAuthenticated]
    def delete(self, request):
        Doubt.objects.filter(user=request.user).delete()
        return Response({'message': 'All doubts cleared'}, status=status.HTTP_200_OK)
