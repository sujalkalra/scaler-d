import { NodeMetadata, NodeType } from '../types'

export const nodeDefinitions: Record<NodeType, NodeMetadata> = {
  client: {
    nodeType: 'client',
    label: 'Client',
    description: 'End-user device (browser, mobile app) that initiates requests to your system.',
    icon: 'Monitor',
    color: '#6366f1', // Indigo
    category: 'client',
    constraints: {
      canConnectTo: ['cdn', 'load_balancer', 'api_gateway'],
      cannotConnectTo: ['database', 'cache', 'message_queue', 'object_storage'],
    },
    tips: [
      'Clients should never connect directly to databases',
      'Use CDN for static assets',
      'Consider using WebSocket for real-time features',
    ],
  },
  
  cdn: {
    nodeType: 'cdn',
    label: 'CDN',
    description: 'Content Delivery Network that caches static assets at edge locations closer to users.',
    icon: 'Globe',
    color: '#8b5cf6', // Purple
    category: 'network',
    constraints: {
      canConnectTo: ['load_balancer', 'api_gateway', 'object_storage'],
      cannotConnectTo: ['database', 'cache', 'message_queue'],
    },
    tips: [
      'Great for static assets (images, CSS, JS)',
      'Reduces latency for geographically distributed users',
      'Can cache API responses for read-heavy workloads',
    ],
    learnMore: '/roadmap/cdn',
  },
  
  load_balancer: {
    nodeType: 'load_balancer',
    label: 'Load Balancer',
    description: 'Distributes incoming traffic across multiple servers to ensure reliability and scalability.',
    icon: 'Layers',
    color: '#0ea5e9', // Sky
    category: 'network',
    constraints: {
      canConnectTo: ['api_server', 'api_gateway', 'auth_service'],
      cannotConnectTo: ['database', 'object_storage'],
    },
    tips: [
      'Use health checks to route traffic to healthy instances',
      'Consider sticky sessions for stateful applications',
      'Round-robin is simplest, least-connections for varying load',
    ],
    learnMore: '/roadmap/load-balancers',
  },
  
  api_gateway: {
    nodeType: 'api_gateway',
    label: 'API Gateway',
    description: 'Single entry point that handles routing, authentication, rate limiting, and request transformation.',
    icon: 'Server',
    color: '#10b981', // Emerald
    category: 'network',
    constraints: {
      canConnectTo: ['api_server', 'auth_service', 'cache', 'message_queue'],
      cannotConnectTo: ['database'],
    },
    tips: [
      'Centralize cross-cutting concerns (auth, logging, rate limiting)',
      'Can aggregate multiple microservice responses',
      'Useful for API versioning',
    ],
    learnMore: '/roadmap/api-gateway',
  },
  
  api_server: {
    nodeType: 'api_server',
    label: 'API Server',
    description: 'Application server that processes business logic and handles API requests.',
    icon: 'Cpu',
    color: '#14b8a6', // Teal
    category: 'compute',
    constraints: {
      canConnectTo: ['database', 'cache', 'message_queue', 'object_storage', 'auth_service', 'search_engine', 'notification_service', 'analytics', 'logging'],
      cannotConnectTo: ['client', 'cdn'],
    },
    tips: [
      'Keep stateless for horizontal scaling',
      'Use connection pooling for database connections',
      'Implement circuit breakers for resilience',
    ],
    learnMore: '/roadmap/apis',
  },
  
  auth_service: {
    nodeType: 'auth_service',
    label: 'Auth Service',
    description: 'Handles user authentication, authorization, and session management.',
    icon: 'Shield',
    color: '#f59e0b', // Amber
    category: 'compute',
    constraints: {
      canConnectTo: ['database', 'cache'],
      cannotConnectTo: ['client', 'cdn', 'object_storage', 'message_queue'],
    },
    tips: [
      'Use JWT for stateless authentication',
      'Store sessions in Redis for distributed systems',
      'Implement rate limiting to prevent brute force',
    ],
  },
  
  database: {
    nodeType: 'database',
    label: 'Database',
    description: 'Persistent storage for structured data (SQL or NoSQL).',
    icon: 'Database',
    color: '#ef4444', // Red
    category: 'storage',
    constraints: {
      canConnectTo: ['database'], // For replication
      cannotConnectTo: ['client', 'cdn', 'load_balancer'],
    },
    tips: [
      'Use read replicas for read-heavy workloads',
      'Consider sharding for massive scale',
      'Always have backups and recovery procedures',
    ],
    learnMore: '/roadmap/database-types',
  },
  
  cache: {
    nodeType: 'cache',
    label: 'Cache (Redis)',
    description: 'In-memory data store for frequently accessed data to reduce database load.',
    icon: 'Zap',
    color: '#dc2626', // Red-600
    category: 'storage',
    constraints: {
      canConnectTo: ['database'],
      cannotConnectTo: ['client', 'cdn', 'load_balancer'],
    },
    tips: [
      'Cache invalidation is one of the hardest problems',
      'Use TTL to prevent stale data',
      'Consider cache-aside vs write-through patterns',
    ],
    learnMore: '/roadmap/caching',
  },
  
  message_queue: {
    nodeType: 'message_queue',
    label: 'Message Queue',
    description: 'Async communication between services using publish/subscribe or point-to-point messaging.',
    icon: 'MessageSquare',
    color: '#7c3aed', // Violet
    category: 'messaging',
    constraints: {
      canConnectTo: ['api_server', 'notification_service', 'analytics'],
      cannotConnectTo: ['client', 'cdn', 'database'],
    },
    tips: [
      'Use for decoupling services',
      'Great for handling traffic spikes',
      'Ensure idempotent consumers',
    ],
    learnMore: '/roadmap/message-queues',
  },
  
  object_storage: {
    nodeType: 'object_storage',
    label: 'Object Storage',
    description: 'Scalable storage for unstructured data like images, videos, and files.',
    icon: 'HardDrive',
    color: '#f97316', // Orange
    category: 'storage',
    constraints: {
      canConnectTo: ['cdn'],
      cannotConnectTo: ['client', 'load_balancer', 'database'],
    },
    tips: [
      'Use signed URLs for secure access',
      'Enable CDN for public assets',
      'Consider lifecycle policies for cost optimization',
    ],
  },
  
  search_engine: {
    nodeType: 'search_engine',
    label: 'Search Engine',
    description: 'Full-text search service (Elasticsearch, Algolia) for fast and relevant search results.',
    icon: 'Search',
    color: '#22c55e', // Green
    category: 'compute',
    constraints: {
      canConnectTo: [],
      cannotConnectTo: ['client', 'cdn', 'load_balancer', 'database'],
    },
    tips: [
      'Index only what you need to search',
      'Use async sync from primary database',
      'Consider relevance tuning for better results',
    ],
  },
  
  notification_service: {
    nodeType: 'notification_service',
    label: 'Notification Service',
    description: 'Handles push notifications, emails, SMS, and in-app notifications.',
    icon: 'Bell',
    color: '#ec4899', // Pink
    category: 'messaging',
    constraints: {
      canConnectTo: ['message_queue'],
      cannotConnectTo: ['client', 'cdn', 'database'],
    },
    tips: [
      'Use message queue for reliability',
      'Implement retry logic with backoff',
      'Track delivery status',
    ],
  },
  
  analytics: {
    nodeType: 'analytics',
    label: 'Analytics',
    description: 'Collects and processes metrics, logs, and user behavior data.',
    icon: 'BarChart3',
    color: '#3b82f6', // Blue
    category: 'monitoring',
    constraints: {
      canConnectTo: ['database', 'object_storage'],
      cannotConnectTo: ['client', 'cdn', 'load_balancer'],
    },
    tips: [
      'Use sampling for high-volume data',
      'Store raw events for flexibility',
      'Consider real-time vs batch processing needs',
    ],
  },
  
  logging: {
    nodeType: 'logging',
    label: 'Logging',
    description: 'Centralized log aggregation and monitoring (ELK, Datadog, etc.).',
    icon: 'FileText',
    color: '#64748b', // Slate
    category: 'monitoring',
    constraints: {
      canConnectTo: ['object_storage'],
      cannotConnectTo: ['client', 'cdn', 'database'],
    },
    tips: [
      'Use structured logging (JSON)',
      'Include correlation IDs for tracing',
      'Set up alerts for critical errors',
    ],
  },
}

// Group nodes by category for sidebar
export const nodesByCategory = Object.values(nodeDefinitions).reduce((acc, node) => {
  if (!acc[node.category]) {
    acc[node.category] = []
  }
  acc[node.category].push(node)
  return acc
}, {} as Record<string, NodeMetadata[]>)

export const categoryLabels: Record<string, string> = {
  client: 'Clients',
  network: 'Network Layer',
  compute: 'Compute',
  storage: 'Storage',
  messaging: 'Messaging',
  monitoring: 'Monitoring',
}
