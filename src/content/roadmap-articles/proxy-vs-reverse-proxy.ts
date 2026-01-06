import { RoadmapArticle } from "./index"

export const proxyVsReverseProxyArticle: RoadmapArticle = {
  slug: "proxy-vs-reverse-proxy",
  title: "Proxy vs Reverse Proxy Explained",
  author: "Sujal Kalra",
  publishedDate: "2024-01-30",
  readTime: 7,
  difficulty: "Intermediate",
  category: "Infrastructure",
  tags: ["Proxy", "Reverse Proxy", "Nginx", "Security", "CDN"],
  excerpt: "Understand the difference between forward proxies and reverse proxies, and when to use each in your architecture.",
  content: `
## Introduction

Both proxies sit between clients and servers, but they serve opposite purposes.

---

## Forward Proxy

A forward proxy sits in front of **clients**, forwarding their requests to the internet.

\`\`\`
Client → Forward Proxy → Internet → Server
\`\`\`

### Use Cases
- Anonymity (hide client IP)
- Access control (corporate firewalls)
- Caching (reduce bandwidth)
- Content filtering

---

## Reverse Proxy

A reverse proxy sits in front of **servers**, receiving requests from clients.

\`\`\`
Client → Internet → Reverse Proxy → Server(s)
\`\`\`

### Use Cases
- Load balancing
- SSL termination
- Caching static content
- Security (hide server details)
- Compression

---

## Key Differences

| Aspect | Forward Proxy | Reverse Proxy |
|--------|---------------|---------------|
| Protects | Clients | Servers |
| Knows about | Client identity | Server identity |
| Configured by | Client admin | Server admin |
| Example | VPN, Corporate proxy | Nginx, Cloudflare |

---

## Popular Reverse Proxies

- **Nginx**: Most popular, high performance
- **Traefik**: Container-native, auto-discovery
- **HAProxy**: High availability focus
- **Cloudflare**: Edge reverse proxy + CDN

---

## Key Takeaways

- Forward proxy: Protects and serves clients
- Reverse proxy: Protects and serves servers
- Most modern web architectures use reverse proxies
- Nginx is the go-to choice for most use cases
`
}
