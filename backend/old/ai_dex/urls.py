from django.urls import path
from . import views

urlpatterns = [
    path('query/', views.chatbot_query, name='chatbot_query'),
]