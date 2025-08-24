from django.urls import path
from .views import course_suggestion_api

urlpatterns = [
    path("course/", course_suggestion_api, name="course_suggestion"),
]
