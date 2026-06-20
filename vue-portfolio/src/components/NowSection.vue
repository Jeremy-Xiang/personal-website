<script setup lang="ts">
import { NOW_ITEMS } from '../data/content'
import SectionPanel from './SectionPanel.vue'
import { computed } from 'vue'

const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
const nowMeta = computed(() => {
  const d = new Date()
  return `last updated · ${months[d.getMonth()]} ${d.getFullYear()}`
})
</script>

<template>
  <SectionPanel id="now">
    <h2 class="section-label">now</h2>
    <div v-for="item in NOW_ITEMS" :key="item.key" class="now-item">
      <span class="now-key">{{ item.key }}</span>
      <span class="now-val" v-html="item.html" />
    </div>
    <div class="now-meta">{{ nowMeta }}</div>
  </SectionPanel>
</template>
