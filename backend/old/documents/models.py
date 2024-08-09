from django.db import models
from django.contrib.auth.models import User

class UserRecord(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    pdf = models.FileField(upload_to='user_records/')
    text_content = models.TextField(blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"UserRecord({self.user.username}, {self.uploaded_at})"
