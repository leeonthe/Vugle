import os
from django.conf import settings
from rest_framework import viewsets
from .models import Document
from .serializers import DocumentSerializer
from google.cloud import documentai_v1beta3 as documentai

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer

    def perform_create(self, serializer):
        document = serializer.save()
        self.analyze_document(document)

    def analyze_document(self, document):
        client = documentai.DocumentUnderstandingServiceClient()
        gcs_document = documentai.types.GcsDocument(
            gcs_uri=f'gs://your_bucket_name/{document.file.name}',
            mime_type='application/pdf'
        )
        input_config = documentai.types.InputConfig(gcs_document=gcs_document)
        request = documentai.types.ProcessDocumentRequest(
            input_config=input_config
        )
        result = client.process_document(request=request)
        document.analyzed_text = result.text
        document.save()
