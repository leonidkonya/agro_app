export interface Plot {
  id: string
  name: string
  coordinates: [number, number][]
  area: number
  latitude: number
  longitude: number
  isDefault?: boolean
}

