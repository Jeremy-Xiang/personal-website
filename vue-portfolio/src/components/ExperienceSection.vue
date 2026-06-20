<script setup lang="ts">
import { computed, ref } from 'vue'
import { EXPERIENCE } from '../data/content'
import SectionPanel from './SectionPanel.vue'

const openId = ref<string | null>(null)
const showAll = ref(false)

const featured = computed(() => EXPERIENCE.filter((e) => e.featured))
const rest = computed(() => EXPERIENCE.filter((e) => !e.featured))
const visible = computed(() => (showAll.value ? EXPERIENCE : featured.value))

function toggle(id: string) {
  openId.value = openId.value === id ? null : id
}
</script>

<template>
  <SectionPanel id="experience">
    <h2 class="section-label">experience</h2>
    <p class="section-hint">click entries to expand</p>
    <div
      v-for="entry in visible"
      :key="entry.id"
      class="entry entry-clickable"
      :class="{ open: openId === entry.id, featured: entry.featured }"
      @click="toggle(entry.id)"
    >
      <div class="entry-title" v-html="entry.titleHtml" />
      <div class="entry-meta" v-html="entry.metaHtml" />
      <div class="entry-detail">{{ entry.detail }}</div>
    </div>
    <button
      v-if="rest.length && !showAll"
      type="button"
      class="view-all-btn"
      @click="showAll = true"
    >
      view all ({{ rest.length }} more)
    </button>
    <button
      v-else-if="rest.length && showAll"
      type="button"
      class="view-all-btn"
      @click="showAll = false"
    >
      show less
    </button>
  </SectionPanel>
</template>

<style scoped>
.section-hint {
  font-size: 0.82rem;
  color: var(--muted);
  margin-bottom: 1rem;
  font-weight: 300;
}

.view-all-btn {
  display: block;
  width: 100%;
  margin-top: 8px;
  padding: 12px 16px;
  background: transparent;
  border: 1px solid rgba(110, 143, 255, 0.2);
  border-radius: 6px;
  font-family: var(--font-m);
  font-size: 0.62rem;
  letter-spacing: 0.1em;
  text-transform: lowercase;
  color: var(--accent);
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}

.view-all-btn:hover {
  background: rgba(110, 143, 255, 0.06);
  border-color: rgba(110, 143, 255, 0.35);
}
</style>
