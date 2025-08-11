from django.urls import path
from .views import AskDoubtView, DoubtHistoryView

urlpatterns = [
    path('', AskDoubtView.as_view(), name='ask-doubt'),
    path('history/', DoubtHistoryView.as_view(), name='doubt-history'),
]