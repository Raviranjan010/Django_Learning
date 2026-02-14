# Returning HttpResponse from Django and Understanding URLs

Django offers a simple way to send `HttpResponse`, allowing the server to communicate with the client based on the user's request.

## The Concept
- **HttpResponse** is the main class used to return responses in Django.
- Can send plain text, HTML, JSON, or any other content type.
- Helps define what the browser should display after a request.
- Forms the basic building block for building dynamic web pages.

## Creating a Simple HttpResponse

To return a simple response, define a view function in your app's `views.py` file.

**In `home/views.py`:**
```python
from django.http import HttpResponse

def index(request):
    # return plain text/HTML as HTTP response
    return HttpResponse("Hi.. from Django Server")
```

### Adding HTML Content to Responses
HTML content can also be included in the response to display dynamic web pages.

**In `home/views.py`:**
```python
from django.http import HttpResponse

def about(request):
    # HTML content returned as response
    html_content = "<h1>Hii.. from Django Server | This is an <b>About Page...</b><br><p>This about page can be used to see the about section.</p>"
    return HttpResponse(html_content)
```

---

## Understanding URLs in Django

URLs are used in Django to connect user requests to the correct view. They decide which code should run when a specific URL is visited.

- The `urls.py` file is where URL patterns are defined.
- Each pattern maps a URL path to a specific view function or class.
- Django checks these patterns in order to find the correct match.

### Steps to Configure URLs

**1. Import the views functions**
In `core/urls.py` (Project URLs):
```python
from django.urls import path
from home.views import index, about
```

**2. Include the path for calling the views function**
```python
urlpatterns = [
    path('', index, name='index'),
    path('about/', about, name='about'),
]
```

**3. Run the Django Server**
```bash
python manage.py runserver
```

- Visit `http://127.0.0.1:8000/` to view the “Hi.. from Django Server” message.
- Visit `http://127.0.0.1:8000/about/` to see the HTML content.

---

## Returning HTML Page as Response (Using Templates)

To serve full HTML pages, follow these steps:

**1. Create a templates folder**
Inside your app directory (e.g., `home`), create a folder named `templates`.

**2. Create an HTML file**
Create `home/templates/index.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Django Server</title>
</head>
<body>
    <h1>This HTML page is returned by Django.</h1>
    <p>Django is really nice.</p>
</body>
</html>
```

**3. Update `views.py`**
Use Django’s `render` function to serve the HTML file.
```python
from django.shortcuts import render

def index(request):
    return render(request, 'index.html')
```

**4. Map the view in `urls.py`**
```python
from django.urls import path
from home.views import index

urlpatterns = [
    path('', index, name='index')
]
```
