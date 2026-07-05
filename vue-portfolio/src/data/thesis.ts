export const THESIS_STATS = [
  { label: 'Members tracked', value: '28', sub: 'across both chambers', accent: true },
  { label: 'Signal factors', value: '4', sub: 'cluster · committee · flow · recency' },
  { label: 'Disclosure window', value: '45d', sub: 'allowed by law' },
  { label: 'Views', value: '5', sub: 'tape · stocks · members · signals · ideas' },
]

export const THESIS_SCORE = [
  { icon: '⚭', title: 'Cluster buys', body: 'Multiple members buying the same ticker inside the window is the strongest tell — independent conviction, same conclusion.', weight: 'highest weight' },
  { icon: '⚖', title: 'Committee jurisdiction', body: 'A buy from a member whose committee oversees the sector counts extra. Access is the whole premise.', weight: 'high weight' },
  { icon: '∑', title: 'Net flow', body: 'Buys minus sells per ticker over the loaded window — direction and magnitude of congressional money.', weight: 'base signal' },
  { icon: '◷', title: 'Recency', body: 'A filing inside the last 14 days bumps the score. Old disclosures are already priced in.', weight: 'bonus' },
]

export const THESIS_VIEWS = [
  { name: 'the tape', body: 'Every disclosed trade in reverse-chronological order, each with its filing-lag bar — days used of the 45 allowed.' },
  { name: 'stocks', body: 'Per-ticker congressional flow: who is buying, who is selling, and how the net line trends.' },
  { name: 'members', body: 'Profiles with filing counts, committee seats, and one-year excess return vs the market.' },
  { name: 'signals', body: 'Tickers ranked by conviction score, with a plain-language "why" for every rank.' },
  { name: 'ideas', body: 'The watchlist layer — follow members, and get flagged when your follows converge on a ticker.' },
]

export const THESIS_STACK = ['react', 'vite', 'javascript', 'fraunces', 'ibm plex mono', 'vercel']

export const THESIS_DESIGN = [
  { title: 'Filing-lag bar', body: 'The signature visual. Every trade renders a bar showing how much of the legal 45-day disclosure window the member used before filing. Late filers are visible at a glance.' },
  { title: 'Terminal aesthetic', body: 'Dark, dense, monospaced data in IBM Plex Mono under a Fraunces serif wordmark — built to read like a trading terminal, not a news site.' },
  { title: 'Everything explains itself', body: 'No black-box scores. Each signal lists its reasons: how many members clustered, which committees are involved, how fresh the filings are.' },
]
