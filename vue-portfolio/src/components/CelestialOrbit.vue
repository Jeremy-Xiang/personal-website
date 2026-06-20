<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useReducedMotion } from '../composables/useMotion'

const orbitRef = ref<HTMLElement | null>(null)
const { reducedMotion } = useReducedMotion()

onMounted(() => {
  if (reducedMotion.value) return
  // Offset rotation so sun/moon don't always start at the same spot
  const start = (Date.now() / 1000) % 180
  if (orbitRef.value) {
    orbitRef.value.style.animationDelay = `-${start}s`
  }
})
</script>

<template>
  <div class="celestial-orbit" aria-hidden="true">
    <div ref="orbitRef" class="orbit-track">
      <div class="celestial-body sun">
        <div class="body-glow sun-glow" />
        <div class="body-core sun-core" />
      </div>
      <div class="celestial-body moon">
        <div class="body-glow moon-glow" />
        <div class="body-core moon-core" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.celestial-orbit {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.orbit-track {
  position: absolute;
  width: min(88vmin, 720px);
  height: min(88vmin, 720px);
  left: 50%;
  top: 46%;
  transform: translate(-50%, -50%);
  animation: orbit-spin 200s linear infinite;
}

@keyframes orbit-spin {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

.celestial-body {
  position: absolute;
  left: 50%;
  width: 0;
  height: 0;
}

.sun {
  top: -2px;
  transform: translateX(-50%);
}

.moon {
  bottom: -2px;
  transform: translateX(-50%);
}

.body-core {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
}

.body-glow {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  filter: blur(12px);
}

.sun-core {
  width: 22px;
  height: 22px;
  background: radial-gradient(circle at 35% 35%, #fff8e7 0%, #ffd08a 45%, #e8943a 100%);
  box-shadow: 0 0 20px rgba(255, 190, 90, 0.45);
  opacity: 0.55;
}

.sun-glow {
  width: 56px;
  height: 56px;
  background: rgba(255, 180, 80, 0.18);
}

.moon-core {
  width: 18px;
  height: 18px;
  background: radial-gradient(circle at 38% 32%, #f4f6ff 0%, #c8d0e8 55%, #8898b8 100%);
  box-shadow: 0 0 16px rgba(180, 200, 255, 0.35);
  opacity: 0.7;
}

.moon-glow {
  width: 44px;
  height: 44px;
  background: rgba(160, 180, 255, 0.12);
}

@media (prefers-reduced-motion: reduce) {
  .orbit-track {
    animation: none;
  }
}
</style>
