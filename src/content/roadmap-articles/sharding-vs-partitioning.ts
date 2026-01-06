import { RoadmapArticle } from "./index"

export const shardingVsPartitioningArticle: RoadmapArticle = {
  slug: "sharding-vs-partitioning",
  title: "Sharding vs Partitioning",
  author: "Sujal Kalra",
  publishedDate: "2024-02-18",
  readTime: 9,
  difficulty: "Advanced",
  category: "Database",
  tags: ["Sharding", "Partitioning", "Database", "Scaling", "Distributed Systems"],
  excerpt: "Understand the difference between sharding and partitioning, and learn how to scale your database horizontally.",
  content: `
## Introduction

Both techniques divide data into smaller pieces, but they work at different levels.

---

## Partitioning

Dividing a table within a **single database**.

\`\`\`sql
-- Range partitioning by date
CREATE TABLE orders (
  id SERIAL,
  created_at TIMESTAMP,
  total DECIMAL
) PARTITION BY RANGE (created_at);

CREATE TABLE orders_2024_q1 PARTITION OF orders
  FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');
\`\`\`

---

## Sharding

Distributing data across **multiple database servers**.

\`\`\`
Shard Key: user_id
User 1-1000    → Shard 1
User 1001-2000 → Shard 2
User 2001-3000 → Shard 3
\`\`\`

---

## Key Differences

| Aspect | Partitioning | Sharding |
|--------|--------------|----------|
| Scope | Single database | Multiple databases |
| Purpose | Query performance | Horizontal scale |
| Complexity | Lower | Higher |
| Data locality | Same server | Different servers |

---

## Choosing a Shard Key

Good shard key:
- High cardinality
- Even distribution
- Query-aligned

\`\`\`
✅ user_id (many unique values, queries by user)
❌ country (few values, uneven distribution)
\`\`\`

---

## Key Takeaways

- Start with partitioning before sharding
- Sharding adds significant complexity
- Choose shard key carefully - hard to change later
- Consider managed solutions (CockroachDB, Vitess)
`
}
