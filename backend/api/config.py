from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

GCP_PROJECT_ID = os.getenv('GCP_PROJECT_ID')
GCP_LOCATION = os.getenv('GCP_LOCATION')
GCP_PROCESSOR_ID = os.getenv('GCP_PROCESSOR_ID')
GCP_SERVICE_ACCOUNT_PATH = os.getenv('GCP_SERVICE_ACCOUNT_PATH')

# OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
