import openai
import yaml
import os
from google.cloud import documentai_v1beta3 as documentai



script_dir = os.path.dirname(os.path.abspath(__file__))
config_path = os.path.join(script_dir, '../dex_config/config.yaml')

# script_dir = os.path.dirname(os.path.abspath(__file__))
# config_path = os.path.join(script_dir, '../dex_config/config.yaml')
print("Config Path:", config_path)

with open(config_path, 'r') as f:
    config = yaml.safe_load(f)

openai.api_key = config['openai_api_key']

gcp_credentials_path = "/Users/yoon/Documents/Vugle/backend/dex_config/vugle-dex-1505d9c56161.json"

def analyze_document(file_path):
    try:
        print(f"Processing file: {file_path}")
        
        # Determine MIME type
        if file_path.lower().endswith('.pdf'):
            mime_type = "application/pdf"
        elif file_path.lower().endswith('.jpg') or file_path.lower().endswith('.jpeg'):
            mime_type = "image/jpeg"
        elif file_path.lower().endswith('.png'):
            mime_type = "image/png"
        else:
            raise ValueError("Unsupported file format")

        print(f"Detected MIME type: {mime_type}")

        client = documentai.DocumentProcessorServiceClient.from_service_account_json(gcp_credentials_path)
        project_id = config['gcp_project_id']
        location = config['gcp_location']
        processor_id = config['gcp_processor_id']

        with open(file_path, 'rb') as f:
            document_content = f.read()

        document = {"content": document_content, "mime_type": mime_type}
        name = f"projects/{project_id}/locations/{location}/processors/{processor_id}"
        request = documentai.ProcessRequest(name=name, raw_document=document)

        result = client.process_document(request=request)
        document = result.document

        return document.text

    except Exception as e:
        print(f"Error in analyze_document: {e}")
        raise


def query_gpt(prompt):
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful assistant, analyzing medical and military history documents."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=500
    )
    return response['choices'][0]['message']['content'].strip()

def extract_relevant_text(document_text, query):
    prompt = f"Extract the relevant sections from the following text that pertain to the query: '{query}'. Text: '{document_text}'"
    relevant_text = query_gpt(prompt)
    return relevant_text

def find_relevant_documents(query, documents_dir="../dex_docs/sample_medical_records/"):
    relevant_docs = []
    for filename in os.listdir(documents_dir):
        if filename.endswith((".pdf", ".jpg", ".jpeg", ".png")):
            file_path = os.path.join(documents_dir, filename)
            document_text = analyze_document(file_path)
            relevance_prompt = f"Given the following content: '{document_text}', is it relevant to the query: '{query}'? Answer 'yes' or 'no' and explain why."
            relevance_response = query_gpt(relevance_prompt)
            if "yes" in relevance_response.lower():
                relevant_text = extract_relevant_text(document_text, query)
                relevant_docs.append((filename, relevant_text))
    return relevant_docs

def generate_potential_conditions(user_input):
    prompt = f"Given the user's condition: '{user_input}', what other conditions might be related or could be of concern?"
    potential_conditions = query_gpt(prompt)
    return potential_conditions.split('\n')

def clear_session_data(session):
    session.flush()
