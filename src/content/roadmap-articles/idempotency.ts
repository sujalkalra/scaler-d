import { RoadmapArticle } from "./index"

export const idempotencyArticle: RoadmapArticle = {
  slug: "idempotency",
  title: "Idempotency in Distributed Systems",
  author: "Sujal Kalra",
  publishedDate: "2024-03-09",
  readTime: 8,
  difficulty: "Intermediate",
  category: "Theory",
  tags: ["Idempotency", "Distributed Systems", "API Design", "Reliability"],
  excerpt: "Learn why idempotency is crucial for building reliable APIs and how to implement it correctly.",
  content: `
## Introduction

An operation is **idempotent** if performing it multiple times has the same effect as performing it once.

---

## Why Idempotency Matters

In distributed systems, network failures cause retries:

\`\`\`
Client → "Charge $100" → Server (timeout)
Client → "Charge $100" → Server (success)

Without idempotency: Customer charged $200!
With idempotency: Customer charged $100 ✓
\`\`\`

---

## HTTP Method Idempotency

| Method | Idempotent? | Safe? |
|--------|-------------|-------|
| GET | ✓ | ✓ |
| PUT | ✓ | ✗ |
| DELETE | ✓ | ✗ |
| POST | ✗ | ✗ |
| PATCH | ✗ | ✗ |

---

## Implementing Idempotency

### Idempotency Keys

\`\`\`javascript
// Client sends unique key with request
const response = await fetch('/api/payments', {
  method: 'POST',
  headers: {
    'Idempotency-Key': 'unique-request-id-123',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ amount: 100 })
});

// Server stores key + response, returns same response on retry
\`\`\`

---

## Best Practices

1. Generate idempotency keys client-side (UUIDs)
2. Store keys with TTL (24-48 hours)
3. Return cached response for duplicate requests
4. Use database transactions to store key + result atomically

---

## Key Takeaways

- Idempotency prevents duplicate operations
- Essential for payment and order systems
- Use idempotency keys for non-idempotent operations
- Design APIs to be idempotent by default
`
}
