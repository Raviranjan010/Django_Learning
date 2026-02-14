# Relational Fields in Django

Django models often need to relate to each other. Django offers three main types of database relationships.

## 1. Many-to-One (`ForeignKey`)

Used when one record of a model is related to multiple records of another model.

**Example:** A `Song` belongs to one `Album`, but an `Album` has many `Songs`.

```python
class Album(models.Model):
    title = models.CharField(max_length=100)

class Song(models.Model):
    title = models.CharField(max_length=100)
    # The 'Many' side holds the ForeignKey
    album = models.ForeignKey(Album, on_delete=models.CASCADE)
```

## 2. Many-to-Many (`ManyToManyField`)

Used when records in both models can be related to multiple records in the other.

**Example:** A `Book` can have multiple `Authors`, and an `Author` can write multiple `Books`.

```python
class Author(models.Model):
    name = models.CharField(max_length=100)

class Book(models.Model):
    title = models.CharField(max_length=100)
    # Can be placed in either model
    authors = models.ManyToManyField(Author)
```

## 3. One-to-One (`OneToOneField`)

Used when one record is related to exactly one record of another model. Useful for extending user profiles.

**Example:** A `Car` has exactly one `Vehicle` registration.

```python
class Vehicle(models.Model):
    reg_no = models.IntegerField()

class Car(models.Model):
    vehicle = models.OneToOneField(Vehicle, on_delete=models.CASCADE, primary_key=True)
    model_name = models.CharField(max_length=100)
```

---

## Data Integrity Options (`on_delete`)

When using `ForeignKey` or `OneToOneField`, you must define what happens when the referenced object is deleted.

-   **`models.CASCADE`**: Deletes the object containing the ForeignKey as well. (Delete Album -> Delete all its Songs).
-   **`models.PROTECT`**: Prevents deletion of the referenced object if related objects exist. (Cannot delete Album if it has Songs).
-   **`models.SET_NULL`**: Sets the ForeignKey to NULL. Requires `null=True`.
-   **`models.SET_DEFAULT`**: Sets the ForeignKey to a default value.
-   **`models.DO_NOTHING`**: Takes no action (can cause IntegrityError).
