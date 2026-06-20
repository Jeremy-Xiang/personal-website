<script setup lang="ts">
import { ref } from 'vue'
import { FEATURED_PROJECTS } from '../data/content'
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
</style>
