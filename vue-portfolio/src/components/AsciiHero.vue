<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { AsciiArt } from '../lib/ascii'

/* ASCII hero mark — the ∞ wordmark decoded as live ASCII, like the
   image→ASCII portfolio-hero trend. To use a photo of yourself instead
   (the full "like theirs" version), drop portrait.jpg in src/assets and
   swap the fromText call for:
     art.fromImage(new URL('../assets/portrait.jpg', import.meta.url).href)
   Everything else (dissolve-in, shimmer, theme ink) stays the same. */

const cv = ref<HTMLCanvasElement | null>(null)
let art: AsciiArt | null = null
let mo: MutationObserver | null = null

function inkForTheme(): string {
  return document.documentElement.dataset.theme === 'light' ? '#2a4fff' : '#6e8fff'
}

onMounted(() => {
  if (!cv.value) return
  art = new AsciiArt(cv.value, {
    cols: 62,
    fontSize: 7,
    ink: inkForTheme(),
    background: 'transparent',
  })
  art.fromText('∞', 320)

  mo = new MutationObserver(() => art?.setInk(inkForTheme()))
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
})

onUnmounted(() => {
  art?.destroy()
  mo?.disconnect()
})
</script>

<template>
  <div class="ascii-hero" aria-hidden="true">
    <canvas ref="cv" />
    <span class="ascii-cap">∞ · rendered as ascii, live</span>
  </div>
</template>

<style scoped>
.ascii-hero {
  position: absolute;
  right: 3vw;
  top: 50%;
  transform: translateY(-52%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  pointer-events: none;
  opacity: 0.85;
  filter: drop-shadow(0 0 18px rgba(110, 143, 255, 0.18));
}
.ascii-cap {
  font-family: var(--font-m, monospace);
  font-size: 0.56rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--muted);
}
/* keep the hero headline the star on smaller screens */
@media (max-width: 1300px) {
  .ascii-hero { display: none; }
}
</style>
