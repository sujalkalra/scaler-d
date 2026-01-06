import { RoadmapArticle } from "./index"

export const spofArticle: RoadmapArticle = {
  slug: "spof",
  title: "Single Point of Failure (SPOF)",
  author: "Sujal Kalra",
  publishedDate: "2024-02-05",
  readTime: 7,
  difficulty: "Intermediate",
  category: "Architecture",
  tags: ["SPOF", "Reliability", "Redundancy", "Fault Tolerance"],
  excerpt: "Identify and eliminate single points of failure in your system architecture. A crucial skill for building reliable systems.",
  content: `
## Introduction

A **Single Point of Failure (SPOF)** is any component whose failure would bring down the entire system. Identifying and eliminating SPOFs is crucial for reliability.

---

## Common SPOFs

### 1. Database
**Problem**: Single database instance
**Solution**: Replicas, clustering, multi-region

### 2. Load Balancer
**Problem**: One load balancer
**Solution**: Active-passive LB pair

### 3. DNS
**Problem**: Single DNS provider
**Solution**: Multiple DNS providers

### 4. Network
**Problem**: Single ISP connection
**Solution**: Multiple network providers

---

## How to Identify SPOFs

Ask: "If this component fails, what happens?"

\`\`\`
User → DNS → LB → Web Server → Database
  ↓      ↓     ↓       ↓           ↓
SPOF?  SPOF? SPOF?   SPOF?      SPOF?
\`\`\`

---

## Mitigation Strategies

| SPOF | Mitigation |
|------|------------|
| Database | Read replicas, multi-master |
| Server | Auto-scaling groups |
| Load Balancer | Active-passive pair |
| Region | Multi-region deployment |
| Code bug | Canary deployments |

---

## Key Takeaways

- Every system has potential SPOFs
- Redundancy is the primary defense
- More redundancy = more complexity
- Regular failure testing reveals hidden SPOFs
- Document your failure modes
`
}
