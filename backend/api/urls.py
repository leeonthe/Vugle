from django.urls import path
from .views import OAuthLoginView, OAuthCallbackView, GenerateJWTView, GetAccessTokenView

urlpatterns = [
    path('oauth/login/', OAuthLoginView.as_view(), name='oauth_login'),
    path('oauth/callback/', OAuthCallbackView.as_view(), name='oauth_callback'),
    path('generate-jwt/', GenerateJWTView.as_view(), name='generate_jwt'),
    path('get-access-token/', GetAccessTokenView.as_view(), name='get_access_token'),
]

