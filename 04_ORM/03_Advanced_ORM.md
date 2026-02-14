# Advanced ORM Techniques

## 1. `get_or_create()`

A shortcut method to retrieve an object if it exists, or create it if it doesn't.

**Syntax:**
```python
obj, created = Model.objects.get_or_create(lookups, defaults={})
```
-   **Returns**: A tuple `(object, created_boolean)`.
-   **`created`**: `True` if a new object was created, `False` if retrieved.

**Example:**
```python
category, created = Category.objects.get_or_create(
    name='Tech',
    defaults={'description': 'Technology related posts'}
)

if created:
    print("New category created!")
else:
    print("Category already existed.")
```

**Concurrency:**
It attempts to handle race conditions atomically, but in high-concurrency environments with non-atomic databases, issues can still arise.

## 2. `bulk_create()`

Inserts multiple objects into the database in a **single query**. significantly faster than calling `save()` in a loop.

**Example:**
```python
entries = []
for i in range(1000):
    entries.append(Student(name=f"Student {i}", age=20))

# One SQL Query for 1000 records
Student.objects.bulk_create(entries)
```

**Limitations:**
-   Does **not** call the model’s `save()` method.
-   Does **not** trigger `pre_save` or `post_save` signals.
-   Does not work across multi-table inheritance scenarios easily.

## 3. `bulk_update()`

Updates specific fields for multiple objects in one query.

```python
objs = Entry.objects.all()
for obj in objs:
    obj.headline = "Updated Headline"

# Only updates the 'headline' column
Entry.objects.bulk_update(objs, ['headline'])
```
