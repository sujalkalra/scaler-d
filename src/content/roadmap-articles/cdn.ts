import { RoadmapArticle } from "./index"

export const cdnArticle: RoadmapArticle = {
  slug: "cdn",
  title: "Content Delivery Networks (CDN)",
  author: "Sujal Kalra",
  publishedDate: "2024-03-01",
  readTime: 8,
  difficulty: "Intermediate",
  category: "Performance",
  tags: ["CDN", "Performance", "Caching", "Latency", "Global Distribution"],
  excerpt: "Understand how CDNs deliver content faster by caching at edge locations worldwide.",
  content: `
## Introduction

A **CDN (Content Delivery Network)** is a distributed network of servers that delivers content to users from the geographically closest location.

---

## How CDNs Work

\`\`\`
User (Tokyo) → Edge Server (Tokyo) → Cache Hit ✓
                    ↓
              Cache Miss
                    ↓
           Origin Server (US)
\`\`\`

---

## What CDNs Cache

- Static files (images, CSS, JS)
- Video content
- API responses (sometimes)
- HTML pages (static sites)

---

## Benefits

| Benefit | Impact |
|---------|--------|
| Lower latency | 50-200ms faster |
| Reduced origin load | 70-90% traffic offloaded |
| DDoS protection | Absorbs attack traffic |
| Global availability | Handles regional outages |

---

## Popular CDN Providers

- **Cloudflare**: Great free tier, DDoS protection
- **AWS CloudFront**: Deep AWS integration
- **Fastly**: Developer-friendly, edge compute
- **Akamai**: Enterprise, largest network

---

## CDN Configuration Tips

\`\`\`
# Cache-Control header examples
Cache-Control: public, max-age=31536000  # Static assets (1 year)
Cache-Control: public, max-age=3600      # API responses (1 hour)
Cache-Control: private, no-store         # User-specific data
\`\`\`

---

## Key Takeaways

- CDNs are essential for global applications
- Cache-Control headers control CDN behavior
- Consider edge computing for dynamic content
- Monitor cache hit rates
`
}
