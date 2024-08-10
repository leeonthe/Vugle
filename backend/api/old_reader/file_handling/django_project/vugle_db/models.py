from django.db import models

class DocumentModel(models.Model):
    name = models.CharField(max_length=255)
    pdf_file = models.FileField(upload_to='documents/')
    extracted_text = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name