# import google.auth
# from google.cloud import aiplatform
# from documents.models import Document

# def handle_chatbot_query(query, user_id):
#     project_id = "vugle-health-431600"
#     location = "us-central1"
#     model_id = "your_model_id"

#     # Initialize the API client
#     credentials, _ = google.auth.default()
#     client = aiplatform.gapic.PredictionServiceClient(credentials=credentials)

#     # Retrieve user documents
#     documents = Document.objects.filter(user_id=user_id)
#     if not documents.exists():
#         return "No documents found for the user."

#     relevant_docs = [doc.analyzed_text for doc in documents if query.lower() in (doc.analyzed_text or "").lower()]

#     if not relevant_docs:
#         return "No relevant documents found."

#     # Prepare the request for Vertex AI
#     instances = [{"content": " ".join(relevant_docs), "query": query}]

#     endpoint = f"projects/{project_id}/locations/{location}/endpoints/{model_id}"
#     response = client.predict(endpoint=endpoint, instances=instances)

#     return response.predictions[0]['content'] if response.predictions else "No relevant information found."