# Introduction to Django

## What is Django?

Django is a high-level Python web framework that encourages rapid development and clean, pragmatic design. Built by experienced developers, it takes care of much of the hassle of web development, so you can focus on writing your app without needing to reinvent the wheel. It’s free and open source.

### Key Features:
- **Ridiculously fast**: Django was designed to help developers take applications from concept to completion as quickly as possible.
- **Reassuringly secure**: Django takes security seriously and helps developers avoid many common security mistakes.
- **Exceedingly scalable**: Some of the busiest sites on the Web use Django’s ability to quickly and flexibly scale.

---

## 🏗️ MVT Architecture (Model-View-Template)

Django follows the **MVT (Model-View-Template)** architectural pattern, which is a variation of the well-known MVC (Model-View-Controller) pattern.

Understanding MVT is crucial because it dictates how Django handles requests.

### 1. Model (The Data Layer)
The **Model** manages the data and business logic. It interacts with the database.
- Represents your database tables as Python classes.
- Handles data validation and relationships.
- You generally modify `models.py`.

### 2. View (The Logic Layer)
The **View** receives web requests and returns web responses.
- It acts as the bridge between Models and Templates.
- It fetches data from the Model, processes it, and passes it to the Template.
- In MVC terms, the Django "View" is actually the "Controller".
- You modify `views.py`.

### 3. Template (The Presentation Layer)
The **Template** handles the User Interface (UI).
- It is an HTML file mixed with Django Template Language (DTL).
- It determines *how* the data is displayed.
- You modify `.html` files in a `templates` directory.

### 🔄 The MVT Flow Diagram

```ascii
User Request (Browser)
       ⬇
    URL Dispatcher (urls.py)
       ⬇
      View (views.py) ⬅➡ Model (models.py) ⬅➡ Database
       ⬇
    Template (html)
       ⬇
Response (HTML to Browser)
```

---

## Django MVT vs. Traditional MVC

It can be confusing for developers coming from other frameworks like Rails or Spring. Here is the mapping:

| Concept | MVC Term | Django Term | Responsibility |
| :--- | :--- | :--- | :--- |
| **Data** | **M**odel | **M**odel | Describes database schema and data structure. |
| **Presentation** | **V**iew | **T**emplate | Describes how the data looks (HTML/CSS). |
| **Control Logic** | **C**ontroller | **V**iew | Handles the user input and interaction logic. |

> **Analogy:**
> - **Model**: The Chef (knows the recipes/data).
> - **View**: The Waiter (takes the order, tells the chef, brings the food).
> - **Template**: The Menu/Plate presentation (how it looks to the customer).

---

## Why Choose Django?

1.  **Batteries Included**: Django comes with authentication, admin interface, sitemaps, RSS feeds, and more out of the box. You don't need to hunt for third-party libraries for basic functionality.
2.  **Versatile**: Used for everything from content management systems (CMS) to social networks to scientific computing platforms.
3.  **Secure**: It provides protection against:
    - SQL Injection
    - Cross-Site Scripting (XSS)
    - Cross-Site Request Forgery (CSRF)
    - Clickjacking
    - Host Header Validation

## Why use Django over other frameworks?

1.  **Versatile**: Django is not limited to a specific type of web application. Whether you're building content management systems (CMS), e-commerce platforms, social networking sites, or APIs, Django provides the tools and flexibility to tackle diverse projects.
2.  **Availability of Documentation**: Django boasts a large and active community. This means ample resources, tutorials, and third-party packages are available. The cost-effective nature and collaborative environment make it a top choice.
3.  **Testing Support**: Django promotes reliable code through its built-in testing framework. Developers can easily write unit tests, ensuring that any changes to the code won't lead to unexpected issues.
4.  **Free and Open Source**: Django is an open-source framework, meaning it is free to use and modify.

## Sites using Django
Many high-traffic websites and applications have been built using Django, including:
- **Instagram**
- **Pinterest**
- **Mozilla**
- **Disqus**
- **National Geographic**

## History

Django was created in the fall of 2003 at the Lawrence Journal-World newspaper. It was released publicly under a BSD license in July 2005. It is named after the jazz guitarist Django Reinhardt.
