import { RoadmapArticle } from "./index"

export const longPollingVsWebsocketsArticle: RoadmapArticle = {
  slug: "long-polling-vs-websockets",
  title: "Long Polling vs WebSockets",
  author: "Sujal Kalra",
  publishedDate: "2024-03-15",
  readTime: 8,
  difficulty: "Intermediate",
  category: "Communication",
  tags: ["Long Polling", "WebSockets", "Real-time", "HTTP", "Bidirectional"],
  excerpt: "Compare real-time communication techniques - from simple polling to full-duplex WebSocket connections.",
  content: `
## Introduction

When building real-time features, you need to choose the right communication pattern for your use case.

---

## Polling

Client repeatedly asks server for updates.

\`\`\`javascript
setInterval(async () => {
  const updates = await fetch('/api/updates');
  // Process updates
}, 5000); // Every 5 seconds
\`\`\`

**Pros**: Simple
**Cons**: Wasteful, delayed updates

---

## Long Polling

Client request stays open until server has data.

\`\`\`javascript
async function longPoll() {
  const response = await fetch('/api/updates?wait=true');
  handleUpdate(response);
  longPoll(); // Immediately start next request
}
\`\`\`

**Pros**: Near real-time, works everywhere
**Cons**: Connection overhead, one-directional

---

## WebSockets

Full-duplex, persistent connection.

\`\`\`javascript
const ws = new WebSocket('wss://api.example.com/socket');

ws.onmessage = (event) => {
  console.log('Received:', event.data);
};

ws.send('Hello server!');
\`\`\`

**Pros**: True real-time, bidirectional, efficient
**Cons**: More complex, stateful connection

---

## Server-Sent Events (SSE)

One-way server-to-client stream.

\`\`\`javascript
const events = new EventSource('/api/stream');
events.onmessage = (e) => console.log(e.data);
\`\`\`

---

## Comparison

| Feature | Polling | Long Polling | WebSocket | SSE |
|---------|---------|--------------|-----------|-----|
| Latency | High | Medium | Low | Low |
| Server push | ✗ | ✓ | ✓ | ✓ |
| Client push | ✓ | ✓ | ✓ | ✗ |
| Overhead | High | Medium | Low | Low |

---

## Key Takeaways

- Use WebSockets for chat, gaming, collaboration
- Use SSE for notifications, feeds
- Long polling as fallback for older browsers
- Consider Socket.io for automatic fallbacks
`
}
