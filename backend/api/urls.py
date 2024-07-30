from django.urls import path
from .views import OAuthLoginView, OAuthCallbackView

urlpatterns = [
    path('oauth/login/', OAuthLoginView.as_view(), name='oauth_login'),
    path('oauth/callback/', OAuthCallbackView.as_view(), name='oauth_callback'),
]