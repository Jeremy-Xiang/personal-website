<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useFinePointer } from '../composables/useMotion'

const { finePointer } = useFinePointer()
const dot = ref<HTMLElement | null>(null)
const ring = ref<HTMLElement | null>(null)
let mx = -100
let my = -100
let rx = -100
let ry = -100
let rafId = 0
let scrollTimer = 0

function onMove(e: MouseEvent) {
  mx = e.clientX
  my = e.clientY
}

function onScroll() {
  document.body.classList.add('is-scrolling')
  clearTimeout(scrollTimer)
  scrollTimer = window.setTimeout(() => {
    document.body.classList.remove('is-scrolling')
  }, 120)
}

function tick() {
  if (!finePointer.value) return
  rx += (mx - rx) * 0.11
  ry += (my - ry) * 0.11
  if (dot.value) {
    dot.value.style.transform = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`
  }
  if (ring.value) {
    ring.value.style.transform = `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`
  }
  rafId = requestAnimationFrame(tick)
}

onMounted(() => {
  window.addEventListener('mousemove', onMove, { passive: true })
  window.addEventListener('scroll', onScroll, { passive: true })
  rafId = requestAnimationFrame(tick)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('scroll', onScroll)
  cancelAnimationFrame(rafId)
  clearTimeout(scrollTimer)
  document.body.classList.remove('is-scrolling')
})
</script>

<template>
  <div v-if="finePointer" ref="dot" class="cur-dot" />
  <div v-if="finePointer" ref="ring" class="cur-ring" />
</template>
