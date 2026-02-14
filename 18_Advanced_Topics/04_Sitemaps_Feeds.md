# Sitemaps and RSS Feeds

Sitemaps help search engines index your site. RSS feeds allow users to subscribe to updates.

## 1. Sitemaps

Django comes with a high-level sitemap-generating framework.

### Setup
Add `django.contrib.sitemaps` to `INSTALLED_APPS`.

### Creating a Sitemap (`sitemaps.py`)
```python
from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from .models import Article

class ArticleSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.9

    def items(self):
        return Article.objects.filter(is_published=True)

    def lastmod(self, obj):
        return obj.updated_at
```

### URLs (`urls.py`)
```python
from django.contrib.sitemaps.views import sitemap
from .sitemaps import ArticleSitemap

sitemaps = {
    'articles': ArticleSitemap,
}

urlpatterns = [
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps},
         name='django.contrib.sitemaps.views.sitemap'),
]
```

---

## 2. RSS Feeds

### Creating a Feed Class (`feeds.py`)
```python
from django.contrib.syndication.views import Feed
from django.urls import reverse
from .models import Article

class LatestEntriesFeed(Feed):
    title = "My Blog News"
    link = "/sitenews/"
    description = "Updates on changes and additions to my blog."

    def items(self):
        return Article.objects.order_by('-pub_date')[:5]

    def item_title(self, item):
        return item.title

    def item_description(self, item):
        return item.content
        
    # item_link is only needed if Article object has no get_absolute_url method.
    def item_link(self, item):
        return reverse('article-detail', args=[item.pk])
```

### URLs (`urls.py`)
```python
from .feeds import LatestEntriesFeed

urlpatterns = [
    path('feed/', LatestEntriesFeed()),
]
```
