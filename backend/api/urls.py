from django.urls import path
from .views import TestView, UserView, UserLoginView
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

urlpatterns = [
    path('test/', TestView.as_view()),
    path('create-user/', UserView.as_view()),
    path('get-user/', UserLoginView.as_view()), 
]
