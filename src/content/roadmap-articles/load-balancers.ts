import { RoadmapArticle } from "./index"

export const loadBalancersArticle: RoadmapArticle = {
  slug: "load-balancers",
  title: "Understanding Load Balancers",
  author: "Ashish Pratap Singh",
  publishedDate: "2024-01-25",
  readTime: 9,
  difficulty: "Intermediate",
  category: "Infrastructure",
  tags: ["Load Balancer", "Scaling", "High Availability", "Infrastructure"],
  excerpt: "Deep dive into load balancers - how they distribute traffic, improve reliability, and enable horizontal scaling.",
  sourceUrl: "https://blog.algomaster.io/p/load-balancers",
  content: `
# Understanding Load Balancers

A **Load Balancer** distributes incoming network traffic across multiple servers to ensure no single server becomes overwhelmed.

---

## Why Load Balancing?

Without a load balancer:
\`\`\`
[Users] → [Single Server] → 😵 Overwhelmed!
\`\`\`

With a load balancer:
\`\`\`
            ┌→ [Server 1]
[Users] → [Load Balancer] → [Server 2]
            └→ [Server 3]
\`\`\`

### Key Benefits

1. **High Availability** - If one server fails, others handle the traffic
2. **Scalability** - Add servers as demand grows
3. **Performance** - Distribute load for faster response times
4. **Flexibility** - Perform maintenance without downtime

---

## Types of Load Balancers

### Layer 4 (Transport Layer)

Routes based on **IP address and TCP/UDP ports**. Fast but less flexible.

\`\`\`
Client IP: 192.168.1.1:5000 → Server A
Client IP: 192.168.1.2:5000 → Server B
\`\`\`

**Pros:**
- Very fast (no packet inspection)
- Lower latency
- Protocol agnostic

**Cons:**
- No content-based routing
- Limited intelligence

### Layer 7 (Application Layer)

Routes based on **HTTP headers, URLs, cookies**. More intelligent decisions.

\`\`\`
/api/users    → User Service Cluster
/api/products → Product Service Cluster
/api/orders   → Order Service Cluster
/static/*     → CDN
\`\`\`

**Pros:**
- Content-based routing
- SSL termination
- Caching capabilities
- Request manipulation

**Cons:**
- Slightly higher latency
- More complex

---

## Load Balancing Algorithms

### 1. Round Robin

Distributes requests sequentially:
\`\`\`
Request 1 → Server A
Request 2 → Server B
Request 3 → Server C
Request 4 → Server A (cycles back)
\`\`\`

### 2. Weighted Round Robin

Servers with higher weights get more traffic:
\`\`\`
Server A (weight: 3) → 3 requests
Server B (weight: 2) → 2 requests
Server C (weight: 1) → 1 request
\`\`\`

### 3. Least Connections

Routes to server with fewest active connections:
\`\`\`
Server A: 10 connections
Server B: 5 connections  ← New request goes here
Server C: 8 connections
\`\`\`

### 4. IP Hash

Same client IP always goes to same server:
\`\`\`python
server_index = hash(client_ip) % num_servers
\`\`\`

Useful for **session persistence**.

### 5. Least Response Time

Routes to fastest responding server:
\`\`\`
Server A: 50ms avg response
Server B: 30ms avg response ← New request goes here
Server C: 45ms avg response
\`\`\`

---

## Health Checks

Load balancers continuously check server health:

\`\`\`
[LB] → GET /health → [Server A] → 200 OK ✓
[LB] → GET /health → [Server B] → 503 Error ✗
[LB] → GET /health → [Server C] → 200 OK ✓
\`\`\`

Unhealthy servers are removed from the pool until they recover.

### Health Check Configuration

\`\`\`yaml
health_check:
  path: /health
  interval: 10s
  timeout: 5s
  unhealthy_threshold: 3
  healthy_threshold: 2
\`\`\`

---

## Session Persistence (Sticky Sessions)

Sometimes you need the same user to hit the same server:

\`\`\`
Methods:
1. Cookie-based: Set-Cookie: SERVERID=server-a
2. IP-based: Same IP → Same server
3. URL-based: /app;JSESSIONID=abc → Server A
\`\`\`

**When needed:**
- Session stored in server memory
- Stateful applications
- File uploads in progress

**Better alternative:** Store sessions externally (Redis)

---

## Popular Load Balancers

| Name | Type | Best For |
|------|------|----------|
| **Nginx** | Software | Web apps, reverse proxy |
| **HAProxy** | Software | High-performance, TCP/HTTP |
| **AWS ALB** | Cloud | AWS workloads, L7 |
| **AWS NLB** | Cloud | AWS workloads, L4 |
| **Cloudflare** | Edge | Global, DDoS protection |
| **F5 BIG-IP** | Hardware | Enterprise, complex routing |

---

## Load Balancer Patterns

### Active-Passive

\`\`\`
[Primary LB] ← Traffic
     ↓ (heartbeat)
[Backup LB]  ← Takes over if primary fails
\`\`\`

### Active-Active

\`\`\`
[DNS] → [LB 1] ← Half traffic
      → [LB 2] ← Half traffic
\`\`\`

---

## Key Takeaways

- Load balancers are essential for scalable applications
- Choose between L4 (faster) and L7 (smarter) based on needs
- Health checks ensure traffic goes to healthy servers
- Consider session persistence for stateful apps
- Use active-passive or active-active for LB high availability
- Most cloud providers offer managed load balancers
`
}
