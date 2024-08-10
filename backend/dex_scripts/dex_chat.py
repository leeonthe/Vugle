import openai
import yaml
import os
from google.cloud import documentai_v1beta3 as documentai

# Load config
with open('dex_config/config.yaml', 'r') as f:
    config = yaml.safe_load(f)

openai.api_key = config['openai_api_key']

def analyze_document(file_path):
    client = documentai.DocumentProcessorServiceClient.from_service_account_json(config['gcp_credentials_path'])
    project_id = config['gcp_project_id']
    location = config['gcp_location']
    processor_id = config['gcp_processor_id']

    if file_path.lower().endswith('.pdf'):
        mime_type = "application/pdf"
    elif file_path.lower().endswith('.jpg') or file_path.lower().endswith('.jpeg'):
        mime_type = "image/jpeg"
    elif file_path.lower().endswith('.png'):
        mime_type = "image/png"
    else:
        raise ValueError("Unsupported file format")

    with open(file_path, 'rb') as f:
        document_content = f.read()

    document = {"content": document_content, "mime_type": mime_type}

    name = f"projects/{project_id}/locations/{location}/processors/{processor_id}"
    request = documentai.ProcessRequest(name=name, raw_document=document)

    result = client.process_document(request=request)
    document = result.document

    return document.text

def query_gpt(prompt):
    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
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

def find_relevant_documents(query, documents_dir="dex_docs/sample_medical_records/"):
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

if __name__ == "__main__":
    print("Welcome! Dex will help you find relevant medical documents and answer your questions about them.")
    print("You can also ask general questions. Type 'stop' to end the session.")
    
    while True:
        user_query = input("Please enter your query: ")
        
        if user_query.lower() in ["stop"]:
            print("Ending Dex.")
            break
        
        relevant_docs = find_relevant_documents(user_query)
        
        if relevant_docs:
            for doc, relevant_text in relevant_docs:
                print(f"Relevant document found: {doc}")
                chatbot_response = query_gpt(f"Based on the following extracted content, {relevant_text}, {user_query}")
                print(f"Response to query from document '{doc}':")
                print(chatbot_response)
        else:
            print("No relevant documents found. Answering as a general query.")
            general_response = query_gpt(user_query)
            print("Chatbot Response:")
            print(general_response)
