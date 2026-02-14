# Database Optimization

Optimization focuses on making database queries faster and efficient.

## The N+1 Problem
The **N+1 problem** occurs when you fetch a list of objects (1 query) and then access a related object for *each* item in the loop (N queries).

### Example
```python
# 1 Query to get all authors
authors = Author.objects.all()

for author in authors:
    # N Queries (one per author) to get their books
    print(author.book_set.all())
```
If you have 100 authors, this executes **101 queries**.

## Solutions

### 1. `select_related()` (For `ForeignKey` / `OneToOne`)
Performs a SQL JOIN. Fetches related data in the *same* initial query.

```python
# 1 Query TOTAL
books = Book.objects.select_related('author').all()

for book in books:
    print(book.author.name) # No extra DB hit
```

### 2. `prefetch_related()` (For `ManyToMany` / Reverse `ForeignKey`)
Executes a second separate query and performs the "join" in Python.

```python
# 2 Queries TOTAL
authors = Author.objects.prefetch_related('book_set').all()

for author in authors:
    print(author.book_set.all()) # No extra DB hit
```

## Other Techniques

1.  **Batch Processing**: Instead of processing/saving objects one by one in a loop, process them in batches (e.g., `bulk_create`).
2.  **Lazy Loading**: Django QuerySets are lazy. They don't run until evaluated. Keep them lazy as long as possible.
3.  **Indexing**: Add `db_index=True` to fields you frequent filter or sort by.
