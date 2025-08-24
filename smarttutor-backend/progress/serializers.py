from rest_framework import serializers
from .models import CourseProgress, QuizAttempt, QuestionResponse

class CourseProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseProgress
        fields = ['id', 'user', 'lesson', 'completed', 'updated_at']
        read_only_fields = ['id', 'user', 'updated_at']

class QuestionResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionResponse
        fields = ['id', 'question', 'selected_answer', 'correct']
        read_only_fields = ['id', 'correct']

class QuizAttemptSerializer(serializers.ModelSerializer):
    responses = QuestionResponseSerializer(many=True, read_only=True)
    class Meta:
        model = QuizAttempt
        fields = ['id', 'user', 'quiz', 'score', 'total', 'percentage', 'created_at', 'responses']
        read_only_fields = ['id', 'user', 'score', 'total', 'percentage', 'created_at', 'responses']
