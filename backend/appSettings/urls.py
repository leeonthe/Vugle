from django.urls import path
from .views import SettingsView
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

urlpatterns = [
    path('settings', SettingsView.as_view()),
    path('create-new-setting', SettingsView.as_view()),

]
