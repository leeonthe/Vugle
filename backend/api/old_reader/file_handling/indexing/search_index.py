from google.cloud import aiplatform
from django_project.vugle_db.models import DocumentModel

def search_documents(query, project_id, location, index_endpoint):
    aiplatform.init(project=project_id, location=location)
    client = aiplatform.gapic.FeaturestoreOnlineServingServiceClient()

    # Assume the embedding for the query is obtained through some function
    query_embedding = get_query_embedding(query)

    # Making the embedding search request
    request = {
        "index_endpoint": index_endpoint,
        "deployed_index_id": "your-deployed-index-id",
        "data": query_embedding
    }

    results = client.match(request=request)
    matched_documents = [DocumentModel.objects.get(id=result.id) for result in results]

    return matched_documents

def get_query_embedding(query):
    # This function needs to convert text query into embedding, potentially using another model or API
    return [0.0] * 128  # Dummy example

# Example usage
if __name__ == "__main__":
    project_id = 'your-project-id'
    location = 'your-location'
    index_endpoint = 'your-index-endpoint'
    query = "example search query"
    results = search_documents(query, project_id, location, index_endpoint)
    for result in results:
        print(result.name, result.extracted_text)
