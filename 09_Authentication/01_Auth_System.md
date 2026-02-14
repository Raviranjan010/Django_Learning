# User Authentication System

Authentication is securing the application by verifying user identity.

## 1. Setup
Make sure `django.contrib.auth` is in `INSTALLED_APPS` (it is by default).

## 2. Views (`views.py`)

We need views for Register, Login, and Logout.

```python
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages

def login_view(request):
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        user = authenticate(username=username, password=password)
        
        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            messages.error(request, "Invalid Credentials")
            
    return render(request, 'login.html')

def register_view(request):
    if request.method == 'POST':
        # ... fetch data ...
        username = request.POST.get('username')
        # Check existence
        if User.objects.filter(username=username).exists():
            messages.info(request, "Username taken")
            return redirect('register')
            
        # Create User
        user = User.objects.create_user(username=username, email=email)
        user.set_password(password)
        user.save()
        
        messages.success(request, "Account created")
        return redirect('login')
        
    return render(request, 'register.html')
```

## 3. URLs (`urls.py`)

```python
path('login/', views.login_view, name='login'),
path('register/', views.register_view, name='register'),
```

## 4. Templates

Use simple HTML forms with `{% csrf_token %}`.
Display messages using:
```html
{% if messages %}
    {% for message in messages %}
        <div class="alert">{{ message }}</div>
    {% endfor %}
{% endif %}
```
