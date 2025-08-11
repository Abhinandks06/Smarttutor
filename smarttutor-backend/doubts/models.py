from django.db import models
from django.contrib.auth.models import User

class Doubt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="doubts")
    question = models.TextField()
    answer = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Doubt({self.user.username}): {self.question[:30]}..."
