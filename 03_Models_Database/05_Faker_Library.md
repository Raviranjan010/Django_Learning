# Using Faker in Django

The **Faker** library is excellent for populating your database with dummy data for testing or development.

## Installation

```bash
pip install faker
```

## Basic Usage

```python
from faker import Faker
fake = Faker()

print(fake.name())      # "Ryan Gallagher"
print(fake.email())     # "ryan@example.com"
print(fake.address())   # "7631 Johnson Village..."
print(fake.text())      # "Lorem ipsum..."
```

## Generating Seed Data for Django

You can create a script to bulk populate your models.

```python
import random
from faker import Faker
from myapp.models import Student

fake = Faker()

def seed_db(num_records=10):
    pk_list = []
    
    for _ in range(num_records):
        name = fake.name()
        email = fake.email()
        age = random.randint(18, 30)
        
        student = Student(name=name, email=email, age=age)
        student.save()
        pk_list.append(student.id)
    
    print(f"Successfully created {num_records} students.")

# Run the function
if __name__ == '__main__':
    seed_db(50)
```

## Seeding
You can ensure the same "random" data is generated every time by seeding the generator.
```python
Faker.seed(4321)
# Now calls to fake.name() will produce the same sequence
```
