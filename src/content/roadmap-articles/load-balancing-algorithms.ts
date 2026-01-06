import { RoadmapArticle } from "./index"

export const loadBalancingAlgorithmsArticle: RoadmapArticle = {
  slug: "load-balancing-algorithms",
  title: "Load Balancing Algorithms Explained",
  author: "Sujal Kalra",
  publishedDate: "2024-01-28",
  readTime: 12,
  difficulty: "Advanced",
  category: "Infrastructure",
  tags: ["Load Balancing", "Algorithms", "Round Robin", "Consistent Hashing"],
  excerpt: "Master different load balancing algorithms - from simple Round Robin to sophisticated Consistent Hashing. Includes code examples.",
  content: `
## Introduction

Choosing the right load balancing algorithm impacts your system's performance, reliability, and resource utilization.

---

## Common Algorithms

### 1. Round Robin
Requests are distributed sequentially across servers.

\`\`\`python
class RoundRobinBalancer:
    def __init__(self, servers):
        self.servers = servers
        self.current = 0
    
    def get_server(self):
        server = self.servers[self.current]
        self.current = (self.current + 1) % len(self.servers)
        return server
\`\`\`

**Best for**: Servers with equal capacity

---

### 2. Weighted Round Robin
Servers with higher capacity get more requests.

\`\`\`python
servers = [
    {"host": "server1", "weight": 5},
    {"host": "server2", "weight": 3},
    {"host": "server3", "weight": 2}
]
# server1 gets 50% of traffic
\`\`\`

---

### 3. Least Connections
Route to the server with fewest active connections.

**Best for**: Long-lived connections, varying request times

---

### 4. IP Hash
Route based on client IP for session persistence.

\`\`\`python
def get_server(client_ip, servers):
    hash_value = hash(client_ip)
    return servers[hash_value % len(servers)]
\`\`\`

---

### 5. Consistent Hashing
Minimizes redistribution when servers are added/removed.

**Best for**: Caching layers, distributed systems

---

## Algorithm Comparison

| Algorithm | Complexity | Use Case |
|-----------|------------|----------|
| Round Robin | O(1) | Homogeneous servers |
| Weighted RR | O(1) | Different capacities |
| Least Conn | O(n) | Variable request times |
| IP Hash | O(1) | Session persistence |
| Consistent Hash | O(log n) | Dynamic server pools |

---

## Key Takeaways

- Match algorithm to your workload characteristics
- Weighted algorithms handle heterogeneous servers
- Consistent hashing is essential for caching
- Monitor and adjust based on real metrics
`
}
