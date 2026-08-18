<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { NAV_SECTIONS } from '../data/content'

// Observatory-style corner readout: real moon phase, scroll "altitude",
// active field of view, UTC clock. Desktop pointer devices only.
const route = useRoute()
const now = ref(new Date())
const altitude = ref(90)
const section = ref('hero')
const expanded = ref(false)

const SYNODIC = 29.530588853
// New moon reference: 2000-01-06 18:14 UTC
const EPOCH = Date.UTC(2000, 0, 6, 18, 14)

const moon = computed(() => {
  const days = (now.value.getTime() - EPOCH) / 86400000
  const age = ((days % SYNODIC) + SYNODIC) % SYNODIC
  const illum = Math.round((1 - Math.cos((age / SYNODIC) * Math.PI * 2)) / 2 * 100)
  const names: [number, string, string][] = [
    [1.85, 'new moon', '●'],
    [5.54, 'waxing crescent', '☽'],
    [9.23, 'first quarter', '◐'],
    [12.92, 'waxing gibbous', '◔'],
    [16.61, 'full moon', '○'],
    [20.3, 'waning gibbous', '◕'],
    [23.99, 'last quarter', '◑'],
    [27.68, 'waning crescent', '☾'],
  ]
  const entry = names.find(([limit]) => age < limit) ?? names[0]!
  return { name: entry[1], glyph: entry[2], illum }
})

const utc = computed(() =>
  now.value.toISOString().slice(11, 19),
)

const fov = computed(() => {
  if (route.name === 'home') return section.value
  return String(route.name ?? 'deep field')
})

let clock = 0
let obs: IntersectionObserver | null = null

function onScroll() {
  const maxS = document.documentElement.scrollHeight - window.innerHeight
  const r = maxS > 0 ? window.scrollY / maxS : 0
  // zenith at page top, horizon at page end
  altitude.value = Math.round((90 - r * 90) * 10) / 10
}

onMounted(() => {
  clock = window.setInterval(() => { now.value = new Date() }, 1000)
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  obs = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) section.value = e.target.id
      }
    },
    { rootMargin: '-40% 0px -55% 0px' },
  )
  const watch = () => {
    ;['hero-sec', ...NAV_SECTIONS].forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs?.observe(el)
    })
  }
  // sections mount with the page; observe after paint
  window.setTimeout(watch, 600)
})

onUnmounted(() => {
  clearInterval(clock)
  window.removeEventListener('scroll', onScroll)
  obs?.disconnect()
})
</script>

<template>
  <button
    class="sky-readout"
    :class="{ expanded }"
    aria-label="Sky readout — current moon phase, scroll altitude, and clock"
    @click="expanded = !expanded"
  >
    <span class="sr-line sr-moon">{{ moon.glyph }} {{ moon.name }} · {{ moon.illum }}%</span>
    <span class="sr-line">alt {{ altitude >= 0 ? '+' : '' }}{{ altitude }}° · fov {{ fov === 'hero-sec' ? 'zenith' : fov }}</span>
    <span class="sr-line sr-dim">{{ utc }} utc</span>
    <span v-if="expanded" class="sr-line sr-dim">obs 43.07°N 89.40°W · madison</span>
  </button>
</template>

<style scoped>
.sky-readout {
  position: fixed; right: 22px; bottom: 20px; z-index: 90;
  display: flex; flex-direction: column; gap: 3px; align-items: flex-end;
  background: none; border: none; padding: 10px 12px; cursor: pointer;
  font-family: var(--font-m, ui-monospace), monospace;
  font-size: 10.5px; letter-spacing: 0.08em; text-align: right;
  color: rgba(170, 185, 230, 0.5);
  border-right: 1px solid rgba(110, 143, 255, 0.18);
  transition: color 0.25s ease, border-color 0.25s ease;
}
.sky-readout:hover, .sky-readout.expanded {
  color: rgba(200, 212, 245, 0.85);
  border-right-color: rgba(110, 143, 255, 0.45);
}
.sky-readout:focus-visible { outline: 1px solid rgba(110, 143, 255, 0.5); outline-offset: 3px; }
.sr-moon { color: rgba(200, 212, 245, 0.75); }
.sr-dim { opacity: 0.65; }
.sr-line { white-space: nowrap; line-height: 1.5; }


@media (max-width: 900px), (pointer: coarse) {
  .sky-readout { display: none; }
}
</style>
