# Pinterest Clone - Models

We use a modular approach for our database design.

## 1. Custom User (`accounts/models.py`)

Using a custom user model is a professional best practice.

```python
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    bio = models.TextField(blank=True)
    profile_picture = models.ImageField(upload_to="profiles/", blank=True)

    def __str__(self):
        return self.username
```
*Note: Add `AUTH_USER_MODEL = "accounts.User"` to `settings.py`.*

## 2. Pin Model (`pins/models.py`)

The core content unit.

```python
from django.db import models
from django.conf import settings

class Pin(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="pins/")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
```

## 3. Boards (`boards/models.py`)

To save collections of pins.

```python
from django.db import models
from django.conf import settings
from pins.models import Pin

class Board(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=150)
    pins = models.ManyToManyField(Pin, blank=True)

    def __str__(self):
        return self.name
```

## 4. Social Interactions (`social/models.py`)

Likes and Comments.

```python
from django.db import models
from django.conf import settings
from pins.models import Pin

class Like(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    pin = models.ForeignKey(Pin, on_delete=models.CASCADE)
    class Meta:
        unique_together = ('user', 'pin')

class Comment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    pin = models.ForeignKey(Pin, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
```
