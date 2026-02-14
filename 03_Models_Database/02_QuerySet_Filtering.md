# QuerySet Filtering

QuerySets allow you to refine your database search to retrieve specific records.

## Basic Filtering

### `filter()`
Returns a QuerySet containing objects that match the given parameters.
```python
# Get all users from 'India'
users = User.objects.filter(country='India')
```

### `exclude()`
Returns a QuerySet containing objects that do **NOT** match the parameters.
```python
# Get all users NOT from 'Agra'
users = User.objects.exclude(city='Agra')
```

### Chaining Filters
QuerySets are lazy and chainable.
```python
# Get users from India AND NOT from Agra
User.objects.filter(country='India').exclude(city='Agra')
```

## Field Lookups
Field lookups use double underscores (`__`) to specify conditions.

-   `__exact`: Exact match.
-   `__icontains`: Case-insensitive containment.
-   `__startswith`: Starts with.
-   `__gt` / `__gte`: Greater than / Greater than or equal to.
-   `__lt` / `__lte`: Less than / Less than or equal to.

**Example:**
```python
# Name contains "Dani" (case-insensitive)
Student.objects.filter(name__icontains="Dani")
```

## Advanced Filtering with `Q` Objects

Standard keyword arguments in `filter()` are "AND"ed together. To perform complex "OR" queries, use `Q` objects.

**Import:**
```python
from django.db.models import Q
```

**Example (OR Condition):**
Users from India **OR** New York.
```python
User.objects.filter(Q(country='India') | Q(city='New York'))
```

**Example (NOT Condition):**
Users who are NOT from India (using `~`).
```python
User.objects.filter(~Q(country='India'))
```

## `F` Objects

`F` objects allow you to reference model fields directly in database operations (e.g., comparing two fields in the same row or updating a field based on its current value).

**Import:**
```python
from django.db.models import F
```

**Example (Field Comparison):**
Find users where names are same as their city (random example).
```python
User.objects.filter(name=F('city'))
```

**Example (Atomic Update):**
Increment a view count without fetching the object first (avoids race conditions).
```python
Post.objects.filter(id=1).update(views=F('views') + 1)
```

