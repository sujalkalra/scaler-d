import { RoadmapArticle } from "./index"

export const cdcArticle: RoadmapArticle = {
  slug: "cdc",
  title: "Change Data Capture (CDC)",
  author: "Sujal Kalra",
  publishedDate: "2024-02-22",
  readTime: 9,
  difficulty: "Advanced",
  category: "Database",
  tags: ["CDC", "Data Streaming", "Debezium", "Event-Driven", "Real-time"],
  excerpt: "Learn Change Data Capture - the technique for tracking and streaming database changes in real-time.",
  content: `
## Introduction

**Change Data Capture (CDC)** is a pattern that captures and tracks changes to data in a database, enabling real-time data streaming and synchronization.

---

## How CDC Works

\`\`\`
Database → Change Log → CDC Tool → Stream → Consumers
                                      ↓
                              (Kafka, etc.)
\`\`\`

---

## CDC Methods

### Log-based CDC
Reads database transaction logs (most reliable).

\`\`\`
PostgreSQL: WAL (Write-Ahead Log)
MySQL: Binary Log
SQL Server: Transaction Log
\`\`\`

### Trigger-based CDC
Uses database triggers to capture changes.

### Query-based CDC
Polls database for changes (timestamp/version columns).

---

## Popular CDC Tools

| Tool | Database Support |
|------|-----------------|
| Debezium | PostgreSQL, MySQL, MongoDB |
| AWS DMS | Most databases |
| Fivetran | Cloud databases |
| Maxwell | MySQL |

---

## Use Cases

1. **Real-time analytics**: Stream to data warehouse
2. **Microservices sync**: Keep services in sync
3. **Cache invalidation**: Update caches on change
4. **Audit logs**: Track all data changes
5. **Search indexing**: Keep Elasticsearch updated

---

## Key Takeaways

- CDC enables real-time data integration
- Log-based CDC is most reliable
- Debezium + Kafka is a popular combination
- Consider ordering and exactly-once semantics
`
}
