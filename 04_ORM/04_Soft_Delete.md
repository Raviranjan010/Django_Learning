# Implementing Soft Delete

**Soft Delete** (Logical Delete) means marking a record as "deleted" (e.g., `is_deleted=True`) instead of physically removing it from the database row. This allows for data recovery and auditing.

## Implementation Steps

### 1. Add `is_deleted` Field
Add a boolean field to your model.

```python
class Student(models.Model):
    name = models.CharField(max_length=100)
    is_deleted = models.BooleanField(default=False)
```

### 2. Create a Custom Manager
Create a manager that excludes deleted items by default.

```python
class StudentManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)
```

### 3. Attach Managers to Model

```python
class Student(models.Model):
    name = models.CharField(max_length=100)
    is_deleted = models.BooleanField(default=False)

    objects = StudentManager()      # Default: Hides deleted
    admin_objects = models.Manager() # Fallback: Shows all

    def delete(self):
        """Soft delete instead of real delete"""
        self.is_deleted = True
        self.save()
        
    def restore(self):
        self.is_deleted = False
        self.save()
```

## Usage

```python
# Soft Delete
s = Student.objects.get(id=1)
s.delete()  # Sets is_deleted=True

# Querying
Student.objects.all()       # Excludes deleted student
Student.admin_objects.all() # Includes deleted student

# Restoring
deleted_student = Student.admin_objects.get(id=1)
deleted_student.restore()
```

**Advantages:**
- Data safety.
- Easy restoration.

**Disadvantages:**
- Database grows indefinitely.
- Must remember to filter `is_deleted=False` if not using the custom manager.
