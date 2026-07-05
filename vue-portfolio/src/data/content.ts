import type { Constellation, ExperienceEntry, FeaturedProject, NowItem, QuantProject, ToolCard, Trait } from '../types'

export const CONSTELLATIONS: Constellation[] = [
  { name: 'orion', x: 3, y: 14, w: 13, h: 16, drift: [18, -10, -12, 14, 10, -6, 35],
    stars: [{ x: 20, y: 15, bright: true }, { x: 80, y: 20, bright: true }, { x: 35, y: 50 }, { x: 50, y: 52 }, { x: 65, y: 54 }, { x: 25, y: 90, bright: true }, { x: 78, y: 88, bright: true }, { x: 48, y: 68, faint: true }],
    lines: [[0, 1], [0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6], [5, 6]] },
  { name: 'scorpius', x: 83, y: 16, w: 14, h: 13, drift: [-10, -12, 14, 10, -8, 14, 40],
    stars: [{ x: 10, y: 20 }, { x: 25, y: 10, bright: true }, { x: 42, y: 22 }, { x: 55, y: 45, bright: true }, { x: 68, y: 65 }, { x: 78, y: 82 }, { x: 90, y: 72, bright: true }, { x: 86, y: 58, faint: true }],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7]] },
  { name: 'cygnus', x: 35, y: 2, w: 14, h: 9, drift: [12, 8, -10, -10, 6, -6, 48],
    stars: [{ x: 50, y: 10, bright: true }, { x: 50, y: 40 }, { x: 50, y: 70, bright: true }, { x: 50, y: 95 }, { x: 15, y: 62, bright: true }, { x: 85, y: 62, bright: true }],
    lines: [[0, 1], [1, 2], [2, 3], [4, 2], [2, 5]] },
  { name: 'lyra', x: 18, y: 32, w: 8, h: 7, drift: [14, -6, -10, 8, 8, -10, 44],
    stars: [{ x: 50, y: 15, bright: true }, { x: 30, y: 45 }, { x: 70, y: 45 }, { x: 30, y: 80 }, { x: 70, y: 80 }],
    lines: [[0, 1], [0, 2], [1, 3], [2, 4], [3, 4]] },
  { name: 'aquila', x: 78, y: 38, w: 12, h: 10, drift: [-12, 10, 14, -8, -10, 6, 42],
    stars: [{ x: 50, y: 20, bright: true }, { x: 35, y: 10, faint: true }, { x: 62, y: 32, faint: true }, { x: 20, y: 55 }, { x: 80, y: 60 }, { x: 50, y: 90 }],
    lines: [[1, 0], [0, 2], [3, 0], [0, 4], [0, 5]] },
  { name: 'big-dipper', x: 42, y: 60, w: 16, h: 9, drift: [-14, 12, 16, -8, -10, 10, 46],
    stars: [{ x: 10, y: 50, bright: true }, { x: 30, y: 70, bright: true }, { x: 45, y: 30, bright: true }, { x: 25, y: 15, bright: true }, { x: 55, y: 50 }, { x: 75, y: 55 }, { x: 92, y: 40, bright: true }],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [5, 6]] },
  { name: 'cassiopeia', x: 3, y: 72, w: 14, h: 7, drift: [10, -8, -14, 10, 6, -12, 38],
    stars: [{ x: 5, y: 70, bright: true }, { x: 25, y: 30, bright: true }, { x: 50, y: 65 }, { x: 75, y: 25, bright: true }, { x: 95, y: 60, bright: true }],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4]] },
  { name: 'southern-cross', x: 82, y: 80, w: 10, h: 10, drift: [-8, 10, 12, -14, -6, 8, 50],
    stars: [{ x: 50, y: 10, bright: true }, { x: 50, y: 90, bright: true }, { x: 12, y: 55, bright: true }, { x: 88, y: 50, bright: true }, { x: 72, y: 72, faint: true }],
    lines: [[0, 1], [2, 3]] },
]

export const CONSTELLATION_NAMES: Record<string, string> = {
  orion: 'orion',
  scorpius: 'scorpius',
  cygnus: 'cygnus',
  lyra: 'lyra',
  aquila: 'aquila',
  'big-dipper': 'ursa major',
  cassiopeia: 'cassiopeia',
  'southern-cross': 'crux',
}

