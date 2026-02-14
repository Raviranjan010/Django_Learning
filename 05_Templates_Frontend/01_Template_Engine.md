# Django Template Engine

A Django template is an HTML file that can also include CSS and JavaScript. It is used to create dynamic web pages.

- Renders data sent from views inside the HTML structure.
- Helps define the layout and design of each page.
- Supports template tags and variables for dynamic content.
- Makes it easy to separate presentation from application logic.

## Organizing Templates
Django provides two ways to organize templates based on your project structure:
1.  **Project-level templates**: A single template directory shared across all apps.
2.  **App-level templates**: Separate template directories for individual apps.

## Template Setup in Django

### Configuration in `settings.py`

1.  Create a folder named `templates` in the project’s base directory (`BASE_DIR`).
2.  Update the `TEMPLATES` setting in `settings.py` to include this folder.

```python
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'], # Point to project-level templates
        'APP_DIRS': True,                 # Discover templates inside each app
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
```

## Using Django Templates

Templates are not limited to displaying static HTML; they can also present dynamic data passed from views via a context dictionary.

### Example: Passing Data to Template

**1. `views.py`**
```python
from django.shortcuts import render

def simple_view(request):
    data = "Gfg is the best"
    number_list = [1, 2, 3, 4, 5]
    context = {
        "data": data,
        "list": number_list
    }
    return render(request, "geeks.html", context)
```

**2. `urls.py`**
```python
from django.urls import path
from . import views

urlpatterns = [
    path('simple', views.simple_view),
]
```

**3. Template File (`geeks.html`)**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Homepage</title>
</head>
<body>
    <h1>Welcome to GeeksforGeeks.</h1>
    <p>{{ data }}</p>
    <ul>
        {% for number in list %}
            <li>{{ number }}</li>
        {% endfor %}
    </ul>
</body>
</html>
```

### The `render` Function
The `render` function combines a given template with a given context dictionary and returns an implementation request object.
```python
render(request, template_name, context=None, content_type=None, status=None, using=None)
```

---

## 2. Tags

Tags provide arbitrary logic in the rendering process.

### Common Tags:
- `{% if %}`: Control flow.
  ```html
  {% if user.is_authenticated %}
      <p>Welcome back!</p>
  {% else %}
      <a href="{% url 'login' %}">Login</a>
  {% endif %}
  ```

- `{% for %}`: Loop over a list.
  ```html
  <ul>
  {% for item in items %}
      <li>{{ item.name }}</li>
  {% empty %}
      <li>No items found.</li>
  {% endfor %}
  </ul>
  ```

- `{% url %}`: Returns an absolute path reference (a URL without the domain name).
  ```html
  <a href="{% url 'article-detail' article.id %}">Read More</a>
  ```

- `{% csrf_token %}`: Essential for security in POST forms.

---

## 3. Template Inheritance (The Killer Feature)

Template inheritance allows you to build a base "skeleton" template that contains all the common elements of your site and defines **blocks** that child templates can override.

### Base Template (`base.html`)
```html
<!DOCTYPE html>
<html>
<head>
    <title>{% block title %}My Site{% endblock %}</title>
</head>
<body>
    <header>
        <h1>My Site</h1>
    </header>
    
    <main>
        {% block content %}{% endblock %}
    </main>

    <footer>
        <p>&copy; 2023 My Site</p>
    </footer>
</body>
</html>
```

### Child Template (`home.html`)
```html
{% extends "base.html" %}

{% block title %}Home Page{% endblock %}

{% block content %}
    <h2>This is the homepage</h2>
    <p>Welcome to my site.</p>
{% endblock %}
```

---

## 4. Static Files (CSS, JS, Images)

Static files are files that don't change (unlike uploaded media files).

### Configuration (`settings.py`)
```python
STATIC_URL = 'static/'
STATICFILES_DIRS = [BASE_DIR / "static"]
```

### Usage in Template
```html
{% load static %}
<img src="{% static 'images/logo.png' %}" alt="My Logo">
<link rel="stylesheet" href="{% static 'css/style.css' %}">
```

---

## 5. Media Files (User Uploads)

How to handle files uploaded by users.

### Configuration (`settings.py`)
```python
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / "media"
```

### URL Configuration (`urls.py`)
**This is required only for development (`DEBUG=True`).**
```python
from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

### Usage in Template
```html
<img src="{{ profile.avatar.url }}" alt="Avatar">
```

---

## 6. Custom Template Tags & Filters

You can create your own tags and filters.

### Structure
Create a `templatetags` directory inside your app.
```
myapp/
    templatetags/
        __init__.py
        my_extras.py
```

### Creating a Filter (`my_extras.py`)
```python
from django import template

register = template.Library()

@register.filter(name='cut')
def cut(value, arg):
    """Removes all values of arg from the given string"""
    return value.replace(arg, '')
```

### Implementation
```html
{% load my_extras %}
{{ somevariable|cut:" " }}
```
