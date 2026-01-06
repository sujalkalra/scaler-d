import { RoadmapArticle } from "./index"

export const webhooksArticle: RoadmapArticle = {
  slug: "webhooks",
  title: "What are Webhooks?",
  author: "Sujal Kalra",
  publishedDate: "2024-01-18",
  readTime: 6,
  difficulty: "Beginner",
  category: "Communication",
  tags: ["Webhooks", "Events", "HTTP", "Integration", "Real-time"],
  excerpt: "Understand webhooks - the event-driven way for applications to communicate. Learn how to receive real-time notifications from external services.",
  content: `
## Introduction

**Webhooks** are automated messages sent from one application to another when a specific event occurs. Unlike traditional APIs where you request data, webhooks push data to you automatically.

Think of it like this: Instead of constantly checking your mailbox (polling), webhooks are like having the postman ring your doorbell when a package arrives.

---

## How Webhooks Work

1. You provide a **callback URL** to the service
2. When an event occurs, the service sends an HTTP POST request to your URL
3. Your server processes the incoming data

\`\`\`javascript
// Your webhook endpoint
app.post('/webhooks/payment', (req, res) => {
  const event = req.body;
  
  if (event.type === 'payment.completed') {
    // Handle successful payment
    console.log('Payment received:', event.data.amount);
  }
  
  res.status(200).send('OK');
});
\`\`\`

---

## Webhooks vs Polling

| Aspect | Webhooks | Polling |
|--------|----------|---------|
| Data freshness | Real-time | Delayed |
| Server load | Low | High |
| Complexity | Event-driven | Simpler to implement |
| Resource usage | Efficient | Wasteful |

---

## Common Webhook Use Cases

- **Payment notifications** (Stripe, PayPal)
- **Git events** (GitHub, GitLab)
- **Chat messages** (Slack, Discord)
- **Email events** (SendGrid, Mailchimp)
- **Form submissions** (Typeform, Google Forms)

---

## Key Takeaways

- Webhooks enable real-time, event-driven communication
- More efficient than polling for notifications
- Require a publicly accessible endpoint
- Always verify webhook signatures for security
`
}
