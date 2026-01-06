import { RoadmapArticle } from "./index"

export const scalabilityArticle: RoadmapArticle = {
  slug: "scalability",
  title: "Scalability in System Design",
  author: "Sujal Kalra",
  publishedDate: "2024-02-01",
  readTime: 10,
  difficulty: "Intermediate",
  category: "Architecture",
  tags: ["Scalability", "Horizontal Scaling", "Vertical Scaling", "Performance"],
  excerpt: "Master the fundamentals of scalability - the ability to handle growing amounts of work. Learn horizontal vs vertical scaling.",
  content: `
## Introduction

**Scalability** is a system's ability to handle increased load by adding resources. It's one of the most important non-functional requirements.

---

## Vertical Scaling (Scale Up)

Add more power to existing machines.

\`\`\`
Before: 4 CPU cores, 16GB RAM
After:  16 CPU cores, 64GB RAM
\`\`\`

### Pros
- Simpler to implement
- No code changes needed
- No distributed system complexity

### Cons
- Hardware limits
- Single point of failure
- Expensive at high end

---

## Horizontal Scaling (Scale Out)

Add more machines to the pool.

\`\`\`
Before: 1 server
After:  10 servers behind load balancer
\`\`\`

### Pros
- No hardware limits
- Better fault tolerance
- Cost-effective at scale

### Cons
- Distributed system complexity
- Data consistency challenges
- Requires stateless design

---

## Scaling Different Components

| Component | Scaling Strategy |
|-----------|-----------------|
| Web servers | Horizontal (load balancer) |
| Databases | Vertical + Read replicas |
| Caching | Horizontal (distributed cache) |
| File storage | Object storage (S3) |

---

## Key Takeaways

- Start simple with vertical scaling
- Design for horizontal scaling from day one
- Stateless services are easier to scale
- Database is often the bottleneck
- Use caching to reduce database load
`
}
