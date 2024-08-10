from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from documents.views import DocumentViewSet
from ai_dex.views import Ai_dexView
# from users.views import UserViewSet

router = routers.DefaultRouter()
# router.register(r'users', UserViewSet)
router.register(r'documents', DocumentViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api/v1.0/app/', include('appSettings.urls')),
    path('chatbot/', include('chatbot.urls')),
    # path('ai/', include('ai.urls')),
    path('o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
    path('ai_dex/', Ai_dexView.as_view(), name='ai_dex'),
    path('ai_dex/', include('ai_dex.urls')),
    path('user_records/', include('documents.urls')),
]
