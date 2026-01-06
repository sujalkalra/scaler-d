import { RoadmapArticle } from "./index"

export const databaseTypesArticle: RoadmapArticle = {
  slug: "database-types",
  title: "Types of Databases",
  author: "Sujal Kalra",
  publishedDate: "2024-02-10",
  readTime: 10,
  difficulty: "Beginner",
  category: "Database",
  tags: ["Database", "SQL", "NoSQL", "Graph", "Time-series"],
  excerpt: "A comprehensive guide to different database types - from relational to graph databases. Learn when to use each type.",
  content: `
## Introduction

Choosing the right database is crucial for your application's success. Let's explore the major types and their use cases.

---

## Relational Databases (SQL)

Structured data with relationships. Uses tables, rows, columns.

\`\`\`sql
SELECT users.name, orders.total
FROM users
JOIN orders ON users.id = orders.user_id
WHERE orders.status = 'completed';
\`\`\`

**Examples**: PostgreSQL, MySQL, Oracle
**Use for**: Financial data, e-commerce, any structured data with relationships

---

## Document Databases

Store data as JSON-like documents.

\`\`\`json
{
  "_id": "user123",
  "name": "John",
  "orders": [
    { "id": 1, "total": 99.99 },
    { "id": 2, "total": 49.99 }
  ]
}
\`\`\`

**Examples**: MongoDB, CouchDB
**Use for**: Content management, catalogs, user profiles

---

## Key-Value Stores

Simple key-value pairs. Extremely fast.

**Examples**: Redis, DynamoDB
**Use for**: Caching, sessions, real-time data

---

## Graph Databases

Nodes and relationships. Great for connected data.

**Examples**: Neo4j, Neptune
**Use for**: Social networks, recommendations, fraud detection

---

## Time-Series Databases

Optimized for time-stamped data.

**Examples**: InfluxDB, TimescaleDB
**Use for**: Metrics, IoT, financial data

---

## Quick Reference

| Type | Best For | Examples |
|------|----------|----------|
| Relational | Complex queries, ACID | PostgreSQL |
| Document | Flexible schemas | MongoDB |
| Key-Value | Speed, caching | Redis |
| Graph | Relationships | Neo4j |
| Time-Series | Temporal data | InfluxDB |

---

## Key Takeaways

- No single database fits all use cases
- Consider query patterns and data structure
- Polyglot persistence (multiple DBs) is common
- Start with PostgreSQL if unsure
`
}
