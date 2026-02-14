# Connecting Receivers

To handle a signal, you must "connect" a function (receiver) to it.

## 1. Using the `@receiver` Decorator (Recommended)

```python
from django.dispatch import receiver
from django.db.models.signals import post_save
from .models import MyModel

@receiver(post_save, sender=MyModel)
def my_handler(sender, instance, created, **kwargs):
    if created:
        print(f"New instance of {sender} created!")
```
**`sender` argument**: It is efficient and best practice to always restrict the receiver to a specific Sender model. Without it, your function would run for *every* model in the system.

## 2. Using `connect()` Method manually

```python
from django.db.models.signals import post_save
from .models import MyModel

def my_handler(sender, instance, **kwargs):
    print("Saved!")

# Connect manually (e.g., inside an AppConfig.ready() method)
post_save.connect(my_handler, sender=MyModel)
```

## 3. Disconnecting
Useful for testing or temporary disabling.

```python
post_save.disconnect(my_handler, sender=MyModel)
```

## Where to put Signals?
Do not put them in `models.py` to avoid circular imports.
1.  Create `signals.py` in your app.
2.  Connect them in `apps.py`:

```python
# apps.py
from django.apps import AppConfig

class MyAppConfig(AppConfig):
    name = 'myapp'

    def ready(self):
        import myapp.signals
```
