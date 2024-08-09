import os
from google.cloud import documentai_v1 as documentai
from django_project.vugle_db.models import DocumentModel

def parse_document(document_id):
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    
    client = documentai.DocumentProcessorServiceClient()
    document_record = DocumentModel.objects.get(id=document_id)
    pdf_content = document_record.pdf_file.read()

    name = f'projects/{os.getenv("GOOGLE_CLOUD_PROJECT_ID")}/locations/{os.getenv("GOOGLE_CLOUD_LOCATION")}/processors/{os.getenv("DOCUMENT_AI_PROCESSOR_ID")}'
    request = documentai.ProcessRequest(
        name=name,
        raw_document=documentai.RawDocument(
            content=pdf_content,
            mime_type='application/pdf'
        )
    )

    result = client.process_document(request=request)
    extracted_text = result.document.text

    # Save the extracted text back into the database
    document_record.extracted_text = extracted_text
    document_record.save()

    print("Document processing and storage complete.")
