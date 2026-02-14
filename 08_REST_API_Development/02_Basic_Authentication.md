# DRF Basic Authentication

Basic Authentication verifies users using their username and password encoded in the HTTP Header. It is simple but should only be used over **HTTPS** because credentials are sent in plain text (Base64 encoded).

## 1. Global Configuration

In `settings.py`:
```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework.authentication.SessionAuthentication', # Optional, useful for browser
    ]
}
```

## 2. Per-View Configuration

### Function-Based Views
```python
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@authentication_classes([BasicAuthentication])
@permission_classes([IsAuthenticated])
def my_view(request):
    return Response({"message": f"Hello {request.user}"})
```

### Class-Based Views
```python
from rest_framework.views import APIView
# ... imports ...

class MyView(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # ...
```

## 3. Testing

### Using `httpie` CLI
```bash
http -a username:password :8000/api/endpoint/
```

### Curl
```bash
curl -u username:password http://127.0.0.1:8000/api/endpoint/
```

Without credentials, you will receive `401 Unauthorized`.
