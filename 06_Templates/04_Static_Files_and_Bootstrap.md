# Adding CSS and Bootstrap in Django

## Adding CSS in Django Templates

Although external CSS files (Static Files) are best practice, sometimes you need to add CSS directly.

### 1. Inline Styles
Apply styles directly to HTML elements.
```html
<p style="color: red; font-size: 16px;">This is a paragraph.</p>
```

### 2. Embedded CSS
Embed CSS rules within `<style>` tags in the `<head>` or `<body>`.
```html
<head>
    <style>
        p {
            color: blue;
            font-size: 14px;
        }
    </style>
</head>
```

---

## Integrating Bootstrap

Bootstrap is a popular CSS framework that helps create responsive, visually appealing websites.

### Method 1: Using CDN (Content Delivery Network)

**1. Create a Base Template (`base.html`)**
Include the Bootstrap CSS link in the `<head>` and JS script at the end of `<body>`.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{% block title %}Django Bootstrap{% endblock %}</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    
    {% block content %}
    {% endblock %}

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

**2. Extend in Child Template**
```html
{% extends 'base.html' %}

{% block content %}
    <nav class="navbar navbar-dark bg-dark">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">My Django Site</a>
        </div>
    </nav>

    <div class="container mt-5">
        <h1>Welcome!</h1>
        <button class="btn btn-primary">Click Me</button>
    </div>
{% endblock %}
```

### Method 2: Static Files (Production Recommended)
1.  Download Bootstrap files.
2.  Place them in your `static/` directory.
3.  Load them using `{% load static %}`.

```html
{% load static %}
<link rel="stylesheet" href="{% static 'css/bootstrap.min.css' %}">
```
