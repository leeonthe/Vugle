from gemini_api import GeminiAPI
from documents.models import UserRecord

def query_health_condition(user_id, query):
    user_records = UserRecord.objects.filter(user_id=user_id)
    relevant_docs = []

    for record in user_records:
        if query.lower() in record.text_content.lower():
            relevant_docs.append(record)

    return relevant_docs
