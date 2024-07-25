from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1.0/user/', include('api.urls')),
    path('api/v1.0/app/', include('appSettings.urls')),
]
