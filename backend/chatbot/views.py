from django.http import JsonResponse
from django.views import View
from django.middleware.csrf import get_token
import json, logging

from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from dex_scripts.dex_chat import analyze_document, generate_potential_conditions, clear_session_data,  config_path

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
    "loading":{
        "prompt": "[[IMAGE]][BR][BOLD]...[CLOSE]",
        "options": []
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
        "prompt": "[[IMAGE]][BR][BOLD]Tell us your condition(s)[CLOSE][NEWLINE]Which conditions / symptoms would you like to submit claim for?",
        "options": [
            
        ]
    },
    # NOT COVER YET
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
    # NOT COVER YET
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
                "text": "Not that I can think of",
                "next": "potential_condition_linking"
            },
            {
                "text": "RETUNRN TEST",
                "next": "new_condition"
            }
        ]
    },
    "add_more_condition": {
        "prompt": "[[IMAGE]][BR][BOLD]Tell us more about your condition(s)[CLOSE][NEWLINE]Which conditions / symptoms would you like to submit claim for?",
        "options": [
            # USER INPUT
        ]


    },
    

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
        # move to scaling_pain
    },

    "scaling_pain":{
        "prompt": "[[IMAGE]][BR][BOLD]How severe is your knee pain now?[CLOSE][NEWLINE]On a scale of (1 - 10)",
        # move to finding_right_claim
    },

    # TODO: add: Assessment completed! 🙌 Thanks for your time, Robert!
    # TODO: add: Reviewing DD214, etc
     "finding_right_claim": {
        "prompt": "[[IMAGE]][BR][BOLD]We’re finding right claim for your condition based on your files[CLOSE]"+
        
        "[BR][BOLD]We’re finding right claim for your condition based on your files[CLOSE][NEWLINE]We will now review your documents to determine which type of claim is best suited for you."
        
        +"[BR]DD214[NEWLINE]STRs[NEWLINE]Medical records[NEWLINE]Service records[NEWLINE]Previous Claims"
        
        ,
        "options": [
            # Define options or further steps here...
        ]
    },

    # TODO: Text styling
    "service_connect": {
        "prompt": "[[IMAGE]][BR][BOLD]Secondary Service-Connected Claim[CLOSE][NEWLINE]Your condition might be affected by your existing condition ‘Lower back pain’ for which you’ve received a 70% disability rating.[NEWLINE][LINK_START]What is this claim?[LINK_END]",
        "options": [
        {
            "text": "Start Filing",
            "next": "check_if_user_been_to_private_clinics"
        }
            
        ]
    },

    # TODO: Text styling
    "check_if_user_been_to_private_clinics": {
        "prompt": "[[IMAGE]][BR][BOLD]Have you been to any private clinics?[CLOSE][NEWLINE]We couldn’t find any VA medical records about your conditions. Have you attended any private clinics for your condition?",
        "options": [
            {
                "text": "Yes, I have",
                "next": "hospital_linking"
            },
            {
                "text": "No, I haven't",
                "next": "hospital_linking"   
            }
        ]
    },

