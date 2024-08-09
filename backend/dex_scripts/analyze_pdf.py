from google.cloud import documentai_v1beta3 as documentai
import os
import yaml

# Load config
with open('dex_config/config.yaml', 'r') as f:
    config = yaml.safe_load(f)

def analyze_document(file_path):
    client = documentai.DocumentProcessorServiceClient.from_service_account_json(config['gcp_credentials_path'])
    project_id = config['gcp_project_id']
    location = config['gcp_location']
    processor_id = config['gcp_processor_id']

    # Determine the MIME type based on the file extension
    if file_path.lower().endswith('.pdf'):
        mime_type = "application/pdf"
    elif file_path.lower().endswith('.jpg') or file_path.lower().endswith('.jpeg'):
        mime_type = "image/jpeg"
    elif file_path.lower().endswith('.png'):
        mime_type = "image/png"
    else:
        raise ValueError("Unsupported file format")

    # Read the file into memory
    with open(file_path, 'rb') as f:
        document_content = f.read()

    document = {"content": document_content, "mime_type": mime_type}

    name = f"projects/{project_id}/locations/{location}/processors/{processor_id}"
    request = documentai.ProcessRequest(name=name, raw_document=document)

    result = client.process_document(request=request)
    document = result.document

    text = document.text
    return text

if __name__ == "__main__":
    file_path = "dex_docs/sample_medical_records/DD214_dummy.jpeg"
    text = analyze_document(file_path)
    print(text)
