# Django Production Deployment

Deploying Django requires moving from a development environment (`runserver`) to a production environment (Gunicorn + Nginx + PostgreSQL).

## 1. The Architecture

- **Web Server (Nginx)**: Handles incoming HTTP requests, serves static files, and terminates SSL.
- **Application Server (Gunicorn)**: Executes Python code. Handles WSGI requests from Nginx.
- **Database (PostgreSQL)**: Stores data.
- **Process Manager (Systemd / Docker)**: Keeps Gunicorn running.

## 2. Preparing for Production

### `settings.py`

- **`DEBUG = False`**: Critical.
- **`ALLOWED_HOSTS`**: Set to your domain/IP.
- **`SECRET_KEY`**: Load from environment variable.
- **`DATABASES`**: Use PostgreSQL.
- **`STATIC_ROOT`**: Where `collectstatic` will put files.
- **`MEDIA_ROOT`**: Where user uploads go.

### Environment Variables
Use `python-decouple` or `django-environ`.

```python
import environ
env = environ.Env()
environ.Env.read_env()

SECRET_KEY = env('SECRET_KEY')
DEBUG = env.bool('DEBUG', default=False)
DATABASES = {'default': env.db()}
```

## 3. WSGI Server (Gunicorn)

Gunicorn (Green Unicorn) is a pure-Python WSGI server for UNIX.

```bash
pip install gunicorn
gunicorn myproject.wsgi
```

- **Workers**: `(2 x num_cores) + 1`.

## 4. Web Server (Nginx)

Nginx acts as a reverse proxy.

### Sample Nginx Config
```nginx
server {
    listen 80;
    server_name example.com;

    location = /favicon.ico { access_log off; log_not_found off; }
    
    location /static/ {
        alias /home/user/myproject/staticfiles/;
    }

    location /media/ {
        alias /home/user/myproject/media/;
    }

    location / {
        include proxy_params;
        proxy_pass http://unix:/run/gunicorn.sock;
    }
}
```

## 5. Docker Deployment

Dockerizing your application makes deployment reproducible.

### `Dockerfile`
```dockerfile
FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "myproject.wsgi:application"]
```

### `docker-compose.yml`
```yaml
version: '3.8'

services:
  web:
    build: .
    command: gunicorn myproject.wsgi:application --bind 0.0.0.0:8000
    volumes:
      - ./static:/app/static
    env_file: .env
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=mydb
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
```

## 6. Static Files

In production, Django does not serve static files.

1.  Set `STATIC_ROOT`.
2.  Run `python manage.py collectstatic`.
3.  Configure Nginx to serve that directory.
