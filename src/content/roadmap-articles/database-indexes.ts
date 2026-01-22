import { RoadmapArticle } from "./index"

export const databaseIndexesArticle: RoadmapArticle = {
  slug: "database-indexes",
  title: "Database Indexes Explained",
  author: "Ashish Pratap Singh",
  publishedDate: "2024-02-16",
  readTime: 10,
  difficulty: "Intermediate",
  category: "Database",
  tags: ["Indexes", "Database", "Performance", "B-Tree", "Query Optimization"],
  excerpt: "Master database indexes - the key to fast queries. Learn how they work and when to use them.",
  sourceUrl: "https://blog.algomaster.io/p/database-indexes",
  content: `
# Database Indexes Explained

A **database index** is a data structure that improves the speed of data retrieval operations. Think of it like an index in a book—instead of reading every page, you look up the topic and go directly to the right page.

---

## Why Indexes Matter

### Without Index (Full Table Scan)

\`\`\`sql
SELECT * FROM users WHERE email = 'john@example.com';
-- Scans ALL rows: O(n)
-- 1 million rows = 1 million comparisons
\`\`\`

### With Index (Direct Lookup)

\`\`\`sql
CREATE INDEX idx_users_email ON users(email);

SELECT * FROM users WHERE email = 'john@example.com';
-- Uses index: O(log n)
-- 1 million rows = ~20 comparisons
\`\`\`

**Performance difference: 50,000x faster!**

---

## How Indexes Work

### B-Tree Index (Most Common)

B-Tree (Balanced Tree) is the default index type in most databases.

\`\`\`
                    [M]
                   /   \\
              [D,H]     [R,W]
             /  |  \\   /  |  \\
          [A-C][E-G][I-L][N-Q][S-V][X-Z]
                          ↓
                    Points to actual rows
\`\`\`

**Properties:**
- Self-balancing
- Sorted order
- O(log n) search, insert, delete
- Good for range queries

### How a Lookup Works

\`\`\`sql
SELECT * FROM users WHERE email = 'john@example.com';
\`\`\`

\`\`\`
1. Start at root node
2. 'john' > 'M'? No → go left
3. 'john' > 'H'? Yes → go right  
4. 'john' > 'I'? Yes, < 'L'? Yes → found leaf!
5. Leaf contains pointer to actual row
6. Fetch row from disk
\`\`\`

---

## Types of Indexes

### 1. Primary Index

Automatically created on primary key:

\`\`\`sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,  -- Index created automatically
  email VARCHAR(255)
);
\`\`\`

### 2. Secondary Index

Created on non-primary columns:

\`\`\`sql
CREATE INDEX idx_email ON users(email);
\`\`\`

### 3. Composite Index

Index on multiple columns:

\`\`\`sql
CREATE INDEX idx_name_date ON orders(customer_id, created_at);

-- Helps these queries:
SELECT * FROM orders WHERE customer_id = 123;
SELECT * FROM orders WHERE customer_id = 123 AND created_at > '2024-01-01';

-- Does NOT help:
SELECT * FROM orders WHERE created_at > '2024-01-01';  -- customer_id not specified
\`\`\`

**Column order matters!** (Leftmost prefix rule)

### 4. Unique Index

Enforces uniqueness:

\`\`\`sql
CREATE UNIQUE INDEX idx_email ON users(email);
-- Duplicate emails will be rejected
\`\`\`

### 5. Partial Index

Index only some rows:

\`\`\`sql
CREATE INDEX idx_active_users ON users(email) WHERE active = true;
-- Smaller index, faster for common queries
\`\`\`

### 6. Hash Index

O(1) lookups, but no range queries:

\`\`\`sql
CREATE INDEX idx_hash ON users USING HASH (email);
-- Only for equality: WHERE email = 'x'
-- Not for: WHERE email LIKE 'x%'
\`\`\`

---

## When to Add Indexes

### ✅ Good Candidates

- Columns in **WHERE** clauses
- Columns used in **JOIN** conditions
- Columns used in **ORDER BY**
- Columns used in **GROUP BY**
- High cardinality columns (many unique values)

### ❌ Avoid Indexing

- Small tables (full scan is faster)
- Frequently updated columns
- Low cardinality columns (e.g., boolean)
- Columns rarely used in queries

---

## Index Costs

Indexes aren't free:

| Benefit | Cost |
|---------|------|
| Fast reads | Slower writes (must update index) |
| | Storage space |
| | Memory usage |
| | Index maintenance |

\`\`\`
Write-heavy workload → Fewer indexes
Read-heavy workload → More indexes
\`\`\`

---

## Analyzing Query Performance

### EXPLAIN Command

\`\`\`sql
EXPLAIN SELECT * FROM users WHERE email = 'john@example.com';

-- Output:
-- Seq Scan on users  (cost=0.00..35.50 rows=1 width=100)
--   Filter: (email = 'john@example.com')
-- ^ Bad! Full table scan

-- After adding index:
-- Index Scan using idx_email on users  (cost=0.29..8.31 rows=1 width=100)
-- ^ Good! Using index
\`\`\`

### Key Metrics

\`\`\`
cost: Estimated execution cost
rows: Estimated rows returned
Seq Scan: Full table scan (bad for large tables)
Index Scan: Using index (good)
Index Only Scan: All data from index (best)
\`\`\`

---

## Common Index Patterns

### 1. Covering Index

Include all needed columns in index:

\`\`\`sql
CREATE INDEX idx_covering ON orders(customer_id, status, total);

SELECT status, total FROM orders WHERE customer_id = 123;
-- Index Only Scan (no table access needed)
\`\`\`

### 2. Index for Sorting

\`\`\`sql
CREATE INDEX idx_created ON posts(created_at DESC);

SELECT * FROM posts ORDER BY created_at DESC LIMIT 10;
-- Uses index for sorting, no filesort
\`\`\`

### 3. Index for Join

\`\`\`sql
CREATE INDEX idx_order_user ON orders(user_id);

SELECT * FROM users u JOIN orders o ON u.id = o.user_id;
-- Fast join using index
\`\`\`

---

## Index Anti-Patterns

### 1. Over-Indexing

\`\`\`sql
-- Don't create an index for every column!
CREATE INDEX idx_a ON users(a);
CREATE INDEX idx_b ON users(b);
CREATE INDEX idx_c ON users(c);
CREATE INDEX idx_d ON users(d);
-- Slows down writes significantly
\`\`\`

### 2. Indexing Low-Cardinality Columns

\`\`\`sql
-- Bad: Only 2 unique values
CREATE INDEX idx_active ON users(active);  -- true/false

-- Better: Partial index if you query one value often
CREATE INDEX idx_active ON users(id) WHERE active = true;
\`\`\`

### 3. Function Calls Prevent Index Use

\`\`\`sql
-- Index NOT used:
SELECT * FROM users WHERE LOWER(email) = 'john@example.com';

-- Fix: Create expression index
CREATE INDEX idx_email_lower ON users(LOWER(email));
\`\`\`

---

## Key Takeaways

- Indexes speed up reads but slow down writes
- B-Tree is the default and handles most cases
- Always check EXPLAIN before and after adding indexes
- Column order matters in composite indexes
- Don't over-index—each index has a cost
- Monitor index usage and remove unused indexes
`
}
