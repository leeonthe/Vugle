from django.shortcuts import render
from django.http import JsonResponse
from dex_scripts.query_processor import query_health_condition

def chatbot_query(request):
    user_id = request.user.id
    query = request.GET.get('query')
    
    relevant_docs = query_health_condition(user_id, query)
    
    response = [{'id': doc.id, 'text_content': doc.text_content} for doc in relevant_docs]
    
    return JsonResponse(response, safe=False)
