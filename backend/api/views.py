from django.shortcuts import redirect
from django.conf import settings
import requests, json, string, random
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

def generate_random_string(length=16):
    characters = string.ascii_letters + string.digits
    random_string = ''.join(random.choice(characters) for _ in range(length))
    return random_string

@csrf_exempt
def oauth_login(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method'}, status=405)

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
    request.session.save()  # Ensure session is saved

    # Debug prints
    print("OAuth Login:")
    print("Received Challenge:", challenge)
    print("Received Verifier:", verifier)
    print("Generated State:", state)
    print("Session ID (login):", request.session.session_key)
    print("Session Data (login):", request.session.items())

    client_id = '0oax86sg7sEgacnY52p7'  # Ensure this matches the client_id of your application in the admin
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

    print("Redirecting to:", auth_url)
    return redirect(auth_url)

@csrf_exempt
def oauth_callback(request):
    code = request.GET.get('code')
    state = request.GET.get('state')
    token_url = 'https://sandbox-api.va.gov/oauth2/veteran-verification/v1/token'
    client_id = '0oax86sg7sEgacnY52p7'
    redirect_uri = 'http://localhost:8000/api/oauth/callback/'

    # Debug prints
    print("OAuth Callback:")
    print("Received Code:", code)
    print("Received State:", state)
    print("Session ID (callback):", request.session.session_key)
    print("Session Data (callback):", request.session.items())

    verifier = request.session.get('code_verifier')
    print("Retrieved Verifier:", verifier)

    if not verifier:
        return JsonResponse({'error': 'Verifier not found in session'}, status=400)

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

    # Debug prints
    print("Token Request Data:", data)
    print("Token Request Headers:", headers)
    print("Token Response Status Code:", response.status_code)
    print("Token Response Content:", response.text)

    if response.status_code != 200:
        return JsonResponse({'error': 'Failed to obtain token', 'details': response.json()}, status=response.status_code)

    try:
        token_data = response.json()
        print("Token Data:", token_data)
    except ValueError as e:
        print("Error decoding JSON response:", e)
        return JsonResponse({'error': 'Error decoding JSON response'}, status=400)

    return JsonResponse(token_data)
