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

function tick(t: number) {
  if (active && ring.value) {
    const dt = lastT ? Math.min(t - lastT, 100) : 16.7
    lastT = t
    const a = 1 - Math.exp(-dt * K)
    rx += (mx - rx) * a
    ry += (my - ry) * a
    place(ring.value, rx, ry)
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
  if (!rafId) rafId = requestAnimationFrame(tick)
}

function stop() {
  active = false
  document.body.classList.remove('custom-cursor')
  window.removeEventListener('mousemove', onMove)
  document.documentElement.removeEventListener('mouseleave', onLeave)
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
