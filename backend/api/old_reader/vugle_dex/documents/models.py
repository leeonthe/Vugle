from django.db import models

class Document(models.Model):
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='documents/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    analyzed_text = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title