from django.http import JsonResponse
from django.views import View
from .utils import handle_chatbot_query

class ChatbotView(View):
    def post(self, request):
        query = request.POST.get('query')
        response = handle_chatbot_query(query)
        return JsonResponse({'response': response})