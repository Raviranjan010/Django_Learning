# Django Model Fields

Fields define the structure of the database table, specifying the column type and validation rules.

## Common Field Types

-   **`CharField`**: Stores short text strings (e.g., names, titles). Requires `max_length`.
-   **`TextField`**: Stores large text blocks (e.g., blog posts, descriptions).
-   **`IntegerField`**: Stores integer values.
-   **`BooleanField`**: Stores `True`/`False` values.
-   **`DateTimeField`**: Stores date and time.
-   **`DateField`**: Stores date only.
-   **`ImageField` / `FileField`**: Uploads files to a specified path.
-   **`SlugField`**: Stores short labels consisting of letters, numbers, underscores, or hyphens. Used in URLs.

## Field Options (Attributes)

Every field takes a set of specific arguments to control its behavior.

-   **`null`**: If `True`, Django will store empty values as `NULL` in the database. (Default: `False`)
-   **`blank`**: If `True`, the field is allowed to be blank in forms. (Default: `False`)
-   **`choices`**: A sequence of 2-tuples to use as choices for this field.
-   **`default`**: The default value for the field.
-   **`help_text`**: Extra "help" text to be displayed with the form widget.
-   **`verbose_name`**: A human-readable name for the field.
-   **`unique`**: If `True`, this field must be unique throughout the table.

---

## Important Distinction: `null=True` vs `blank=True`

Understanding this difference is crucial for data integrity and form validation.

| Feature | `null=True` | `blank=True` |
| :--- | :--- | :--- |
| **Scope** | **Database** Schema | **Form** Validation |
| **Meaning** | Allows `NULL` values in the DB column. | Allows empty string/value in forms. |
| **Use Case** | Optional database fields (e.g., middle name). | Optional form fields (e.g., optional bio). |

### Examples:

1.  **`null=True, blank=True`**: Field is optional in both forms and database.
2.  **`null=True, blank=False`**: Field is required in forms, but can be NULL in DB (rare use case).
3.  **`null=False, blank=True`**: Field is optional in forms, but DB requires a value (common for strings, stored as empty string `""`).
4.  **`null=False, blank=False`**: Field is required everywhere (Default).

---

## Deep Dive: `SlugField`

A "slug" is a URL-friendly label for something (e.g., `my-first-blog-post`).

**Syntax:**
```python
slug = models.SlugField(max_length=200)
```

**Common usage:**
Often used to generate readable URLs for detailed views.
```python
path('article/<slug:slug>/', views.article_detail)
```

**Auto-populating Slugs:**
You often want to auto-generate a slug from a title. This is typically done by overriding the `save()` method (see Model Methods notes).
