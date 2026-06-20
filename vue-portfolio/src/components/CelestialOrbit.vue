<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useReducedMotion } from '../composables/useMotion'

const orbitRef = ref<HTMLElement | null>(null)
const { reducedMotion } = useReducedMotion()

onMounted(() => {
  if (reducedMotion.value) return
  const start = (Date.now() / 1000) % 200
  if (orbitRef.value) {
    orbitRef.value.style.animationDelay = `-${start}s`
  }
})
</script>

<template>
  <div class="celestial-orbit" aria-hidden="true">
    <div ref="orbitRef" class="orbit-track">
      <div class="celestial-body sun">
        <svg class="sun-svg" viewBox="0 0 64 64" width="36" height="36">
          <defs>
            <radialGradient id="sunCore" cx="38%" cy="32%" r="55%">
              <stop offset="0%" stop-color="#fffef5" />
              <stop offset="45%" stop-color="#ffd98a" />
              <stop offset="100%" stop-color="#e8882a" />
            </radialGradient>
            <radialGradient id="sunCorona" cx="50%" cy="50%" r="50%">
              <stop offset="60%" stop-color="rgba(255,190,80,0)" />
              <stop offset="100%" stop-color="rgba(255,160,60,0.22)" />
            </radialGradient>
          </defs>
          <circle cx="32" cy="32" r="28" fill="url(#sunCorona)" class="sun-halo" />
          <g class="sun-rays">
            <line
              v-for="i in 12"
              :key="i"
              x1="32"
              y1="32"
              :x2="32 + Math.cos((i - 1) * Math.PI / 6) * 26"
              :y2="32 + Math.sin((i - 1) * Math.PI / 6) * 26"
              stroke="rgba(255,200,100,0.35)"
              stroke-width="1.2"
              stroke-linecap="round"
            />
          </g>
          <circle cx="32" cy="32" r="11" fill="url(#sunCore)" opacity="0.9" />
          <circle cx="28" cy="27" r="4" fill="rgba(255,255,240,0.35)" />
          <circle cx="32" cy="32" r="16" fill="none" stroke="rgba(255,220,140,0.25)" stroke-width="1" />
        </svg>
      </div>
      <div class="celestial-body moon">
        <svg class="moon-svg" viewBox="0 0 64 64" width="30" height="30">
          <defs>
            <radialGradient id="moonLit" cx="35%" cy="30%" r="60%">
              <stop offset="0%" stop-color="#f8faff" />
              <stop offset="55%" stop-color="#b8c4dc" />
              <stop offset="100%" stop-color="#6878a0" />
            </radialGradient>
            <radialGradient id="moonShade" cx="75%" cy="65%" r="45%">
              <stop offset="0%" stop-color="rgba(20,30,60,0.45)" />
              <stop offset="100%" stop-color="rgba(20,30,60,0)" />
            </radialGradient>
          </defs>
          <circle cx="32" cy="32" r="14" fill="url(#moonLit)" opacity="0.85" />
          <circle cx="38" cy="36" r="12" fill="url(#moonShade)" />
          <path
            d="M 22 24 Q 28 18 36 22"
            fill="none"
            stroke="rgba(240,248,255,0.22)"
            stroke-width="1.2"
            stroke-linecap="round"
          />
          <circle cx="26" cy="28" r="2.2" fill="rgba(80,95,130,0.35)" />
          <circle cx="34" cy="24" r="1.4" fill="rgba(80,95,130,0.28)" />
          <circle cx="30" cy="36" r="1.8" fill="rgba(80,95,130,0.3)" />
          <circle cx="32" cy="32" r="15" fill="none" stroke="rgba(200,215,255,0.15)" stroke-width="0.8" />
        </svg>
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
  --orbit-r: min(28vmin, 220px);
  position: absolute;
  width: calc(var(--orbit-r) * 2);
  height: calc(var(--orbit-r) * 2);
  left: 50%;
  /* Keep the top of the ring below the nav bar */
  top: max(calc(76px + var(--orbit-r)), 54%);
  transform: translate(-50%, -50%);
  opacity: 0.4;
  animation: orbit-spin 200s linear infinite;
}

@keyframes orbit-spin {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.celestial-body {
  position: absolute;
  left: 50%;
  width: 0;
  height: 0;
  filter: drop-shadow(0 0 12px rgba(255, 180, 80, 0.18));
}

.sun {
  top: -2px;
  transform: translateX(-50%);
}

.moon {
  bottom: -2px;
  transform: translateX(-50%);
  filter: drop-shadow(0 0 10px rgba(160, 180, 255, 0.16));
}

.sun-svg,
.moon-svg {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.sun-rays {
  transform-origin: 32px 32px;
  animation: sun-spin 90s linear infinite;
}

.sun-halo {
  animation: sun-breathe 8s ease-in-out infinite alternate;
}

@keyframes sun-breathe {
  from {
    opacity: 0.75;
  }
  to {
    opacity: 1;
  }
}

@keyframes sun-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .orbit-track,
  .sun-rays,
  .sun-halo {
    animation: none;
  }
}

@media (max-width: 640px) {
  .orbit-track {
    --orbit-r: min(24vmin, 180px);
    top: max(calc(68px + var(--orbit-r)), 52%);
    opacity: 0.32;
  }
}
</style>
