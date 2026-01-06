import { RoadmapArticle } from "./index"

export const apiArticle: RoadmapArticle = {
  slug: "apis",
  title: "What is an API?",
  author: "Sujal Kalra",
  publishedDate: "2024-01-15",
  readTime: 8,
  difficulty: "Beginner",
  category: "Communication",
  tags: ["API", "REST", "HTTP", "Web Development", "Backend"],
  excerpt: "Learn the fundamentals of APIs - the building blocks of modern software communication. Understand how applications talk to each other.",
  content: `
## Introduction

An **API (Application Programming Interface)** is a set of rules and protocols that allows different software applications to communicate with each other. Think of it as a waiter in a restaurant – you (the client) tell the waiter (API) what you want, and the waiter brings back the food (data) from the kitchen (server).

APIs are the backbone of modern software development. Every time you use an app on your phone, send a message, or check the weather, you're using APIs behind the scenes.

---

## Why Do We Need APIs?

APIs solve several critical problems in software development:

### 1. **Abstraction**
APIs hide the complexity of underlying systems. You don't need to know how Google Maps calculates routes – you just call their API.

### 2. **Modularity**
APIs allow systems to be built as independent modules that communicate through well-defined interfaces.

### 3. **Reusability**
Build once, use everywhere. A payment API like Stripe can be integrated into thousands of applications.

### 4. **Security**
APIs provide a controlled gateway to your data, exposing only what's necessary.

---

## Types of APIs

### REST APIs
The most common type. Uses HTTP methods and follows a stateless architecture.

\`\`\`javascript
// Example: Fetching user data from a REST API
const response = await fetch('https://api.example.com/users/123');
const user = await response.json();
console.log(user.name); // "John Doe"
\`\`\`

### GraphQL APIs
Query exactly what you need. Developed by Facebook.

\`\`\`graphql
query {
  user(id: "123") {
    name
    email
    posts {
      title
    }
  }
}
\`\`\`

### gRPC APIs
High-performance, uses Protocol Buffers. Great for microservices.

### WebSocket APIs
Real-time, bidirectional communication.

---

## HTTP Methods in REST APIs

| Method | Purpose | Example |
|--------|---------|---------|
| GET | Retrieve data | Get user profile |
| POST | Create new data | Create new user |
| PUT | Update data (replace) | Update user profile |
| PATCH | Partial update | Update user email only |
| DELETE | Remove data | Delete user account |

---

## Anatomy of an API Request

![API Request Diagram](/placeholder-api-diagram.png)

Every API request consists of:

1. **Endpoint URL**: Where to send the request
2. **HTTP Method**: What action to perform
3. **Headers**: Metadata (authentication, content type)
4. **Body**: Data to send (for POST/PUT)

\`\`\`javascript
// Complete API request example
const response = await fetch('https://api.example.com/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-token-here'
  },
  body: JSON.stringify({
    title: 'My New Post',
    content: 'This is the post content'
  })
});

const newPost = await response.json();
\`\`\`

---

## API Response Codes

Understanding HTTP status codes is crucial:

- **2xx Success**: 200 OK, 201 Created, 204 No Content
- **4xx Client Errors**: 400 Bad Request, 401 Unauthorized, 404 Not Found
- **5xx Server Errors**: 500 Internal Server Error, 503 Service Unavailable

---

## Real-World API Examples

### 1. Twitter/X API
Post tweets, read timelines, manage followers.

### 2. Stripe API
Process payments, manage subscriptions.

### 3. OpenAI API
Generate text, images, embeddings.

### 4. Google Maps API
Geocoding, directions, places search.

---

## Best Practices for API Design

1. **Use meaningful resource names**: \`/users\` not \`/getUsers\`
2. **Version your APIs**: \`/api/v1/users\`
3. **Return appropriate status codes**
4. **Provide clear error messages**
5. **Document everything**
6. **Implement rate limiting**
7. **Use HTTPS always**

---

## Key Takeaways

- APIs enable communication between software systems
- REST is the most common API architecture
- Understanding HTTP methods and status codes is essential
- Good API design focuses on simplicity and consistency
- Always prioritize security and documentation

---

## Next Steps

Now that you understand APIs, explore these related concepts:
- [Webhooks](/roadmap/webhooks) - Event-driven API notifications
- [REST vs GraphQL](/roadmap/rest-vs-graphql) - Choosing the right API style
- [API Gateway](/roadmap/api-gateway) - Managing APIs at scale
`
}
