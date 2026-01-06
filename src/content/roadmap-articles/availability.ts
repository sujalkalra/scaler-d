import { RoadmapArticle } from "./index"

export const availabilityArticle: RoadmapArticle = {
  slug: "availability",
  title: "High Availability in Distributed Systems",
  author: "Sujal Kalra",
  publishedDate: "2024-02-03",
  readTime: 8,
  difficulty: "Intermediate",
  category: "Architecture",
  tags: ["Availability", "SLA", "Redundancy", "Failover", "Uptime"],
  excerpt: "Learn what high availability means, how it's measured, and strategies to achieve 99.99% uptime for your systems.",
  content: `
## Introduction

**Availability** is the percentage of time a system is operational and accessible. High availability (HA) systems are designed to minimize downtime.

---

## Measuring Availability

Availability is measured in "nines":

| Nines | Availability | Downtime/Year |
|-------|--------------|---------------|
| Two 9s | 99% | 3.65 days |
| Three 9s | 99.9% | 8.76 hours |
| Four 9s | 99.99% | 52.6 minutes |
| Five 9s | 99.999% | 5.26 minutes |

---

## Strategies for High Availability

### 1. Redundancy
\`\`\`
Primary Database ←→ Replica Database
       ↓                  ↓
    Active            Standby
\`\`\`

### 2. Load Balancing
Distribute traffic across multiple servers.

### 3. Health Checks
\`\`\`javascript
// Kubernetes liveness probe
livenessProbe:
  httpGet:
    path: /health
    port: 8080
  periodSeconds: 10
\`\`\`

### 4. Failover
Automatically switch to backup when primary fails.

### 5. Geographic Distribution
Deploy across multiple regions/data centers.

---

## Key Takeaways

- Availability = (Total Time - Downtime) / Total Time
- Eliminate single points of failure
- Design for failure, not perfection
- More nines = exponentially harder to achieve
- Balance availability with cost and complexity
`
}
