from django.shortcuts import redirect
from django.conf import settings
from oauth2_provider.models import Application
import requests, base64, hashlib, secrets

def generate_code_verifier():
    return base64.urlsafe_b64encode(secrets.token_bytes(32)).decode('utf-8').rstrip('=')

def generate_code_challenge(verifier):
    code_challenge = hashlib.sha256(verifier.encode('utf-8')).digest()
    return base64.urlsafe_b64encode(code_challenge).decode('utf-8').rstrip('=')

def oauth_login(request):
    client_id = settings.OAUTH_CLIENT_ID
    redirect_uri = settings.OAUTH_REDIRECT_URI
    verifier = generate_code_verifier()
    challenge = generate_code_challenge(verifier)

    request.session['code_verifier'] = verifier

    state = 'random_state_string'
    scope = 'profile openid offline_access disability_rating.read service_history.read veteran_status.read'

    auth_url = (
        f'https://sandbox-api.va.gov/oauth2/veteran-verification/v1/authorization?response_type=code'
        f'&client_id={client_id}'
        f'&redirect_uri={redirect_uri}'
        f'&scope={scope}'
        f'&state={state}'
        f'&code_challenge={challenge}'
        f'&code_challenge_method=S256'
    )
    print("SUCCESS")
    return redirect(auth_url)

def oauth_callback(request):
    code = request.GET.get('code')
    verifier = request.session['code_verifier']

    token_url = 'https://va.gov/oauth2/token'
    client_id = '0oax86sg7sEgacnY52p7'  
    redirect_uri = 'http://localhost:8000/api/oauth/callback/'

    response = requests.post(token_url, data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': redirect_uri,
        'client_id': client_id,
        'code_verifier': verifier,
    })

    token_data = response.json()

    return redirect('some-view-name')
