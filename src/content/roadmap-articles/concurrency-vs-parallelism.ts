import { RoadmapArticle } from "./index"

export const concurrencyVsParallelismArticle: RoadmapArticle = {
  slug: "concurrency-vs-parallelism",
  title: "Concurrency vs Parallelism",
  author: "Sujal Kalra",
  publishedDate: "2024-03-11",
  readTime: 7,
  difficulty: "Intermediate",
  category: "Theory",
  tags: ["Concurrency", "Parallelism", "Threading", "Performance"],
  excerpt: "Understand the crucial difference between concurrency and parallelism, and when to use each approach.",
  content: `
## Introduction

**Concurrency** is about dealing with multiple things at once. **Parallelism** is about doing multiple things at once.

---

## The Difference

### Concurrency
Multiple tasks making progress by interleaving execution.

\`\`\`
Single core:
Task A: ████░░░░████░░░░████
Task B: ░░░░████░░░░████░░░░
Time →
\`\`\`

### Parallelism
Multiple tasks executing simultaneously.

\`\`\`
Multiple cores:
Core 1 (Task A): ████████████
Core 2 (Task B): ████████████
Time →
\`\`\`

---

## Analogy

**Concurrency**: One cook making multiple dishes, switching between them
**Parallelism**: Multiple cooks each making their own dish

---

## When to Use What

| Use Case | Approach |
|----------|----------|
| I/O-bound work (network, disk) | Concurrency |
| CPU-bound work (computation) | Parallelism |
| Web servers | Concurrency |
| Image processing | Parallelism |
| Database queries | Concurrency |
| Machine learning | Parallelism |

---

## Implementation Patterns

\`\`\`javascript
// Concurrency (JavaScript async)
const results = await Promise.all([
  fetch('/api/users'),
  fetch('/api/posts'),
  fetch('/api/comments')
]);

// Parallelism (Web Workers)
const worker = new Worker('heavy-computation.js');
worker.postMessage(data);
\`\`\`

---

## Key Takeaways

- Concurrency = structure, Parallelism = execution
- I/O-bound → concurrency
- CPU-bound → parallelism
- You often need both in real systems
`
}
