# chatbot/urls.py

from django.urls import path
from .views import ChatbotView

urlpatterns = [
    path('', ChatbotView.as_view(), name='chatbot'),
    path('finding_right_claim/', ChatbotView.get_finding_right_claim, name='get_finding_right_claim'),

]
