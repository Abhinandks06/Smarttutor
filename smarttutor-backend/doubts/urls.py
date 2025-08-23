from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    # Frontend-used endpoints
    AskDoubtView, DoubtHistoryView, DeleteDoubtView,
    ChatSessionListCreateView, ChatSessionDetailView, ClearAllDoubtsView,

    # Study/Quiz/Progress APIs
    StudyProgramViewSet, LessonViewSet, QuizViewSet,
    QuestionViewSet, AnswerViewSet, ProgressViewSet, SubmitQuizView
)

router = DefaultRouter()
router.register(r'programs', StudyProgramViewSet, basename='program')
router.register(r'lessons', LessonViewSet, basename='lesson')
router.register(r'quizzes', QuizViewSet, basename='quiz')
router.register(r'questions', QuestionViewSet, basename='question')
router.register(r'answers', AnswerViewSet, basename='answer')
router.register(r'progress', ProgressViewSet, basename='progress')

urlpatterns = [
    # Doubts + Sessions (kept as-is for your existing frontend)
    path('', AskDoubtView.as_view(), name='ask-doubt'),  # POST
    path('history/', DoubtHistoryView.as_view(), name='doubt-history'),  # GET paginated (session_id optional)
    path('history/<int:pk>/', DeleteDoubtView.as_view(), name='doubt-delete'),  # DELETE one
    path('sessions/', ChatSessionListCreateView.as_view(), name='chat-session-list'),  # GET/POST
    path('sessions/<int:pk>/', ChatSessionDetailView.as_view(), name='chat-session-detail'),  # DELETE
    path('doubts/clear-all/', ClearAllDoubtsView.as_view(), name='clear_all_doubts'),

    # Study / Quiz / Progress
    path('', include(router.urls)),
    path('quiz/<int:quiz_id>/submit/', SubmitQuizView.as_view(), name='submit-quiz'),
]
