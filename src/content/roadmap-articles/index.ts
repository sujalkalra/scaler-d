// Article content registry - maps slugs to article data
// This makes it easy to add/edit articles without touching component code

export interface RoadmapArticle {
  slug: string
  title: string
  author: string
  publishedDate: string
  readTime: number
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  category: string
  tags: string[]
  excerpt: string
  content: string // Markdown content
  sourceUrl?: string // Citation link
  coverImage?: string
}

// Import all article content
import { apiArticle } from "./apis"
import { webhooksArticle } from "./webhooks"
import { restVsGraphqlArticle } from "./rest-vs-graphql"
import { apiGatewayArticle } from "./api-gateway"
import { loadBalancersArticle } from "./load-balancers"
import { loadBalancingAlgorithmsArticle } from "./load-balancing-algorithms"
import { proxyVsReverseProxyArticle } from "./proxy-vs-reverse-proxy"
import { scalabilityArticle } from "./scalability"
import { availabilityArticle } from "./availability"
import { spofArticle } from "./spof"
import { capTheoremArticle } from "./cap-theorem"
import { databaseTypesArticle } from "./database-types"
import { sqlVsNosqlArticle } from "./sql-vs-nosql"
import { acidTransactionsArticle } from "./acid-transactions"
import { databaseIndexesArticle } from "./database-indexes"
import { shardingVsPartitioningArticle } from "./sharding-vs-partitioning"
import { consistentHashingArticle } from "./consistent-hashing"
import { cdcArticle } from "./cdc"
import { cachingArticle } from "./caching"
import { cachingStrategiesArticle } from "./caching-strategies"
import { cacheEvictionArticle } from "./cache-eviction"
import { cdnArticle } from "./cdn"
import { rateLimitingArticle } from "./rate-limiting"
import { messageQueuesArticle } from "./message-queues"
import { bloomFiltersArticle } from "./bloom-filters"
import { idempotencyArticle } from "./idempotency"
import { concurrencyVsParallelismArticle } from "./concurrency-vs-parallelism"
import { statefulVsStatelessArticle } from "./stateful-vs-stateless"
import { longPollingVsWebsocketsArticle } from "./long-polling-vs-websockets"
import { batchVsStreamArticle } from "./batch-vs-stream"

// Registry of all articles by slug
export const roadmapArticles: Record<string, RoadmapArticle> = {
  "apis": apiArticle,
  "webhooks": webhooksArticle,
  "rest-vs-graphql": restVsGraphqlArticle,
  "api-gateway": apiGatewayArticle,
  "load-balancers": loadBalancersArticle,
  "load-balancing-algorithms": loadBalancingAlgorithmsArticle,
  "proxy-vs-reverse-proxy": proxyVsReverseProxyArticle,
  "scalability": scalabilityArticle,
  "availability": availabilityArticle,
  "spof": spofArticle,
  "cap-theorem": capTheoremArticle,
  "database-types": databaseTypesArticle,
  "sql-vs-nosql": sqlVsNosqlArticle,
  "acid-transactions": acidTransactionsArticle,
  "database-indexes": databaseIndexesArticle,
  "sharding-vs-partitioning": shardingVsPartitioningArticle,
  "consistent-hashing": consistentHashingArticle,
  "cdc": cdcArticle,
  "caching": cachingArticle,
  "caching-strategies": cachingStrategiesArticle,
  "cache-eviction": cacheEvictionArticle,
  "cdn": cdnArticle,
  "rate-limiting": rateLimitingArticle,
  "message-queues": messageQueuesArticle,
  "bloom-filters": bloomFiltersArticle,
  "idempotency": idempotencyArticle,
  "concurrency-vs-parallelism": concurrencyVsParallelismArticle,
  "stateful-vs-stateless": statefulVsStatelessArticle,
  "long-polling-vs-websockets": longPollingVsWebsocketsArticle,
  "batch-vs-stream": batchVsStreamArticle,
}

export function getArticleBySlug(slug: string): RoadmapArticle | undefined {
  return roadmapArticles[slug]
}

export function getAllArticleSlugs(): string[] {
  return Object.keys(roadmapArticles)
}
