# Real World Project: Production-Grade Blog (Part 3)

Finally, let's add an API and prepare for deployment.

## 1. REST API (`blog/serializers.py` & `blog/api_views.py`)

### Serializers (`blog/serializers.py`)
```python
from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')

    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'author', 'created_at']
```

### API Views (`blog/api_views.py`)
```python
from rest_framework import generics, permissions
from .models import Post
from .serializers import PostSerializer

class PostListAPI(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class PostDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
```

### API URLs (`blog/urls.py`)
```python
from django.urls import path
from .api_views import PostListAPI, PostDetailAPI

urlpatterns += [
    path('api/posts/', PostListAPI.as_view(), name='api-post-list'),
    path('api/posts/<int:pk>/', PostDetailAPI.as_view(), name='api-post-detail'),
]
```

---

## 2. Deployment Checklist

### A. Environment Variables (`.env`)
```bash
SECRET_KEY=your-production-secret-key
DEBUG=False
DATABASE_URL=postgres://user:password@localhost:5432/blog_db
ALLOWED_HOSTS=yourdomain.com
```

### B. Static Files
```bash
python manage.py collectstatic
```

### C. Gunicorn
Create a systemd service file `/etc/systemd/system/gunicorn.service`:
```ini
[Unit]
Description=gunicorn daemon
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/home/ubuntu/django_blog
ExecStart=/home/ubuntu/django_blog/venv/bin/gunicorn --access-logfile - --workers 3 --bind unix:/run/gunicorn.sock config.wsgi:application

[Install]
WantedBy=multi-user.target
```

### D. Nginx
Create `/etc/nginx/sites-available/blog`:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location = /favicon.ico { access_log off; log_not_found off; }
    location /static/ {
        alias /home/ubuntu/django_blog/staticfiles/;
    }

    location / {
        include proxy_params;
        proxy_pass http://unix:/run/gunicorn.sock;
    }
}
```

---

## 3. Final Thoughts

Congratulations! You have built a full-stack Django application with:
- Custom User Model
- CRUD Operations
- Authentication
- REST API
- Production Configuration

**Next Steps**:
- Add Email verification.
- Add Redis for caching.
- Add Celery for background tasks.
- Dockerize the application.
