import { RoadmapArticle } from "./index"

export const rateLimitingArticle: RoadmapArticle = {
  slug: "rate-limiting",
  title: "Rate Limiting Algorithms",
  author: "Sujal Kalra",
  publishedDate: "2024-03-03",
  readTime: 11,
  difficulty: "Intermediate",
  category: "Security",
  tags: ["Rate Limiting", "Security", "Token Bucket", "Sliding Window", "API"],
  excerpt: "Master rate limiting algorithms to protect your APIs from abuse. Includes code examples for each algorithm.",
  content: `
## Introduction

**Rate limiting** controls how many requests a client can make in a given time period. Essential for API protection and fair usage.

---

## Common Algorithms

### 1. Token Bucket

Tokens added at fixed rate. Each request consumes a token.

\`\`\`python
class TokenBucket:
    def __init__(self, capacity, refill_rate):
        self.capacity = capacity
        self.tokens = capacity
        self.refill_rate = refill_rate
        self.last_refill = time.time()
    
    def allow_request(self):
        self._refill()
        if self.tokens >= 1:
            self.tokens -= 1
            return True
        return False
\`\`\`

**Pros**: Allows bursts, smooth rate limiting

### 2. Sliding Window Log

Track timestamps of each request.

\`\`\`python
def is_allowed(user_id, limit, window_seconds):
    now = time.time()
    window_start = now - window_seconds
    
    # Remove old entries
    requests[user_id] = [t for t in requests[user_id] if t > window_start]
    
    if len(requests[user_id]) < limit:
        requests[user_id].append(now)
        return True
    return False
\`\`\`

### 3. Fixed Window Counter

Count requests in fixed time windows.

**Pros**: Simple, low memory
**Cons**: Burst at window boundaries

### 4. Sliding Window Counter

Weighted combination of current and previous windows.

---

## Algorithm Comparison

| Algorithm | Memory | Accuracy | Burst Handling |
|-----------|--------|----------|----------------|
| Token Bucket | Low | High | Allowed |
| Sliding Log | High | Highest | Strict |
| Fixed Window | Lowest | Low | Problematic |
| Sliding Counter | Low | High | Controlled |

---

## Implementation Tips

\`\`\`javascript
// Express.js rate limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit per IP
  message: 'Too many requests'
});

app.use('/api/', limiter);
\`\`\`

---

## Key Takeaways

- Token bucket is most versatile
- Consider distributed rate limiting for multiple servers
- Return 429 status code when rate limited
- Include rate limit headers in responses
`
}
