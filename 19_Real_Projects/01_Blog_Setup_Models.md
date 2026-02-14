# Real World Project: Production-Grade Blog (Part 1)

This project will combine everything you've learned into a real, deployable application.

## 1. Project Specifications

We are building a **Multi-User Blog Platform**.
- **Features**: Authentication, CRUD for posts, Comments, Tagging, User Profiles, REST API.
- **Stack**: Django 5, PostgreSQL, Bootstrap 5, DRF.

---

## 2. Initial Setup

### A. Environment
```bash
mkdir django_blog
cd django_blog
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install django psycopg2-binary pillow django-crispy-forms crispy-bootstrap5 djangorestframework python-dotenv
```

### B. Project Creation
```bash
django-admin startproject config .
python manage.py startapp accounts
python manage.py startapp blog
```

### C. Settings Configuration (`config/settings.py`)
```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Third party
    'rest_framework',
    'crispy_forms',
    'crispy_bootstrap5',
    # Local
    'accounts',
    'blog',
]

AUTH_USER_MODEL = 'accounts.CustomUser'
CRISPY_ALLOWED_TEMPLATE_PACKS = "bootstrap5"
CRISPY_TEMPLATE_PACK = "bootstrap5"
```

---

## 3. The User Model (`accounts/models.py`)

Always start with a custom user model.

```python
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)

    def __str__(self):
        return self.username
```

**Register in `accounts/admin.py` and run migrations.**

```bash
python manage.py makemigrations accounts
python manage.py migrate
```

---

## 4. Blog Models (`blog/models.py`)

```python
from django.db import models
from django.conf import settings
from django.utils.text import slugify
from django.urls import reverse

class Post(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    image = models.ImageField(upload_to='posts/', blank=True, null=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('post-detail', kwargs={'slug': self.slug})

    def __str__(self):
        return self.title

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Comment by {self.author} on {self.post}'
```

**Run migrations for blog app.**
