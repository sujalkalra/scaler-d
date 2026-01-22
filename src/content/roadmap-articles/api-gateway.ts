import { RoadmapArticle } from "./index"

export const apiGatewayArticle: RoadmapArticle = {
  slug: "api-gateway",
  title: "What is an API Gateway?",
  author: "Ashish Pratap Singh",
  publishedDate: "2024-01-22",
  readTime: 12,
  difficulty: "Intermediate",
  category: "Infrastructure",
  tags: ["API Gateway", "Microservices", "Security", "Rate Limiting", "Load Balancing"],
  excerpt: "Learn how API Gateways act as the single entry point for your APIs, handling authentication, rate limiting, and request routing.",
  content: `
# What is an API Gateway?

**APIs**, or **Application Programming Interfaces**, are a set of rules and protocols that allows two software applications or services to communicate with each other.

As applications grow in size, the number of APIs increases too. Without the right tools and infrastructure, managing these APIs can quickly become a challenge.

This is where **API Gateway** comes into play.

> An API Gateway acts as a **central server** that sits between clients (e.g., browsers, mobile apps) and backend services.

Instead of clients interacting with multiple microservices directly, they send their requests to the API Gateway. The gateway processes these requests, enforces security, and forwards them to the appropriate microservices.

---

# 1. Why Do We Need an API Gateway?

Modern applications, especially those built using microservices architecture, have multiple backend services managing different functionalities.

For example, in an e-commerce service:
- One service handles **user accounts**
- Another handles **payments**
- Another manages **product inventory**

### Without an API Gateway:

- Clients would need to know the location and details of all backend services
- Developers would need to manage authentication, rate limiting, and security for each service individually

### With an API Gateway:

- Clients send all requests to one place – the API Gateway
- The API Gateway takes care of routing, authentication, security, and other operational tasks

---

# 2. Core Features of an API Gateway

### 1. Authentication and Authorization

API Gateway secures the backend systems by ensuring only authorized users can access backend services.

- **Authentication:** Verifying identity using tokens (OAuth, JWT), API keys, or certificates
- **Authorization:** Checking permissions to access specific services

### 2. Rate Limiting

To prevent abuse and ensure fair usage:
- Controls the frequency of requests a client can make
- Protects backend services from DoS attacks

> Example: A public API might allow 100 requests per minute per user.

### 3. Load Balancing

Distribute incoming requests evenly across multiple service instances:
- Redirect requests to healthy service instances
- Use algorithms like round-robin, least connections, or weighted distribution

### 4. Caching

Temporarily store frequently requested data:
- Responses to commonly accessed endpoints
- Static resources like images or metadata

### 5. Request Transformation

Modify requests for backend service compatibility:
- Convert XML responses to JSON for modern frontends
- Add or remove headers as needed

### 6. Service Discovery

Dynamically identify the appropriate backend service instance:
- Essential for environments where services frequently scale up or down

### 7. Circuit Breaking

Temporarily stop sending requests to failing services:
- Detects slow responses or timeouts
- Prevents cascading failures

### 8. Logging and Monitoring

Track and analyze system behavior:
- Log request source, destination, and response time
- Collect metrics like request rates and error rates

---

# 3. How Does an API Gateway Work?

Imagine you're using a food delivery app to order dinner.

### Step 1: Request Reception

When you tap "Place Order," the app sends a request to the **API Gateway** with:
- Your user ID
- Selected restaurant and menu items
- Delivery address
- Payment method
- Authentication tokens

### Step 2: Request Validation

The API Gateway validates:
- Required parameters are present
- Data is in the correct format
- Request conforms to expected structure

\`\`\`javascript
app.post('/api/v1/orders', async (req, res) => {
  if (!req.headers['content-type'].includes('application/json')) {
    return res.status(400).send('Invalid content type');
  }
  // Continue processing...
});
\`\`\`

### Step 3: Authentication & Authorization

\`\`\`javascript
const authenticateRequest = async (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  const user = await verifyToken(token);
  return user.permissions.includes('place_orders');
};
\`\`\`

### Step 4: Rate Limiting

\`\`\`javascript
const checkRateLimit = async (userId) => {
  const key = \`rate_limit:order:\${userId}\`;
  const current = await redis.incr(key);
  
  if (current === 1) {
    await redis.expire(key, 60); // 1 minute window
  }
  
  return current <= 10; // Allow 10 requests per minute
};
\`\`\`

### Step 5: Request Transformation

\`\`\`javascript
const transformRequest = async (originalRequest) => {
  const coordinates = await getCoordinatesFromAddress(
    originalRequest.deliveryAddress
  );
  
  return {
    orderId: originalRequest.orderId,
    deliveryLocation: {
      latitude: coordinates.lat,
      longitude: coordinates.lng
    }
  };
};
\`\`\`

### Step 6: Request Routing

The gateway routes to appropriate services:
- **Order Service:** Create a new order record
- **Inventory Service:** Check item availability
- **Payment Service:** Process payment
- **Delivery Service:** Assign a delivery driver

\`\`\`javascript
const routeRequest = async (req, serviceType) => {
  const services = await serviceDiscovery.getServices(serviceType);
  const targetService = selectServiceInstance(services);
  
  return await axios.post(
    \`\${targetService.url}/api/orders\`,
    req.body,
    { headers: req.headers }
  );
};
\`\`\`

### Step 7: Response Handling

\`\`\`javascript
const handleResponse = async (serviceResponse) => {
  const transformedResponse = {
    orderId: serviceResponse.order_reference,
    estimatedDelivery: serviceResponse.eta,
    status: serviceResponse.current_status
  };
  
  if (serviceResponse.cacheable) {
    await cacheResponse(transformedResponse.orderId, transformedResponse);
  }
  
  return transformedResponse;
};
\`\`\`

### Step 8: Logging & Monitoring

\`\`\`javascript
const logRequest = async (req, res, timing) => {
  await logger.log({
    timestamp: new Date(),
    path: req.path,
    method: req.method,
    responseTime: timing,
    statusCode: res.statusCode,
    userId: req.user?.id
  });
};
\`\`\`

---

## Popular API Gateways

| Gateway | Best For |
|---------|----------|
| Kong | Enterprise, plugins ecosystem |
| AWS API Gateway | AWS workloads |
| Nginx | High performance |
| Traefik | Container environments |
| Apigee | Large enterprises |

---

## Key Takeaways

- API Gateways are the single entry point for all client requests
- They handle cross-cutting concerns like auth, rate limiting, and logging
- Essential for microservices architectures
- Simplify both client interactions and backend management
- Choose based on your infrastructure and scale requirements
`
}
