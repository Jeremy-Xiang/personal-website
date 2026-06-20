<script setup lang="ts">
import { computed, onMounted, onUnmounted, provide, reactive, ref, watch } from 'vue'
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

const constTip = reactive({ visible: false, text: '', x: 0, y: 0 })

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

let constellationLoopActive = false

onMounted(() => {
  // Remove stale tips from prior hot reloads / old builds
  document.querySelectorAll('.const-tip-float, .const-tooltip').forEach((el) => el.remove())

  if (reducedMotion.value) return

  const isCoarse = window.matchMedia('(pointer: coarse)').matches
    || window.matchMedia('(hover: none)').matches
  if (isCoarse) document.documentElement.classList.add('touch-device')

  const depths = [0.012, 0.007, 0.015, 0.009, 0.011, 0.006, 0.010, 0.007]

  let mouseClientX = -999
  let mouseClientY = -999
  let tgtX = 0
  let tgtY = 0
  let curX = 0
  let curY = 0
  const consts: { el: HTMLElement; name: string; depth: number }[] = []

  const onMouseMove = (e: MouseEvent) => {
    mouseClientX = e.clientX
    mouseClientY = e.clientY
    tgtX = (e.clientX / window.innerWidth - 0.5) * 2
    tgtY = (e.clientY / window.innerHeight - 0.5) * 2
  }
  window.addEventListener('mousemove', onMouseMove, { passive: true })

  const setupTimer = window.setTimeout(() => {
    document.querySelectorAll<HTMLElement>('.constellation').forEach((el, i) => {
      consts.push({ el, name: el.dataset.name || '', depth: depths[i % depths.length] ?? 0.01 })
    })
  }, 700)

  const PROXIMITY = 120
  constellationLoopActive = true

  function loop() {
    if (!constellationLoopActive) return
    requestAnimationFrame(loop)

    if (reducedMotion.value || isCoarse) return

    curX += (tgtX - curX) * 0.035
    curY += (tgtY - curY) * 0.035
    consts.forEach(({ el, depth }) => {
      el.style.translate = `${(curX * depth * window.innerWidth * 0.45).toFixed(2)}px ${(curY * depth * window.innerHeight * 0.45).toFixed(2)}px`
    })

    let hit: { name: string; r: DOMRect } | undefined
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

    if (hit) {
      constTip.text = CONSTELLATION_NAMES[hit.name] || hit.name
      constTip.x = hit.r.left + hit.r.width / 2
      constTip.y = hit.r.top - 12
      constTip.visible = true
    } else {
      constTip.visible = false
    }
  }

  requestAnimationFrame(loop)

  onUnmounted(() => {
    constellationLoopActive = false
    clearTimeout(setupTimer)
    window.removeEventListener('mousemove', onMouseMove)
    constTip.visible = false
  })
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

  <!-- Single constellation label — Vue-managed, never duplicated -->
  <div
    v-show="constTip.visible"
    class="const-tip-float"
    :style="{ left: constTip.x + 'px', top: constTip.y + 'px' }"
  >
    {{ constTip.text }}
  </div>

  <SiteNav :lite-mode="liteMode" @infinity-click="onInfinityClick" @toggle-lite="toggleLiteMode" />

  <RouterView />
</template>
