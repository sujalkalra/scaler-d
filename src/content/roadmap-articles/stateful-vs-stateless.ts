import { RoadmapArticle } from "./index"

export const statefulVsStatelessArticle: RoadmapArticle = {
  slug: "stateful-vs-stateless",
  title: "Stateful vs Stateless Architecture",
  author: "Sujal Kalra",
  publishedDate: "2024-03-13",
  readTime: 8,
  difficulty: "Intermediate",
  category: "Architecture",
  tags: ["Stateful", "Stateless", "Architecture", "Scaling", "Sessions"],
  excerpt: "Understand the trade-offs between stateful and stateless architectures and their impact on scalability.",
  content: `
## Introduction

The choice between stateful and stateless design fundamentally affects how your system scales and handles failures.

---

## Stateless Architecture

Server doesn't store client session data between requests.

\`\`\`
Request 1 → Server A → Response
Request 2 → Server B → Response  // Any server can handle
Request 3 → Server C → Response
\`\`\`

### Benefits
- Easy horizontal scaling
- Simple load balancing
- Better fault tolerance
- Easier testing

---

## Stateful Architecture

Server maintains client state between requests.

\`\`\`
Request 1 → Server A (creates session)
Request 2 → Server A (must go to same server!)
Request 3 → Server A
\`\`\`

### Benefits
- Simpler client implementation
- Lower latency for repeated operations
- Real-time features easier

---

## Making Stateful Apps Scalable

### Option 1: Sticky Sessions
Load balancer routes same client to same server.

### Option 2: Externalize State
\`\`\`
All Servers → Shared Redis/Database
\`\`\`

### Option 3: Client-Side State
Store state in JWT tokens or client storage.

---

## Comparison

| Aspect | Stateless | Stateful |
|--------|-----------|----------|
| Scaling | Easy | Complex |
| Fault tolerance | High | Lower |
| Latency | Higher | Lower |
| Complexity | Lower | Higher |

---

## Key Takeaways

- Prefer stateless for web services
- Externalize state to Redis/database if needed
- Stateful is okay for specific use cases (WebSockets, gaming)
- JWT tokens enable stateless authentication
`
}
