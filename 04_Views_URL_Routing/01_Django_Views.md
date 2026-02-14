# Django Views: The Logic Layer

A **view** is a Python function (or class) that takes a web request and returns a web response. This response can be HTML, a redirect, a 404 error, an XML document, or an image.

## 1. Function-Based Views (FBV)

Legacy, simple, and explicit. Good for beginners and complex logic that doesn't fit standard patterns.

### Basic Structure
```python
from django.http import HttpResponse, Http404
from django.shortcuts import render, get_object_or_404
from .models import Article

def index(request):
    latest_articles = Article.objects.order_by('-pub_date')[:5]
    context = {'latest_articles': latest_articles}
    return render(request, 'news/index.html', context)

def detail(request, article_id):
    # Using get_object_or_404 is a best practice
    article = get_object_or_404(Article, pk=article_id)
    return render(request, 'news/detail.html', {'article': article})
```

### The `request` Object
It contains metadata about the request.
- `request.method`: 'GET', 'POST', etc.
- `request.user`: The currently logged-in user (or AnonymousUser).
- `request.GET`: Dictionary-like object for query parameters (`?q=search`).
- `request.POST`: Dictionary-like object for form data.

---

## 2. Class-Based Views (CBV)

Object-oriented views. More reusable and concise for standard patterns.

### Why use CBVs?
- **Code Reuse**: Use inheritance and mixins.
- **Organization**: Separate GET and POST logic into methods.

### Basic `View` Class
```python
from django.views import View
from django.shortcuts import render

class MyView(View):
    def get(self, request):
        return render(request, 'my_template.html')

    def post(self, request):
        # Handle form submission
        return HttpResponse("Form processed")
```

---

## 3. Generic Class-Based Views (GCBV)

Django provides built-in views for common tasks like displaying a list of objects or a detail page.

### Common Generic Views:
1.  **`ListView`**: Display a list of objects.
2.  **`DetailView`**: Display a single object.
3.  **`CreateView`**: specific for creating new objects.
4.  **`UpdateView`**: specific for updating objects.
5.  **`DeleteView`**: specific for deleting objects.

#### Example: `ListView`
```python
from django.views.generic import ListView
from .models import Article

class ArticleListView(ListView):
    model = Article
    template_name = 'article_list.html' # Default: app/model_list.html
    context_object_name = 'articles' # Default: object_list
    paginate_by = 10 # Pagination built-in!
    
    def get_queryset(self):
        # Override to filter
        return Article.objects.filter(is_published=True)
```

#### Example: `DetailView`
```python
from django.views.generic import DetailView
from .models import Article

class ArticleDetailView(DetailView):
    model = Article
    # Automatically looks for pk or slug in URL
```

---

## 4. Mixins

Mixins are multiple inheritance helpers used to add functionality to CBVs.

### Common Mixins:
- **`LoginRequiredMixin`**: Ensures the user is logged in.
- **`PermissionRequiredMixin`**: Checks for specific permissions.
- **`UserPassesTestMixin`**: Custom test logic.

**CRITICAL RULE**: Mixins generally go *first* in the inheritance list (left-to-right).

```python
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import CreateView

class ArticleCreateView(LoginRequiredMixin, CreateView):
    model = Article
    fields = ['title', 'content']
    login_url = '/login/'
```

---

## 5. Decorators

For FBVs, we use decorators to enforce permissions or behavior.

```python
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods

@login_required
@require_http_methods(["GET", "POST"])
def my_protected_view(request):
    # ...
```

---

## 6. Error Handling

### Custom Error Views
Define these in your root `urls.py`:

```python
handler404 = 'mysite.views.custom_page_not_found'
handler500 = 'mysite.views.custom_server_error'
handler403 = 'mysite.views.custom_permission_denied'
handler400 = 'mysite.views.custom_bad_request'
```

### Raising Errors
```python
from django.core.exceptions import PermissionDenied, SuspiciousOperation
from django.http import Http404

def my_view(request):
    if not request.user.is_staff:
        raise PermissionDenied
    if not article:
        raise Http404("Article does not exist")
```
