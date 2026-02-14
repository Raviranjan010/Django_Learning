# Admin Security Considerations

Securing the admin panel is critical as it provides full access to your data.

## 1. Restricting Access

### Change the URL
Don't use the default `/admin/`.
```python
# urls.py
path('secret-admin-panel/', admin.site.urls),
```

### Require Authentication
The admin is authenticated by default, but you can add extra layers (like 2FA) or IP restrictions via middleware.

## 2. Production Settings

**Disable Debug Mode**
In `settings.py`:
```python
DEBUG = False
```
This prevents sensitive information (like stack traces and environment variables) from being exposed if an error occurs.

## 3. General Security Practices

-   **Updates**: Keep Django updated (`pip install --upgrade django`).
-   **Strong Passwords**: Enforce strong password policies.
-   **HTTPS**: Always use HTTPS in production.
    ```python
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    ```
-   **Role-Based Access Control (RBAC)**: Don't give everyone Superuser status. Create specific Groups with limited permissions (e.g., "Editors" can only add Posts, not delete them) and assign users to these groups.

## 4. Preventing Attacks

-   **XSS (Cross-Site Scripting)**: Django templates auto-escape variables. Use `|escapejs` when outputting data into `<script>` tags.
-   **CSRF (Cross-Site Request Forgery)**: Always use `{% csrf_token %}` in forms.
