import { RoadmapArticle } from "./index"

export const loadBalancersArticle: RoadmapArticle = {
  slug: "load-balancers",
  title: "Understanding Load Balancers",
  author: "Sujal Kalra",
  publishedDate: "2024-01-25",
  readTime: 9,
  difficulty: "Intermediate",
  category: "Infrastructure",
  tags: ["Load Balancer", "Scaling", "High Availability", "Infrastructure"],
  excerpt: "Deep dive into load balancers - how they distribute traffic, improve reliability, and enable horizontal scaling.",
  content: `
## Introduction

A **Load Balancer** distributes incoming network traffic across multiple servers to ensure no single server becomes overwhelmed.

---

## Why Load Balancing?

1. **High Availability**: If one server fails, others handle the traffic
2. **Scalability**: Add servers as demand grows
3. **Performance**: Distribute load for faster response times
4. **Flexibility**: Perform maintenance without downtime

---

## Types of Load Balancers

### Layer 4 (Transport Layer)
Routes based on IP and TCP/UDP ports. Fast but less flexible.

### Layer 7 (Application Layer)
Routes based on HTTP headers, URLs, cookies. More intelligent decisions.

\`\`\`
# Layer 7 example: Route by path
/api/users    → User Service
/api/products → Product Service
/api/orders   → Order Service
\`\`\`

---

## Popular Load Balancers

- **HAProxy**: High-performance, open-source
- **Nginx**: Web server + load balancer
- **AWS ELB/ALB**: Managed AWS solutions
- **Cloudflare**: Edge load balancing

---

## Key Takeaways

- Load balancers are essential for scalable applications
- Choose between L4 (faster) and L7 (smarter) based on needs
- Health checks ensure traffic goes to healthy servers
- Session persistence may be needed for stateful apps
`
}
