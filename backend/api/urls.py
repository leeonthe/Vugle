from django.urls import path
from .views import oauth_login, oauth_callback

urlpatterns = [
    path('oauth/login/', oauth_login, name='oauth_login'),
    path('oauth/callback/', oauth_callback, name='oauth_callback'),
]