#   TODO: Text styling + 
    "hospital_linking": {
        "prompt": "[[IMAGE]][BR][BOLD]List of VA medicals near by you[CLOSE][NEWLINE]Here you go! Some centers offer virtual option as well. Please check the availability for each centers carefully.",
        "options": [
            {
                "text": "View medical centers",
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
    },
}
    
def handle_step_change(prompt, user_name):
    if not prompt:
        return []

    processed_prompt = prompt.replace('{user_name}', user_name)
    processed_prompt = processed_prompt.replace('[BOLD]', '**')  # Start bold
    processed_prompt = processed_prompt.replace('[CLOSE]', '**')  # End bold
    processed_prompt = processed_prompt.replace('[NEWLINE]', '\n')  # For new lines
    processed_prompt = processed_prompt.replace('[LINK_START]', '[').replace('[LINK_END]', ']()')  # For link text

    return processed_prompt.split('\n')

def handle_uploaded_file(file):
    logger.debug(f'Handling file upload: {file.name}')
    try:
        file_name = file.name
        path = default_storage.save(file_name, ContentFile(file.read()))
        logger.debug(f'File saved to: {path}')
        return path
    except Exception as e:
        logger.error(f'Error handling file upload: {e}')
        raise e

class ChatbotView(View):
    def get(self, request):
        response = {
            "chatbot_flow": chatbot_flow,
            "csrf_token": get_token(request)
        }
        return JsonResponse(response)

    def post(self, request):
        print("Config Path:", config_path)
        
        try:
            user_name = 'User'
            potential_conditions = []

            # Check if we have a file upload in the request
            if request.FILES.get('dd214'):
                # Simulate loading by immediately responding with a loading message
                if request.GET.get('current_step') == 'upload_dd214':
                    # Return loading message
                    loading_prompt = chatbot_flow['loading']['prompt']
                    return JsonResponse({
                        "prompts": [loading_prompt],
                        "options": chatbot_flow['loading']['options'],
                    })

                file = request.FILES['dd214']
                logger.debug(f'Received file: {file.name}')
                file_path = handle_uploaded_file(file)  # Save the uploaded file
                document_text = analyze_document(file_path)  # Analyze the document
                request.session['dd214_text'] = document_text  # Store the analysis in session
                next_step = "upload_dd214"

                # Process the next step after the file is uploaded
                next_prompt = chatbot_flow[next_step]['prompt']
                processed_prompts = handle_step_change(next_prompt, user_name)
                navigation_url = chatbot_flow[next_step].get('navigation_url', None)
                
                return JsonResponse({
                    "image": chatbot_flow[next_step].get('image', None), 
                    "prompts": processed_prompts, 
                    "options": chatbot_flow[next_step].get('options', []), 
                    "navigation_url": navigation_url,
                    "potential_conditions": potential_conditions  # Send potential conditions to frontend
                })

            # Handle non-file related logic
            data = json.loads(request.body)
            user_response = data.get('response')
            current_step = data.get('current_step')
            user_name = data.get('user_name', 'User')

            logger.debug(f'POST data: {data}')
            logger.debug(f'Current step: {current_step}')
            logger.debug(f'User response: {user_response}')

            # Check if we're in the loading step
            if current_step == 'loading':
                # Return the loading prompt
                print("LOADING CALLED")
                loading_prompt = chatbot_flow['loading']['prompt']
                return JsonResponse({
                    "prompts": [loading_prompt],
                    "options": chatbot_flow['loading']['options'],
                })

            # Handle other non-file-related steps
            potential_conditions = ""

            if current_step is None or user_response is None:
                return JsonResponse({'error': 'Invalid request'}, status=400)

            if current_step == "new_condition":
                request.session['user_condition'] = user_response
                potential_conditions = generate_potential_conditions(user_response)
                print("[GPT] Potential Conditions:", potential_conditions)
                request.session['potential_conditions'] = potential_conditions
                next_step = "get_more_condition"

            elif current_step == "potential_condition_linking":
                potential_conditions = request.session.get('potential_conditions', [])
                next_step = "navigate_potential_condition"

            elif current_step == "basic_assessment":
                request.session['condition_duration'] = user_response #save user response
                next_step = "scaling_pain"
            
            elif current_step == "scaling_pain":
                request.session['pain_severity'] = user_response
                next_step = "finding_right_claim"
            elif current_step == "finding_right_claim":
                next_step = "service_connect"
            elif current_step == "reset":
                clear_session_data(request.session)
                return JsonResponse({"status": "success", "message": "Session data cleared."})
            else:
                next_step = chatbot_flow[current_step]['options'][int(user_response)]['next']

            next_prompt = chatbot_flow[next_step]['prompt']
            processed_prompts = handle_step_change(next_prompt, user_name)
            navigation_url = chatbot_flow[next_step].get('navigation_url', None)
            
            return JsonResponse({
                "image": chatbot_flow[next_step].get('image', None), 
                "prompts": processed_prompts, 
                "options": chatbot_flow[next_step].get('options', []), 
                "navigation_url": navigation_url,
                "potential_conditions": potential_conditions  # Send potential conditions to frontend
            })

        except KeyError as e:
            logger.error(f'KeyError: {e}')
            return JsonResponse({'error': 'Invalid step or response'}, status=400)
        except Exception as e:
            logger.error(f'Unexpected error: {e}')
            return JsonResponse({'error': 'Internal server error'}, status=500)

