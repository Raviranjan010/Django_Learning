# Real World Project: Production-Grade Blog (Part 2)

Now let's build the interactive part: Views and Templates.

## 1. Views (`blog/views.py`)

We will use Class-Based Views (CBVs) for efficiency.

```python
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from .models import Post
from django.urls import reverse_lazy

class PostListView(ListView):
    model = Post
    template_name = 'blog/home.html'
    context_object_name = 'posts'
    paginate_by = 5

class PostDetailView(DetailView):
    model = Post

class PostCreateView(LoginRequiredMixin, CreateView):
    model = Post
    fields = ['title', 'content', 'image']

    def form_valid(self, form):
        form.instance.author = self.request.user
        return super().form_valid(form)

class PostUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Post
    fields = ['title', 'content', 'image']

    def form_valid(self, form):
        form.instance.author = self.request.user
        return super().form_valid(form)

    def test_func(self):
        post = self.get_object()
        return self.request.user == post.author

class PostDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = Post
    success_url = reverse_lazy('blog-home')

    def test_func(self):
        post = self.get_object()
        return self.request.user == post.author
```

## 2. URLs (`blog/urls.py`)

```python
from django.urls import path
from .views import (
    PostListView,
    PostDetailView,
    PostCreateView,
    PostUpdateView,
    PostDeleteView
)

urlpatterns = [
    path('', PostListView.as_view(), name='blog-home'),
    path('post/<slug:slug>/', PostDetailView.as_view(), name='post-detail'),
    path('post/new/', PostCreateView.as_view(), name='post-create'),
    path('post/<slug:slug>/update/', PostUpdateView.as_view(), name='post-update'),
    path('post/<slug:slug>/delete/', PostDeleteView.as_view(), name='post-delete'),
]
```

---

## 3. Templates

### Base Template (`templates/base.html`)
Use Bootstrap for styling.

```html
<!DOCTYPE html>
<html>
<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <title>Django Blog</title>
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div class="container">
            <a class="navbar-brand" href="{% url 'blog-home' %}">My Blog</a>
            <div class="navbar-nav ms-auto">
                {% if user.is_authenticated %}
                    <a class="nav-item nav-link" href="{% url 'post-create' %}">New Post</a>
                    <a class="nav-item nav-link" href="#">Logout</a>
                {% else %}
                    <a class="nav-item nav-link" href="#">Login</a>
                {% endif %}
            </div>
        </div>
    </nav>
    
    <div class="container">
        {% block content %}{% endblock %}
    </div>
</body>
</html>
```

### Home Template (`blog/templates/blog/home.html`)

```html
{% extends "base.html" %}
{% block content %}
    {% for post in posts %}
        <article class="card mb-4">
            <div class="card-body">
                <h2><a href="{% url 'post-detail' post.slug %}">{{ post.title }}</a></h2>
                <p class="text-muted">By {{ post.author }} on {{ post.created_at|date:"F d, Y" }}</p>
                <p>{{ post.content|truncatewords:30 }}</p>
            </div>
        </article>
    {% endfor %}

    <!-- Pagination Logic Here -->
{% endblock %}
```
