from rest_framework import serializers
from .models import (
    ChatSession, Doubt,
    StudyProgram, Lesson, Quiz, Question, Answer, Progress
)


# =======================
#  CHAT & DOUBT SYSTEM
# =======================

class ChatSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatSession
        fields = ["id", "title", "created_at", "user", "program", "lesson"]
        read_only_fields = ["id", "created_at", "user"]


class DoubtSerializer(serializers.ModelSerializer):
    session_title = serializers.CharField(source="session.title", read_only=True)
    program_title = serializers.CharField(source="program.title", read_only=True)
    lesson_title = serializers.CharField(source="lesson.title", read_only=True)

    class Meta:
        model = Doubt
        fields = [
            "id", "question", "answer", "created_at", "session",
            "session_title", "program", "program_title", "lesson", "lesson_title"
        ]
        read_only_fields = ["id", "answer", "created_at"]


# =======================
#  STUDY PROGRAM
# =======================

class StudyProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyProgram
        fields = ["id", "title", "description", "created_at", "created_by"]
        read_only_fields = ["id", "created_at", "created_by"]


class LessonSerializer(serializers.ModelSerializer):
    program_title = serializers.CharField(source="program.title", read_only=True)

    class Meta:
        model = Lesson
        fields = ["id", "program", "program_title", "title", "content", "order"]


# =======================
#  QUIZ & QUESTIONS
# =======================

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ["id", "text", "is_correct"]


class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ["id", "text", "answers", "quiz"]


class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    lesson_title = serializers.CharField(source="lesson.title", read_only=True)

    class Meta:
        model = Quiz
        fields = ["id", "lesson", "lesson_title", "title", "questions"]


# =======================
#  PROGRESS TRACKING
# =======================

class ProgressSerializer(serializers.ModelSerializer):
    lesson_title = serializers.CharField(source="lesson.title", read_only=True)

    class Meta:
        model = Progress
        fields = ["id", "lesson", "lesson_title", "completed", "score", "user"]
        read_only_fields = ["id", "user", "lesson_title"]
