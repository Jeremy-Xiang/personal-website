<script setup lang="ts">
import { ref } from 'vue'
import { useFinePointer } from '../composables/useMotion'

const { finePointer } = useFinePointer()
const dot = ref<HTMLElement | null>(null)
const ring = ref<HTMLElement | null>(null)
let mx = -100
let my = -100
let rx = -100
let ry = -100
let rafId = 0

function onMove(e: MouseEvent) {
  mx = e.clientX
  my = e.clientY
}

function tick() {
  if (!finePointer.value) return
  rx += (mx - rx) * 0.11
  ry += (my - ry) * 0.11
  if (dot.value) {
    dot.value.style.left = `${mx}px`
    dot.value.style.top = `${my}px`
  }
  if (ring.value) {
    ring.value.style.left = `${rx}px`
    ring.value.style.top = `${ry}px`
  }
  rafId = requestAnimationFrame(tick)
}

import { onMounted, onUnmounted } from 'vue'
onMounted(() => {
  window.addEventListener('mousemove', onMove)
  rafId = requestAnimationFrame(tick)
})
onUnmounted(() => {
  window.removeEventListener('mousemove', onMove)
  cancelAnimationFrame(rafId)
})
</script>

<template>
  <div v-if="finePointer" ref="dot" class="cur-dot" />
  <div v-if="finePointer" ref="ring" class="cur-ring" />
</template>
