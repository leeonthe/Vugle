from google.cloud import documentai_v1 as documentai
from django.conf import settings
from myapp.models import UserRecord

def process_ocr(user_record_id):
    user_record = UserRecord.objects.get(id=user_record_id)
    client = documentai.DocumentProcessorServiceClient()
    
    with open(user_record.pdf.path, "rb") as pdf_file:
        pdf_content = pdf_file.read()
    
    document = {"content": pdf_content, "mime_type": "application/pdf"}
    name = f"projects/{settings.GCLOUD_PROJECT}/locations/us/processors/{settings.DOCUMENT_AI_PROCESSOR_ID}"
    request = {"name": name, "raw_document": document}
    
    response = client.process_document(request=request)
    
    text_content = response.document.text
    user_record.text_content = text_content
    user_record.save()