# Django REST Framework (DRF)

Django REST Framework is a powerful and flexible toolkit for building Web APIs. It provides a full set of tools to create RESTful APIs on top of your existing Django models.

## 1. Installation

```bash
pip install djangorestframework
```

Add `rest_framework` to `INSTALLED_APPS` in `settings.py`.

---

## 2. Serializers

Serializers convert complex data (querysets and model instances) into native Python data types (dictionaries) that can then be easily rendered into JSON, XML, or other content types. They also provide deserialization.

### ModelSerializer
The shortcut for creating serializers that deal with model instances/querysets.

```python
from rest_framework import serializers
from .models import Article

class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ['id', 'title', 'content', 'pub_date']
```

---

## 3. ViewSets and Routers

ViewSets allow you to combine the logic for a set of related views into a single class. Routers automatically generate URLs for ViewSets.

### ViewSets (`views.py`)
```python
from rest_framework import viewsets
from .models import Article
from .serializers import ArticleSerializer

class ArticleViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
```

### Routers (`urls.py`)
```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ArticleViewSet

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'articles', ArticleViewSet)

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
]
```
This automatically creates URLs like:
- `GET /articles/` (List)
- `POST /articles/` (Create)
- `GET /articles/{pk}/` (Retrieve)
- `PUT /articles/{pk}/` (Update)
- `DELETE /articles/{pk}/` (Destroy)

---

## 4. APIViews (When you need more control)

If ViewSets are too magical or restrictive, use `APIView`. It's like a standard Django `View` but for APIs.

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class ArticleList(APIView):
    def get(self, request, format=None):
        articles = Article.objects.all()
        serializer = ArticleSerializer(articles, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = ArticleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

---

## 5. Authentication & Permissions

### Permissions
Control who can access what.

```python
from rest_framework.permissions import IsAuthenticated

class ArticleViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
```

### Custom Permissions
```python
from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the snippet.
        return obj.owner == request.user
```

---

## 6. Pagination

Pagination allows you to return large result sets in manageable chunks.

### Configuration (`settings.py`)
```python
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10
}
```

### Overriding Per-View
```python
from rest_framework.pagination import PageNumberPagination

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 1000

class ArticleViewSet(viewsets.ModelViewSet):
    pagination_class = StandardResultsSetPagination
```
