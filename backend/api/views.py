# views.py

from pathlib import Path
import random
import string, json
import hashlib
import base64
import requests, os
import jwt
import time
import uuid
from django.conf import settings
from django.shortcuts import redirect
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponseRedirect, HttpResponse
from django.views import View
from urllib.parse import urlencode
import logging
from django.utils.http import url_has_allowed_host_and_scheme
from django.middleware.csrf import get_token


logger = logging.getLogger(__name__)

# Store code_verifier and state in a temporary dictionary for simplicity (not suitable for production)
# In a production setting, you might use a database or more secure storage
TEMP_STORAGE = {}


class GetCSRFTokenView(View):
    def get(self, request):
        csrf_token = get_token(request)
        return JsonResponse({'csrf_token': csrf_token})
    
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
        
class SaveVeteranDataView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            # Process the data as required, for example, save it to the database
            # or use it to generate a response.
            print('Received Veteran Data:', data)

            # Assuming you process the data successfully
            return JsonResponse({'status': 'success', 'message': 'Veteran data processed successfully.'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)    

class GenerateJWTView(View):
    CLIENT_ID = '0oaxj51zcfaczzOaw2p7'
    PRIVATE_KEY_PATH = Path(__file__).resolve().parent.parent.parent / 'private.pem'
    audience = 'https://deptva-eval.okta.com/oauth2/ausftw7zk6eHr7gMN2p7/v1/token'
    def get(self, request):
        print("IS CALLED, GENEREATE JWT VIEW")
        with open(self.PRIVATE_KEY_PATH, 'r') as key_file:
            private_key = key_file.read()
        

        # Generate JWT
        iat = int(time.time())
        exp = iat + 300
        payload = {
            "aud": self.audience,
            "iss": self.CLIENT_ID,
            "sub": self.CLIENT_ID,
            "iat": iat,
            "exp": exp,
            "jti": str(uuid.uuid4())
        }
        
        jwt_token = jwt.encode(payload, private_key, algorithm='RS256')
        jwt_token_str = jwt_token.decode('utf-8')
        print("jwt_token_str: ", jwt)
        return JsonResponse({"jwt_token": jwt_token_str})
    
class GetAccessTokenView(View):
    CLIENT_ID = '0oaxj51zcfaczzOaw2p7'
    TOKEN_URL = 'https://sandbox-api.va.gov/oauth2/va-letter-generator/system/v1/token'
    
    def get(self, request):
        print("IS CALLED, GET ACCESS TOKEN VIEW")
        generate_jwt_view = GenerateJWTView()
        jwt_response = generate_jwt_view.get(request)
        print("jwt_response: ", jwt_response.content)
        jwt_token = json.loads(jwt_response.content).get('jwt_token')
        print("jwt_token: ", jwt_token)
        
        token_data = {
            'grant_type': 'client_credentials',
            'client_assertion_type': 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
            'client_assertion': jwt_token,
            'scope': 'letters.read'
        }
        response = requests.post(self.TOKEN_URL, data=token_data, headers={'Content-Type': 'application/x-www-form-urlencoded'})
        
        if response.status_code == 200:
            token_response = response.json()
            access_token = token_response.get('access_token')
            print("access_token: ", access_token)
            return JsonResponse({"access_token": access_token})
        else:
            print(f"Token exchange failed: {response.status_code}, {response.text}")
            logger.error(f"Token exchange failed: {response.status_code}, {response.text}")
            return HttpResponseBadRequest("Token exchange failed")