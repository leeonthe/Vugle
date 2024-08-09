import os
from google.cloud import aiplatform
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

PROJECT_ID = os.getenv('GCP_PROJECT_ID')
LOCATION = os.getenv('LOCATION')
ENDPOINT_ID = "your_endpoint_id"

def search_text(query):
    aiplatform.init(project=PROJECT_ID, location=LOCATION)
    endpoint = aiplatform.Endpoint(endpoint_name=ENDPOINT_ID)

    response = endpoint.predict(instances=[{"content": query}])
    return response.predictions

if __name__ == "__main__":
    while True:
        query = input("Enter a query (or type 'exit' to quit): ")
        if query.lower() == 'exit':
            break
        
        results = search_text(query)
        print("Search Results:")
        for result in results:
            print(result)
