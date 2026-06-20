<script setup lang="ts">
import { ref } from 'vue'
import { EXPERIENCE } from '../data/content'
import SectionPanel from './SectionPanel.vue'

const openId = ref<string | null>(null)

function toggle(id: string) {
  openId.value = openId.value === id ? null : id
}
</script>

<template>
  <SectionPanel id="experience">
    <h2 class="section-label">experience</h2>
    <p class="section-hint">click cards to expand</p>
    <div
      v-for="entry in EXPERIENCE"
      :key="entry.id"
      class="entry entry-clickable"
      :class="{ open: openId === entry.id, featured: entry.featured }"
      @click="toggle(entry.id)"
    >
      <div class="entry-title" v-html="entry.titleHtml" />
      <div class="entry-meta" v-html="entry.metaHtml" />
      <div class="entry-detail">{{ entry.detail }}</div>
    </div>
  </SectionPanel>
</template>

<style scoped>
.section-hint {
  font-size: 0.82rem;
  color: var(--muted);
  margin-bottom: 1rem;
  font-weight: 300;
}
</style>
