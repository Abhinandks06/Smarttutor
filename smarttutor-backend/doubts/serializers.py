from rest_framework import serializers
from .models import Doubt, ChatSession

class ChatSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatSession
        fields = ["id", "title", "created_at"]

class DoubtSerializer(serializers.ModelSerializer):
    # session will be represented by its id (foreign key default behavior)
    class Meta:
        model = Doubt
        fields = ["id", "question", "answer", "created_at", "session"]