export const NAV_SECTIONS = ['now', 'projects', 'experience', 'leadership', 'tools', 'contact'] as const

export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    id: 'thesis',
    name: 'THESIS',
    desc: 'Congressional trading intelligence — filings decoded into conviction-ranked signals across 28 tracked members.',
    tags: ['react', 'vite', 'data viz'],
    href: '/thesis',
    accent: '#4ade80',
    pageRoute: '/thesis',
    modalBody: 'A terminal-style dashboard that turns congressional stock disclosures into something readable: who bought what, how late they filed it, and which tickers multiple members are converging on. Conviction scoring weighs cluster buys, committee jurisdiction, and filing recency.',
    liveUrl: 'https://thesis.jeremyxiang.com',
    highlights: [
      '28 members tracked · 5 views (tape, stocks, members, signals, ideas)',
      'Filing-lag bar on every trade — days used of the 45 allowed',
      'Conviction score: cluster buys + committee jurisdiction + recency',
    ],
    extraLinks: [
      { label: 'frontend', href: 'https://github.com/Jeremy-Xiang/thesis-dashboard-frontend' },
      { label: 'backend', href: 'https://github.com/Jeremy-Xiang/thesis-dashboard-api' },
    ],
  },
  {
    id: 'lab',
    name: 'THE LAYERING LAB',
    desc: 'Fragrance layering engine — 439+ fragrances scored for pairing compatibility, with community voting.',
    tags: ['javascript', 'supabase', 'seo'],
    href: 'https://lab.jeremyxiang.com',
    accent: '#e8b45a',
    external: true,
    modalBody: 'A compatibility engine for fragrance layering. Every pairing is scored through a scent-family affinity matrix with diversity-aware ranking, and the community votes combos up or down through Supabase. Ships with 29 SEO landing pages for individual fragrances.',
    liveUrl: 'https://lab.jeremyxiang.com',
    highlights: [
      '439+ fragrances in the pairing database',
      'Scoring engine: family affinity matrix + diversity-aware ranking',
      'Community voting via Supabase · 29 SEO pages',
    ],
    extraLinks: [
      { label: 'source', href: 'https://github.com/Jeremy-Xiang/Layering-Lab' },
    ],
  },
  {
    id: 'portfolio',
    name: 'PORTFOLIO',
    desc: 'Thematic investing showcase — $15k → $400k+ over 3 years, with FinBERT sentiment and ML signals.',
    tags: ['python', 'finbert', 'scikit-learn'],
    href: '/portfolio',
    accent: '#6e8fff',
    pageRoute: '/portfolio',
    modalBody: 'Three years of investing organized by thesis, not ticker — AI infrastructure, defense, energy transition, biodefense. FinBERT scored 300+ headlines per refresh; Random Forest models flagged 30-day outperformance vs SPY. The full case study lives on its own page.',
    highlights: [
      '$15k → $400k+ over 3 years',
      '53 tickers · 5 themes',
      'Theme returns, prediction signals, and the full thesis journal',
    ],
  },
]

export const QUANT_SHOWCASE_URL = 'https://portfolio-showcase-five-chi.vercel.app/'

