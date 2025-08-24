from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
import json
from .models import Course, Lesson, Enrollment, Progress


@csrf_exempt
def list_courses_api(request):
    """
    List all courses.
    """
    if request.method == "GET":
        courses = Course.objects.all().values("id", "title", "description", "difficulty")
        return JsonResponse({"courses": list(courses)}, safe=False)
    return JsonResponse({"error": "Only GET allowed"}, status=405)


@csrf_exempt
def course_detail_api(request, course_id):
    """
    Get course details + lessons.
    """
    course = get_object_or_404(Course, id=course_id)
    lessons = course.lessons.all().values("id", "title", "content")
    return JsonResponse({
        "id": course.id,
        "title": course.title,
        "description": course.description,
        "difficulty": course.difficulty,
        "lessons": list(lessons)
    })


@csrf_exempt
def suggest_course_api(request):
    """
    Suggest a course based on difficulty.
    """
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))
            difficulty = data.get("difficulty", "easy")
            course = Course.objects.filter(difficulty=difficulty).first()
            if not course:
                return JsonResponse({"error": "No course found for difficulty"}, status=404)

            lessons = course.lessons.all().values("id", "title")
            return JsonResponse({
                "suggested_course": {
                    "id": course.id,
                    "title": course.title,
                    "description": course.description,
                    "difficulty": course.difficulty,
                    "lessons": list(lessons)
                }
            })
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Only POST allowed"}, status=405)


@csrf_exempt
def enroll_course_api(request, course_id):
    """
    Enroll student in a course OR fetch their enrollments.
    """
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))
            student_id = data.get("student_id")
            if not student_id:
                return JsonResponse({"error": "student_id required"}, status=400)

            course = get_object_or_404(Course, id=course_id)
            enrollment, created = Enrollment.objects.get_or_create(student_id=student_id, course=course)

            return JsonResponse({"message": f"Student {student_id} enrolled in {course.title}"})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    elif request.method == "GET":
        student_id = request.GET.get("student_id")
        if not student_id:
            return JsonResponse({"error": "student_id required"}, status=400)

        enrollments = Enrollment.objects.filter(student_id=student_id).select_related("course")
        courses = [{"id": e.course.id, "title": e.course.title} for e in enrollments]

        return JsonResponse({"student": student_id, "enrolled_courses": courses})

    return JsonResponse({"error": "Only POST/GET allowed"}, status=405)


@csrf_exempt
def progress_api(request, course_id):
    """
    Track or get student progress.
    """
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))
            student_id = data.get("student_id")
            lesson_id = data.get("lesson")

            if not student_id or not lesson_id:
                return JsonResponse({"error": "student_id and lesson required"}, status=400)

            course = get_object_or_404(Course, id=course_id)
            enrollment = get_object_or_404(Enrollment, student_id=student_id, course=course)
            lesson = get_object_or_404(Lesson, id=lesson_id, course=course)

            progress, created = Progress.objects.get_or_create(enrollment=enrollment, lesson=lesson)
            progress.completed = True
            progress.save()

            return JsonResponse({"message": f"Lesson '{lesson.title}' marked as completed"})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    elif request.method == "GET":
        student_id = request.GET.get("student_id")
        if not student_id:
            return JsonResponse({"error": "student_id required"}, status=400)

        course = get_object_or_404(Course, id=course_id)
        enrollment = get_object_or_404(Enrollment, student_id=student_id, course=course)
        completed_lessons = Progress.objects.filter(enrollment=enrollment, completed=True).values("lesson__id", "lesson__title")

        return JsonResponse({
            "student": student_id,
            "course": course.title,
            "progress": list(completed_lessons)
        })

    return JsonResponse({"error": "Only POST/GET allowed"}, status=405)
