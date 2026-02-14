# Built-in Signals

Django provides many built-in signals categorized by their trigger source.

## 1. Model Signals (`django.db.models.signals`)
These are the most commonly used.

| Signal | Triggered When... | Key Arguments |
| :--- | :--- | :--- |
| **`pre_save`** | Before `model.save()` executes. | `sender`, `instance` |
| **`post_save`** | After `model.save()` commits. | `sender`, `instance`, `created` (bool) |
| **`pre_delete`** | Before `model.delete()` executes. | `sender`, `instance` |
| **`post_delete`** | After `model.delete()` commits. | `sender`, `instance` |
| **`m2m_changed`** | ManyToManyField is modified. | `sender`, `instance`, `action`, `pk_set` |
| **`pre_init`** | Before model `__init__()`. | `sender`, `args`, `kwargs` |
| **`post_init`** | After model `__init__()`. | `sender`, `instance` |

## 2. Request/Response Signals (`django.core.signals`)

| Signal | Triggered When... |
| :--- | :--- |
| **`request_started`** | Django starts processing an HTTP request. |
| **`request_finished`** | Django finishes delivering the HTTP response. |
| **`got_request_exception`** | An exception occurs while processing a request. |

## 3. Database & Migration Signals

-   **`connection_created`**: New DB connection opened.
-   **`post_migrate`**: Triggers after `migrate` command finishes. Useful for creating default permissions or groups.
