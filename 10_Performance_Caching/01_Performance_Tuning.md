# Django Performance Optimization

Performance is a feature. A slow site loses users.

## 1. Database Optimization (The Big One)

- **Index your columns**: `db_index=True` or `indexes=[]` in Meta.
- **Select related data**: Use `select_related()` and `prefetch_related()`.
- **Defer fields**: Use `defer()` and `only()` for large data blobs.
- **Bulk operations**: `bulk_create()`, `bulk_update()`.
- **QuerySets are lazy**: They only hit the DB when evaluated. Chain your filters!
- **`exists()` and `count()`**: Use them instead of `len()`.

## 2. Caching

Caching stores the result of expensive calculations or database queries.

### Setup (Redis is best)
```python
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379',
    }
}
```

### Levels of Caching:
- **Per-site caching**: Cache the entire site.
- **Per-view caching**:
  ```python
  from django.views.decorators.cache import cache_page
  @cache_page(60 * 15) # Cache for 15 minutes
  def my_view(request): ...
  ```
- **Template fragment caching**:
  ```html
  {% load cache %}
  {% cache 500 sidebar %}
      ... sidebar content ...
  {% endcache %}
  ```
- **Low-level API**:
  ```python
  from django.core.cache import cache
  data = cache.get('my_key')
  if not data:
      data = expensive_calculation()
      cache.set('my_key', data, 300)
  ```

## 3. Static Files & Frontend

- **Compression**: Use Gzip or Brotli (Nginx handles this).
- **Minification**: Minify CSS and JS (`django-compressor` or Webpack).
- **CDN**: Serve static/media files from a CDN (Content Delivery Network) like AWS S3 + CloudFront.

## 4. Asynchronous Tasks (Celery)

Don't block the request/response cycle with long-running tasks.
- **Use Cases**: Sending emails, processing images, generating reports.
- **Tool**: Celery + Redis/RabbitMQ.

## 5. Profiling

Don't guess; measure.

- **Django Debug Toolbar**: Essential dev tool. Shows query count and time.
- **Silk**: Profiling tool for Django. captures queries and profiling info.

## 6. Connection Pooling

Creating a database connection is expensive. Reuse them.

- **Tool**: `django-db-geventpool` or `pgbouncer` (for Postgres).
- **Django Built-in**: `CONN_MAX_AGE` setting.
  ```python
  DATABASES = {
      'default': {
          # ...
          'CONN_MAX_AGE': 60, # Keep connections alive for 60s
      }
  }
  ```
