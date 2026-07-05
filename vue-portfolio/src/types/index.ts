export interface ConstellationStar {
  x: number
  y: number
  bright?: boolean
  faint?: boolean
}

export interface Constellation {
  name: string
  x: number
  y: number
  w: number
  h: number
  drift: number[]
  stars: ConstellationStar[]
  lines: [number, number][]
}

export interface NowItem {
  key: string
  html: string
}

export interface ExperienceEntry {
  id: string
  titleHtml: string
  metaHtml: string
  detail: string
  featured?: boolean
}

export interface Trait {
  glyph: string
  name: string
  desc: string
}

export interface ToolCard {
  icon: string
  title: string
  desc: string
  tags: string[]
}

export interface QuantProject {
  id: string
  name: string
  desc: string
  tags: string[]
  repo: string
}

export interface FeaturedProject {
  id: string
  name: string
  desc: string
  tags: string[]
  href: string
  accent?: string
  pageRoute?: string
  external?: boolean
  modalBody?: string
  liveUrl?: string
  highlights?: string[]
  extraLinks?: { label: string; href: string }[]
}
