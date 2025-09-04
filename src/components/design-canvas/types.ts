import { LucideIcon } from "lucide-react"

export interface DesignComponent {
  id: number
  name: string
  icon: LucideIcon
  color: string
  category: string
}

export interface PlacedComponent {
  id: string
  type: number
  x: number
  y: number
}

export interface Edge {
  id: string
  fromId: string
  toId: string
  type: 'solid' | 'dashed' | 'dotted'
  curved: boolean
  controlPoint?: { x: number; y: number }
}

export interface Template {
  id: number
  name: string
  components: {
    id: number
    type: number
    x: number
    y: number
  }[]
}

export type ConnectionMode = 'none' | 'solid' | 'dashed' | 'dotted'