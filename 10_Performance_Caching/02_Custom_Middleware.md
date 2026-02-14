# Creating Custom Middleware

You can write your own middleware to handle cross-cutting concerns globally.

## 1. Class-Based Middleware Structure

```python
class SimpleMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        # One-time configuration

    def __call__(self, request):
        # Code executed BEFORE the view (Request phase)
        
        response = self.get_response(request)

        # Code executed AFTER the view (Response phase)
        
        return response
```

## 2. Project Example: Role-Based Redirection

**Goal**: Redirect users to specific home pages (Teacher, Student, Principal) after login based on their role.

### Step 1: `models.py`
Extend `AbstractUser` to add a Role field.
```python
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('teacher', 'Teacher'),
        ('student', 'Student'),
        ('principal', 'Principal'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
```

### Step 2: `custom_middleware.py`
Create this file in your app.

```python
from django.shortcuts import redirect

class RoleRedirectMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response

    def process_view(self, request, view_func, view_args, view_kwargs):
        # Logic is better placed here or in process_request depending on needs
        # Note: MiddlewareMixin structure is slightly different, but for modern Django 
        # using __call__ is standard. However, to access request.user, it must be after AuthMiddleware.
        pass
        
# Alternative implementation using MiddlewareMixin (older style but common for process_request)
from django.utils.deprecation import MiddlewareMixin

class CustomRoleMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if not request.user.is_authenticated:
            return None
            
        # Avoid redirect loops
        if request.path in ['/logout/', '/login/', '/admin/']:
            return None
            
        role = getattr(request.user, 'role', None)
        path = request.path
        
        if role == 'teacher' and not path.startswith('/teacher_home'):
            return redirect('teacher_home')
        elif role == 'student' and not path.startswith('/student_home'):
            return redirect('student_home')
        elif role == 'principal' and not path.startswith('/principal_home'):
            return redirect('principal_home')
```

### Step 3: Register in `settings.py`
Add it to the bottom of the list.
```python
MIDDLEWARE = [
    # ... built-ins ...
    'testapp.custom_middleware.CustomRoleMiddleware',
]
```
