# Django Middleware

Middleware is a framework of hooks into Django's request/response processing. It's a light, low-level "plugin" system for globally altering Django's input or output.

## 1. How It Works

Each middleware component is responsible for doing some specific function for the request (e.g., authentication) or response (e.g., gzip compression).

Middleware components are processed in order.
1.  **Request phase**: From top to bottom.
2.  **View execution**: (If no middleware returns a response earlier).
3.  **Response phase**: From bottom to top.

### The Onion Analogy
Think of it like an onion: the request has to pass through several layers of middleware to reach the view (the core), and the response has to pass back out through the same layers.

---

## 2. Writing Custom Middleware

A middleware factory is a callable that takes a `get_response` callable and returns a middleware.

### Structure
```python
class SimpleMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        # One-time configuration and initialization.

    def __call__(self, request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.

        response = self.get_response(request)

        # Code to be executed for each request/response after
        # the view is called.

        return response
```

### Example: Log execution time
```python
import time

class TimingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.time()
        
        response = self.get_response(request)
        
        duration = time.time() - start_time
        response['X-Page-Generation-Duration-ms'] = int(duration * 1000)
        return response
```

---

## 3. Activating Middleware

Add your middleware class to the `MIDDLEWARE` setting in `settings.py`.

```python
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    # ...
    'myapp.middleware.SimpleMiddleware', # Add yours here
]
```

## 4. Built-in Middleware

Standard middleware classes provided by Django:

- `AuthenticationMiddleware`: Associating users with requests using sessions.
- `SessionMiddleware`: Enables session support.
- `CsrfViewMiddleware`: Adds protection against Cross Site Request Forgeries.
- `MessageMiddleware`: Enables cookie- and session-based message support.
- `XFrameOptionsMiddleware`: Sample security middleware (adds `X-Frame-Options` header).
