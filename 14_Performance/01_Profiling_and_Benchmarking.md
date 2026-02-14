# Profiling and Benchmarking

## Profiling
Analyzes execution time and resource usage to find bottlenecks.

### 1. Time Profiling
Measure how long code takes to run.

```python
import time
def my_view(request):
    start = time.time()
    # ... expensive logic ...
    print(f"Time taken: {time.time() - start}s")
    return HttpResponse("OK")
```

### 2. Query Profiling
Check how many SQL queries are executed.

```python
from django.db import connection
print(len(connection.queries))
```

### 3. Tools
-   **cProfile**: Built-in Python profiler.
-   **django-silk**: Records SQL queries and execution time for requests.

## Benchmarking
Comparing performance between different implementations.

### 1. Microbenchmarking (`timeit`)
For small snippets, `timeit` is more accurate than `time.time()`.

```python
import timeit
print(timeit.timeit('"-".join(str(n) for n in range(100))', number=10000))
```

### 2. Methodology
-   **Define Scenarios**: What are you testing? (e.g., "Login page under load").
-   **Run Benchmarks**: Ensure consistent environment.
-   **Compare Results**: Data-driven decision making.

### 3. Tools
-   **pytest-benchmark**: For unit test benchmarking.
-   **Locust / Apache JMeter**: For Load Testing.
