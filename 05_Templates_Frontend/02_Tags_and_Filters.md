# Django Template Tags and Filters

The Django Template Language (DTL) primarily consists of variables, tags, filters, and comments.

## 1. Variables
Variables are used to display dynamic data passed from views through the context dictionary.
- Enclosed in **double curly braces** `{{ }}`.
- Syntax: `{{ variable_name }}`

**Example:**
```html
My first name is {{ first_name }}.
```

## 2. Filters
Filters are used to modify variable output before rendering on the page.
- Applied using the **pipe symbol** `|`.
- Syntax: `{{ variable_name | filter_name }}`

**Common Filters:**
- `{{ value | length }}`: Returns the length of the value.
- `{{ value | lower }}`: Converts to lowercase.
- `{{ value | title }}`: Converts to title case.
- `{{ value | date:"D d M Y" }}`: Formats a date.
- `{{ value | default:"nothing" }}`: Returns default if value is False/None.
- `{{ value | truncatechars:20 }}`: Truncates a string.

## 3. Tags
Tags add control flow and logic to templates.
- Enclosed in `{% %}`.
- Syntax: `{% tag_name [arguments] %}`

### Commonly Used Tags

#### `comment`
Ignores everything between `{% comment %}` and `{% endcomment %}`.
```html
{% comment "Optional note" %}
    This block will not be rendered
{% endcomment %}
```

#### `if`, `elif`, `else`
Controls conditional logic.
```html
{% if athlete_list %}
    Number of athletes: {{ athlete_list|length }}
{% elif athlete_in_locker_room_list %}
    Athletes are in the locker room.
{% else %}
    No athletes.
{% endif %}
```

#### `for` loop
Iterates over a list.
```html
<ul>
{% for athlete in athlete_list %}
    <li>{{ athlete.name }}</li>
{% endfor %}
</ul>
```

#### `for` with `empty`
Displays a message if the list is empty.
```html
<ul>
{% for athlete in athlete_list %}
    <li>{{ athlete.name }}</li>
{% empty %}
    <li>No athletes found.</li>
{% endfor %}
</ul>
```

#### `cycle`
Cycles through a list of values with each loop iteration. Useful for alternating row styles.
```html
{% for item in items %}
    <tr class="{% cycle 'row1' 'row2' %}">{{ item }}</tr>
{% endfor %}
```

#### `firstof`
Displays the first argument that is not False.
```html
{% firstof var1 var2 "Default Value" %}
```

#### `lorem`
Generates random "lorem ipsum" text.
```html
{% lorem 3 p %}  {# 3 paragraphs #}
```

#### `now`
Displays the current date/time.
```html
It is currently {% now "D d M Y" %}
```

#### `url`
Returns an absolute path reference matching a given view name.
```html
<a href="{% url 'post-detail' post.id %}">View Post</a>
```

#### `csrf_token`
Essential for security in POST forms.
```html
<form method="post">
    {% csrf_token %}
    ...
</form>
```
