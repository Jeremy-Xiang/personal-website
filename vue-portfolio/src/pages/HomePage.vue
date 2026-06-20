<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useReducedMotion } from '../composables/useMotion'
import { useEffectsMode } from '../composables/useEffectsMode'
import {
  useScroll3D,
  useActiveNav,
  useKeyboardNav,
  useTilt,
} from '../composables/useScroll3D'
import { NAV_SECTIONS } from '../data/content'

import HeroSection from '../components/HeroSection.vue'
import NowSection from '../components/NowSection.vue'
import ProjectsSection from '../components/ProjectsSection.vue'
import ExperienceSection from '../components/ExperienceSection.vue'
import LeadershipSection from '../components/LeadershipSection.vue'
import ToolsSection from '../components/ToolsSection.vue'
import ContactSection from '../components/ContactSection.vue'

const sceneRef = ref<HTMLElement | null>(null)
const { reducedMotion } = useReducedMotion()
const { liteMode } = useEffectsMode()

useScroll3D(sceneRef, '.section-panel', reducedMotion, liteMode)
useActiveNav([...NAV_SECTIONS, 'traits'])
useKeyboardNav({ '1': 'now', '2': 'projects', '3': 'experience', '4': 'leadership', '5': 'tools', '6': 'contact' })
useTilt('.tool-card', 10)
useTilt('.trait', 10)
useTilt('.project-card', 12)

onMounted(() => {
  document.querySelectorAll('a, button, .trait, .tool-card, .entry, .contact-item, .project-card').forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hov'))
    el.addEventListener('mouseleave', () => document.body.classList.remove('hov'))
  })

  const nav = document.querySelector('nav')
  if (!nav) return
  const FADE = 80
  const MIN = 0.05
  const tgts = Array.from(document.querySelectorAll(
    'h1,h2,p,.entry-title,.entry-meta,.section-label,.trait-name,.trait-desc,.now-val,.now-key,.contact-item,.tool-card h3,.tool-card p,footer,.project-name,.project-desc',
  ))
  let tick = false
  const upd = () => {
    const nb = nav.getBoundingClientRect().bottom
    tgts.forEach((el) => {
      const node = el as HTMLElement
      const d = node.getBoundingClientRect().top - nb
      if (d >= FADE) node.style.opacity = ''
      else if (d <= 0) node.style.opacity = String(MIN)
      else node.style.opacity = (MIN + (1 - MIN) * (d / FADE)).toFixed(3)
    })
    tick = false
  }
  window.addEventListener('scroll', () => {
    if (!tick) {
      requestAnimationFrame(upd)
      tick = true
    }
  }, { passive: true })
})
</script>

<template>
  <main ref="sceneRef" class="scene-wrap">
    <HeroSection />
    <NowSection />
    <ProjectsSection />
    <ExperienceSection />
    <LeadershipSection />
    <ToolsSection />
    <ContactSection />

    <div class="footer-section">
      <footer>
        <span>© 2026 jeremy xiang · built with care</span>
        <span>∞</span>
      </footer>
    </div>
  </main>
</template>
