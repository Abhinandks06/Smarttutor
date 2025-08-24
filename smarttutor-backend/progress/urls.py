from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseProgressViewSet, SubmitQuizAPIView

router = DefaultRouter()
router.register(r'course', CourseProgressViewSet, basename='course-progress')

urlpatterns = [
    path('', include(router.urls)),
    path('quizzes/<int:quiz_id>/submit/', SubmitQuizAPIView.as_view(), name='submit-quiz'),
]
