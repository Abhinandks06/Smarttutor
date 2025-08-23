from django.db import models
from django.contrib.auth.models import User


# =========================
# Study Programs & Lessons
# =========================
class StudyProgram(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="created_programs"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Lesson(models.Model):
    program = models.ForeignKey(
        StudyProgram, related_name="lessons", on_delete=models.CASCADE
    )
    title = models.CharField(max_length=255)
    content = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.program.title} - {self.title}"


# =========================
# Quizzes & Questions
# =========================
class Quiz(models.Model):
    lesson = models.OneToOneField(
        Lesson, related_name="quiz", on_delete=models.CASCADE
    )
    title = models.CharField(max_length=255)

    def __str__(self):
        return f"Quiz for {self.lesson.title}"


class Question(models.Model):
    quiz = models.ForeignKey(
        Quiz, related_name="questions", on_delete=models.CASCADE
    )
    text = models.CharField(max_length=500)

    def __str__(self):
        return self.text


class Answer(models.Model):
    question = models.ForeignKey(
        Question, related_name="answers", on_delete=models.CASCADE
    )
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.text} ({'Correct' if self.is_correct else 'Wrong'})"


# =========================
# Progress Tracking
# =========================
class Progress(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="doubts_progress"
    )
    lesson = models.ForeignKey(
        Lesson, on_delete=models.CASCADE, related_name="progress_entries"
    )
    completed = models.BooleanField(default=False)
    score = models.FloatField(default=0.0)  # quiz score

    class Meta:
        unique_together = ("user", "lesson")

    def __str__(self):
        return f"{self.user.username} - {self.lesson.title} - {'Done' if self.completed else 'Pending'}"


# =========================
# Chat Sessions & Doubts
# =========================
class ChatSession(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="chat_sessions"
    )
    title = models.CharField(max_length=255, blank=True)
    program = models.ForeignKey(
        StudyProgram,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="chat_sessions",
    )
    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="chat_sessions",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        context = (
            self.lesson.title
            if self.lesson
            else (self.program.title if self.program else "General")
        )
        return self.title or f"Session {self.id} ({context})"


class Doubt(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="doubts"
    )
    question = models.TextField()
    answer = models.TextField()
    session = models.ForeignKey(
        ChatSession,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="doubts",
    )
    lesson = models.ForeignKey(
        Lesson, on_delete=models.SET_NULL, null=True, blank=True, related_name="doubts"
    )
    program = models.ForeignKey(
        StudyProgram,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="doubts",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.question[:50]
