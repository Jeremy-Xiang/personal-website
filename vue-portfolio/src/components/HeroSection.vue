<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const target = ref<HTMLElement | null>(null)
const showCursor = ref(true)

const parts = [
  { text: 'quietly curious,', em: false },
  { text: '\n', em: false },
  { text: 'relentlessly', em: true },
  { text: ' building.', em: false },
]

onMounted(() => {
  let pi = 0
  let ci = 0
  let currentNode: HTMLElement | null = null
  let typeTimer = 0
  let typeCancelled = false

  function typeNext() {
    if (typeCancelled) return
    if (!target.value || pi >= parts.length) {
      typeTimer = window.setTimeout(() => { if (!typeCancelled) showCursor.value = false }, 2000)
      return
    }
    const part = parts[pi]
    if (!part) return

    if (ci === 0) {
      if (part.text === '\n') {
        target.value.appendChild(document.createElement('br'))
        pi++
        ci = 0
        typeTimer = window.setTimeout(typeNext, 60)
        return
      }
      currentNode = document.createElement(part.em ? 'em' : 'span')
      target.value.appendChild(currentNode)
    }

    if (currentNode) currentNode.textContent += part.text[ci]
    ci++
    if (ci >= part.text.length) {
      pi++
      ci = 0
      currentNode = null
    }
    typeTimer = window.setTimeout(typeNext, 42 + Math.random() * 20)
  }

  typeTimer = window.setTimeout(typeNext, 1500)

  const inner = document.querySelector('.hero-inner') as HTMLElement | null
  let tick = false
  const onScroll = () => {
    if (!inner || tick) return
    tick = true
    requestAnimationFrame(() => {
      const y = window.scrollY
      inner.style.transform = `translateY(${y * 0.3}px)`
      inner.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.65)))
      tick = false
    })
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  onUnmounted(() => {
    typeCancelled = true
    clearTimeout(typeTimer)
    window.removeEventListener('scroll', onScroll)
  })
})
</script>

<template>
  <section class="hero" id="hero-sec">
    <div class="hero-inner">
      <div class="hero-eyebrow">cs + econ · uw–madison · class of 2028</div>
      <div class="hero-tilt">
        <h1>
          <span ref="target" />
          <span v-show="showCursor" class="type-cursor" />
        </h1>
        <p class="hero-sub">
          studying computer science and economics at the
          <a href="https://www.wisc.edu/" target="_blank" rel="noopener">university of wisconsin–madison</a>.
          obsessed with machine learning, clean systems, and software that actually solves problems.
        </p>
      </div>
      <div class="scroll-cue">scroll</div>
    </div>
  </section>
</template>
