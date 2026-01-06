import { RoadmapArticle } from "./index"

export const sqlVsNosqlArticle: RoadmapArticle = {
  slug: "sql-vs-nosql",
  title: "SQL vs NoSQL: 7 Key Differences",
  author: "Sujal Kalra",
  publishedDate: "2024-02-12",
  readTime: 9,
  difficulty: "Intermediate",
  category: "Database",
  tags: ["SQL", "NoSQL", "Database", "Comparison", "Architecture"],
  excerpt: "Understand the fundamental differences between SQL and NoSQL databases to make informed architectural decisions.",
  content: `
## Introduction

SQL and NoSQL represent fundamentally different approaches to data storage and retrieval.

---

## The 7 Key Differences

### 1. Data Model
**SQL**: Tables with fixed schema
**NoSQL**: Documents, key-value, graph, or wide-column

### 2. Schema
**SQL**: Schema-on-write (define before inserting)
**NoSQL**: Schema-on-read (flexible structure)

### 3. Scaling
**SQL**: Primarily vertical (scale up)
**NoSQL**: Primarily horizontal (scale out)

### 4. ACID Compliance
**SQL**: Full ACID support
**NoSQL**: Often eventual consistency (BASE)

### 5. Joins
**SQL**: Native JOIN support
**NoSQL**: Usually done at application level

### 6. Query Language
\`\`\`sql
-- SQL
SELECT * FROM users WHERE age > 21;
\`\`\`

\`\`\`javascript
// MongoDB
db.users.find({ age: { $gt: 21 } });
\`\`\`

### 7. Use Cases
**SQL**: Banking, ERP, complex queries
**NoSQL**: Real-time apps, big data, flexible schemas

---

## Decision Framework

| Factor | Choose SQL | Choose NoSQL |
|--------|------------|--------------|
| Data structure | Fixed, relational | Variable, nested |
| Scaling needs | Moderate | Massive |
| Consistency | Critical | Flexible |
| Query complexity | High | Low |

---

## Key Takeaways

- Neither is universally better
- SQL excels at complex queries and consistency
- NoSQL excels at scale and flexibility
- Many modern apps use both (polyglot persistence)
`
}
