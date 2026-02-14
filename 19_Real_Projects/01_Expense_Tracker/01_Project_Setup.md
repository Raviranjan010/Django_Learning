# Expense Tracker - Project Setup

## 1. Project Overview
We will build an **Expense Tracker** application with the following features:
-   **User Authentication**: Register, Login, Logout.
-   **Expense Management**: Add, View, Delete expenses.
-   **Categorization**: Income vs Expense.
-   **Responsive Design**: Using a pre-built beautiful UI.

## 2. Environment Setup

### Install Python & Django
Ensure Python is installed.
```bash
pip install django
```

### Create Virtual Environment
Isolate dependencies to avoid conflicts.
```bash
python -m venv myenv
# Activate it:
# Windows:
cd myenv/Scripts/activate
# Mac/Linux:
source myenv/bin/activate
```

### Create Django Project
```bash
django-admin startproject expensetracker
cd expensetracker
```

### Initialize Git Repository
```bash
git init
```
Create a `.gitignore` file to exclude `__pycache__`, `*.pyc`, `db.sqlite3` (optional), and the `myenv/` folder.

## 3. Create the App
Create a separate app for the tracker logic.
```bash
python manage.py startapp tracker
```

**Register the App:**
In `expensetracker/settings.py`:
```python
INSTALLED_APPS = [
    # ...
    'tracker',
]
```

## 4. Git Workflow (Best Practice)
1.  **Stage Changes**: `git add .`
2.  **Commit**: `git commit -m "Initial setup"`
3.  **Create Repository**: On GitHub/GitLab.
4.  **Push**: `git remote add origin <url>`, then `git push -u origin master`.

### Branching
Always work on a feature branch.
```bash
git checkout -b feature/expenses
# Work on features...
git add .
git commit -m "Added features"
git push origin feature/expenses
```
