from django.urls import path
from .views import AskDoubtView, DoubtHistoryView, DeleteDoubtView, ChatSessionListCreateView, ChatSessionDetailView

urlpatterns = [
    path('', AskDoubtView.as_view(), name='ask-doubt'),  # POST to create new doubt (accepts session_id)
    path('history/', DoubtHistoryView.as_view(), name='doubt-history'),  # GET paginated, accepts session_id param
    path('history/<int:pk>/', DeleteDoubtView.as_view(), name='doubt-delete'),  # DELETE a single doubt
    path('sessions/', ChatSessionListCreateView.as_view(), name='chat-session-list'),  # GET/POST
    path('sessions/<int:pk>/', ChatSessionDetailView.as_view(), name='chat-session-detail'),  # DELETE
]


# --- Added delete and clear all routes ---
from .views import DeleteDoubtView, ClearAllDoubtsView
from django.urls import path
urlpatterns += [
    path('doubts/<int:pk>/delete/', DeleteDoubtView.as_view(), name='delete_doubt'),
    path('doubts/clear-all/', ClearAllDoubtsView.as_view(), name='clear_all_doubts'),
]
