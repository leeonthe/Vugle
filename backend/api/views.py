# views.py

import random
import string
import hashlib
import base64
import requests, os
from django.shortcuts import redirect
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponseRedirect, HttpResponse
from django.views import View
from urllib.parse import urlencode
import logging
from django.utils.http import url_has_allowed_host_and_scheme


logger = logging.getLogger(__name__)

# Store code_verifier and state in a temporary dictionary for simplicity (not suitable for production)
# In a production setting, you might use a database or more secure storage
TEMP_STORAGE = {}

class OAuthLoginView(View):
    def get(self, request):
        code_verifier = self._generate_code_verifier()
        code_challenge = self._generate_code_challenge(code_verifier)
        state = self._generate_state()
        # Store code_verifier and state in TEMP_STORAGE
        TEMP_STORAGE[state] = code_verifier
        print("[login] code_verifier ", code_verifier)
        print("doublechekc", code_verifier)
        print('[login] state ', state)
        print('[login] code_challenge ', code_challenge)

        params = {
            'client_id': '0oax86sg7sEgacnY52p7',
            'redirect_uri': 'http://localhost:8000/api/oauth/callback/',
            'response_type': 'code',
            'scope': 'profile openid offline_access disability_rating.read service_history.read veteran_status.read',
            'state': state,
            'code_challenge_method': 'S256',
            'code_challenge': code_challenge,
        }

        auth_url = f"https://sandbox-api.va.gov/oauth2/veteran-verification/v1/authorization?{urlencode(params)}"
        return JsonResponse({
            'auth_url': auth_url,
            'state': state,
        })

    def _generate_code_verifier(self):
        return base64.urlsafe_b64encode(os.urandom(32)).rstrip(b'=').decode('ascii')

    def _generate_code_challenge(self, code_verifier):
        code_challenge = hashlib.sha256(code_verifier.encode('ascii')).digest()
        return base64.urlsafe_b64encode(code_challenge).rstrip(b'=').decode('ascii')

    def _generate_state(self):
        return ''.join(random.choices(string.ascii_letters + string.digits, k=16))

    def get_code_verifier(self, state):
        return TEMP_STORAGE.get(state)

class OAuthCallbackView(View):
    def get(self, request):
        code = request.GET.get('code')
        state = request.GET.get('state')
        code_verifier = OAuthLoginView().get_code_verifier(state)
        print("[callback] code ", code)
        print("[callback] state ", state)
        print("[callback] code_verifier ", code_verifier)
        if not code:
            logger.error("Missing code")
            return HttpResponseBadRequest("Missing code")
        if not state:
            logger.error("Missing state")
            return HttpResponseBadRequest("Missing state")
        if not code_verifier:    
            logger.error("Missing code_verifier")
            return HttpResponseBadRequest("Missing code_verifier")
        
        token_url = "https://sandbox-api.va.gov/oauth2/veteran-verification/v1/token/"
    
        token_data = {
            'grant_type': 'authorization_code',
            'code': code,
            'client_id': '0oax86sg7sEgacnY52p7',
            'redirect_uri': 'yourapp://oauthredirect',
            'code_verifier': code_verifier,
        }

        response = requests.post(token_url, data=token_data)
        print("response: ",response)
        if response.status_code == 200:
            token_response = response.json()
            access_token = token_response.get('access_token')

            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <title>OAuth Redirect</title>
                <script type="text/javascript">
                    function postToken() {{
                        window.ReactNativeWebView.postMessage("{access_token}");
                    }}
                    window.onload = postToken;
                </script>
            </head>
            <body>
                <p>Redirecting...</p>
            </body>
            </html>
            """
            return HttpResponse(html_content)
        
        else:
            logger.error(f"Token exchange failed: {response.status_code}, {response.text}")
            return HttpResponseBadRequest("Token exchange failed")
        

# class ClientCredentialsView(View):
#     CLIENT_ID = '0oax86sg7sEgacnY52p7'


