# Pinterest Clone - Future Enhancements

To take this project to the next level (and make it a "Portfolio-Worthy" app), consider implementing these features:

## 1. Frontend Upgrades
-   **Infinite Scroll**: Use AJAX (or HTMX) to load more pins as the user scrolls, instead of simple pagination.
-   **JavaScript Framework**: Rebuild the frontend using React or Vue.js, consuming the Django data via an API.

## 2. Advanced Features
-   **Follow System**: Allow users to follow other users and see their pins in a "Following" feed.
-   **Private Boards**: Add a boolean field `is_private` to Boards so only the owner can see them.
-   **Trending Algorithm**: Sort the home feed not just by `created_at`, but by number of `likes` in the last 24 hours.

## 3. Deployment & Tech
-   **Docker**: Containerize the application for easier deployment.
-   **Celery**: Process image resizing and emails asynchronously (background tasks).
-   **AI Auto-Tagging**: Integrate a machine learning model to automatically detect what's in an uploaded image (e.g., "Cat", "Sunset") and add tags.
