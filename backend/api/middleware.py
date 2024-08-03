# backend/api/middleware.py

from urllib.parse import urlparse

class AllowCustomSchemeMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)

    def is_safe_url(self, url, allowed_hosts, require_https=False):
        if url.startswith('yourapp://'):
            return True
        return url.startswith(('http://', 'https://')) and urlparse(url).hostname in allowed_hosts
