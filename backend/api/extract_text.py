import os
from google.cloud import documentai_v1beta3 as documentai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def extract_text_from_document(file_path):
    project_id = os.getenv('GCP_PROJECT_ID')
    location = os.getenv('GCP_LOCATION')
    processor_id = os.getenv('GCP_PROCESSOR_ID')

    client = documentai.DocumentProcessorServiceClient.from_service_account_json(os.getenv('GCP_SERVICE_ACCOUNT_PATH'))
    with open(file_path, "rb") as file:
        image_content = file.read()

    document = {"content": image_content, "mime_type": "application/pdf"}
    name = f"projects/{project_id}/locations/{location}/processors/{processor_id}"

    request = documentai.ProcessRequest(name=name, raw_document=document)
    result = client.process_document(request=request)
    document = result.document

    text = ""
    for page in document.pages:
        for paragraph in page.paragraphs:
            paragraph_text = get_text(paragraph.layout, document.text)
            text += paragraph_text + "\n"

    return text

def get_text(layout, text):
    """
    Extracts text based on text anchor in the layout.
    """
    response_text = ""
    for segment in layout.text_anchor.text_segments:
        start_index = int(segment.start_index)
        end_index = int(segment.end_index)
        response_text += text[start_index:end_index]
    return response_text
