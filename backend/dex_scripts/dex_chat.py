import openai
import yaml
import os
from google.cloud import documentai_v1beta3 as documentai



script_dir = os.path.dirname(os.path.abspath(__file__))
config_path = os.path.join(script_dir, '../dex_config/config.yaml')

# script_dir = os.path.dirname(os.path.abspath(__file__))
# config_path = os.path.join(script_dir, '../dex_config/config.yaml')
print("Config Path:", config_path)

with open(config_path, 'r') as f:
    config = yaml.safe_load(f)

openai.api_key = config['openai_api_key']

gcp_credentials_path = "/Users/yoon/Documents/Vugle/backend/dex_config/vugle-dex-1505d9c56161.json"

def analyze_document(file_path):
    try:
        print(f"Processing file: {file_path}")
        
        # Determine MIME type
        if file_path.lower().endswith('.pdf'):
            mime_type = "application/pdf"
        elif file_path.lower().endswith('.jpg') or file_path.lower().endswith('.jpeg'):
            mime_type = "image/jpeg"
        elif file_path.lower().endswith('.png'):
            mime_type = "image/png"
        else:
            raise ValueError("Unsupported file format")

        print(f"Detected MIME type: {mime_type}")

        client = documentai.DocumentProcessorServiceClient.from_service_account_json(gcp_credentials_path)
        project_id = config['gcp_project_id']
        location = config['gcp_location']
        processor_id = config['gcp_processor_id']

        with open(file_path, 'rb') as f:
            document_content = f.read()

        document = {"content": document_content, "mime_type": mime_type}
        name = f"projects/{project_id}/locations/{location}/processors/{processor_id}"
        request = documentai.ProcessRequest(name=name, raw_document=document)

        result = client.process_document(request=request)
        document = result.document

        return document.text

    except Exception as e:
        print(f"Error in analyze_document: {e}")
        raise


def query_gpt(prompt):
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful assistant, analyzing medical and military history documents."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=500
    )
    return response['choices'][0]['message']['content'].strip()

def extract_relevant_text(document_text, query):
    prompt = f"Extract the relevant sections from the following text that pertain to the query: '{query}'. Text: '{document_text}'"
    relevant_text = query_gpt(prompt)
    return relevant_text

def find_relevant_documents(query, documents_dir="../dex_docs/sample_medical_records/"):
    relevant_docs = []
    for filename in os.listdir(documents_dir):
        if filename.endswith((".pdf", ".jpg", ".jpeg", ".png")):
            file_path = os.path.join(documents_dir, filename)
            document_text = analyze_document(file_path)
            relevance_prompt = f"Given the following content: '{document_text}', is it relevant to the query: '{query}'? Answer 'yes' or 'no' and explain why."
            relevance_response = query_gpt(relevance_prompt)
            if "yes" in relevance_response.lower():
                relevant_text = extract_relevant_text(document_text, query)
                relevant_docs.append((filename, relevant_text))
    return relevant_docs

def generate_potential_conditions(user_input):
    prompt = f"""
    Given the user's condition: '{user_input}', list related conditions in the following format:
    
    Condition Name: <name>
    Risk Level: <High/Medium/Low risk>
    Description: <short description>
    
    Separate each condition with a blank line.
    """
    potential_conditions = query_gpt(prompt)
    return potential_conditions.split('\n\n')

def get_best_suited_claim(session_data):
    try:
        # Extract the relevant information from the session data
        disability_rating_info = session_data['disability_rating']['attributes']
        combined_disability_rating = disability_rating_info.get('combined_disability_rating')
        individual_ratings = disability_rating_info.get('individual_ratings', [])

        service_history_info = session_data['service_history']['data'][0]['attributes']
        branch_of_service = service_history_info.get('branch_of_service')
        service_type = service_history_info.get('service_type')
        discharge_status = service_history_info.get('discharge_status')

        veteran_status_info = session_data['status']['attributes'].get('veteran_status')

        benefit_info = session_data['letters']['benefitInformation']
        service_connected_percentage = benefit_info.get('serviceConnectedPercentage')
        monthly_award_amount = benefit_info.get('monthlyAwardAmount', {}).get('value')
        service_connected_disabilities = benefit_info.get('serviceConnectedDisabilities')

        # USER INPUT DATA
        user_condition = session_data['user_condition']
        potential_conditions = session_data['potential_conditions']
        condition_duration = session_data['condition_duration']
        pain_severity = session_data['pain_severity']
        
        # Construct a prompt using this extracted information
        prompt = f"""
        Based on the following veteran's data:
        - Combined Disability Rating: {combined_disability_rating}%
        - Individual Ratings:
        {"".join([f"  - {rating['diagnostic_text']} ({rating['rating_percentage']}%)" for rating in individual_ratings])}
        - Branch of Service: {branch_of_service}
        - Service Type: {service_type}
        - Discharge Status: {discharge_status}
        - Veteran Status: {veteran_status_info}
        - Service-Connected Disabilities: {service_connected_disabilities}
        - Service-Connected Percentage: {service_connected_percentage}%
        - Monthly Award Amount: ${monthly_award_amount}

        - User Condition: {user_condition}
        - Potential Conditions: {potential_conditions}
        - Condition Duration: {condition_duration}
        - Pain Severity: {pain_severity}

        
        Determine the most suitable type of VA claim for this veteran. The options of VA claim are New Claim, Increased Claim, and Secondary Service-Connected Claim.
        Respond only with the following format:
        "[[IMAGE]][BR][BOLD]{{TYPE OF CLAIM}}[CLOSE][NEWLINE]{{One ~ two sentence description why this type of claim is best suited for this user given user input and data}}"
        """

        # Call the GPT API with the constructed prompt
        response = openai.Completion.create(
            engine="gpt-4",  # Replace with your engine or model of choice
            prompt=prompt,
            max_tokens=1000,  # Adjust token length based on the expected response size
            temperature=0.7  # Adjust temperature for response creativity
        )

        # Extract the GPT response
        gpt_response = response.choices[0].text.strip()

        # Log or handle the response if needed
        # print("GPT Response:", gpt_response)

        # Return the response directly
        return gpt_response

    except Exception as e:
        # Handle any exceptions that occur during the API call
        print(f"Error in get_best_suited_claim: {str(e)}")
        return "[[IMAGE]][BR][BOLD]Error[CLOSE][NEWLINE]There was an error determining the best suited claim. Please try again later."





def clear_session_data(session):
    session.flush()
