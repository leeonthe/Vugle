from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api/v1.0/app/', include('appSettings.urls')),
    path('o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
]
