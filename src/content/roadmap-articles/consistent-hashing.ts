import { RoadmapArticle } from "./index"

export const consistentHashingArticle: RoadmapArticle = {
  slug: "consistent-hashing",
  title: "Consistent Hashing Explained",
  author: "Sujal Kalra",
  publishedDate: "2024-02-20",
  readTime: 11,
  difficulty: "Advanced",
  category: "Database",
  tags: ["Consistent Hashing", "Distributed Systems", "Load Balancing", "Caching"],
  excerpt: "Master consistent hashing - the algorithm that powers distributed caches and databases. Essential for system design interviews.",
  content: `
## Introduction

**Consistent hashing** is a technique that minimizes key remapping when nodes are added or removed from a distributed system.

---

## The Problem with Simple Hashing

\`\`\`python
# Simple modulo hashing
server = hash(key) % num_servers

# If num_servers changes from 3 to 4:
# Almost ALL keys get remapped!
\`\`\`

---

## How Consistent Hashing Works

1. Arrange servers on a virtual ring (0 to 2^32)
2. Hash keys to positions on the ring
3. Key is assigned to the next server clockwise

\`\`\`
        Server A
           |
    Key1 --|
           |
Key2 ------+------ Server B
           |
    Key3 --|
           |
        Server C
\`\`\`

---

## Adding/Removing Servers

When a server is added, only keys between it and the previous server are remapped.

\`\`\`
Before: 3 servers → 3/3 = 100% keys affected by removal
With CH: 3 servers → 1/3 = 33% keys affected by removal
\`\`\`

---

## Virtual Nodes

Problem: Uneven distribution with few servers
Solution: Each server gets multiple virtual nodes

\`\`\`python
for i in range(100):  # 100 virtual nodes per server
    position = hash(f"{server_id}:{i}")
    ring.add(position, server_id)
\`\`\`

---

## Real-World Usage

- **Amazon DynamoDB**: Data partitioning
- **Apache Cassandra**: Token ring
- **Memcached**: Cache distribution
- **Discord**: Server selection

---

## Key Takeaways

- Minimizes remapping when topology changes
- Virtual nodes improve balance
- Essential for distributed caches and databases
- O(log n) lookup with sorted ring
`
}
