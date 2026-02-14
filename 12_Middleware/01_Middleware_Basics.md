# Middleware in Django

Middleware acts as a lightweight "plugin" system that processes requests and responses globally. It sits between the web server and the view.

## How it Works

1.  **Request Phase**: Request passes through middleware (top-to-bottom of `MIDDLEWARE` list).
2.  **View Processing**: Django determines which view to call.
3.  **Response Phase**: Response passes back through middleware (bottom-to-top).

## Middleware Hooks

-   **`process_request(request)`**: key hook. Runs before the view. Return `None` to continue, or `HttpResponse` to stop processing.
-   **`process_view(request, view_func, args, kwargs)`**: Runs just before the view is called.
-   **`process_exception(request, exception)`**: Runs if the view raises an exception.
-   **`process_response(request, response)`**: Runs after the view returns.

## Built-in Middleware

| Middleware | Purpose |
| :--- | :--- |
| `SecurityMiddleware` | Adds security headers (HSTS, X-Content-Type-Options). |
| `SessionMiddleware` | Enables session support (`request.session`). |
| `CommonMiddleware` | URL rewriting (Append slash), User-Agent checks. |
| `CsrfViewMiddleware` | CSRF protection. |
| `AuthenticationMiddleware` | Associates users with requests (`request.user`). |
| `MessageMiddleware` | Flash messages support. |
| `XFrameOptionsMiddleware` | Clickjacking protection. |

**Order Matters!**
For example, `AuthenticationMiddleware` must come *after* `SessionMiddleware` because it uses sessions to store the user.
