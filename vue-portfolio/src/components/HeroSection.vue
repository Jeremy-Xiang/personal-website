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
  const cursorEl = document.querySelector('.type-cursor') as HTMLElement | null
  void cursorEl

  function typeNext() {
    if (!target.value || pi >= parts.length) {
      setTimeout(() => { showCursor.value = false }, 2000)
      return
    }
    const part = parts[pi]
    if (!part) return

    if (ci === 0) {
      if (part.text === '\n') {
        target.value.appendChild(document.createElement('br'))
        pi++
        ci = 0
        setTimeout(typeNext, 60)
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
    setTimeout(typeNext, 42 + Math.random() * 20)
  }

  setTimeout(typeNext, 1500)
})

onMounted(() => {
  const inner = document.querySelector('.hero-inner') as HTMLElement | null
  if (!inner) return
  let tick = false
  const onScroll = () => {
    if (tick) return
    tick = true
    requestAnimationFrame(() => {
      const y = window.scrollY
      inner.style.transform = `translateY(${y * 0.3}px)`
      inner.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.65)))
      tick = false
    })
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', onScroll))
})

function onHeroMove(e: MouseEvent) {
  const hero = (e.currentTarget as HTMLElement)
  const tilt = hero.querySelector('.hero-tilt') as HTMLElement
  if (!tilt) return
  const r = hero.getBoundingClientRect()
  const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2)
  const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2)
  tilt.style.transform = `perspective(900px) rotateX(${-dy * 4.5}deg) rotateY(${dx * 5.5}deg) translateZ(60px)`
}

function onHeroLeave(e: MouseEvent) {
  const tilt = (e.currentTarget as HTMLElement).querySelector('.hero-tilt') as HTMLElement
  if (tilt) tilt.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateZ(60px)'
}
</script>

<template>
  <section class="hero" id="hero-sec" @mousemove="onHeroMove" @mouseleave="onHeroLeave">
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
