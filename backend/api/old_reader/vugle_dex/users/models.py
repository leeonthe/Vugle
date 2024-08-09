from django.db import models

class User(models.Model):
    name = models.CharField(max_length=255)
    icn = models.CharField(max_length=255, unique=True)
    disability_rating = models.IntegerField()

    def __str__(self):
        return self.name
