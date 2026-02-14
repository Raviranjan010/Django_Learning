# Common Middleware Use Cases

## 1. Debugging
### Logging Requests
Log every request method and path to the console or a file.

```python
import logging
logger = logging.getLogger(__name__)

class RequestLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        logger.info(f"Request: {request.method} {request.path}")
        return self.get_response(request)
```

## 2. Localization (i18n)
Dynamically set the language based on user preference or headers.
*This is built-in via `LocaleMiddleware`.*

```python
# Concept:
request.LANGUAGE_CODE = request.META.get('HTTP_ACCEPT_LANGUAGE')
```

## 3. Throttling / Rate Limiting
Prevent abuse by limiting requests from a single IP.

```python
from django.core.cache import cache
from django.http import HttpResponseForbidden

class SimpleThrottleMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        ip = request.META.get('REMOTE_ADDR')
        key = f"throttle_{ip}"
        count = cache.get(key, 0)
        
        if count > 100: # Limit 100 requests
            return HttpResponseForbidden("Too many requests")
            
        cache.set(key, count + 1, 60) # Reset every 60 seconds
        return self.get_response(request)
```

## 4. Maintenance Mode
Temporarily block access during updates.

```python
from django.http import HttpResponse
from django.conf import settings

class MaintenanceMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if getattr(settings, 'MAINTENANCE_MODE', False):
            return HttpResponse("Site is under maintenance.", status=503)
        return self.get_response(request)
```
