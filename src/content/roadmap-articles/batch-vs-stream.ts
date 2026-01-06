import { RoadmapArticle } from "./index"

export const batchVsStreamArticle: RoadmapArticle = {
  slug: "batch-vs-stream",
  title: "Batch vs Stream Processing",
  author: "Sujal Kalra",
  publishedDate: "2024-03-17",
  readTime: 9,
  difficulty: "Advanced",
  category: "Processing",
  tags: ["Batch Processing", "Stream Processing", "Kafka", "Spark", "Real-time"],
  excerpt: "Understand the difference between batch and stream processing, and when to use each approach.",
  content: `
## Introduction

Data processing can happen in batches (chunks) or as a continuous stream. The choice impacts architecture, latency, and complexity.

---

## Batch Processing

Process large volumes of data at scheduled intervals.

\`\`\`
Data → Storage → Batch Job (nightly) → Results
\`\`\`

### Characteristics
- High throughput
- High latency (hours to days)
- Simple error handling
- Efficient resource usage

### Tools
- Apache Spark
- Hadoop MapReduce
- AWS Batch

---

## Stream Processing

Process data as it arrives in real-time.

\`\`\`
Data → Stream → Processor → Results (immediate)
\`\`\`

### Characteristics
- Low latency (ms to seconds)
- Continuous processing
- Complex state management
- Higher resource costs

### Tools
- Apache Kafka Streams
- Apache Flink
- AWS Kinesis

---

## When to Use What

| Use Case | Approach |
|----------|----------|
| Daily reports | Batch |
| Fraud detection | Stream |
| ETL pipelines | Batch |
| Live dashboards | Stream |
| ML training | Batch |
| Recommendations | Hybrid |

---

## Lambda Architecture

Combines both for best of both worlds:

\`\`\`
                    ┌→ Batch Layer → Batch Views ─┐
Raw Data ──────────│                              ├→ Query
                    └→ Speed Layer → Real-time ───┘
\`\`\`

---

## Key Takeaways

- Batch for high-volume, latency-tolerant processing
- Stream for real-time insights and actions
- Modern systems often use both (Lambda/Kappa architecture)
- Consider operational complexity when choosing
`
}
