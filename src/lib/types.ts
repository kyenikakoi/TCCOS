export type POIDirection = 'long' | 'short' | 'both'
export type POIStatus = 'draft' | 'active' | 'approaching' | 'triggered' | 'fulfilled' | 'invalidated'
export type RuleType = 'price_above' | 'price_below' | 'price_touch' | 'candle_close_above' | 'candle_close_below' | 'time_reached'
export type RuleLogic = 'AND' | 'OR'

export interface Tag {
  id: string
  name: string
  color: string
}

export interface POIRule {
  id: string
  poi_id: string
  rule_type: RuleType
  value: number
  timeframe?: string
  logic: RuleLogic
  order_index: number
}

export interface POI {
  id: string
  user_id: string
  symbol: string
  direction: POIDirection
  zone_high: number
  zone_low: number
  status: POIStatus
  notes?: string
  created_at: string
  updated_at: string
  tags?: Tag[]
  rules?: POIRule[]
}

export interface MarketEvent {
  id: string
  event_date: string
  currency: string
  title: string
  impact: 'low' | 'medium' | 'high'
  forecast?: string
  previous?: string
  actual?: string
}

export interface Notification {
  id: string
  user_id: string
  poi_id?: string
  title: string
  body: string
  read: boolean
  snoozed_until?: string
  created_at: string
}

export interface PushSubscription {
  id: string
  user_id: string
  endpoint: string
  p256dh: string
  auth: string
  created_at: string
}