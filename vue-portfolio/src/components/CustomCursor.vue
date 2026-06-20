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

function onMove(e: MouseEvent) {
  mx = e.clientX
  my = e.clientY
}

function onLeave() {
  mx = -100
  my = -100
}

function tick() {
  if (active && dot.value && ring.value) {
    rx += (mx - rx) * 0.11
    ry += (my - ry) * 0.11
    dot.value.style.left = `${mx}px`
    dot.value.style.top = `${my}px`
    ring.value.style.left = `${rx}px`
    ring.value.style.top = `${ry}px`
  }
  rafId = requestAnimationFrame(tick)
}

function start() {
  if (active) return
  active = true
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
