<script setup lang="ts">
import { computed, onMounted, provide, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { effectsModeKey, useEffectsModeProvider } from './composables/useEffectsMode'
import { useReducedMotion } from './composables/useMotion'
import { useTheme } from './composables/useTheme'
import { useStarfield, useScrollProgress } from './composables/useStarfield'
import { CONSTELLATION_NAMES } from './data/content'

import CustomCursor from './components/CustomCursor.vue'
import Constellations from './components/Constellations.vue'
import DomainIntro from './components/DomainIntro.vue'
import SiteNav from './components/SiteNav.vue'

const route = useRoute()
const canvasRef = ref<HTMLCanvasElement | null>(null)
const { reducedMotion } = useReducedMotion()
const { theme } = useTheme()
const { liteMode, toggleLiteMode } = useEffectsModeProvider()
const { progress } = useScrollProgress()

provide(effectsModeKey, liteMode)

const isHome = computed(() => route.name === 'home')

useStarfield(canvasRef, reducedMotion, theme, liteMode)

function onInfinityClick() {
  document.querySelectorAll<HTMLElement>('.constellation').forEach((w) => {
    const d = parseFloat(w.style.getPropertyValue('--drift-dur')) || 44
    w.dataset.orig = String(d)
    w.style.setProperty('--drift-dur', `${d / 4}s`)
  })
  setTimeout(() => {
    document.querySelectorAll<HTMLElement>('.constellation').forEach((w) => {
      w.style.setProperty('--drift-dur', `${w.dataset.orig || 44}s`)
    })
  }, 4500)
}

let tipEl: HTMLDivElement | null = null

onMounted(() => {
  if (reducedMotion.value) return

  const depths = [0.012, 0.007, 0.015, 0.009, 0.011, 0.006, 0.010, 0.007]
  tipEl = document.createElement('div')
  tipEl.style.cssText = 'position:fixed;z-index:9990;font-family:var(--font-m);font-size:.6rem;letter-spacing:.12em;text-transform:lowercase;color:var(--accent);background:rgba(7,8,15,0.92);border:1px solid rgba(110,143,255,.35);padding:4px 10px;border-radius:3px;white-space:nowrap;pointer-events:none;opacity:0;transition:opacity .2s ease;transform:translateX(-50%)'
  document.body.appendChild(tipEl)

  let mouseClientX = -999
  let mouseClientY = -999
  let tgtX = 0
  let tgtY = 0
  let curX = 0
  let curY = 0
  let visibleFor: string | null = null
  const consts: { el: HTMLElement; name: string; depth: number }[] = []

  setTimeout(() => {
    document.querySelectorAll<HTMLElement>('.constellation').forEach((el, i) => {
      consts.push({ el, name: el.dataset.name || '', depth: depths[i % depths.length] ?? 0.01 })
    })
  }, 700)

  window.addEventListener('mousemove', (e) => {
    mouseClientX = e.clientX
    mouseClientY = e.clientY
    tgtX = (e.clientX / window.innerWidth - 0.5) * 2
    tgtY = (e.clientY / window.innerHeight - 0.5) * 2
  }, { passive: true })

  const PROXIMITY = 80
  ;(function loop() {
    requestAnimationFrame(loop)
    if (liteMode.value) return

    curX += (tgtX - curX) * 0.035
    curY += (tgtY - curY) * 0.035
    consts.forEach(({ el, depth }) => {
      el.style.translate = `${(curX * depth * window.innerWidth * 0.45).toFixed(2)}px ${(curY * depth * window.innerHeight * 0.45).toFixed(2)}px`
    })

    type Hit = { name: string; r: DOMRect }
    let hit: Hit | undefined
    let closestDist = PROXIMITY
    for (const { el, name } of consts) {
      if (!name) continue
      const r = el.getBoundingClientRect()
      const d = Math.hypot(mouseClientX - (r.left + r.width / 2), mouseClientY - (r.top + r.height / 2))
      if (d < closestDist) {
        closestDist = d
        hit = { name, r }
      }
    }

    if (hit && tipEl && hit.name !== visibleFor) {
      tipEl.textContent = CONSTELLATION_NAMES[hit.name] || hit.name
      tipEl.style.left = `${hit.r.left + hit.r.width / 2}px`
      tipEl.style.top = `${hit.r.top - 8}px`
      tipEl.style.opacity = '1'
      visibleFor = hit.name
    } else if (!hit && visibleFor && tipEl) {
      tipEl.style.opacity = '0'
      visibleFor = null
    }
  })()
})

watch(liteMode, (v) => {
  document.documentElement.classList.toggle('lite-mode', v)
})
</script>

<template>
  <CustomCursor />
  <div class="progress-bar" :style="{ width: progress + '%' }" />

  <div class="gblob gb1" />
  <div class="gblob gb2" />
  <div class="gblob gb3" />

  <canvas ref="canvasRef" class="starfield" />
  <Constellations />
  <DomainIntro v-if="isHome" />

  <SiteNav :lite-mode="liteMode" @infinity-click="onInfinityClick" @toggle-lite="toggleLiteMode" />

  <RouterView />
</template>
