<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'
import { useFinePointer } from '../composables/useMotion'

const { finePointer } = useFinePointer()
const dot = ref<HTMLElement | null>(null)
const ring = ref<HTMLElement | null>(null)

let mx = -100
let my = -100
let rx = -100
let ry = -100
let rafId = 0
let active = false
let lastT = 0

// ring chase rate, per ms. 0.007 ≈ the old 0.11-per-frame feel at 60fps,
// but stays identical at 240Hz and doesn't fall apart on dropped frames.
const K = 0.007

function place(el: HTMLElement, x: number, y: number) {
  el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
}

function onMove(e: MouseEvent) {
  mx = e.clientX
  my = e.clientY
  // dot tracks the OS cursor directly, no RAF hop, no lag
  if (dot.value) place(dot.value, mx, my)
}

function onLeave() {
  mx = -100
  my = -100
  if (dot.value) place(dot.value, mx, my)
}

/* Morph state (FABLE 25 — 69 MORPH): over [data-mag] elements the ring
   stops chasing the mouse and wraps the element instead. */
let wrapEl: HTMLElement | null = null

function onOver(e: Event) {
  const t = (e.target as HTMLElement).closest?.('[data-mag]')
  wrapEl = (t as HTMLElement) ?? null
}
function onOut(e: Event) {
  const t = (e.target as HTMLElement).closest?.('[data-mag]')
  if (t && t === wrapEl) wrapEl = null
}

function tick(t: number) {
  if (active && ring.value) {
    const dt = lastT ? Math.min(t - lastT, 100) : 16.7
    lastT = t
    const a = 1 - Math.exp(-dt * K)
    const el = ring.value
    if (wrapEl && wrapEl.isConnected) {
      const r = wrapEl.getBoundingClientRect()
      rx += (r.left + r.width / 2 - rx) * a * 1.6
      ry += (r.top + r.height / 2 - ry) * a * 1.6
      el.style.width = `${r.width + 14}px`
      el.style.height = `${r.height + 10}px`
      el.style.borderRadius = '8px'
      el.classList.add('cur-wrap')
    } else {
      rx += (mx - rx) * a
      ry += (my - ry) * a
      if (el.classList.contains('cur-wrap')) {
        el.style.width = ''
        el.style.height = ''
        el.style.borderRadius = ''
        el.classList.remove('cur-wrap')
      }
    }
    place(el, rx, ry)
  }
  rafId = requestAnimationFrame(tick)
}

function start() {
  if (active) return
  active = true
  lastT = 0
  document.body.classList.add('custom-cursor')
  window.addEventListener('mousemove', onMove, { passive: true })
  document.documentElement.addEventListener('mouseleave', onLeave)
  document.addEventListener('pointerover', onOver, { passive: true })
  document.addEventListener('pointerout', onOut, { passive: true })
  if (!rafId) rafId = requestAnimationFrame(tick)
}

function stop() {
  active = false
  document.body.classList.remove('custom-cursor')
  window.removeEventListener('mousemove', onMove)
  document.documentElement.removeEventListener('mouseleave', onLeave)
  document.removeEventListener('pointerover', onOver)
  document.removeEventListener('pointerout', onOut)
  cancelAnimationFrame(rafId)
  rafId = 0
}

watch(finePointer, (v) => { v ? start() : stop() }, { immediate: true })

onUnmounted(stop)
</script>

<template>
  <div v-show="finePointer" ref="dot" class="cur-dot" aria-hidden="true" />
  <div v-show="finePointer" ref="ring" class="cur-ring" aria-hidden="true" />
</template>
