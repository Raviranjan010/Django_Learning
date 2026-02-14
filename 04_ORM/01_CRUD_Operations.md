# Django ORM: CRUD Operations

Django ORM (Object-Relational Mapper) allows you to Create, Retrieve, Update, and Delete data using Python.

## 1. Creating Data (Insert)

### Method A: `Model.objects.create()`
Creates and saves the object in a single step.
```python
# Creates and writes to DB immediately
p1 = Person.objects.create(name="John", age=25)
```

### Method B: `Model()` then `.save()`
Instantiates the object first, allowing modification before saving.
```python
# In-memory only
p2 = Person(name="Jane", age=30)
# Writes to DB
p2.save()
```

### Comparison: `Model()` vs `create()`

| Feature | `Model()` | `Model.objects.create()` |
| :--- | :--- | :--- |
| **Action** | Initializes instance | Initializes & Saves |
| **DB Hit** | No (until `.save()`) | Yes (Immediate) |
| **Usage** | Complex logic before save | Quick insertion |

## 2. Retrieving Data (Read)

-   **All Records**:
    ```python
    all_users = User.objects.all()
    ```

-   **Single Record** (raises Error if not found or multiple found):
    ```python
    user = User.objects.get(id=1)
    ```

-   **Filtering** (Returns QuerySet):
    ```python
    active_users = User.objects.filter(is_active=True)
    ```

## 3. Updating Data

### Single Object Update
```python
user = User.objects.get(id=1)
user.name = "New Name"
user.save()
```

### Bulk Update
Updates multiple records in one query.
```python
User.objects.filter(age__lt=18).update(is_minor=True)
```

## 4. Deleting Data

### Single Object Delete
```python
user = User.objects.get(id=1)
user.delete()
```

### Bulk Delete
```python
User.objects.filter(is_active=False).delete()
```
**Warning**: Deletes are usually irreversible.
