from rest_framework import generics
from .models import StudyProgram, Lesson
from .serializers import StudyProgramSerializer, LessonSerializer

class StudyProgramListCreateView(generics.ListCreateAPIView):
    queryset = StudyProgram.objects.all()
    serializer_class = StudyProgramSerializer


class StudyProgramDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = StudyProgram.objects.all()
    serializer_class = StudyProgramSerializer


class LessonListCreateView(generics.ListCreateAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer


class LessonDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
