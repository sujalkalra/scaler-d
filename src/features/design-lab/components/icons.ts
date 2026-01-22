import { 
  Monitor, Globe, Layers, Server, Cpu, Shield, Database, 
  Zap, MessageSquare, HardDrive, Search, Bell, BarChart3, FileText,
  LucideProps
} from 'lucide-react'
import { NodeType } from '../types'
import { forwardRef } from 'react'

export const nodeIcons: Record<NodeType, React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>> = {
  client: Monitor,
  cdn: Globe,
  load_balancer: Layers,
  api_gateway: Server,
  api_server: Cpu,
  auth_service: Shield,
  database: Database,
  cache: Zap,
  message_queue: MessageSquare,
  object_storage: HardDrive,
  search_engine: Search,
  notification_service: Bell,
  analytics: BarChart3,
  logging: FileText,
}
