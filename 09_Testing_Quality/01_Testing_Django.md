# Testing in Django

Testing is not optional. It is the only way to ensure your code works as expected and doesn't break when you make future changes.

## 1. The Basics (`TestCase`)

Django’s `TestCase` class is a subclass of Python’s `unittest.TestCase`.

### Features of `django.test.TestCase`:
- **Database isolation**: It creates a test database, runs migrations, wraps every test in a transaction, and rolls back the transaction at the end. Your production DB is safe.
- **Client**: A dummy web browser to making requests.

### Example `tests.py`
```python
from django.test import TestCase
from django.urls import reverse
from .models import Article

class ArticleModelTest(TestCase):
    def setUp(self):
        # Called before every test
        self.article = Article.objects.create(title="Test Article", content="Content")

    def test_string_representation(self):
        self.assertEqual(str(self.article), "Test Article")

class ArticleViewTest(TestCase):
    def setUp(self):
        self.article = Article.objects.create(title="Test Article", content="Content")

    def test_home_page_status_code(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)

    def test_detail_page_returns_correct_html(self):
        url = reverse('article-detail', args=[self.article.id])
        response = self.client.get(url)
        self.assertContains(response, "Test Article")
```

---

## 2. Using `pytest` (Recommended)

`pytest` is a more powerful and pythonic testing framework.

### Installation
```bash
pip install pytest pytest-django
```

### Configuration (`pytest.ini`)
```ini
[pytest]
DJANGO_SETTINGS_MODULE = mysite.settings
python_files = tests.py test_*.py *_tests.py
```

### Writing Tests in Pytest style
No classes required!
```python
import pytest
from django.urls import reverse
from .models import Article

@pytest.mark.django_db
def test_article_create():
    article = Article.objects.create(title="New", content="Content")
    assert Article.objects.count() == 1

@pytest.mark.django_db
def test_home_view(client): # 'client' fixture is injected automatically
    url = reverse('home')
    response = client.get(url)
    assert response.status_code == 200
```

---

## 3. Factory Boy (Better than fixtures)

Instead of hardcoding objects or using JSON fixtures, use factories.

### Installation
```bash
pip install factory_boy
```

### Usage
```python
import factory
from .models import User, Article

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
    
    username = factory.Sequence(lambda n: f'user{n}')
    email = factory.LazyAttribute(lambda o: f'{o.username}@example.com')

class ArticleFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Article
    
    title = "My Article"
    author = factory.SubFactory(UserFactory)
```

**In Tests:**
```python
def test_something():
    user = UserFactory() # Creates a user
    article = ArticleFactory(author=user) # Creates article with that user
```

---

## 4. Coverage

Measure how much of your code is tested.

```bash
pip install coverage
coverage run -m pytest
coverage report
coverage html # Generates a nice HTML report
```
