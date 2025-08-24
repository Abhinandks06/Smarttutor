from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from .models import CourseProgress, QuizAttempt, QuestionResponse
from .serializers import CourseProgressSerializer, QuizAttemptSerializer
from courses.models import Lesson
from quizzes.models import Quiz, Question, Answer

class CourseProgressViewSet(viewsets.ModelViewSet):
    serializer_class = CourseProgressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CourseProgress.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SubmitQuizAPIView(APIView):
    """
    POST /api/progress/quizzes/<quiz_id>/submit/
    Body: {"answers": {"<question_id>": <answer_id>, ...}}
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, quiz_id):
        quiz = get_object_or_404(Quiz, pk=quiz_id, created_by=request.user)
        answers_map = request.data.get('answers', {})

        total = quiz.questions.count()
        score = 0

        attempt = QuizAttempt.objects.create(user=request.user, quiz=quiz, total=total)

        for question in quiz.questions.all():
            selected_answer_id = answers_map.get(str(question.id))
            selected = Answer.objects.filter(pk=selected_answer_id, question=question).first() if selected_answer_id else None
            correct = bool(selected and selected.is_correct)
            if correct:
                score += 1
            QuestionResponse.objects.create(
                attempt=attempt,
                question=question,
                selected_answer=selected,
                correct=correct
            )

        percentage = (score / total * 100) if total else 0.0
        attempt.score = score
        attempt.percentage = percentage
        attempt.save()

        # if the quiz is tied to a lesson, we can mark lesson progress (optional rule)
        if quiz.lesson:
            cp, _ = CourseProgress.objects.get_or_create(user=request.user, lesson=quiz.lesson)
            if percentage >= 70.0:  # mark complete threshold (customizable)
                cp.completed = True
                cp.save()

        return Response(QuizAttemptSerializer(attempt).data, status=200)
