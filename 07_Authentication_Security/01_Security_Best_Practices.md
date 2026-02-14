# Django Security Best Practices

Django is secure by default, but you can make it insecure if you're not careful.

## 1. Secret Key

- **NEVER** commit your `SECRET_KEY` to version control.
- Use environment variables (`os.environ.get('SECRET_KEY')`).
- If your key is compromised, attackers can sign cookies and reset passwords.

## 2. Debug Mode

- **NEVER** run with `DEBUG = True` in production.
- If `True`, Django displays detailed error pages with sensitive information (environment variables, settings, source code snippets).

## 3. Allowed Hosts

- Always set `ALLOWED_HOSTS` to your domain names.
- Prevents Host Header attacks (cache poisoning, poisoning links in emails).

```python
ALLOWED_HOSTS = ['www.example.com', '.example.com']
```

## 4. Cross-Site Scripting (XSS)

Django templates escape specific characters by default, which protects against XSS.

- **Risk**: Using `|safe` filter or `{% autoescape off %}`.
- **Mitigation**: Only use `safe` on trusted content. sanitize user input using `bleach`.

## 5. Cross-Site Request Forgery (CSRF)

Django has built-in CSRF protection.

- **Risk**: Disabling `CsrfViewMiddleware` or using `@csrf_exempt` without a good reason.
- **Mitigation**: Always use `{% csrf_token %}` in POST forms.

## 6. SQL Injection

Django's ORM is protected against SQL injection because it separates the query structure from the data parameters.

- **Risk**: Using raw SQL queries with string formatting.
- **Mitigation**: Always use parameterized queries.
  ```python
  # BAD
  cursor.execute("SELECT * FROM users WHERE username = '%s'" % username)
  
  # GOOD
  cursor.execute("SELECT * FROM users WHERE username = %s", [username])
  ```

## 7. Clickjacking

Clickjacking protection is enabled by default via `XFrameOptionsMiddleware`.

- **Settings**: `X_FRAME_OPTIONS = 'DENY'` or `'SAMEORIGIN'`.

## 8. HTTPS / SSL

In production, HTTPS is mandatory.

```python
# settings.py for Production

# Redirect all HTTP to HTTPS
SECURE_SSL_REDIRECT = True 

# Use 'Secure' flag on cookies (only sent over HTTPS)
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# HTTP Strict Transport Security (HSTS)
# Tells browsers to ONLY connect via HTTPS for the next year
SECURE_HSTS_SECONDS = 31536000 
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
```

## 9. Content Security Policy (CSP)

A CSP header helps prevent XSS by specifying which dynamic resources are allowed to load.

- Use `django-csp` library.
```python
CSP_DEFAULT_SRC = ("'self'", "https://fonts.googleapis.com")
CSP_STYLE_SRC = ("'self'", "'unsafe-inline'")
```

## 10. User Uploaded Files

- **Never** serve user-uploaded files from the same domain as your app (cookies are shared).
- Verify file types (don't trust extensions).
- Rename uploaded files to random strings to prevent overwriting or executing malicious filenames.
