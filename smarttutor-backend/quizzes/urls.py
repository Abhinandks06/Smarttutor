from django.urls import path
from .views import generate_quiz_api

urlpatterns = [
    path("generate/", generate_quiz_api, name="generate_quiz"),
]
