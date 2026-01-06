import { RoadmapArticle } from "./index"

export const databaseIndexesArticle: RoadmapArticle = {
  slug: "database-indexes",
  title: "Database Indexes Explained",
  author: "Sujal Kalra",
  publishedDate: "2024-02-16",
  readTime: 10,
  difficulty: "Intermediate",
  category: "Database",
  tags: ["Indexes", "Database", "Performance", "B-Tree", "Query Optimization"],
  excerpt: "Master database indexes - the key to fast queries. Learn how they work and when to use them.",
  content: `
## Introduction

A **database index** is a data structure that improves the speed of data retrieval operations. Think of it like an index in a book.

---

## How Indexes Work

Without index: Full table scan (O(n))
With index: Direct lookup (O(log n))

\`\`\`sql
-- Without index: scans all rows
SELECT * FROM users WHERE email = 'john@example.com';

-- With index: direct lookup
CREATE INDEX idx_users_email ON users(email);
\`\`\`

---

## Types of Indexes

### B-Tree Index (Default)
Balanced tree structure. Good for equality and range queries.

### Hash Index
O(1) lookups. Only for equality comparisons.

### Composite Index
\`\`\`sql
CREATE INDEX idx_name_date ON orders(customer_id, created_at);
-- Helps: WHERE customer_id = 1 AND created_at > '2024-01-01'
\`\`\`

### Partial Index
\`\`\`sql
CREATE INDEX idx_active ON users(email) WHERE active = true;
\`\`\`

---

## When to Add Indexes

✅ Columns in WHERE clauses
✅ Columns used in JOINs
✅ Columns used in ORDER BY
✅ High-cardinality columns

❌ Small tables
❌ Frequently updated columns
❌ Low-cardinality columns

---

## Key Takeaways

- Indexes speed up reads but slow down writes
- Every query should use an index
- Use EXPLAIN to analyze query plans
- Don't over-index
`
}
