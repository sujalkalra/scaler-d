import { RoadmapArticle } from "./index"

export const acidTransactionsArticle: RoadmapArticle = {
  slug: "acid-transactions",
  title: "ACID Transactions in Databases",
  author: "Sujal Kalra",
  publishedDate: "2024-02-14",
  readTime: 8,
  difficulty: "Intermediate",
  category: "Database",
  tags: ["ACID", "Transactions", "Database", "Consistency", "Isolation"],
  excerpt: "Deep dive into ACID properties - the guarantees that make database transactions reliable and predictable.",
  content: `
## Introduction

**ACID** is a set of properties that guarantee database transactions are processed reliably.

---

## The Four Properties

### Atomicity
All or nothing. Either all operations succeed, or none do.

\`\`\`sql
BEGIN TRANSACTION;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT; -- Both happen or neither
\`\`\`

### Consistency
Database moves from one valid state to another.

### Isolation
Concurrent transactions don't interfere with each other.

### Durability
Committed transactions survive system failures.

---

## Isolation Levels

| Level | Dirty Reads | Non-repeatable | Phantom |
|-------|-------------|----------------|---------|
| Read Uncommitted | ✓ | ✓ | ✓ |
| Read Committed | ✗ | ✓ | ✓ |
| Repeatable Read | ✗ | ✗ | ✓ |
| Serializable | ✗ | ✗ | ✗ |

---

## Key Takeaways

- ACID ensures data integrity
- Higher isolation = lower concurrency
- Choose isolation level based on requirements
- NoSQL databases often sacrifice ACID for performance
`
}
