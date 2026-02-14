# Django Models Basics

A **Django model** is a Python class that represents a database table. It acts as the single source of truth for your data, containing the essential fields and behaviors of the data you’re storing.

-   **ORM (Object-Relational Mapping)**: Django’s ORM allows you to interact with your database using Python code instead of raw SQL.
-   **Admin Integration**: Models work smoothly with the Django admin panel for managing information.

## 1. Creating a Django Model

Models are defined in the `models.py` file of your app.

### Example `models.py`

```python
from django.db import models

class GeeksModel(models.Model):
    # Field Definitions
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='images/')

    # String Representation
    def __str__(self):
        return self.title
```

**Breakdown:**
-   `models.Model`: All models must inherit from this class.
-   `CharField`: Used for short text (requires `max_length`).
-   `TextField`: Used for longer text.
-   `ImageField`: Used to store image files (requires `Pillow` library).
-   `__str__`: Defines how the object acts when converted to a string (e.g., in the admin panel).

## 2. Applying Migrations

Whenever you create, update, or delete a model, you must propagate these changes to the database schema.

### Step 1: `makemigrations`
Generates the SQL commands for your model changes.
```bash
python manage.py makemigrations
```

### Step 2: `migrate`
Executes the generated SQL commands to update the database table.
```bash
python manage.py migrate
```

## 3. Registering Models in Django Admin

To manage your model via the built-in admin interface, you need to register it.

**In `admin.py`:**

```python
from django.contrib import admin
from .models import GeeksModel

# Register your models here.
admin.site.register(GeeksModel)
```

Now, you can log in to the admin panel (usually at `/admin/`) and create, update, or delete instances of `GeeksModel`.