export const QUANT_PROJECTS: QuantProject[] = [
  {
    id: 'alpha-factor',
    name: 'alpha-factor-pipeline',
    desc: '17-factor library → IC analysis → walk-forward gradient boosting → long-short backtest, reported net of costs.',
    tags: ['scikit-learn', 'backtesting'],
    repo: 'https://github.com/Jeremy-Xiang/Alpha-Factor-Pipeline',
  },
  {
    id: 'multi-agent',
    name: 'multi-agent-analyst',
    desc: 'Supervisor agent coordinates three one-source subagents (technical, fundamental, sentiment) into one thesis with a full audit trail.',
    tags: ['claude api', 'tool use'],
    repo: 'https://github.com/Jeremy-Xiang/Multi-Agent-Analyst',
  },
  {
    id: 'filings',
    name: 'filings-assistant',
    desc: 'Citation-grounded Q&A over filings and earnings calls. Refuses when retrieval comes back empty instead of guessing.',
    tags: ['rag', 'tf-idf', 'claude api'],
    repo: 'https://github.com/Jeremy-Xiang/Filings-Assistant',
  },
  {
    id: 'screener',
    name: 'screener-alerts',
    desc: 'Event-based technical screener — fires on the crossover day, not every day after — with pluggable notifiers.',
    tags: ['apscheduler', 'webhooks'],
    repo: 'https://github.com/Jeremy-Xiang/Screener-Alerts',
  },
  {
    id: 'forecast',
    name: 'stock-forecast-bench',
    desc: 'Four next-day OHLC models vs naive persistence under strict walk-forward validation. Two lose to the baseline.',
    tags: ['scikit-learn', 'walk-forward'],
    repo: 'https://github.com/Jeremy-Xiang/Stock-Forecast',
  },
  {
    id: 'clustering',
    name: 'ticker-clustering',
    desc: 'Clusters tickers by behavior (return, volatility, momentum, liquidity) instead of sector label, mapped in 2D via PCA.',
    tags: ['k-means', 'pca'],
    repo: 'https://github.com/Jeremy-Xiang/Ticker-Clustering',
  },
]

export const NOW_ITEMS: NowItem[] = [
  { key: 'learning', html: 'machine learning fundamentals — the math underneath the models' },
  { key: 'building', html: 'a <a href="https://github.com/Jeremy-Xiang/Portfolio-Showcase" target="_blank" rel="noopener">six-part quant research series</a> for <a href="/thesis">thesis</a> · <a href="https://lab.jeremyxiang.com" target="_blank" rel="noopener">the layering lab</a> — fragrance pairing engine' },
  { key: 'reading', html: '<em>thinking, fast and slow</em> — daniel kahneman<span class="read-bar" title="~70% through"><span class="read-fill" style="width:70%"></span></span>' },
  { key: 'exploring', html: 'what content creation might look like over the summer' },
  { key: 'on the side', html: 'staying sharp in valorant (top 1%) — aim and economics have more in common than you\'d think' },
]

