from django.http import JsonResponse
from django.views import View
from django.middleware.csrf import get_token
import json
import logging

logger = logging.getLogger(__name__)

chatbot_flow = {
    "start": {
        "prompt": "Nice to meet you, {user_name}.",
        "options": [
            {
                "text": "Sounds good!",
                "next": "question_1"
            }
        ]
    },
    "question_1": {
        "prompt": "Which claims would you like to submit? Select all that applies.",
        "options": [
            {
                "text": "New claim",
                "next": "question_2"
            },
            {
                "text": "Current disability worsened",
                "next": "question_2"
            }
        ]
    },
    "question_2": {
        "prompt": "Do you think your current circumstance falls under the right claim?",
        "options": [
            {
                "text": "Yes, it is",
                "next": "end"
            },
            {
                "text": "No, let me go back",
                "next": "question_1"
            }
        ]
    },
    "end": {
        "prompt": "Thank you for your responses. We will guide you further."
    }
}

class ChatbotView(View):
    def get(self, request):
        response = {
            "chatbot_flow": chatbot_flow,
            "csrf_token": get_token(request)
        }
        return JsonResponse(response)

    def post(self, request):
        try:
            data = json.loads(request.body)
            user_response = data.get('response')
            current_step = data.get('current_step')

            logger.debug(f'POST data: {data}')
            logger.debug(f'Current step: {current_step}')
            logger.debug(f'User response: {user_response}')

            if current_step is None or user_response is None:
                return JsonResponse({'error': 'Invalid request'}, status=400)

            next_step = chatbot_flow[current_step]['options'][int(user_response)]['next']
            return JsonResponse(chatbot_flow[next_step])

        except KeyError as e:
            logger.error(f'KeyError: {e}')
            return JsonResponse({'error': 'Invalid step or response'}, status=400)
        except Exception as e:
            logger.error(f'Unexpected error: {e}')
            return JsonResponse({'error': 'Internal server error'}, status=500)
