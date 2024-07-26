# api/models.py
from django.db import models
from oauth2_provider.models import AbstractApplication
from django.contrib.auth.models import User

class Application(AbstractApplication):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
