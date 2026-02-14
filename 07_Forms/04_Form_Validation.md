# Form Validation

Validation ensures that the data submitted by the user matches your requirements constraints (e.g., "Age must be > 18", "Email must be valid").

## 1. Built-in Validation
Django fields come with default validators:
-   `EmailField` checks for `@` and domain.
-   `IntegerField` ensures the value is a number.
-   `required=True` ensures the field is not empty.

## 2. Custom Validation with `clean()`

To add custom logic (e.g., "Password must match Confirm Password"), override the `clean()` method of the form.

### Example: Validating Username Length

```python
from django import forms

class PostForm(forms.ModelForm):
    # ... Meta class ...

    def clean(self):
        # Get the "cleaned" data (data that passed basic type checks)
        cleaned_data = super().clean()
        
        username = cleaned_data.get('username')
        text = cleaned_data.get('text')

        # Custom Logic
        if username and len(username) < 5:
            self.add_error('username', 'Username must be at least 5 characters long.')

        if text and len(text) < 10:
            self.add_error('text', 'Post content must be at least 10 characters.')
            
        # Always return the cleaned data
        return cleaned_data
```

## 3. Displaying Errors in Templates

Django automatically handles error display when you use `{{ form.as_p }}`, but you can also loop through them manually.

```html
<form method="post">
    {% csrf_token %}
    
    <!-- Display Non-field errors (e.g., created in clean()) -->
    {% if form.non_field_errors %}
        <div class="alert alert-danger">{{ form.non_field_errors }}</div>
    {% endif %}

    {% for field in form %}
        <div class="fieldWrapper">
            {{ field.label_tag }} {{ field }}
            {% if field.errors %}
                <div class="error">{{ field.errors }}</div>
            {% endif %}
        </div>
    {% endfor %}
    
    <button type="submit">Submit</button>
</form>
```
