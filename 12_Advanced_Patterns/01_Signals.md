# Django Signals

Django includes a "signal dispatcher" which helps decoupled applications get notified when actions occur elsewhere in the framework.

## 1. When to Use Signals

- When you want to trigger an action based on a specific event.
- When you want to decouple the sender (e.g., User model) and the receiver (e.g., Profile model).
- **Common Use Case**: Creating a `Profile` instance automatically when a `User` is created.

---

## 2. Built-in Signals

Some of the most useful built-in signals:

- `pre_save`, `post_save`: Sent before/after a model's `save()` method is called.
- `pre_delete`, `post_delete`: Sent before/after a model's `delete()` method or queryset's `delete()` method is called.
- `m2m_changed`: Sent when a ManyToManyField is changed.
- `request_started`, `request_finished`: Sent when HTTP request starts/finishes.

---

## 3. Connecting to Signals

### Method A: `receiver` Decorator (Recommended)

1.  **Create a `signals.py` file** inside your app.
```python
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Profile

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
```

2.  **Connect in `apps.py`**:
    You must ensure that your signal handling code is imported when Django starts.

```python
from django.apps import AppConfig

class UsersConfig(AppConfig):
    name = 'users'

    def ready(self):
        import users.signals
```

---

## 4. Custom Signals

You can define your own signals.

```python
# signals.py
import django.dispatch

user_logged_in_failed = django.dispatch.Signal()
```

### Sending the Signal
```python
# views.py
from .signals import user_logged_in_failed

def my_view(request):
    # ... logic ...
    user_logged_in_failed.send(sender=request.user)
```

### Receiving the Signal
```python
@receiver(user_logged_in_failed)
def log_failed_login(sender, **kwargs):
    # Log the failure
    pass
```

---

## 5. Potential Pitfalls

- **Avoid logic loops**: If a `post_save` signal triggers a save on the same model, it will create an infinite loop.
- **Transactional signals**: Sometimes you want the signal to fire only after the transaction is committed.
  - Use `transaction.on_commit()` inside the signal handler if needed.
