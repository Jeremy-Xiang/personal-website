<script setup lang="ts">
import { ref } from 'vue'
import { FEATURED_PROJECTS, QUANT_PROJECTS, QUANT_SHOWCASE_URL } from '../data/content'
import type { FeaturedProject } from '../types'
import SectionPanel from './SectionPanel.vue'
import ProjectModal from './ProjectModal.vue'

const modalProject = ref<FeaturedProject | null>(null)

function openModal(p: FeaturedProject, e: Event) {
  e.preventDefault()
  modalProject.value = p
}

function closeModal() {
  modalProject.value = null
}
</script>

<template>
  <SectionPanel id="projects">
    <h2 class="section-label">featured projects</h2>
    <p class="section-hint">click a card for details · double-click or use links inside modal to open live site</p>
    <div class="project-grid">
      <a
        v-for="p in FEATURED_PROJECTS"
        :key="p.id"
        href="#"
        class="project-card"
        :style="{ '--pa': p.accent || 'var(--accent)' }"
        @click="openModal(p, $event)"
      >
        <div class="project-card-top">
          <span class="project-name">{{ p.name }}</span>
          <span class="project-arrow">↗</span>
        </div>
        <p class="project-desc">{{ p.desc }}</p>
        <div class="tags">
          <span v-for="tag in p.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </a>
    </div>

    <div class="quant-head">
      <h3 class="quant-title">the quant series</h3>
      <a class="quant-all" :href="QUANT_SHOWCASE_URL" target="_blank" rel="noopener">full showcase ↗</a>
    </div>
    <p class="section-hint">six fastapi research services, built to plug into thesis's backend</p>
    <div class="quant-grid">
      <a
        v-for="q in QUANT_PROJECTS"
        :key="q.id"
        :href="q.repo"
        target="_blank"
        rel="noopener"
        class="quant-row"
      >
        <div class="quant-row-top">
          <span class="quant-name">{{ q.name }}</span>
          <span class="quant-arrow">↗</span>
        </div>
        <p class="quant-desc">{{ q.desc }}</p>
        <div class="tags">
          <span v-for="tag in q.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </a>
    </div>
  </SectionPanel>

  <ProjectModal :project="modalProject" @close="closeModal" />
</template>

<style scoped>
.section-hint {
  font-size: 0.82rem;
  color: var(--muted);
  margin-bottom: 1.25rem;
  font-weight: 300;
}

/* ── quant series ── */
.quant-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 14px;
  margin-top: 2.4rem;
  margin-bottom: 6px;
}
.quant-title {
  font-family: var(--font-m);
  font-size: 0.64rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent2);
  font-weight: 400;
}
.quant-all {
  font-family: var(--font-m);
  font-size: 0.66rem;
  letter-spacing: 0.06em;
  color: var(--accent);
  text-decoration: none;
  border: 1px solid rgba(110, 143, 255, 0.32);
  border-radius: 99px;
  padding: 0.32rem 0.85rem;
  transition: color 0.2s, border-color 0.2s, background 0.2s, box-shadow 0.2s;
}
.quant-all:hover {
  color: var(--accent2);
  border-color: var(--accent2);
  background: var(--accent-glow);
  box-shadow: 0 0 18px color-mix(in srgb, var(--accent) 20%, transparent);
}
.quant-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.quant-row {
  --qa: var(--accent2);
  display: block;
  text-decoration: none;
  color: inherit;
  border: 1px solid rgba(110, 143, 255, 0.1);
  border-left: 2px solid color-mix(in srgb, var(--qa) 40%, transparent);
  border-radius: 8px;
  padding: 0.85rem 1rem;
  background: rgba(110, 143, 255, 0.025);
  transition: transform 0.2s ease, border-color 0.2s, background 0.2s, box-shadow 0.2s;
}
/* star-temperature sequence: blue → white-violet → gold → orange → red → teal */
.quant-row:nth-child(1) { --qa: #8fb8ff; }
.quant-row:nth-child(2) { --qa: #b8a8ff; }
.quant-row:nth-child(3) { --qa: #e8c98a; }
.quant-row:nth-child(4) { --qa: #f0a883; }
.quant-row:nth-child(5) { --qa: #f08a8a; }
.quant-row:nth-child(6) { --qa: #8fd8c8; }
.quant-row:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--qa) 40%, transparent);
  border-left-color: var(--qa);
  background: color-mix(in srgb, var(--qa) 6%, transparent);
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.25), 0 0 18px color-mix(in srgb, var(--qa) 12%, transparent);
}
.quant-row-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.3rem;
}
.quant-name {
  font-family: var(--font-m);
  font-size: 0.78rem;
  color: var(--text);
  letter-spacing: 0.02em;
}
.quant-row:hover .quant-name {
  color: color-mix(in srgb, var(--qa) 65%, var(--text));
}
.quant-arrow {
  font-family: var(--font-m);
  font-size: 0.7rem;
  color: var(--qa);
  opacity: 0;
  transform: translate(-3px, 3px);
  transition: opacity 0.2s, transform 0.2s;
}
.quant-row:hover .quant-arrow {
  opacity: 1;
  transform: translate(0, 0);
}
.quant-desc {
  font-size: 0.8rem;
  color: var(--muted);
  line-height: 1.6;
  font-weight: 300;
  margin-bottom: 0.55rem;
}
@media (max-width: 640px) {
  .quant-grid {
    grid-template-columns: 1fr;
  }
}
</style>
