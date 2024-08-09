import os
from google.cloud import aiplatform
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

PROJECT_ID = os.getenv('GCP_PROJECT_ID')
LOCATION = os.getenv('LOCATION')
MODEL_NAME = "your_model_name"
DEPLOYED_MODEL_NAME = "deployed_model_name"

def deploy_model():
    aiplatform.init(project=PROJECT_ID, location=LOCATION)
    model = aiplatform.Model(model_name=MODEL_NAME)

    endpoint = model.deploy(
        deployed_model_display_name=DEPLOYED_MODEL_NAME,
        machine_type="n1-standard-4",
    )

    return endpoint.resource_name

if __name__ == "__main__":
    endpoint_resource_name = deploy_model()
    print(f"Model deployed to endpoint: {endpoint_resource_name}")