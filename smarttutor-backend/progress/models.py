from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class CourseProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='course_progress')
    lesson = models.ForeignKey('courses.Lesson', on_delete=models.CASCADE, related_name='progress_entries')
    completed = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'lesson')

    def __str__(self):
        return f"{self.user.username} - {self.lesson} - {'Done' if self.completed else 'Pending'}"

class QuizAttempt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='quiz_attempts')
    quiz = models.ForeignKey('quizzes.Quiz', on_delete=models.CASCADE, related_name='attempts')
    score = models.IntegerField(default=0)
    total = models.IntegerField(default=0)
    percentage = models.FloatField(default=0.0)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user.username} - {self.quiz.title} - {self.percentage:.1f}%"

class QuestionResponse(models.Model):
    attempt = models.ForeignKey(QuizAttempt, on_delete=models.CASCADE, related_name='responses')
    question = models.ForeignKey('quizzes.Question', on_delete=models.CASCADE)
    selected_answer = models.ForeignKey('quizzes.Answer', on_delete=models.SET_NULL, null=True, blank=True)
    correct = models.BooleanField(default=False)
