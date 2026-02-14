# Pinterest Clone - Performance Optimization

To make the application production-ready, we need to optimize it.

## 1. Database Optimization (`select_related`)
In `views.py`, we already used `select_related` to avoid N+1 queries.

```python
# Fetches User data in the same query as Pins
pins = Pin.objects.select_related("user").all()
```
If we display tags or comments (Many-to-Many), use `prefetch_related`.

## 2. Pagination
Loading 1000 pins at once will crash the browser. Use Django's `Paginator`.

```python
from django.core.paginator import Paginator

def home(request):
    pin_list = Pin.objects.all().order_by("-created_at")
    paginator = Paginator(pin_list, 20) # Show 20 pins per page
    
    page_number = request.GET.get('page')
    pins = paginator.get_page(page_number)
    return render(request, "home.html", {"pins": pins})
```

## 3. Image Compression
Large images slow down the site. We can override the `save` method in the `Pin` model to compress images using `Pillow`.

```python
from PIL import Image

class Pin(models.Model):
    # ... fields ...

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        
        img = Image.open(self.image.path)
        if img.height > 1080 or img.width > 1080:
            output_size = (1080, 1080)
            img.thumbnail(output_size)
            img.save(self.image.path)
```

## 4. Caching
Cache the homepage if it doesn't change every second.

```python
from django.views.decorators.cache import cache_page

@cache_page(60 * 15) # Cache for 15 minutes
def home(request):
    # ...
```

## 5. Use a CDN
In production, serve static and media files via a CDN (like AWS S3 or Cloudflare) instead of the local filesystem.
