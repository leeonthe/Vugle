from django.urls import path
from .views import TestView
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

urlpatterns = [
    path('', TestView.as_view()),
]