export const EXPERIENCE: ExperienceEntry[] = [
  {
    id: 'quant-series',
    featured: true,
    titleHtml: 'built a <a href="https://github.com/Jeremy-Xiang/Portfolio-Showcase" target="_blank" rel="noopener">six-part quant research series</a> — factor pipeline, multi-agent analyst, filings RAG, and more',
    metaHtml: '2026 · python, fastapi, claude api · <a href="https://portfolio-showcase-five-chi.vercel.app/" target="_blank" rel="noopener">showcase ↗</a>',
    detail: 'Six FastAPI services built to mount into THESIS\'s backend: a 17-factor alpha pipeline with walk-forward boosting, a supervisor/subagent analyst with audit trails, citation-grounded filings Q&A, an event-based screener, a forecast benchmark, and behavioral ticker clustering.',
  },
  {
    id: 'lab',
    featured: true,
    titleHtml: 'built <a href="https://lab.jeremyxiang.com" target="_blank" rel="noopener">THE LAYERING LAB</a> — a fragrance layering compatibility engine with community voting',
    metaHtml: '2026 · javascript, supabase, seo · <a href="https://lab.jeremyxiang.com" target="_blank" rel="noopener">live ↗</a>',
    detail: '439+ fragrances scored for pairing through a scent-family affinity matrix with diversity-aware ranking. Community voting runs on Supabase; 29 SEO pages drive organic search traffic.',
  },
  {
    id: 'thesis',
    featured: true,
    titleHtml: 'built <a href="/thesis">THESIS</a> — a congressional trading intelligence dashboard with conviction-ranked signals',
    metaHtml: '2025–2026 · react, vite · <a href="https://thesis.jeremyxiang.com" target="_blank" rel="noopener">live ↗</a>',
    detail: 'Decodes congressional stock disclosures: 28 tracked members, filing-lag analytics against the 45-day window, and a conviction score built from cluster buys, committee jurisdiction, and recency.',
  },
  {
    id: 'investing',
    featured: true,
    titleHtml: 'grew a thematic <a href="/portfolio">investment portfolio</a> from $15k to $400k+ over 3 years',
    metaHtml: '2023–2026 · python, finbert, scikit-learn · <a href="/portfolio">case study ↗</a>',
    detail: 'Organized by thesis, not ticker — AI infrastructure, defense, energy transition, biodefense. FinBERT scored 300+ headlines per refresh; Random Forest models flagged 30-day SPY outperformance.',
  },
  {
    id: 'website',
    featured: true,
    titleHtml: 'designed and built this personal website from scratch',
    metaHtml: '2026 · vue, typescript, vite',
    detail: '3D starfield with mouse parallax, constellation overlay, scroll-driven depth panels, and component-based architecture — migrated from a single HTML file.',
  },
  {
    id: 'codaworx',
    featured: true,
    titleHtml: 'presented a <a href="https://coda-five.vercel.app/" target="_blank" rel="noopener">product strategy</a> for <a href="https://codaworx.com/" target="_blank" rel="noopener">codaworx</a> at the PMC case competition',
    metaHtml: '2026 · RICE scoring, vercel',
    detail: 'Prioritized a feature roadmap using RICE scoring and presented a go-to-market strategy at UW–Madison\'s Product Management Club case competition.',
  },
  {
    id: 'inspirit',
    titleHtml: 'co-authored an NLP paper on word-reading time prediction at <a href="https://www.inspiritai.com/" target="_blank" rel="noopener">inspirit ai</a>',
    metaHtml: 'aug 2023 – jan 2024 · <a href="/Xiang_WordReadingTime_Paper.pdf" target="_blank" rel="noopener">read paper ↗</a>',
    detail: 'Regression models predicting per-word reading time from syntactic and frequency features; compared logistic regression, random forest, and gradient boosting.',
  },
  {
    id: 'stroke',
    titleHtml: 'built <a href="https://jeremy-xiang.github.io" target="_blank" rel="noopener">ML models for stroke risk prediction</a> with interactive web tool',
    metaHtml: '2023 · python, pandas, classification',
    detail: 'Trained logistic regression, decision tree, and random forest classifiers on the Kaggle stroke dataset. Interactive prediction tool on GitHub Pages.',
  },
  {
    id: 'intel',
    titleHtml: 'shadowed chip design engineers on PPA research at <a href="https://www.intel.com/" target="_blank" rel="noopener">intel</a>',
    metaHtml: 'may 2022 – aug 2022 · engineering shadow',
    detail: 'Observed PPA optimization workflows on next-gen silicon at Intel. Early exposure to the engineering tradeoffs behind modern CPU design.',
  },
]

export const TRAITS: Trait[] = [
  { glyph: '✦', name: 'curious', desc: 'ask why, then ask again' },
  { glyph: '◈', name: 'adaptable', desc: 'good at finding footing' },
  { glyph: '✣', name: 'collaborative', desc: 'comfortable across teams' },
  { glyph: '❖', name: 'resilient', desc: 'eagle scout, heroism award' },
  { glyph: '✧', name: 'composed', desc: 'steady under pressure' },
  { glyph: '✶', name: 'patient', desc: 'good things take time' },
  { glyph: '❋', name: 'passionate', desc: 'obsessive about what i love' },
]

export const TOOLS: ToolCard[] = [
  { icon: '⟨/⟩', title: 'languages', desc: 'from systems-level C/C++ to typescript and python.', tags: ['typescript', 'python', 'java', 'c / c++'] },
  { icon: 'λ', title: 'machine learning', desc: 'classification, nlp, and data exploration.', tags: ['pandas', 'scikit-learn', 'finbert', 'nlp'] },
  { icon: '◉', title: 'web & backend', desc: 'full-stack apps shipped on vercel and firebase.', tags: ['fastapi', 'react', 'vue', 'vercel', 'render'] },
  { icon: '∑', title: 'economics', desc: 'intermediate micro, macro, and econometrics.', tags: ['microeconomics', 'macroeconomics', 'statistics', 'latex'] },
  { icon: '⌘', title: 'workflow', desc: 'the everyday stack for shipping and reviewing.', tags: ['git', 'vs code', 'figma', 'android studio'] },
  { icon: '✎', title: 'spoken', desc: 'happy to hold a conversation in any of three.', tags: ['english', 'mandarin', 'spanish'] },
]
