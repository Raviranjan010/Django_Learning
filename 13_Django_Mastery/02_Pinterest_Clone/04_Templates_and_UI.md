# Pinterest Clone - Templates & UI

We will use CSS Columns for a pure CSS Masonry layout (Pinterest style).

## 1. Base Template (`templates/base.html`)

```html
<!DOCTYPE html>
<html>
<head>
    <title>Pinterest Clone</title>
    <style>
        /* Global Styles */
        body { font-family: sans-serif; margin: 0; background: #fafafa; }
        nav { padding: 20px; background: white; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
    </style>
</head>
<body>
    <nav>
        <a href="/">Home</a>
        {% if user.is_authenticated %}
            <a href="/create-pin/">Create Pin</a>
            <a href="/logout/">Logout</a>
        {% else %}
            <a href="/login/">Login</a>
        {% endif %}
    </nav>
    
    <div class="container" style="padding: 20px;">
        {% block content %}{% endblock %}
    </div>
</body>
</html>
```

## 2. Masonry Feed (`templates/home.html`)

```html
{% extends "base.html" %}

{% block content %}
<style>
    .grid {
        column-count: 4;
        column-gap: 15px;
    }
    @media (max-width: 1000px) { .grid { column-count: 3; } }
    @media (max-width: 700px) { .grid { column-count: 2; } }

    .card {
        break-inside: avoid; /* Prevents element splitting across columns */
        margin-bottom: 15px;
        border-radius: 12px;
        overflow: hidden;
        background: white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .card img {
        width: 100%;
        display: block;
        border-radius: 12px;
    }
    .card h4 {
        padding: 10px;
        margin: 0;
        font-size: 16px;
    }
</style>

<div class="grid">
  {% for pin in pins %}
    <div class="card">
      <a href="{% url 'pin_detail' pin.id %}">
        <img src="{{ pin.image.url }}">
      </a>
      <h4>{{ pin.title }}</h4>
    </div>
  {% endfor %}
</div>
{% endblock %}
```
