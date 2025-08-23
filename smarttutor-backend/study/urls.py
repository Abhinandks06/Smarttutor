from django.urls import path
from .views import StudyProgramListCreateView, StudyProgramDetailView, LessonListCreateView, LessonDetailView

urlpatterns = [
    path('programs/', StudyProgramListCreateView.as_view(), name="studyprogram-list"),
    path('programs/<int:pk>/', StudyProgramDetailView.as_view(), name="studyprogram-detail"),
    path('lessons/', LessonListCreateView.as_view(), name="lesson-list"),
    path('lessons/<int:pk>/', LessonDetailView.as_view(), name="lesson-detail"),
]
