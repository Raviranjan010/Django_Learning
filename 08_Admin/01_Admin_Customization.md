# Django Admin Customization

The Django Admin is one of the framework's most powerful features. It reads your models and provides a quick, model-centric interface for trusted users to manage content on your site.

## 1. Basics

To use the admin, you must create a superuser:
```bash
python manage.py createsuperuser
```

Then, register your models in `admin.py`:

```python
from django.contrib import admin
from .models import Article

admin.site.register(Article)
```

---

## 2. Advanced Customization (`ModelAdmin`)

To customize how a model is displayed, create a `ModelAdmin` class.

```python
from django.contrib import admin
from .models import Article

class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'pub_date', 'is_published')
    list_filter = ('is_published', 'pub_date')
    search_fields = ('title', 'content')
    prepopulated_fields = {'slug': ('title',)}
    date_hierarchy = 'pub_date'
    ordering = ('-pub_date',)

admin.site.register(Article, ArticleAdmin)
# OR use the decorator:
# @admin.register(Article)
# class ArticleAdmin(admin.ModelAdmin): ...
```

### Key Options:
- **`list_display`**: Fields to show in the list view.
- **`list_filter`**: Sidebar filters.
- **`search_fields`**: Search bar (uses `__icontains` by default).
- **`prepopulated_fields`**: Auto-fill slug from another field.
- **`date_hierarchy`**: Drill-down by date.
- **`ordering`**: Default sort order.

---

## 3. Editing Forms

You can customize the add/change forms.

```python
class ArticleAdmin(admin.ModelAdmin):
    fields = ('title', 'content', 'pub_date') # Reorder fields
    # OR create fieldsets
    fieldsets = (
        (None, {
            'fields': ('title', 'content')
        }),
        ('Advanced options', {
            'classes': ('collapse',),
            'fields': ('slug', 'is_published'),
        }),
    )
```

---

## 4. Inline Models

Edit related models on the same page (e.g., editing `Book` and its `Review`s).

```python
class ReviewInline(admin.TabularInline):
    model = Review
    extra = 1

class BookAdmin(admin.ModelAdmin):
    inlines = [ReviewInline]
```

- **`TabularInline`**: Compact, spreadsheet-like.
- **`StackedInline`**: Each form is stacked vertically.

---

## 5. Custom Admin Actions

Add bulk actions to the list view.

```python
@admin.action(description='Mark selected stories as published')
def make_published(modeladmin, request, queryset):
    queryset.update(status='p')

class ArticleAdmin(admin.ModelAdmin):
    actions = [make_published]
```

---

## 6. Overriding Admin Templates

You can override admin templates to change the look and feel.
- Copy templates from `django/contrib/admin/templates/admin/` to your project's `templates/admin/`.
- Commonly overridden: `base_site.html` (to change the title/header).
