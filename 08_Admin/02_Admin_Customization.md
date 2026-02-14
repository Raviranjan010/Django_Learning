# Django Admin - Redesign and Customization

Django provides powerful tools to tailor the admin panel to specific requirements using the `ModelAdmin` class.

## Setup Example
Assume we have `Movies` and `Customers` models.

```python
# admin.py
from django.contrib import admin
from .models import Movies, Customers
```

## 1. Changing Order of Fields (`fields`)
By default, fields appear in the order defined in the model. You can reorder them.

```python
class MovieAdmin(admin.ModelAdmin):
    fields = ['release_year', 'title', 'length']

admin.site.register(Movies, MovieAdmin)
```

## 2. Adding Search and Filters

### Search (`search_fields`)
Adds a search box.
```python
class MovieAdmin(admin.ModelAdmin):
    search_fields = ['title', 'length', 'release_year']
```

### Filters (`list_filter`)
Adds a sidebar filter.
```python
class MovieAdmin(admin.ModelAdmin):
    list_filter = ['release_year']
```

## 3. Customizing the List View (`list_display`)
Show more columns in the list of items, not just the string representation.

```python
class MovieAdmin(admin.ModelAdmin):
    list_display = ['title', 'release_year', 'length']
```

## 4. Editable List Views (`list_editable`)
Allow editing fields directly from the list view without opening the record.

```python
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'phone']
    list_editable = ['phone'] # Must also be in list_display

admin.site.register(Customers, CustomerAdmin)
```

## 5. Overriding Admin Templates
To change the branding (e.g., "Django site admin" header), you can override templates.

1.  Create `templates/admin/base_site.html`.
2.  Ensure `TEMPLATES` in `settings.py` points to your templates folder.

**`templates/admin/base_site.html`**:
```html
{% extends "admin/base.html" %}

{% block title %}{{ title }} | {{ site_title|default:_('Django site admin') }}{% endblock %}

{% block branding %}
<h1 id="site-name" style="font-family: cursive;">
    <a href="{% url 'admin:index' %}">Video Rental Administration</a>
</h1>
{% endblock %}

{% block nav-global %}{% endblock %}
```
