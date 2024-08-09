# data_processing/data_storage.py

from django_project.app_name.models import DocumentModel
from utils.db_utils import get_document_by_id, update_extracted_text

def save_extracted_data(document_id, extracted_text):
    """
    Saves the extracted text from a document to the corresponding database entry.
    
    Args:
        document_id (int): The ID of the document to update.
        extracted_text (str): The extracted text to be saved in the database.
    
    Returns:
        bool: True if the operation was successful, False otherwise.
    """
    # Check if the document exists in the database
    document_exists = get_document_by_id(document_id)
    if document_exists:
        # Update the document with the extracted text
        return update_extracted_text(document_id, extracted_text)
    else:
        print("Document not found in the database.")
        return False

def create_and_store_document(name, pdf_file, extracted_text):
    """
    Creates a new document record in the database and stores the PDF along with its extracted text.
    
    Args:
        name (str): The name of the document.
        pdf_file (File): A file object representing the PDF file.
        extracted_text (str): The extracted text from the PDF.
    
    Returns:
        DocumentModel: The created document model instance.
    """
    # Create a new document instance
    document = DocumentModel(name=name, pdf_file=pdf_file)
    document.extracted_text = extracted_text  # Set the extracted text
    document.save()  # Save the document to the database
    return document
