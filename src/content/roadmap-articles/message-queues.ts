import { RoadmapArticle } from "./index"

export const messageQueuesArticle: RoadmapArticle = {
  slug: "message-queues",
  title: "Message Queues Explained",
  author: "Sujal Kalra",
  publishedDate: "2024-03-05",
  readTime: 10,
  difficulty: "Intermediate",
  category: "Communication",
  tags: ["Message Queue", "Kafka", "RabbitMQ", "Async", "Decoupling"],
  excerpt: "Learn how message queues enable asynchronous communication, decouple services, and handle traffic spikes.",
  content: `
## Introduction

A **message queue** is a form of asynchronous service-to-service communication. Messages are stored in a queue until processed.

---

## Why Message Queues?

### 1. Decoupling
Services don't need to know about each other.

### 2. Asynchronous Processing
\`\`\`
Sync:  User → Order Service → Payment → Inventory → Email → Response
Async: User → Order Service → Response (immediate)
                    ↓
              [Message Queue]
                    ↓
         Payment, Inventory, Email (async)
\`\`\`

### 3. Load Leveling
Handle traffic spikes without overwhelming services.

### 4. Reliability
Messages persist until successfully processed.

---

## Queue vs Pub/Sub

**Queue**: One consumer receives each message
**Pub/Sub**: All subscribers receive each message

---

## Popular Solutions

| Solution | Best For |
|----------|----------|
| RabbitMQ | Traditional queuing, complex routing |
| Apache Kafka | Event streaming, high throughput |
| AWS SQS | Managed, simple queuing |
| Redis Streams | Lightweight, already using Redis |

---

## Basic Pattern

\`\`\`javascript
// Producer
await queue.send('orders', {
  orderId: '123',
  userId: 'user-456',
  items: [...]
});

// Consumer
queue.subscribe('orders', async (message) => {
  await processOrder(message);
  await message.ack();
});
\`\`\`

---

## Key Takeaways

- Message queues enable async, decoupled architectures
- Choose based on throughput and feature needs
- Always handle failures and dead letters
- Kafka for events, RabbitMQ for tasks
`
}
