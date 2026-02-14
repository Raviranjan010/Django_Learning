# Aggregation vs Annotation

Django ORM provides two powerful methods for calculating statistics: `aggregate()` and `annotate()`.

| Feature | `aggregate()` | `annotate()` |
| :--- | :--- | :--- |
| **Scope** | Entire QuerySet (Global) | Per-Object (Individual) |
| **Return Type** | Dictionary `{'avg': 50}` | QuerySet `[<Obj1>, <Obj2>]` |
| **Fields Added** | None | Adds temporary fields to each object |
| **Use Case** | "What is the total revenue of the shop?" | "How many books has *each* author written?" |

## Example Setup

```python
class Author(models.Model):
    name = models.CharField(max_length=100)

class Book(models.Model):
    title = models.CharField(max_length=100)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=5, decimal_places=2)
```

## 1. Using `aggregate()`
Calculates a single value for the whole table.

```python
from django.db.models import Avg, Sum, Count

# Returns: {'total_books': 100, 'avg_price': 15.50}
stats = Book.objects.aggregate(
    total_books=Count('id'),
    avg_price=Avg('price')
)
```

## 2. Using `annotate()`
Calculates values for each record in the list.

```python
# Returns: <QuerySet [<Author: JK Rowling>, <Author: Tolkien>]>
# But each Author object now has a 'num_books' attribute!
authors = Author.objects.annotate(
    num_books=Count('book')
)

for a in authors:
    print(f"{a.name} has written {a.num_books} books.")
```

## Combination

You can filter before annotating!

```python
# Get authors who have written more than 5 books
active_authors = Author.objects.annotate(count=Count('book')).filter(count__gt=5)
```
