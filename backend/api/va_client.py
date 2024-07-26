# api/va_client.py
import os
import requests
from django.conf import settings
import logging

VERIFICATION_URL = f"{settings.VA_API_URL}services/veteran_verification/v1/"
VERIFICATION_SCOPE = "profile openid offline_access disability_rating.read service_history.read veteran_status.read"

def get_bearer_token():
    token_url = f"{settings.VA_API_URL}oauth2/token"
    data = {
        'grant_type': 'client_credentials',
        'client_id': settings.VA_CLIENT_ID,
        'client_secret': settings.VA_CLIENT_SECRET,
        'scope': VERIFICATION_SCOPE,
    }
    response = requests.post(token_url, data=data)
    response.raise_for_status()
    return response.json().get('access_token')

def get_status():
    token = get_bearer_token()
    headers = {"Authorization": f"Bearer {token}"}
    status_url = f"{VERIFICATION_URL}status"
    try:
        response = requests.get(status_url, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        logging.error(e)
        return None

def get_disability_rating():
    token = get_bearer_token()
    headers = {"Authorization": f"Bearer {token}"}
    disability_rating_url = f"{VERIFICATION_URL}disability_rating"
    try:
        response = requests.get(disability_rating_url, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        logging.error(e)
        return None

def get_service_history():
    token = get_bearer_token()
    headers = {"Authorization": f"Bearer {token}"}
    service_history_url = f"{VERIFICATION_URL}service_history"
    try:
        response = requests.get(service_history_url, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        logging.error(e)
        return None
