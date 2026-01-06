import { RoadmapArticle } from "./index"

export const cacheEvictionArticle: RoadmapArticle = {
  slug: "cache-eviction",
  title: "Cache Eviction Policies",
  author: "Sujal Kalra",
  publishedDate: "2024-02-28",
  readTime: 8,
  difficulty: "Intermediate",
  category: "Performance",
  tags: ["Caching", "LRU", "LFU", "Eviction", "Memory Management"],
  excerpt: "Learn cache eviction strategies - how to decide which items to remove when cache is full.",
  content: `
## Introduction

When cache reaches capacity, you must decide which items to evict. The eviction policy determines cache efficiency.

---

## Common Eviction Policies

### 1. LRU (Least Recently Used)
Evicts items that haven't been accessed for the longest time.

\`\`\`python
# Access order: A, B, C, D, E (cache size: 4)
# Cache: [B, C, D, E] (A evicted - oldest access)
\`\`\`

**Best for**: General purpose, temporal locality

### 2. LFU (Least Frequently Used)
Evicts items with lowest access count.

**Best for**: When some items are consistently popular

### 3. FIFO (First In, First Out)
Evicts oldest items regardless of usage.

**Best for**: Simple implementation, time-based data

### 4. TTL (Time To Live)
Items expire after set duration.

\`\`\`python
cache.set("session:123", user_data, ttl=3600)  # Expires in 1 hour
\`\`\`

### 5. Random
Randomly select item to evict.

**Best for**: When access patterns are unpredictable

---

## Policy Comparison

| Policy | Complexity | Use Case |
|--------|------------|----------|
| LRU | O(1) | General purpose |
| LFU | O(log n) | Stable popularity |
| FIFO | O(1) | Time-sensitive data |
| TTL | O(1) | Session data |
| Random | O(1) | Unpredictable access |

---

## Key Takeaways

- LRU is the most common default
- Combine TTL with other policies
- Monitor hit rate to evaluate effectiveness
- Consider memory overhead of tracking
`
}
