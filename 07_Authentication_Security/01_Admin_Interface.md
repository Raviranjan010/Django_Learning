# Django Admin Interface

The Django Admin Interface is a built-in feature that provides a web-based dashboard to manage project data through models. It enables developers and administrators to handle data efficiently without writing SQL or extra backend code.

## Key Features
-   **Ready-to-use**: Browser-based management interface.
-   **CRUD Operations**: Allows adding, editing, and deleting records.
-   **User Management**: Manage users, groups, and permissions.
-   **Customizable**: Can be extended according to project requirements.

## 1. Accessing Admin Panel

### Start the Server
```bash
python manage.py runserver
```
Open: `http://127.0.0.1:8000/admin/`

### Creating a Superuser
To log in, you need a user with generic permissions.
```bash
python manage.py createsuperuser
```
Provide Username, Email (optional), and Password.

## 2. Registering Models

By default, only built-in models (like Users and Groups) appear. To manage your own models, you must register them.

**Step 1: Define Model (`models.py`)**
```python
from django.db import models

class FacultyDetails(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    department = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
```

**Step 2: Register in `admin.py`**
```python
from django.contrib import admin
from .models import FacultyDetails

admin.site.register(FacultyDetails)
```

**Step 3: Migrations**
```bash
python manage.py makemigrations
python manage.py migrate
```
Now `FacultyDetails` will appear on the dashboard.
