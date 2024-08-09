from google.cloud import aiplatform
from django_project.vugle_db.models import DocumentModel

def create_embedding_index(project_id, location, index_display_name):
    """
    Creates an embedding index in Vertex AI.
    
    Args:
        project_id (str): Google Cloud project ID.
        location (str): Location for the Vertex AI resources.
        index_display_name (str): The display name for the created index.

    Returns:
        The created index object.
    """
    client = aiplatform.IndexEndpointServiceClient()

    # Define the location path for the Vertex AI resource
    location_path = client.common_location_path(project_id, location)

    # Configuration for the index
    index = {
        "display_name": index_display_name,
        "description": "Embedding index for document search",
        "metadata_schema_uri": "gs://google-cloud-aiplatform/schema/index/vertexai-embeds-generic-v1.json",
        "deployed_indexes": []
    }

    # Create the index
    operation = client.create_index(parent=location_path, index=index)
    print("Creating index...")
    response = operation.result()

    print(f"Index created: {response.name}")
    return response

def generate_embeddings_and_upload(project_id, location, index_name):
    """
    Generates embeddings for all documents and uploads them to the index.
    
    Args:
        project_id (str): Google Cloud project ID.
        location (str): Location for the Vertex AI resources.
        index_name (str): Name of the index where embeddings will be uploaded.
    """
    documents = DocumentModel.objects.all()
    embeddings = []

    for document in documents:
        # Assuming you have a function to generate embeddings from text
        embedding = get_document_embedding(document.extracted_text)
        embeddings.append(embedding)

    # Upload embeddings to the index
    client = aiplatform.IndexEndpointServiceClient()
    index_endpoint = client.index_endpoint_path(project_id, location, index_name)

    # Batch upload or individual uploads depending on the API and size of embeddings
    for embedding in embeddings:
        client.upload_indexed_data(index_endpoint, data_items=[embedding])

    print("All embeddings uploaded successfully.")

def get_document_embedding(text):
    """
    Placeholder function to generate embeddings from text.
    You will need to replace this with actual model inference logic.
    
    Args:
        text (str): Text to convert into an embedding.

    Returns:
        A list representing the embedding.
    """
    # Example: return a dummy embedding
    return [float(ord(char)) % 256 for char in text[:128]]  # Simple placeholder

if __name__ == "__main__":
    PROJECT_ID = 'your-google-cloud-project-id'
    LOCATION = 'your-google-cloud-location'
    INDEX_DISPLAY_NAME = 'DocumentSearchIndex'

    # Create an index
    index = create_embedding_index(PROJECT_ID, LOCATION, INDEX_DISPLAY_NAME)
    
    # Optionally generate and upload embeddings
    generate_embeddings_and_upload(PROJECT_ID, LOCATION, index.name)
