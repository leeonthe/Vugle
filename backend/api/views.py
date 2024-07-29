from django.shortcuts import redirect
from django.conf import settings
import requests, base64, hashlib, secrets, re, os

def generate_code_verifier():
    code_verifier = base64.urlsafe_b64encode(os.urandom(40)).decode('utf-8')
    code_verifier = re.sub('[^a-zA-Z0-9]+', '', code_verifier)
    return code_verifier

def generate_code_challenge(verifier):
    code_challenge = hashlib.sha256(verifier.encode('utf-8')).digest()
    code_challenge = base64.urlsafe_b64encode(code_challenge).decode('utf-8')
    code_challenge = code_challenge.replace('=', '')
    return code_challenge

def oauth_login(request):
    print("IS CALLED")
    client_id = '0oax86sg7sEgacnY52p7'
    redirect_uri = 'http://localhost:8000/api/oauth/callback/'
    verifier = generate_code_verifier()
    challenge = generate_code_challenge(verifier)

    request.session['code_verifier'] = verifier
    request.session['test_key'] = 'test_value'
    request.session.save()

    # Debug: Print the verifier and session ID to ensure it's being set
    print("Generated Verifier:", verifier)
    print("Session ID (login):", request.session.session_key)
    print("Session Data (login):", request.session.items())
    
    state = 'random_state_string'
    scope = 'profile openid offline_access disability_rating.read service_history.read veteran_status.read'

    auth_url = (
        f'https://sandbox-api.va.gov/oauth2/veteran-verification/v1/authorization?'
        f'client_id={client_id}'
        f'&redirect_uri={redirect_uri}'
        f'&response_type=code'
        f'&scope={scope}'
        f'&state={state}'
        f'&code_challenge_method=S256'
        f'&code_challenge={challenge}'
    )
    print("SUCCESS")
    return redirect(auth_url)

def oauth_callback(request):
    code = request.GET.get('code')
    verifier = request.session.get('code_verifier')
    state = request.GET.get('state')
    token_url = 'https://sandbox-api.va.gov/oauth2/veteran-verification/v1/token'
    client_id = '0oax86sg7sEgacnY52p7'
    redirect_uri = 'http://localhost:8000/api/oauth/callback/'

    # Debug: Print the verifier and session ID to ensure it's being retrieved
    print("Retrieved Verifier:", verifier)
    print("Session ID (callback):", request.session.session_key)
    print("Session Data (callback):", request.session.items())
    
    if not verifier:
        print("Error: Verifier not found in session")
        return redirect('/errorJSON')

    print("Code:", code)
    print("Verifier:", verifier)
    print("Token URL:", token_url)
    print("Client ID:", client_id)
    print("Redirect URI:", redirect_uri)
    print("State:", state)

    data = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': redirect_uri,
        'client_id': client_id,
        'code_verifier': verifier,
    }

    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    print("Request Data:", data)
    print("Request Headers:", headers)

    response = requests.post(token_url, data=data, headers=headers)

    print("Response status code:", response.status_code)
    print("Response content:", response.text)

    if response.status_code != 200:
        print("Error: Failed to obtain token")
        return redirect('/errorStatus')

    try:
        token_data = response.json()
    except ValueError as e:
        print("Error decoding JSON response:", e)
        return redirect('/errorJSON')

    # For testing, redirect to the root URL or some known view
    return redirect('http://localhost:8000/api/oauth/callback/')
