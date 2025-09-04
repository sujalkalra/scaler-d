import { 
  Layers, Database, Server, Globe, Zap, MessageSquare, Shield, 
  Cloud, HardDrive, Cpu, Network, Lock, FileText, Users, 
  BarChart3, Settings, Webhook, GitBranch, Container, 
  Activity, Timer, Search, Mail, Bell, Upload
} from "lucide-react"
import { DesignComponent } from "./types"

export const designComponents: DesignComponent[] = [
  // Core Infrastructure
  { id: 1, name: "Load Balancer", icon: Layers, color: "bg-primary", category: "Infrastructure" },
  { id: 2, name: "Database", icon: Database, color: "bg-secondary", category: "Data Storage" },
  { id: 3, name: "API Gateway", icon: Server, color: "bg-success", category: "Infrastructure" },
  { id: 4, name: "CDN", icon: Globe, color: "bg-warning", category: "Infrastructure" },
  { id: 5, name: "Cache", icon: Zap, color: "bg-destructive", category: "Performance" },
  
  // Messaging & Communication
  { id: 6, name: "Message Queue", icon: MessageSquare, color: "bg-primary", category: "Messaging" },
  { id: 7, name: "Message Broker", icon: Network, color: "bg-secondary", category: "Messaging" },
  { id: 8, name: "Event Bus", icon: GitBranch, color: "bg-success", category: "Messaging" },
  { id: 9, name: "Notification Service", icon: Bell, color: "bg-warning", category: "Messaging" },
  { id: 10, name: "Email Service", icon: Mail, color: "bg-destructive", category: "Messaging" },
  
  // Security & Auth
  { id: 11, name: "Auth Service", icon: Shield, color: "bg-primary", category: "Security" },
  { id: 12, name: "Identity Provider", icon: Users, color: "bg-secondary", category: "Security" },
  { id: 13, name: "Encryption", icon: Lock, color: "bg-success", category: "Security" },
  { id: 14, name: "Firewall", icon: Shield, color: "bg-warning", category: "Security" },
  
  // Data Processing
  { id: 15, name: "Search Engine", icon: Search, color: "bg-primary", category: "Data Processing" },
  { id: 16, name: "Analytics", icon: BarChart3, color: "bg-secondary", category: "Data Processing" },
  { id: 17, name: "Data Warehouse", icon: HardDrive, color: "bg-success", category: "Data Storage" },
  { id: 18, name: "Stream Processor", icon: Activity, color: "bg-warning", category: "Data Processing" },
  { id: 19, name: "Batch Processor", icon: Timer, color: "bg-destructive", category: "Data Processing" },
  
  // Storage
  { id: 20, name: "Object Storage", icon: Container, color: "bg-primary", category: "Data Storage" },
  { id: 21, name: "File Storage", icon: FileText, color: "bg-secondary", category: "Data Storage" },
  { id: 22, name: "Blob Storage", icon: Upload, color: "bg-success", category: "Data Storage" },
  
  // Services
  { id: 23, name: "Microservice", icon: Cpu, color: "bg-primary", category: "Services" },
  { id: 24, name: "Web Server", icon: Server, color: "bg-secondary", category: "Services" },
  { id: 25, name: "API Service", icon: Webhook, color: "bg-success", category: "Services" },
  { id: 26, name: "Config Service", icon: Settings, color: "bg-warning", category: "Services" },
  
  // Cloud & Infrastructure
  { id: 27, name: "Cloud Function", icon: Cloud, color: "bg-primary", category: "Cloud" },
  { id: 28, name: "Container", icon: Container, color: "bg-secondary", category: "Cloud" },
  { id: 29, name: "Kubernetes", icon: Network, color: "bg-success", category: "Cloud" },
  { id: 30, name: "VM Instance", icon: Cpu, color: "bg-warning", category: "Cloud" },
]