from django.db import models
from django.contrib.auth.models import User
from study.models import Lesson

class Progress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)
    score = models.FloatField(default=0.0)  # quiz score

    class Meta:
        unique_together = ("user", "lesson")

    def __str__(self):
        return f"{self.user.username} - {self.lesson.title} - {'Done' if self.completed else 'Pending'}"
