# views.py

from django.shortcuts import redirect
from django.conf import settings
import requests, base64, hashlib, re, os, string, random, json
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt

def generate_random_string(length=16):
    characters = string.ascii_letters + string.digits
    random_string = ''.join(random.choice(characters) for _ in range(length))
    return random_string

@csrf_exempt
def oauth_login(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method'}, status=405)

    print("IS CALLED")

    try:
        data = json.loads(request.body)
        challenge = data.get('code_challenge')
        verifier = data.get('code_verifier')
    except (KeyError, json.JSONDecodeError) as e:
        return JsonResponse({'error': f'Missing or invalid parameter: {str(e)}'}, status=400)

    state = generate_random_string()

    if not challenge:
        return JsonResponse({'error': 'Missing code challenge'}, status=400)
    if not verifier:
        return JsonResponse({'error': 'Missing code verifier'}, status=400)

    # Save the code verifier and state in session
    request.session['code_verifier'] = verifier
    request.session['state'] = state

    print("Received Challenge (Django):", challenge)
    print("Received Verifier (Django):", verifier)
    print("Session ID (login):", request.session.session_key)
    print("Session Data (login):", request.session.items())
    print("State:", state)
    print("Cookies (login):", request.COOKIES)

    client_id = '0oax86sg7sEgacnY52p7'
    redirect_uri = 'http://localhost:8000/api/oauth/callback/'
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

    request.session.save()
    print("SUCCESS: ", auth_url)
    return redirect(auth_url)

def oauth_callback(request):
    code = request.GET.get('code')
    state = request.GET.get('state')
    token_url = 'https://sandbox-api.va.gov/oauth2/veteran-verification/v1/token'
    client_id = '0oax86sg7sEgacnY52p7'
    redirect_uri = 'http://localhost:8000/api/oauth/callback/'

    verifier = request.session.get('code_verifier')
    print("Retrieved Verifier (Django):", verifier)
    print("Session ID (callback):", request.session.session_key)
    print("Session Data (callback):", request.session.items())
    print("State callback:", request.session.get('state'))
    print("Cookies (callback):", request.COOKIES)

    if not verifier:
        print("Error: Verifier not found in session")
        return redirect('/errorJSON')

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

    response = requests.post(token_url, data=data, headers=headers)
    print("Request Data:", data)
    print("Request Headers:", headers)
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

    return redirect('http://localhost:8000/api/oauth/callback/')