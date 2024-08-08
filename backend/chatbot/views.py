from django.http import JsonResponse
from django.views import View
from django.middleware.csrf import get_token
import json
import logging

logger = logging.getLogger(__name__)
image = "static/vugle.png"
chatbot_flow = {
    "start": {
        "prompt": "[[IMAGE]]\nNice to meet you, {user_name}.\nBefore we begin, I need to ask you a few questions that will help me evaluate the best approach for you.",
        "options": [
            {
                "text": "Sounds good!",
                "next": "question_1"
            }
        ]
    },
    "question_1": {
        "prompt": "[[IMAGE]]\nWhich claims would you like to submit? Select all that apply.",
        "options": [
            {
                "text": "New claim",
                "next": "question_2"
            },
            {
                "text": "Current disability worsened",
                "next": "question_2"
            },
            {
                "text": "Hospital linking",
                "next": "hospital_linking"
            },
        ]
    },
    "question_2": {
        "prompt": "[[IMAGE]]\nDo you think your current circumstance falls under the right claim?",
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
    "hospital_linking": {
        "prompt": "[[IMAGE]]\nGot it. Click the link below to test hospital linking.",
        "options": [
            {
                "text": "TEST LINKING HOSIPITAL",
                "next": "navigate_hospital"
            }
        ]
    },
    "navigate_hospital": {
        "prompt": "",
        "navigation_url": "/hospital"
    },
    "end": {
        "prompt": "[[IMAGE]]\nThank you for your responses. We will guide you further."
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
            next_prompt = chatbot_flow[next_step]['prompt'].split('\n')
            navigation_url = chatbot_flow[next_step].get('navigation_url', None)
            return JsonResponse({"image": chatbot_flow[next_step].get('image', None), "prompts": next_prompt, "options": chatbot_flow[next_step].get('options', []), "navigation_url": navigation_url})

        except KeyError as e:
            logger.error(f'KeyError: {e}')
            return JsonResponse({'error': 'Invalid step or response'}, status=400)
        except Exception as e:
            logger.error(f'Unexpected error: {e}')
            return JsonResponse({'error': 'Internal server error'}, status=500)
