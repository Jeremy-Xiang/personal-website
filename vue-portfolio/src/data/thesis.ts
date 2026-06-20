export const THESIS_STATS = [
  { label: 'Starting capital', value: '$15k', sub: 'Jan 2023', accent: true },
  { label: 'Peak value', value: '$400k+', sub: '3-year thesis return', positive: true },
  { label: 'Tickers tracked', value: '53', sub: 'across 5 themes' },
  { label: 'News scored daily', value: '300+', sub: 'scored per refresh' },
]

export const THESIS_RETURNS = [
  { theme: 'AI Infrastructure', tickers: 'NVDA, AMD, TSM, MSFT…', pct: '+274.6%', width: '85%', color: '#60a5fa', positive: true },
  { theme: 'Energy Transition', tickers: 'CEG, VST, NEE, FSLR…', pct: '+362.2%', width: '100%', color: '#4ade80', positive: true },
  { theme: 'Defense', tickers: 'LMT, RTX, PLTR, KTOS…', pct: '+202.9%', width: '64%', color: '#f97316', positive: true },
  { theme: 'Healthcare', tickers: 'UNH, TMO, ISRG, DHR…', pct: '+0.1%', width: '12%', color: '#f472b6', positive: true },
  { theme: 'Biodefense', tickers: 'MRNA, SIGA, ILMN, GILD…', pct: '−16.8%', width: '20%', color: '#c084fc', positive: false },
]

export const THESIS_SIGNALS = [
  { theme: 'AI', signal: 'BUY', prob: 72, type: 'buy' as const },
  { theme: 'DEF', signal: 'HOLD', prob: 54, type: 'hold' as const },
  { theme: 'NRG', signal: 'BUY', prob: 68, type: 'buy' as const },
  { theme: 'BIO', signal: 'HOLD', prob: 51, type: 'hold' as const },
  { theme: 'MED', signal: 'HOLD', prob: 48, type: 'hold' as const },
]

export const THESIS_HOW = [
  { icon: '◈', title: 'Theme buckets, not tickers', body: 'The portfolio is organized around theses — like "AI infrastructure is undersupplied" — not single stocks.' },
  { icon: 'λ', title: 'Daily NLP on headlines', body: 'Headlines from Yahoo Finance, CNBC, WSJ, ProMED, CDC alerts, and Breaking Defense scored with FinBERT.' },
  { icon: '∑', title: 'Random Forest signals', body: 'Models train on three years of daily prices using momentum, volatility, and relative-return features.' },
  { icon: '◉', title: 'Biodefense monitoring', body: 'ProMED outbreak reports, WHO news, and CDC alerts feed the biodefense thesis.' },
]

export const THESIS_STACK = ['python', 'fastapi', 'scikit-learn', 'react', 'yfinance', 'pandas', 'finbert', 'recharts', 'render', 'vercel']

export const THESIS_JOURNAL = [
  { title: 'Jan 2023 — AI Infrastructure', body: 'Opened with NVDA on the thesis that AI training compute would stay undersupplied for years.' },
  { title: 'Apr 2023 — Defense', body: 'Added LMT and RTX after Ukraine exposed Western stockpile gaps.' },
  { title: 'Sep 2024 — Energy Transition', body: 'Started a nuclear basket (CEG, VST). AI data-center demand pointed to baseload power.' },
  { title: 'Jan 2025 — Biodefense', body: 'Opened around mRNA platforms and SIGA — the only FDA-approved smallpox antiviral.' },
  { title: 'Mar 2025 — Healthcare Infrastructure', body: 'Added TMO and DHR as lab-infrastructure picks-and-shovels.' },
]
