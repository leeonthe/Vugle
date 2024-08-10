import google.auth
from google.cloud import aiplatform

def handle_chatbot_query(query):
    project_id = "your_project_id"
    location = "us-central1"  # Adjust as necessary
    model_id = "your_model_id"

    # Initialize the API client
    credentials, _ = google.auth.default()
    client = aiplatform.gapic.PredictionServiceClient(credentials=credentials)

    # Prepare the request
    endpoint = f"projects/{project_id}/locations/{location}/endpoints/{model_id}"
    instances = [{"query": query}]

    response = client.predict(endpoint=endpoint, instances=instances)
    return response.predictions[0]['content']