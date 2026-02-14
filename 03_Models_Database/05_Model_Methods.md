# Overriding the `save` Method

The `save()` method is called whenever an object is created or updated in the database. You can override it to perform custom logic before or after saving.

## Common Use Case: Auto-generating Slugs

A frequent use of overriding `save()` is to automatically generate a `slug` from a `title`.

### Example Implementation

```python
from django.db import models
from django.utils.text import slugify

class GeeksModel(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(blank=True, null=True)

    def save(self, *args, **kwargs):
        # Only generate slug if it's empty to avoid changing it on updates
        if not self.slug:
            self.slug = slugify(self.title)
        
        # Call the "real" save() method
        super(GeeksModel, self).save(*args, **kwargs)
```

**Key Points:**
1.  **`slugify`**: A Django utility that converts "Hello World!" to "hello-world".
2.  **`super().save()`**: You **must** call the parent class's save method, otherwise the data won't persist to the database.
3.  **`*args, **kwargs`**: Ensure you pass all arguments to the parent method.

## Important Considerations

1.  **Overwriting Slugs**: If you regenerate the slug every time (without the `if not self.slug` check), the URL of your page will change whenever you edit the title. This is bad for SEO (broken links).
2.  **Bulk Operations**: The `save()` method is **NOT** called when using `bulk_create()` or `update()`. If you need logic to run there, you may need other approaches (like database triggers or custom managers).
3.  **Recursion**: Be careful not to trigger infinite save loops within your custom save method.

## Other Common Methods

### `get_absolute_url`

This method tells Django how to calculate the canonical URL for an object. It is highly recommended to define this.

```python
from django.urls import reverse

def get_absolute_url(self):
    return reverse('model-detail-view', args=[str(self.id)])
```
-   Used by the admin interface 'View on site' button.
-   Used by `CreateView` and `UpdateView` to redirect after success.

