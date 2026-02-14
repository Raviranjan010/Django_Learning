# Load Balancing

Load balancing distributes traffic across multiple servers to ensure reliability and speed.

## Why Load Balance?
-   **Scalability**: Handle more users by adding more servers.
-   **Redundancy**: If one server crashes, the others take over (No single point of failure).

## Algorithms
1.  **Round Robin**: Distribute requests sequentially (Server A -> Server B -> Server C -> Server A...).
2.  **Least Connections**: Send request to the server with the fewest active users.
3.  **Weighted Round Robin**: Give more requests to powerful servers.

## Nginx Load Balancing Config
You can configure Nginx to act as a load balancer in front of multiple Gunicorn instances (possibly on different machines).

```nginx
http {
    upstream django_cluster {
        server 10.0.0.1:8000;
        server 10.0.0.2:8000;
        server 10.0.0.3:8000;
    }

    server {
        listen 80;
        server_name example.com;

        location / {
            proxy_pass http://django_cluster;
            proxy_set_header Host $host;
        }
    }
}
```

## Scaling Types
-   **Vertical Scaling**: Upgrading the server (More RAM/CPU).
-   **Horizontal Scaling**: Adding more servers (Load Balancing). Horizontal is generally better for long-term growth.

## Example: AWS Elastic Load Balancer (ELB)
If using AWS, you can create a balancer via CLI:

```bash
aws elb create-load-balancer \
    --load-balancer-name my-load-balancer \
    --listeners "Protocol=HTTP,LoadBalancerPort=80,InstanceProtocol=HTTP,InstancePort=8000" \
    --availability-zones us-east-1a us-east-1b
```
