# Django URL Dispatcher & Advanced Techniques

The Django URL Dispatcher maps incoming HTTP requests to views, enabling precise request routing. It supports dynamic URLs, named patterns, namespaces, and class-based views.

## Creating URL Patterns
URL patterns define how URLs are routed to views. They are stored in the `urlpatterns` list.

**Example: `urls.py`**
```python
from django.urls import path
from . import views

urlpatterns = [
    path('home/', views.home_view, name='home'),
    path('about/', views.about_view, name='about'),
]
```
- `'home/'` is mapped to `home_view`.
- `name='home'` allows easy reference in templates and Python code.

---

## Using Regular Expression Captures (`re_path`)
Regex captures extract dynamic values from URLs and pass them to views as arguments.

**Example:**
```python
from django.urls import re_path
from . import views

urlpatterns = [
    re_path(r'^blog/(?P<blog_id>\d+)/\$', views.blog_detail, name='blog_detail'),
]
```
- `(?P<blog_id>\d+)`: captures an integer.
- The view is called as `blog_detail(request, blog_id=1)`.

---

## Naming and Inverting URL Patterns

**Naming**:
Add the `name` argument to `path()`.

**Inverting (Reverse Resolution)**:
Generates URLs from their names instead of hardcoding paths.

- **In Templates**:
  ```html
  <a href="{% url 'home' %}">Home</a>
  ```
- **In Python Code**:
  ```python
  from django.urls import reverse
  home_url = reverse('home')
  ```

---

## Using Namespaces
Namespaces organize URL patterns, avoiding naming conflicts when multiple apps exist.

**1. Include app URLs with namespace**:
```python
from django.urls import path, include

urlpatterns = [
    path('books/', include(('books.urls', 'books'), namespace='books')),
]
```

**2. Reference Namespaced URLs**:
- **Template**: `{% url 'books:book_detail' book_id=1 %}`
- **Python**: `reverse('books:book_detail', kwargs={'book_id': 1})`

---

## Using Class-Based Views (CBVs)
Class-based views provide reusable and organized view logic.

**1. Define the View**:
```python
from django.views import View
from django.http import HttpResponse

class ItemListView(View):
    def get(self, request):
        return HttpResponse("List of items")
```

**2. Map to URL**:
Use `.as_view()` to convert the class into a callable view.
```python
from django.urls import path
from .views import ItemListView

urlpatterns = [
    path('items/', ItemListView.as_view(), name='item-list'),
]
```
