from django_project.vugle_db.models import DocumentModel

def get_document_by_id(document_id):
    """Retrieve a document by its ID from the database."""
    try:
        document = DocumentModel.objects.get(id=document_id)
        return document
    except DocumentModel.DoesNotExist:
        return None

def save_new_document(name, pdf_file):
    """Save a new document to the database."""
    document = DocumentModel(name=name, pdf_file=pdf_file)
    document.save()
    return document

def update_extracted_text(document_id, text):
    """Update the extracted text field for a specific document."""
    document = get_document_by_id(document_id)
    if document:
        document.extracted_text = text
        document.save()
        return True
    return False
