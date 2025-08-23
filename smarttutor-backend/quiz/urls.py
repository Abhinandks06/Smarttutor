from django.urls import path
from .views import QuizListCreateView, QuizDetailView, QuestionListCreateView, AnswerListCreateView

urlpatterns = [
    path('quizzes/', QuizListCreateView.as_view(), name="quiz-list"),
    path('quizzes/<int:pk>/', QuizDetailView.as_view(), name="quiz-detail"),
    path('questions/', QuestionListCreateView.as_view(), name="question-list"),
    path('answers/', AnswerListCreateView.as_view(), name="answer-list"),
]
