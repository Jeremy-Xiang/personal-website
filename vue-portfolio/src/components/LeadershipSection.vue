<script setup lang="ts">
import { TRAITS } from '../data/content'
import SectionPanel from './SectionPanel.vue'
</script>

<template>
  <SectionPanel id="leadership">
    <h2 class="section-label">leadership</h2>
    <div class="entry">
      <div class="entry-title">senior patrol leader · eagle scout</div>
      <div class="entry-meta">boy scouts of america · 2018 – 2023</div>
    </div>
    <div class="entry">
      <div class="entry-title">recipient of the BSA heroism award</div>
      <div class="entry-meta">boy scouts of america</div>
    </div>
    <div style="margin-top: 24px">
      <h2 class="section-label" id="traits">traits</h2>
      <div class="traits-grid">
        <div v-for="t in TRAITS" :key="t.name" class="trait">
          <div class="trait-glyph">{{ t.glyph }}</div>
          <div class="trait-name">{{ t.name }}</div>
          <div class="trait-desc">{{ t.desc }}</div>
        </div>
      </div>
    </div>
  </SectionPanel>
</template>
