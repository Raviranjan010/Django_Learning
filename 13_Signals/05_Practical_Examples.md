# Practical Example: Auto-Create User Profile

A classic use case for signals is creating a `Profile` instance immediately after a `User` registers.

## 1. The Models (`models.py`)

```python
from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    
    def __str__(self):
        return f"Profile of {self.user.username}"
```

## 2. The Signals (`signals.py`)

```python
from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import Profile

@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    """Create Profile only when User is created"""
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_profile(sender, instance, **kwargs):
    """Save Profile whenever User is saved"""
    # Catches edge cases where profile exists but needs update logic
    instance.profile.save()
```

## 3. Registering Signals (`apps.py`)

```python
from django.apps import AppConfig

class UsersConfig(AppConfig):
    name = 'users'

    def ready(self):
        import users.signals
```

## 4. Other Use Cases
-   **Invalidating Cache**: `post_save` on a Product model clears the `product_list` cache.
-   **Notification**: `new_order` signal triggers an Email and SMS sender.
-   **Audit Logs**: `pre_delete` signal saves a copy of the record to an `Archive` table.
