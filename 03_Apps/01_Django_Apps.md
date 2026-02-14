# Django Apps

## What is an App?

A Django **project** is a collection of configurations and **apps** for a particular website. An **app** is a web application that does something – e.g., a blog system, a database of public records, or a simple poll app. It is a self-contained Python package.

### The Concept of Pluggability
Ideally, an app should be written so that it can be dropped into any Django project. This is the core philosophy of Django's reusable apps.

### Key Components of an App

When you run `python manage.py startapp myapp`, Django creates:

- `admin.py`: Define the admin interface for this app.
- `apps.py`: App configuration (e.g., signals setup).
- `models.py`: Database models.
- `tests.py`: Tests for this app.
- `views.py`: Request handlers.
- `migrations/`: Directory for storing database schema changes.

**Best Practice**: Create a `urls.py` inside your app folder and include it in the main project `urls.py`. This makes the app portable.

### How to Create an App in Django

**Step 1: Navigate to the Project Directory**
Open the terminal and navigate to the root directory of the Django project, where the `manage.py` file is located:
```bash
cd project_name
```

**Step 2: Create a New App**
Create a Django app with the following command:
```bash
python manage.py startapp projectApp
```
This will generate a directory structure like:
```
projectApp/
    migrations/
    __init__.py
    admin.py
    apps.py
    models.py
    tests.py
    views.py
```

**Step 3: Register the App in Project's `settings.py`**
Open `project_name/settings.py` and add the app to the `INSTALLED_APPS` list:

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    # ...
    'projectApp.apps.ProjectAppConfig', # Recommended: Use AppConfig
    # OR
    'projectApp',
]
```

**Step 4: Include App URLs in Project URLs**
Connect the app's URLs to the main project so Django can route requests.

In `urls.py` of the main project directory (`project_name/urls.py`):
```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include("projectApp.urls")),  # Include app URLs
]
```

**Step 5: Create `urls.py` in App**
The app requires its own `urls.py` to define view routes. Create it inside the `projectApp` directory:

```python
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
]
```

**Step 6: Create a View**
In `projectApp/views.py`, define a view that will return a simple response:

```python
from django.http import HttpResponse

def index(request):
    return HttpResponse("Hello, Geeks! Welcome to your first Django app.")
```

**Step 7: Run the Development Server**
```bash
python manage.py runserver
```
Visit `http://127.0.0.1:8000/` and you should see the message.

---

### Django App Features

| Feature | Description |
| :--- | :--- |
| **Modularity** | Apps are loosely coupled and independently developed. |
| **Reusability** | Apps are reusable across projects. |
| **Collaboration** | Teams can work independently on separate apps. |
| **Organization** | Maintains clean, organized, and manageable code. |
| **Built-in Features** | Django offers tools like admin, middleware, etc., to accelerate development. |

---


### AppConfig (`apps.py`)
This file allows you to configure metadata for the application.

```python
from django.apps import AppConfig

class BlogConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'blog'
    verbose_name = "My Awesome Blog" # Changes the name in Admin Panel

    def ready(self):
        import blog.signals # Import signals here to avoid circular imports
```
