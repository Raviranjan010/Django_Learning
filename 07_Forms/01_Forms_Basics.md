# Django Forms Basics

Django Forms are used to collect input from users, check if the input is correct, and process the data.

## Key Features
-   **Gather information**: Through form fields such as text, email, or password.
-   **Automatic validation**: Checks data before processing.
-   **Security**: Built-in protection against CSRF and malicious script injection.
-   **HTML Generation**: Automatically renders HTML input tags.

## 1. Syntax
```python
field_name = forms.FieldType(**options)
```
-   **field_name**: Name of the form field (e.g., `first_name`).
-   **FieldType**: Type of the field (e.g., `CharField`, `EmailField`, `IntegerField`).
-   **options**: specific arguments (e.g., `max_length`, `required`, `label`).

## 2. Creating a Simple Django Form

Create a `forms.py` file in your app folder:

```python
from django import forms

class InputForm(forms.Form):
    first_name = forms.CharField(max_length=200)
    last_name = forms.CharField(max_length=200)
    roll_number = forms.IntegerField(help_text="Enter 6 digit roll number")
    password = forms.CharField(widget=forms.PasswordInput())
```

## 3. Rendering Django Forms

Django provides 3 built-in methods to render form fields in templates:

1.  **`{{ form.as_table }}`**: Renders fields as table cells wrapped in `<tr>` tags.
2.  **`{{ form.as_p }}`**: Renders fields wrapped in `<p>` tags.
3.  **`{{ form.as_ul }}`**: Renders fields wrapped in `<li>` tags.

### Example Template (`home.html`)
```html
<!DOCTYPE html>
<html>
<head>
    <title>Django Form</title>
</head>
<body>
    <h2>Student Registration Form</h2>
    <form action="" method="post">
        {% csrf_token %}
        {{ form.as_p }}
        <input type="submit" value="Submit">
    </form>
</body>
</html>
```

### Example View (`views.py`)
```python
from django.shortcuts import render
from .forms import InputForm

def home_view(request):
    context = {}
    context['form'] = InputForm()
    return render(request, "home.html", context)
```

## 4. Django Forms vs HTML Forms

| Feature | HTML Forms | Django Forms |
| :--- | :--- | :--- |
| **Definition** | Standard HTML `<form>` tags. | Python classes inheriting `forms.Form`. |
| **Validation** | Manual JavaScript or backend logic. | Built-in, automatic server-side validation. |
| **Model Linking** | No direct link. | Can automatically map to Models (`ModelForm`). |
| **Security** | Manual CSRF handling. | Built-in CSRF protection. |
| **Use Case** | Simple, static forms. | Robust, data-driven applications. |
