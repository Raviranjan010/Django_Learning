# Introduction to Signals

In Django, **Signals** allow different parts of an application to communicate with each other without being tightly coupled. They follow the **Publisher-Subscriber** (Observer) pattern.

## Why use Signals?
-   **Decoupling**: A model doesn't need to know about the email system to trigger a "Welcome Email".
-   **Asynchronous-like events**: Respond to events (like a user saving) regardless of where that save happened (Admin, View, Shell).

## Core Components

1.  **Senders**: The object/component that triggers the event (e.g., `User` model).
2.  **Signals**: The actual event object (e.g., `post_save`).
3.  **Receivers**: The function that "listens" for the signal and executes logic.

## How it Works
1.  **Sender** performs an action (e.g., `user.save()`).
2.  **Signal** (`post_save`) is sent known to the dispatcher.
3.  **Dispatcher** finds all connected **Receivers**.
4.  **Receivers** execute their logic (e.g., `create_profile`).

This process happens **synchronously** by default (blocking the request until all receivers finish).
