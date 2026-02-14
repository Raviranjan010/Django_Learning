# Template Inheritance in Django

Django's **Template Inheritance** is the most powerful part of its template engine. It allows you to build a base "skeleton" template that contains all the common elements of your site and defines **blocks** that child templates can override.

## The `extends` Tag
Enables reusing a base template across multiple pages.

**Syntax:**
```html
{% extends 'base_template.html' %}
```

- Must be the **first tag** in the template.
- Can accept a variable: `{% extends variable_name %}`.

## The `block` Tag
Defines a block that can be overridden by child templates.

**Syntax:**
```html
{% block block_name %}
    Default content
{% endblock %}
```

## The `include` Tag
Loads and renders another template within the current template. Useful for small components like navbars or footers.

**Syntax:**
```html
{% include "foo/bar.html" %}
```

---

## Example Workflow

### 1. Create a Base Template (`base.html`)
```html
<!DOCTYPE html>
<html>
<head>
    <title>{% block title %}My Site{% endblock %}</title>
</head>
<body>
    <header>
        <h1>My Website</h1>
    </header>

    <main>
        {% block content %}
        <p>This is the default content.</p>
        {% endblock %}
    </main>

    <footer>
        <p>Footer info</p>
    </footer>
</body>
</html>
```

### 2. Create a Child Template (`home.html`)
```html
{% extends "base.html" %}

{% block title %}Home Page{% endblock %}

{% block content %}
    <h2>Welcome Home!</h2>
    <p>This content replaces the default block.</p>
{% endblock %}
```

### 3. Render in View (`views.py`)
```python
from django.shortcuts import render

def home(request):
    return render(request, "home.html")
```
