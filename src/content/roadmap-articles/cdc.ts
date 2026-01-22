import { RoadmapArticle } from "./index"

export const cdcArticle: RoadmapArticle = {
  slug: "cdc",
  title: "Change Data Capture (CDC)",
  author: "Ashish Pratap Singh",
  publishedDate: "2024-02-22",
  readTime: 12,
  difficulty: "Advanced",
  category: "Database",
  tags: ["CDC", "Data Streaming", "Debezium", "Event-Driven", "Real-time"],
  excerpt: "Learn Change Data Capture - the technique for tracking and streaming database changes in real-time.",
  content: `
# What is Change Data Capture (CDC)?

Modern applications often rely on multiple systems (e.g., search engines, caches, data lakes, microservices), all of which need **up-to-date data**.

Traditional **batch ETL jobs** are slow, introduce latency, and often lead to stale data and inconsistencies.

**Change Data Capture (CDC)** is a design pattern used to **track and capture changes** in a database (inserts, updates, deletes) and **stream those changes in real time** to downstream systems.

This ensures downstream systems remain in sync without needing expensive batch jobs.

---

# 1. How CDC Works

At a high level, CDC works by continuously monitoring a database for data changes.

When a change occurs, CDC captures the change event and makes the information available for processing.

The process typically involves:

- **Monitoring:** Detecting changes from source systems
- **Capturing:** Extracting details about the change event (before and after values)
- **Delivering:** Transmitting the change event to consumers (message queues, data pipelines)

This helps in achieving **event-driven architectures** where applications respond to data changes as they happen.

---

# 2. CDC Implementation Approaches

## 2.1 Timestamp-Based CDC

This approach relies on adding a \`last_updated\` column to your database tables.

\`\`\`sql
SELECT * FROM orders WHERE last_updated > '2024-02-15 12:00:00';
\`\`\`

**Pros:**
- Simple to implement
- No external dependencies

**Cons:**
- May not capture deleted records
- Performance overhead with large data
- Potential data gaps

## 2.2 Trigger-Based CDC

Database triggers automatically log changes to a separate audit table.

\`\`\`sql
CREATE TRIGGER order_changes
AFTER UPDATE ON orders
FOR EACH ROW
INSERT INTO order_audit (order_id, old_status, new_status, changed_at)
VALUES (OLD.id, OLD.status, NEW.status, NOW());
\`\`\`

**Pros:**
- Real-time capture
- Detailed auditing
- Flexible

**Cons:**
- Performance impact on transactions
- Complex maintenance
- Resource intensive

## 2.3 Log-Based CDC

Reads changes directly from the database's **write-ahead log (WAL)** or **binary log (binlog)**.

**Database Logs:**
- **PostgreSQL:** WAL (Write-Ahead Log)
- **MySQL:** Binary Log
- **SQL Server:** Transaction Log

**Pros:**
- High efficiency
- Scalability
- Comprehensive change capture
- Minimal latency

**Cons:**
- Complex setup
- Database-specific
- Requires additional tooling

> **Log-based CDC is generally preferred** because it efficiently captures all types of changes directly from transaction logs with minimal impact on the primary database.

---

# 3. Real-World Use Cases of CDC

## 3.1 Microservices Communication

In a microservices architecture, CDC captures changes and propagates them via a messaging system (like Kafka) so each microservice stays updated without direct service-to-service calls.

## 3.2 Event Sourcing

CDC captures every change as an event, building a complete log of all modifications.

**Example:** A financial application that logs every transaction as an event, enabling complete account history reconstruction.

## 3.3 Data Warehousing

CDC captures database changes and pushes them into a data warehouse in near real-time, enabling up-to-date analytics and reporting.

## 3.4 Cache Invalidation

CDC triggers cache updates automatically whenever the underlying data changes.

**Example:** An online news platform uses CDC to invalidate cached articles when content is updated.

---

# 4. Implementing CDC with Debezium and Kafka

**Debezium** is a popular open-source tool that provides log-based CDC for various databases.

### Step 1: Set Up Kafka and Debezium

\`\`\`bash
# Start Zookeeper
bin/zookeeper-server-start.sh config/zookeeper.properties &

# Start Kafka Broker
bin/kafka-server-start.sh config/server.properties &
\`\`\`

### Step 2: Configure Debezium Connector

\`\`\`json
{
  "name": "inventory-connector",
  "config": {
    "connector.class": "io.debezium.connector.mysql.MySqlConnector",
    "database.hostname": "localhost",
    "database.port": "3306",
    "database.user": "cdc_user",
    "database.password": "password",
    "database.server.id": "184054",
    "database.include.list": "ecommerce",
    "table.include.list": "ecommerce.orders",
    "database.history.kafka.bootstrap.servers": "localhost:9092",
    "database.history.kafka.topic": "dbhistory.inventory"
  }
}
\`\`\`

### Step 3: Listen for Changes

\`\`\`bash
bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 \\
  --topic dbhistory.inventory --from-beginning
\`\`\`

---

# 5. Challenges and Considerations

1. **Schema Evolution:** CDC pipelines must adapt to schema changes gracefully

2. **High Throughput Handling:** Design for processing large volumes of events efficiently

3. **Ordering Guarantees:** Ensure events are processed in the correct order

4. **Security and Compliance:** Implement encryption, data masking, and access controls

---

## Popular CDC Tools

| Tool | Database Support |
|------|------------------|
| Debezium | PostgreSQL, MySQL, MongoDB |
| AWS DMS | Most databases |
| Fivetran | Cloud databases |
| Maxwell | MySQL |

---

## Key Takeaways

- CDC enables real-time data synchronization across systems
- Log-based CDC is the preferred approach for most use cases
- Debezium + Kafka is a popular and powerful combination
- Consider ordering and exactly-once semantics
- Essential for event-driven architectures and microservices
`
}
