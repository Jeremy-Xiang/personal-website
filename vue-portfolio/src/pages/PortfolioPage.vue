<script setup lang="ts">
import { onMounted } from 'vue'
import {
  PORTFOLIO_HOW,
  PORTFOLIO_JOURNAL,
  PORTFOLIO_RETURNS,
  PORTFOLIO_SIGNALS,
  PORTFOLIO_STACK,
  PORTFOLIO_STATS,
} from '../data/portfolio'

onMounted(() => {
  requestAnimationFrame(() => {
    document.querySelectorAll<HTMLElement>('.bar-fill').forEach((el) => {
      const w = el.style.getPropertyValue('--w') || el.dataset.w || '0%'
      el.classList.add('loaded')
      el.style.width = w
    })
  })
})
</script>

<template>
  <main class="thesis-main">
    <RouterLink to="/" class="back-link">← back</RouterLink>

    <div class="thesis-hero">
      <div class="hero-eyebrow">portfolio showcase · 2023–2026</div>
      <h1>PORTFOLIO — <em>investing by<br>thesis, not ticker.</em></h1>
      <p>
        Three years of thematic investing — AI infrastructure, defense, energy transition, biodefense — backed by FinBERT sentiment scoring and Random Forest signals.
        <span class="thesis-tagline">$15k → $400k+ · 53 tickers · 5 themes · 300+ headlines scored per refresh</span>
      </p>
      <div class="cta-row">
        <RouterLink to="/thesis" class="btn-primary">see thesis, the follow-up project →</RouterLink>
      </div>
    </div>

    <section class="thesis-section">
      <div class="section-label">at a glance</div>
      <p class="thesis-intro">The numbers behind the portfolio — capital growth, coverage, and news processed on each refresh.</p>
      <div class="stats-grid thesis-panel">
        <div v-for="s in PORTFOLIO_STATS" :key="s.label" class="stat-cell">
          <div class="stat-label">{{ s.label }}</div>
          <div class="stat-value" :class="{ pos: s.positive, acc: s.accent }">{{ s.value }}</div>
          <div class="stat-sub">{{ s.sub }}</div>
        </div>
      </div>
    </section>

    <section class="thesis-section">
      <div class="section-label">theme returns</div>
      <p class="thesis-intro">Performance since inception, grouped by theme.</p>
      <div class="thesis-panel">
        <div v-for="r in PORTFOLIO_RETURNS" :key="r.theme" class="bar-row">
          <div class="bar-label">{{ r.theme }}<span>{{ r.tickers }}</span></div>
          <div class="bar-track">
            <div class="bar-fill" :style="{ background: r.color, width: r.width }" />
          </div>
          <div class="bar-pct" :class="{ pos: r.positive }" :style="!r.positive ? { color: '#ef4444' } : {}">{{ r.pct }}</div>
        </div>
      </div>
      <p class="thesis-note">Biodefense was initiated in Jan 2025 — early positioning ahead of the next outbreak cycle.</p>
    </section>

    <section class="thesis-section">
      <div class="section-label">prediction signals</div>
      <p class="thesis-intro">Weekly Random Forest estimates of 30-day outperformance vs SPY per theme.</p>
      <div class="signal-grid thesis-panel">
        <div v-for="sig in PORTFOLIO_SIGNALS" :key="sig.theme" class="sig-card" :class="sig.type">
          <div class="sig-theme">{{ sig.theme }}</div>
          <div class="sig-label" :class="sig.type">{{ sig.signal }}</div>
          <div class="sig-prob">{{ sig.prob }}% prob</div>
          <div class="sig-bar"><div class="sig-fill" :class="sig.type" :style="{ width: sig.prob + '%' }" /></div>
        </div>
      </div>
      <p class="thesis-note">Sample signals — live values update on the dashboard.</p>
    </section>

    <section class="thesis-section">
      <div class="section-label">how it works</div>
      <div class="how-grid thesis-panel">
        <div v-for="cell in PORTFOLIO_HOW" :key="cell.title" class="how-cell">
          <div class="how-icon">{{ cell.icon }}</div>
          <h3>{{ cell.title }}</h3>
          <p>{{ cell.body }}</p>
        </div>
      </div>
    </section>

    <section class="thesis-section">
      <div class="section-label">stack</div>
      <div class="stack-list thesis-panel">
        <span v-for="(tag, i) in PORTFOLIO_STACK" :key="tag" class="stack-tag" :class="{ hi: i < 4 }">{{ tag }}</span>
      </div>
    </section>

    <section class="thesis-section">
      <div class="section-label">thesis journal</div>
      <div class="thesis-panel">
        <div v-for="j in PORTFOLIO_JOURNAL" :key="j.title" class="j-entry">
          <div class="j-title">{{ j.title }}</div>
          <div class="j-meta">{{ j.body }}</div>
        </div>
      </div>
    </section>

    <footer class="t-footer" style="font-family:var(--font-m);font-size:.6rem;color:rgba(200,205,235,.22);display:flex;gap:40px;margin-top:4rem;padding-top:2rem;border-top:1px solid var(--border)">
      <span>© 2026 jeremy xiang</span>
      <RouterLink to="/" style="color:var(--muted);text-decoration:none">← back to home</RouterLink>
    </footer>
  </main>
</template>

<style scoped>
.hero-eyebrow {
  font-family: var(--font-m);
  font-size: 0.67rem;
  color: var(--accent);
  letter-spacing: 0.19em;
  text-transform: uppercase;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 14px;
}
.hero-eyebrow::before {
  content: '';
  width: 26px;
  height: 1px;
  background: var(--accent);
}
.btn-primary,
.btn-secondary {
  display: inline-flex;
  padding: 0.6rem 1.3rem;
  border-radius: 4px;
  font-family: var(--font-m);
  font-size: 0.74rem;
  letter-spacing: 0.05em;
  text-decoration: none;
}
.btn-primary { background: var(--accent); color: #fff; }
.btn-secondary { color: var(--muted); border: 1px solid var(--border); }
</style>
