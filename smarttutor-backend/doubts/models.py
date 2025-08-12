from django.db import models
from django.contrib.auth.models import User

class ChatSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="chat_sessions")
    title = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title or f"Session {self.id} - {self.created_at.isoformat()}"

class Doubt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.TextField()
    answer = models.TextField()
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, null=True, blank=True, related_name="doubts")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.question[:50]
