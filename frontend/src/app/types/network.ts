export interface Network {
  ssid: string
  bssid: string
  authentication: string
  encryption: string
  signal: number
  quality: string
  channel: string
  security_level: string
  security_score: number
  suspicious: string[]
  scan_count: number
}