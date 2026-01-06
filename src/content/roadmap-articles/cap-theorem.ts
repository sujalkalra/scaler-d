import { RoadmapArticle } from "./index"

export const capTheoremArticle: RoadmapArticle = {
  slug: "cap-theorem",
  title: "CAP Theorem Explained",
  author: "Sujal Kalra",
  publishedDate: "2024-02-08",
  readTime: 11,
  difficulty: "Advanced",
  category: "Theory",
  tags: ["CAP Theorem", "Distributed Systems", "Consistency", "Availability", "Partition Tolerance"],
  excerpt: "Master the CAP theorem - the fundamental trade-off in distributed systems. Understand why you can only pick two out of three.",
  content: `
## Introduction

The **CAP Theorem** states that a distributed system can only provide two of three guarantees simultaneously: **Consistency**, **Availability**, and **Partition Tolerance**.

---

## The Three Properties

### Consistency (C)
Every read receives the most recent write or an error.

### Availability (A)
Every request receives a response (not error).

### Partition Tolerance (P)
The system continues to operate despite network failures between nodes.

---

## The Trade-offs

Since network partitions are inevitable, you must choose between C and A during partitions:

\`\`\`
During Network Partition:
┌─────────────────────────────────────┐
│  CP: Block writes until partition   │
│      heals (consistent but not      │
│      available)                     │
├─────────────────────────────────────┤
│  AP: Accept writes on both sides    │
│      (available but potentially     │
│      inconsistent)                  │
└─────────────────────────────────────┘
\`\`\`

---

## Real-World Examples

| System | Choice | Trade-off |
|--------|--------|-----------|
| Traditional RDBMS | CP | Blocks on partition |
| Cassandra | AP | Eventual consistency |
| MongoDB | CP | Primary election blocks writes |
| DynamoDB | AP (configurable) | Conflict resolution needed |

---

## Key Takeaways

- Partition tolerance is non-negotiable in distributed systems
- You're really choosing between C and A during failures
- Most systems are "tunable" along the CP-AP spectrum
- Consider PACELC: also consider Latency vs Consistency when no partition
- Choose based on your business requirements
`
}
