# Advanced Django Topics

Django's ecosystem is vast. Here we explore powerful tools for handling background tasks, real-time communication, and custom management commands.

## 1. Celery (Async Task Queue)

Celery is an asynchronous task queue/job queue based on distributed message passing. It is focused on real-time operation, but supports scheduling as well.

### Installation
```bash
pip install celery redis
```

### Configuration (`celery.py`)
Create a `celery.py` file next to `settings.py`.

```python
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')

app = Celery('mysite')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
```

### Defining Tasks (`tasks.py`)
Inside any app:

```python
from celery import shared_task

@shared_task
def send_welcome_email(user_id):
    user = User.objects.get(pk=user_id)
    # ... send email ...
    return f"Email sent to {user.email}"
```

### Calling Tasks
```python
send_welcome_email.delay(user.id) # Non-blocking
```

---

## 2. Django Channels (WebSockets)

Channels extends Django to handle WebSockets and other asynchronous protocols.

### Installation
```bash
pip install channels daphne
```

### Configuration (`asgi.py`)
```python
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import chat.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')

application = ProtocolTypeRouter({
  "http": get_asgi_application(),
  "websocket": AuthMiddlewareStack(
        URLRouter(
            chat.routing.websocket_urlpatterns
        )
    ),
})
```

### Consumers (`consumers.py`)
Consumers are like Views for WebSockets.

```python
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        await self.send(text_data=json.dumps({
            'message': message
        }))
```

---

## 3. Custom Management Commands

Create your own `./manage.py` commands.

### Structure
```
myapp/
    management/
        __init__.py
        commands/
            __init__.py
            my_command.py
```

### Implementation (`my_command.py`)

```python
from django.core.management.base import BaseCommand
from myapp.models import Article

class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    def add_arguments(self, parser):
        parser.add_argument('poll_ids', nargs='+', type=int)

    def handle(self, *args, **options):
        for poll_id in options['poll_ids']:
            try:
                poll = Poll.objects.get(pk=poll_id)
            except Poll.DoesNotExist:
                raise CommandError('Poll "%s" does not exist' % poll_id)

            poll.opened = False
            poll.save()

            self.stdout.write(self.style.SUCCESS('Successfully closed poll "%s"' % poll_id))
```

### Usage
```bash
python manage.py my_command 1 2 3
```

---

## 4. Multi-Database Support

Django can connect to multiple databases.

### Configuration (`settings.py`)
```python
DATABASES = {
    'default': {},
    'users_db': {},
}
```

### Routing (`routers.py`)
Create a database router class to decide which database to read/write from for a given model.

```python
class UserRouter:
    def db_for_read(self, model, **hints):
        if model._meta.app_label == 'auth':
            return 'users_db'
        return None
```
