from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.upload_user_record, name='upload_user_record'),
    path('success/', views.success, name='success'),
]
