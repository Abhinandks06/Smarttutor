from django.urls import path
from . import views

urlpatterns = [
    path("courses/", views.list_courses_api, name="list-courses"),
    path("courses/<int:course_id>/", views.course_detail_api, name="course-detail"),
    path("suggest/", views.suggest_course_api, name="suggest-course"),
    path("courses/<int:course_id>/enroll/", views.enroll_course_api, name="enroll-course"),
    path("courses/<int:course_id>/progress/", views.progress_api, name="progress"),
]
