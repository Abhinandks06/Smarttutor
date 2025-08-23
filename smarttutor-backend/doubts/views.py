from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from .models import (
    ChatSession, Doubt,
    StudyProgram, Lesson, Quiz, Question, Answer, Progress
)
from .serializers import (
    ChatSessionSerializer, DoubtSerializer,
    StudyProgramSerializer, LessonSerializer,
    QuizSerializer, QuestionSerializer, AnswerSerializer,
    ProgressSerializer
)

# ===========================
#  SIMPLE AI ANSWER (replace with your real AI call)
# ===========================
def get_ai_answer(question: str) -> str:
    # Swap this with your real AI integration.
    return f"AI-generated answer for: {question}"


# ===========================
#  ENDPOINTS USED BY FRONTEND
# ===========================

class AskDoubtView(generics.CreateAPIView):
    """
    POST /api/doubts/
    Body: { question: str, session: optional int, program: optional int, lesson: optional int }
    """
    serializer_class = DoubtSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        question = request.data.get("question", "").strip()
        if not question:
            return Response({"error": "No question provided"}, status=400)

        session_id = request.data.get("session")
        program_id = request.data.get("program")
        lesson_id = request.data.get("lesson")

        session = None
        program = None
        lesson = None

        if session_id:
            session = get_object_or_404(ChatSession, pk=session_id, user=request.user)
        if program_id:
            program = get_object_or_404(StudyProgram, pk=program_id, created_by=request.user)
        if lesson_id:
            lesson = get_object_or_404(Lesson, pk=lesson_id, program__created_by=request.user)

        answer = get_ai_answer(question)

        doubt = Doubt.objects.create(
            user=request.user,
            question=question,
            answer=answer,
            session=session,
            program=program,
            lesson=lesson,
        )
        data = DoubtSerializer(doubt).data
        return Response(data, status=201)


class DoubtHistoryView(generics.ListAPIView):
    """
    GET /api/doubts/history/?page=&page_size=&session_id=
    Returns: {results, page, page_size, total, has_more}
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
        data = DoubtSerializer(items, many=True).data
        has_more = end < total
        return Response({
            'results': data,
            'page': page,
            'page_size': page_size,
            'total': total,
            'has_more': has_more,
        })


class DeleteDoubtView(generics.DestroyAPIView):
    """
    DELETE /api/doubts/history/<pk>/
    """
    serializer_class = DoubtSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Doubt.objects.filter(user=self.request.user)


class ClearAllDoubtsView(generics.GenericAPIView):
    """
    DELETE /api/doubts/doubts/clear-all/   (kept path to match your existing urls.py)
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        Doubt.objects.filter(user=request.user).delete()
        return Response({'message': 'All doubts cleared'}, status=status.HTTP_200_OK)


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


# ===========================
#   STUDY PROGRAM VIEWSETS
# ===========================

class StudyProgramViewSet(viewsets.ModelViewSet):
    serializer_class = StudyProgramSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return StudyProgram.objects.filter(created_by=self.request.user)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class LessonViewSet(viewsets.ModelViewSet):
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Lesson.objects.filter(program__created_by=self.request.user)


class QuizViewSet(viewsets.ModelViewSet):
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Quiz.objects.filter(lesson__program__created_by=self.request.user)


class QuestionViewSet(viewsets.ModelViewSet):
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Question.objects.filter(quiz__lesson__program__created_by=self.request.user)


class AnswerViewSet(viewsets.ModelViewSet):
    serializer_class = AnswerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Answer.objects.filter(question__quiz__lesson__program__created_by=self.request.user)


class ProgressViewSet(viewsets.ModelViewSet):
    serializer_class = ProgressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Progress.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ===========================
#   CUSTOM QUIZ SUBMISSION
# ===========================

class SubmitQuizView(generics.GenericAPIView):
    """
    POST /api/doubts/quiz/<quiz_id>/submit/
    Body: { "answers": { "<question_id>": <answer_id>, ... } }
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, quiz_id):
        quiz = get_object_or_404(Quiz, id=quiz_id, lesson__program__created_by=request.user)
        answers = request.data.get("answers", {})  # {question_id: answer_id}

        score = 0
        total = quiz.questions.count()

        for question in quiz.questions.all():
            selected_answer_id = answers.get(str(question.id))
            if selected_answer_id:
                ans = Answer.objects.filter(id=selected_answer_id, question=question).first()
                if ans and ans.is_correct:
                    score += 1

        percentage = (score / total * 100) if total > 0 else 0.0

        progress, created = Progress.objects.get_or_create(
            user=request.user,
            lesson=quiz.lesson,
            defaults={"completed": True, "score": percentage}
        )
        if not created:
            progress.completed = True
            progress.score = percentage
            progress.save()

        return Response({
            "score": score,
            "total": total,
            "percentage": percentage,
        }, status=status.HTTP_200_OK)
