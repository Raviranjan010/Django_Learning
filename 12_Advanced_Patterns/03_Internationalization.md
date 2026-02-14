# Internationalization (i18n) & Localization (L10n)

Django provides robust support for making your application available in multiple languages and time zones.

## 1. Concepts

- **Internationalization (i18n)**: Preparing the software to be adapted to different languages. (Developer's job).
- **Localization (L10n)**: Translating the text and adapting formats. (Translator's job).

## 2. Configuration (`settings.py`)

```python
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

LANGUAGES = [
    ('en', 'English'),
    ('es', 'Spanish'),
    ('fr', 'French'),
]

LOCALE_PATHS = [
    BASE_DIR / 'locale',
]
```

## 3. Marking Strings for Translation

### In Python Code
Use `gettext` (aliased as `_`).

```python
from django.utils.translation import gettext as _

def my_view(request):
    output = _("Welcome to my site.")
    return HttpResponse(output)
```

### In Templates
Use `{% trans %}` or `{% blocktrans %}`.

```html
{% load i18n %}

<h1>{% trans "Welcome to my site." %}</h1>

{% blocktrans %}
    This string will have {{ variable }} inside it.
{% endblocktrans %}
```

## 4. Creating Translation Files

1.  **Create Message Files**:
    ```bash
    mkdir locale
    django-admin makemessages -l es
    django-admin makemessages -l fr
    ```

2.  **Edit `.po` files**:
    Open `locale/es/LC_MESSAGES/django.po` and add translations.
    ```po
    msgid "Welcome to my site."
    msgstr "Bienvenido a mi sitio."
    ```

3.  **Compile Messages**:
    ```bash
    django-admin compilemessages
    ```

## 5. Switching Languages

Add `django.middleware.locale.LocaleMiddleware` to the `MIDDLEWARE` setting.
It determines the language from:
1.  URL prefix (`/es/about/`)
2.  Session data
3.  Cookie
4.  Browser `Accept-Language` header
