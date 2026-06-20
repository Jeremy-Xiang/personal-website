<script setup lang="ts">
import { TOOLS } from '../data/content'
import SectionPanel from './SectionPanel.vue'
</script>

<template>
  <SectionPanel id="tools" max-width="700px">
    <h2 class="section-label">tools</h2>
    <div class="tools-grid">
      <div v-for="tool in TOOLS" :key="tool.title" class="tool-card">
        <div class="tool-icon">{{ tool.icon }}</div>
        <h3>{{ tool.title }}</h3>
        <p>{{ tool.desc }}</p>
        <div class="tags">
          <span v-for="tag in tool.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>
    </div>
  </SectionPanel>
</template>
