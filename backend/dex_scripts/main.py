from analyze_pdf import analyze_document
from chatbot import query_gpt
import os

def find_relevant_documents(query, documents_dir="dex_docs/sample_medical_records/"):
    relevant_docs = []
    for filename in os.listdir(documents_dir):
        if filename.endswith((".pdf", ".jpg", ".jpeg", ".png")):  # Support for multiple file types
            file_path = os.path.join(documents_dir, filename)
            document_text = analyze_document(file_path)
            relevance_prompt = f"Given the following content: '{document_text}', is it relevant to the query: '{query}'? Answer 'yes' or 'no' and explain why."
            relevance_response = query_gpt(relevance_prompt)
            if "yes" in relevance_response.lower():
                relevant_docs.append((filename, relevance_response))
    return relevant_docs

if __name__ == "__main__":
    print("Enter your queries. Type 'stop' or 'quit' to stop.")
    
    while True:
        user_query = input("Please enter your query: ")
        
        if user_query.lower() in ["stop", "quit"]:
            print("Exiting the program.")
            break
        
        relevant_docs = find_relevant_documents(user_query)
        
        if relevant_docs:
            for doc, relevance in relevant_docs:
                print(f"Relevant document found: {doc}")
                document_text = analyze_document(os.path.join("dex_docs/sample_medical_records", doc))
                chatbot_response = query_gpt(f"Based on the following medical record, {document_text}, {user_query}")
                print(f"Response to query from document '{doc}':")
                print(chatbot_response)
        else:
            print("No relevant documents found.")
