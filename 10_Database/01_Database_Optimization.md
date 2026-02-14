# Django Database Optimization

Database performance is usually the biggest bottleneck in web applications. Django's ORM is powerful, but it's easy to write inefficient queries if you're not careful.

## 1. The N+1 Problem

This is the most common performance issue. It happens when you access a related field in a loop, causing a separate database query for each item.

### The Problem:
```python
# Views.py
books = Book.objects.all()
return render(request, 'books.html', {'books': books})

# Template
{% for book in books %}
    {{ book.author.name }}  <!-- Triggers a query for EACH book! -->
{% endfor %}
```
If you have 100 books, this executes 1 query for books + 100 queries for authors = 101 queries.

### The Solution: `select_related` and `prefetch_related`

#### A. `select_related()` (SQL JOIN)
Use for single-valued relationships (ForeignKey, OneToOne).
```python
books = Book.objects.select_related('author').all()
```
This fetches the book *and* the author in a single complex SQL query.

#### B. `prefetch_related()` (Python Join)
Use for multi-valued relationships (ManyToMany, Reverse ForeignKey).
```python
authors = Author.objects.prefetch_related('books').all()
```
This executes 2 queries: one for authors, one for all related books, and joins them in Python.

---

## 2. Using `defer()` and `only()`

If you have a model with a huge text field that you don't need, don't load it.

```python
# Only loads 'id' and 'name'. 'biography' (huge text) is deferred.
authors = Author.objects.only('name')

# Loads everything EXCEPT 'biography'.
authors = Author.objects.defer('biography')
```

**Warning**: If you access a deferred field later, Django triggers a new query.

---

## 3. Database Indexes

Indexes speed up lookups (WHERE clauses) but slow down writes (INSERT/UPDATE).

```python
class Customer(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

    class Meta:
        indexes = [
            models.Index(fields=['last_name', 'first_name']),
            models.Index(fields=['first_name'], name='first_name_idx'),
        ]
```
Add indexes to fields you frequently filter or order by.

---

## 4. Aggregation and Annotation

Perform calculations in the database, not in Python.

```python
from django.db.models import Count, Avg

# BAD:
count = len(Book.objects.all()) # Fetches all rows into memory!

# GOOD:
count = Book.objects.count() # SELECT COUNT(*) FROM ...

# Complex:
authors = Author.objects.annotate(num_books=Count('book'))
# Now each author object has a 'num_books' attribute.
```

---

## 5. Bulk Operations

Inserting or updating many records one by one is slow.

### `bulk_create()`
```python
entries = [Entry(headline=f"Entry {i}") for i in range(1000)]
Entry.objects.bulk_create(entries)
```

### `bulk_update()`
```python
objs = Entry.objects.all()
for obj in objs:
    obj.headline = "New Headline"
Entry.objects.bulk_update(objs, ['headline'])
```

---

## 6. Raw SQL

When the ORM is too slow or complex, drop down to SQL.

```python
from django.db import connection

def my_custom_sql(self):
    with connection.cursor() as cursor:
        cursor.execute("UPDATE bar SET foo = 1 WHERE baz = %s", [self.baz])
        cursor.execute("SELECT foo FROM bar WHERE baz = %s", [self.baz])
        row = cursor.fetchone()
    return row
```
**Warning**: You lose cross-database portability and security protections (be careful of SQL injection).
