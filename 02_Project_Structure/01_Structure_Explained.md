# Django Project Structure

## How to Create a Project in Django

A Django project is the main folder structure for a web application, containing settings, URLs, and apps. It sets up the environment for development.

### Steps to create a Django project
Before creating a Django project, ensure that a virtual environment is set up and Django is installed within it.

**Step 1: Create the Project**
Once the environment is activated and Django is available, a new project can be created using:
```bash
django-admin startproject projectName
```
This will create a new folder named `projectName`.

Change into your project directory:
```bash
cd projectName
```

---

## 🏗️ The Standard Structure

When you run `django-admin startproject mysite`, you get the following structure:
```
mysite/              # Root Project Directory (Container)
├── manage.py        # Command-line utility for interacting with this project
└── mysite/          # The Inner Project Package (Python package)
    ├── __init__.py  # Makes this directory a Python package
    ├── settings.py  # Configuration for the Django project
    ├── urls.py      # The "Table of Contents" for URL routing
    ├── asgi.py      # Entry point for ASGI-compatible web servers
    └── wsgi.py      # Entry point for WSGI-compatible web servers
```

---

## 1. `manage.py`

`manage.py` is a command-line script that lets you interact with this Django project. It is a thin wrapper around `django-admin`. You generally use it for:

- `python manage.py runserver` (Start development server)
- `python manage.py createsuperuser` (Create an admin)
- `python manage.py startapp <app_name>` (Create a new app)
- `python manage.py makemigrations` (Create new migrations based on changes to models)
- `python manage.py migrate` (Apply migrations to the database)

Key Difference: `django-admin` is for system-wide commands, `manage.py` is for commands specific to your project (using your project's `settings.py`).

---

## 2. `settings.py` (The Heart of Configuration)

The `settings.py` file contains all the configuration for your Django installation.

### Key Settings Explained:

#### `DEBUG`
- `DEBUG = True`: Shows detailed error pages. **NEVER use `True` in production.**
- `DEBUG = False`: Shows generic error pages (404, 500). **Use in production.** Only works if `ALLOWED_HOSTS` is set.

#### `ALLOWED_HOSTS`
- A list of strings representing the domain names that this Django site can serve.
- Example: `ALLOWED_HOSTS = ['www.example.com', '.example.com', 'localhost']`
- This is a security measure to prevent Host Header attacks.

#### `INSTALLED_APPS`
- This is arguably the most important setting. It tells Django which "apps" are active in this project.
- It includes default apps (`str` for admin, `auth` for authentication, etc.) and your custom apps.
- **Rule:** If you create a new app, you MUST add it here (e.g., `'blog',` or `'blog.apps.BlogConfig'`).

#### `MIDDLEWARE`
- A list of middleware to use. Middleware is a framework of hooks into Django's request/response processing. Usually for security, session.

#### `TEMPLATES`
- Configuration for the template engine. Defines where Django looks for templates (e.g., `DIRS` list).

#### `DATABASES`
- A dictionary containing the settings for all databases to be used with Django.
- Default is SQLite3. In production, switch to PostgreSQL or MySQL.

#### `STATIC_URL`
- URL to use when referring to static files located in `STATIC_ROOT`.
- Example: `STATIC_URL = 'static/'`.

---

## 3. `urls.py` (The Dispatcher)

The `urls.py` file is the URL declaration for your Django-powered site; a "table of contents" of your Django-powered site.

- It maps URL patterns (strings) to Python functions (views).
- Uses `path()` and `re_path()` functions.
- Supports including other URLconf modules using `include()`.

```python
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('blog/', include('blog.urls')), # Delegates to the blog app's urls.py
]
```

---

## 4. `wsgi.py` vs `asgi.py` (The Gateway)

ASGI and WSGI are Python specifications that act as a bridge between web servers and Python web applications.

### Difference Between ASGI and WSGI

| Feature | WSGI (Web Server Gateway Interface) | ASGI (Asynchronous Server Gateway Interface) |
| :--- | :--- | :--- |
| **Execution** | Synchronous (blocking) | Asynchronous (non-blocking) |
| **Concurrency** | Threads/Processes | Event Loop (High concurrency) |
| **Protocols** | HTTP only | HTTP, WebSockets, HTTP/2 |
| **Servers** | Gunicorn, mod_wsgi | Daphne, Uvicorn |
| **UseCase** | Traditional request-response (CMS, Simple APIs) | Real-time apps (Chat, Notifications, ML) |

### Summary Comparison

> **WSGI** is designed for synchronous applications and is best suited for traditional request–response web applications.
>
> **ASGI** supports asynchronous applications and efficiently handles long-lived connections such as WebSockets, along with non-HTTP protocols.

### Advantages & Disadvantages

| Aspect | WSGI | ASGI |
| :--- | :--- | :--- |
| **Simplicity** | Simple and easy to implement | More flexible but slightly complex |
| **Stability** | Mature and well-tested | Modern and evolving |
| **Performance** | Scales using threads/processes | Misuse of async can degrade performance |

## 🏗️ How Django Bootstraps

1.  **Request comes in** (e.g., via Gunicorn to `wsgi.py`).
2.  **`settings.py` is loaded**: Django reads the environment settings.
3.  **Middleware Setup**: Django initializes the middleware listed in `MIDDLEWARE`.
4.  **URL Resolution**: Django looks at `ROOT_URLCONF` in settings (usually the main `urls.py`) and tries to match the requested URL.
5.  **View Execution**: Once a match is found, Django calls the associated view function/class.
6.  **Response**: The view returns an `HttpResponse` object, which is sent back through the middleware to the user.
