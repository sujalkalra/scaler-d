import { RoadmapArticle } from "./index"

export const restVsGraphqlArticle: RoadmapArticle = {
  slug: "rest-vs-graphql",
  title: "REST vs GraphQL: Choosing the Right API Style",
  author: "Sujal Kalra",
  publishedDate: "2024-01-20",
  readTime: 10,
  difficulty: "Intermediate",
  category: "Communication",
  tags: ["REST", "GraphQL", "API", "Architecture", "Comparison"],
  excerpt: "A comprehensive comparison of REST and GraphQL APIs. Learn when to use each approach and understand their trade-offs.",
  content: `
## Introduction

The debate between REST and GraphQL is one of the most common in API design. Both are powerful, but they serve different needs.

---

## REST: Representational State Transfer

REST is an architectural style that uses HTTP methods to manipulate resources.

\`\`\`javascript
// REST: Multiple endpoints, fixed responses
GET /users/123           // Get user
GET /users/123/posts     // Get user's posts
GET /users/123/followers // Get user's followers
\`\`\`

### REST Pros
- Simple and widely understood
- Excellent caching with HTTP standards
- Stateless by design
- Great tooling support

### REST Cons
- Over-fetching: Getting more data than needed
- Under-fetching: Multiple requests for related data
- Rigid response structure

---

## GraphQL: Query Language for APIs

GraphQL lets clients request exactly the data they need.

\`\`\`graphql
# GraphQL: Single endpoint, flexible queries
query {
  user(id: "123") {
    name
    email
    posts(limit: 5) {
      title
      createdAt
    }
    followersCount
  }
}
\`\`\`

### GraphQL Pros
- Fetch exactly what you need
- Single endpoint
- Strongly typed schema
- Great for complex, nested data

### GraphQL Cons
- Caching is more complex
- Steeper learning curve
- Potential for expensive queries
- More complex server implementation

---

## When to Use What

| Use Case | Recommendation |
|----------|----------------|
| Simple CRUD apps | REST |
| Mobile apps with limited bandwidth | GraphQL |
| Public APIs | REST |
| Complex, relational data | GraphQL |
| Microservices | REST or gRPC |
| Real-time subscriptions | GraphQL |

---

## Key Takeaways

- REST is simpler and better for basic CRUD operations
- GraphQL shines with complex, nested data requirements
- Consider your team's expertise and project needs
- You can use both in the same project!
`
}
