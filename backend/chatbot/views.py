from django.http import JsonResponse
from django.views import View
from django.middleware.csrf import get_token
import json
import logging

logger = logging.getLogger(__name__)
image = "static/vugle.png"
chatbot_flow = {
    # \n new message container

    "start": {
        "prompt": "[[IMAGE][BR]Nice to meet you, {user_name}.  [BR][NEWLINE][BOLD]Please upload your DD214[CLOSE][NEWLINE]Before we begin, we just need one more document from you to evaluate the best approach for your application![NEWLINE][LINK_START]I don't have it right now[LINK_END]",
        "options": [
            {
                "text": "Upload DD214",
                "next": "upload_dd214"
            }
        ]
    },
    "upload_dd214": {
        "prompt": "[[IMAGE][BR][BOLD]You are all set![CLOSE][NEWLINE]Your document looks great and we’re now good to go."
        + "[BR][BOLD]Choose your claims.[CLOSE][NEWLINE]Are you looking for claim a new condition or existing condition?",
        "options": [
            {
                "text": "New condition",
                "next": "new_condition"
            },
            {
                "text": "Existing condition",
                "next": "exising_condition"
            },
            {
                "text": "Both",
                "next": "both_condition"
            }
        ]
    },

    "new_condition": {
        "prompt": "[[IMAGE]][BR]Tell us your condition(s)[CLOSE][NEWLINEWhich conditions / symptoms would you like to submit claim for?",
        "options": [
            
        ]
    },
    "existing_condition": {
        "prompt": "[[IMAGE]][BR]Do you think your current circumstance falls under the right claim?",
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
    "both_condition": {
        "prompt": "[[IMAGE]]\nWhich claims would you like to submit? Select all that apply.",
        "options": [
            # USER INPUT
        ]
    },
    "get_more_condition": {
        "prompt": "[[IMAGE]][BR][BOLD]Any other conditions?[CLOSE][NEWLINE]It’s okay if they are not severe. Any conditions or symptoms that are troubling you can help us improve your chance.",
        "options": [
            {
                "text": "Add more",
                "next": "add_more_condition"
            },
            {
                "text": "Not taht I can think of",
                "next": "potential_condition_linking"
            },
            {
                "text": "RETUNRN TEST",
                "next": "new_condition"
            }
        ]
    },
    "add_more_condition": {
        "prompt": "[[IMAGE]][BR]Tell us more about your condition(s)[CLOSE][NEWLINE]Which conditions / symptoms would you like to submit claim for?",
        "options": [
            # USER INPUT
        ]


    },
    

    # TODO: Create navigate_potential_condition
    "potential_condition_linking":{
        "prompt": "[[IMAGE]][BR][BOLD]Potential affected conditions[CLOSE][NEWLINE]Based on your health records and the condition you’ve mentioned, we’ve listed potential conditions that you might also be experiencing.[LINK_START]Why it’s important[LINK_END]",
        "options": [
            {
                "text": "Let's check",
                "next": "navigate_potential_condition"
            }
        ]
    },

    "basic_assessment":{
        "prompt": "[[IMAGE]][BR][BOLD]Basic Assessment📄[CLOSE][NEWLINE]Thanks Robert. Now we will ask a few questions that will help us understand your conditions better."
        +"[BR][BOLD]How long has your knee pain been troubling you?[CLOSE]",
        "options": [
            # USER INPUT
        ]
    },

    "scaling_pain":{
        "prompt": "[[IMAGE]][BR][BOLD]How severe is your knee pain now?[CLOSE][NEWLINE]On a scale of (1 - 10)",
        
    },
     "finding_right_claim": {
        "prompt": "[[IMAGE]][BR][BOLD]Finding the Right Claim📋[CLOSE][NEWLINE]Based on the severity and duration of your symptoms, we'll guide you to the appropriate claim.",
        "options": [
            # Define options or further steps here...
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


# THIS IS FOR NAVIGATING TO THE DESIRED PAGE
    "navigate_potential_condition": {
        "prompt": "",
        "navigation_url": "/potential_condition"
    },
    "navigate_hospital": {
        "prompt": "",
        "navigation_url": "/hospital"
    },
    "end": {
        "prompt": "[[IMAGE]]\nThank you for your responses. We will guide you further."
    }
}

def handle_step_change(prompt, user_name):
    if not prompt:
        return []

    # Replace placeholders with markdown-style formatting
    processed_prompt = prompt.replace('{user_name}', user_name)
    processed_prompt = processed_prompt.replace('[BOLD]', '**')  # Start bold
    processed_prompt = processed_prompt.replace('[CLOSE]', '**')  # End bold
    processed_prompt = processed_prompt.replace('[NEWLINE]', '\n')  # For new lines
    processed_prompt = processed_prompt.replace('[LINK_START]', '[').replace('[LINK_END]', ']()')  # For link text

    # Split into separate messages
    return processed_prompt.split('\n')


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
            user_name = data.get('user_name', 'User')  # Assuming user_name is passed from the frontend

            logger.debug(f'POST data: {data}')
            logger.debug(f'Current step: {current_step}')
            logger.debug(f'User response: {user_response}')

            if current_step is None or user_response is None:
                return JsonResponse({'error': 'Invalid request'}, status=400)

            next_step = chatbot_flow[current_step]['options'][int(user_response)]['next']
            next_prompt = chatbot_flow[next_step]['prompt']

            processed_prompts = handle_step_change(next_prompt, user_name)
            navigation_url = chatbot_flow[next_step].get('navigation_url', None)
            return JsonResponse({
                "image": chatbot_flow[next_step].get('image', None), 
                "prompts": processed_prompts, 
                "options": chatbot_flow[next_step].get('options', []), 
                "navigation_url": navigation_url
            })

        except KeyError as e:
            logger.error(f'KeyError: {e}')
            return JsonResponse({'error': 'Invalid step or response'}, status=400)
        except Exception as e:
            logger.error(f'Unexpected error: {e}')
            return JsonResponse({'error': 'Internal server error'}, status=500)