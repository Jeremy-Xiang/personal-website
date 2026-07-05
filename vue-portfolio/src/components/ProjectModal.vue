<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { FeaturedProject } from '../types'

defineProps<{
  project: FeaturedProject | null
}>()

const emit = defineEmits<{ close: [] }>()

function onBackdrop(e: MouseEvent) {
  if ((e.target as HTMLElement).classList.contains('modal-backdrop')) emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="project" class="modal-backdrop" @click="onBackdrop">
        <div class="modal-sheet" role="dialog" aria-modal="true" :aria-label="project.name">
          <button type="button" class="modal-close" aria-label="Close" @click="emit('close')">×</button>

          <div class="modal-header">
            <span class="project-name">{{ project.name }}</span>
            <div class="tags">
              <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>

          <p class="modal-body">{{ project.modalBody || project.desc }}</p>

          <ul v-if="project.highlights?.length" class="modal-highlights">
            <li v-for="(h, i) in project.highlights" :key="i">{{ h }}</li>
          </ul>

          <div class="modal-actions">
            <a
              v-if="project.liveUrl"
              :href="project.liveUrl"
              class="btn-primary"
              target="_blank"
              rel="noopener"
            >
              live ↗
            </a>
            <RouterLink v-if="project.pageRoute" :to="project.pageRoute" class="btn-secondary" @click="emit('close')">
              full project page
            </RouterLink>
            <a
              v-for="link in project.extraLinks || []"
              :key="link.href"
              :href="link.href"
              class="btn-secondary"
              target="_blank"
              rel="noopener"
            >
              {{ link.label }} ↗
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 500;
  background: rgba(4, 5, 12, 0.72);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 24px;
}
.modal-sheet {
  width: min(560px, 100%);
  max-height: 85vh;
  overflow-y: auto;
  background: rgba(11, 14, 28, 0.95);
  border: 1px solid rgba(110, 143, 255, 0.25);
  border-radius: 14px 14px 10px 10px;
  padding: 1.75rem 1.6rem 1.5rem;
  box-shadow: 0 -8px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(110, 143, 255, 0.12);
  transform-origin: bottom center;
}
[data-theme='light'] .modal-sheet {
  background: rgba(255, 255, 255, 0.96);
  border-color: rgba(42, 79, 255, 0.2);
}
.modal-close {
  position: absolute;
  top: 12px;
  right: 14px;
  background: none;
  border: none;
  color: var(--muted);
  font-size: 1.4rem;
  cursor: pointer;
  line-height: 1;
}
.modal-header {
  margin-bottom: 1rem;
}
.modal-header .project-name {
  font-family: var(--font-d);
  font-size: 1.6rem;
  display: block;
  margin-bottom: 0.6rem;
}
.modal-body {
  font-size: 0.92rem;
  color: var(--muted);
  line-height: 1.75;
  margin-bottom: 1rem;
}
.modal-highlights {
  list-style: none;
  margin: 0 0 1.25rem;
  padding: 0;
}
.modal-highlights li {
  font-size: 0.82rem;
  color: var(--muted);
  padding: 0.35rem 0;
  border-bottom: 1px solid var(--border);
  font-family: var(--font-m);
}
.modal-highlights li:last-child {
  border-bottom: none;
}
.modal-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}
.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  padding: 0.55rem 1.1rem;
  border-radius: 4px;
  font-family: var(--font-m);
  font-size: 0.72rem;
  letter-spacing: 0.05em;
  text-decoration: none;
  transition: opacity 0.15s, transform 0.2s;
}
.btn-primary {
  background: var(--accent);
  color: #fff;
}
.btn-secondary {
  background: transparent;
  color: var(--muted);
  border: 1px solid var(--border);
}
.btn-primary:hover,
.btn-secondary:hover {
  opacity: 0.88;
  transform: translateY(-1px);
}
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-active .modal-sheet,
.modal-leave-active .modal-sheet {
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-sheet,
.modal-leave-to .modal-sheet {
  transform: translateY(100%);
}
@media (min-width: 641px) {
  .modal-backdrop {
    align-items: center;
  }
  .modal-sheet {
    border-radius: 14px;
  }
  .modal-enter-from .modal-sheet,
  .modal-leave-to .modal-sheet {
    transform: translateY(24px) scale(0.96);
  }
}
</style>
