<script setup lang="ts">
import { usePanelReveal } from '../composables/useScroll3D'
import {
  THESIS_DESIGN,
  THESIS_SCORE,
  THESIS_STACK,
  THESIS_STATS,
  THESIS_VIEWS,
} from '../data/thesis'

usePanelReveal('.thesis-section')
</script>

<template>
  <main class="thesis-main">
    <RouterLink to="/" class="back-link">← back</RouterLink>

    <div class="thesis-hero">
      <div class="hero-eyebrow">project · 2025–2026</div>
      <h1>THESIS — <em>congressional<br>trading intelligence.</em></h1>
      <p>
        Members of Congress disclose their stock trades — up to 45 days late, buried in filings. THESIS decodes them into a terminal:
        who bought what, how late they filed it, and which tickers multiple members are converging on.
        <span class="thesis-tagline">28 members tracked · filing-lag analytics · conviction-ranked signals</span>
      </p>
      <div class="cta-row">
        <a href="https://thesis.jeremyxiang.com" target="_blank" rel="noopener" class="btn-primary">live terminal ↗</a>
        <a href="https://github.com/Jeremy-Xiang/thesis-dashboard-frontend" target="_blank" rel="noopener" class="btn-secondary">frontend ↗</a>
        <a href="https://github.com/Jeremy-Xiang/thesis-dashboard-api" target="_blank" rel="noopener" class="btn-secondary">backend ↗</a>
      </div>
    </div>

    <section class="thesis-section">
      <div class="section-label">at a glance</div>
      <p class="thesis-intro">Coverage and the constraint that shapes the whole product: the 45-day disclosure window.</p>
      <div class="stats-grid thesis-panel">
        <div v-for="s in THESIS_STATS" :key="s.label" class="stat-cell">
          <div class="stat-label">{{ s.label }}</div>
          <div class="stat-value" :class="{ acc: s.accent }">{{ s.value }}</div>
          <div class="stat-sub">{{ s.sub }}</div>
        </div>
      </div>
    </section>

    <section class="thesis-section">
      <div class="section-label">conviction score</div>
      <p class="thesis-intro">Every ticker gets a score, and every score explains itself. Four inputs, weighted by how hard they are to fake.</p>
      <div class="how-grid thesis-panel">
        <div v-for="cell in THESIS_SCORE" :key="cell.title" class="how-cell">
          <div class="how-icon">{{ cell.icon }}</div>
          <h3>{{ cell.title }}</h3>
          <p>{{ cell.body }}</p>
          <span class="score-weight">{{ cell.weight }}</span>
        </div>
      </div>
    </section>

    <section class="thesis-section">
      <div class="section-label">five views</div>
      <div class="thesis-panel">
        <div v-for="v in THESIS_VIEWS" :key="v.name" class="j-entry">
          <div class="j-title">{{ v.name }}</div>
          <div class="j-meta">{{ v.body }}</div>
        </div>
      </div>
    </section>

    <section class="thesis-section">
      <div class="section-label">design decisions</div>
      <div class="thesis-panel">
        <div v-for="d in THESIS_DESIGN" :key="d.title" class="j-entry">
          <div class="j-title">{{ d.title }}</div>
          <div class="j-meta">{{ d.body }}</div>
        </div>
      </div>
    </section>

    <section class="thesis-section">
      <div class="section-label">stack</div>
      <div class="stack-list thesis-panel">
        <span v-for="(tag, i) in THESIS_STACK" :key="tag" class="stack-tag" :class="{ hi: i < 3 }">{{ tag }}</span>
      </div>
    </section>

    <section class="thesis-section">
      <div class="section-label">where it came from</div>
      <div class="thesis-panel">
        <div class="j-entry">
          <div class="j-title">The predecessor</div>
          <div class="j-meta">
            THESIS grew out of a three-year thematic investing run — $15k to $400k+ — documented in the
            <RouterLink to="/investing" class="inline-link">investing case study</RouterLink>.
            The lesson from that run: the best signals come from people with better information. Congress files theirs in public.
          </div>
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
.score-weight {
  display: inline-block;
  margin-top: 0.55rem;
  font-family: var(--font-m);
  font-size: 0.6rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent);
  border: 1px solid var(--line-col);
  border-radius: 3px;
  padding: 0.1rem 0.45rem;
}
.inline-link { color: var(--accent); }
</style>
