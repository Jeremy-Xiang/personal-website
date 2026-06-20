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
            <radialGradient id="sunCoreGrad" cx="38%" cy="32%" r="55%">
              <stop offset="0%" stop-color="#fffef5" />
              <stop offset="35%" stop-color="#ffe4a8" />
              <stop offset="72%" stop-color="#ffb84a" />
              <stop offset="100%" stop-color="#c86a18" />
            </radialGradient>
            <radialGradient id="sunLimbGrad" cx="50%" cy="50%" r="50%">
              <stop offset="55%" stop-color="rgba(200,90,20,0)" />
              <stop offset="100%" stop-color="rgba(160,60,10,0.35)" />
            </radialGradient>
            <radialGradient id="sunCoronaGrad" cx="50%" cy="50%" r="50%">
              <stop offset="58%" stop-color="rgba(255,190,80,0)" />
              <stop offset="100%" stop-color="rgba(255,150,50,0.24)" />
            </radialGradient>
            <filter id="sunGrain" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="4" result="noise" />
              <feColorMatrix in="noise" type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.35 0" result="softNoise" />
              <feComposite in="SourceGraphic" in2="softNoise" operator="arithmetic" k1="0" k2="1" k3="0.18" k4="0" />
            </filter>
            <clipPath id="sunDiscClip">
              <circle cx="32" cy="32" r="11.5" />
            </clipPath>
          </defs>
          <circle cx="32" cy="32" r="28" fill="url(#sunCoronaGrad)" class="sun-halo" />
          <g class="sun-rays">
            <line
              v-for="i in 12"
              :key="i"
              x1="32"
              y1="32"
              :x2="32 + Math.cos((i - 1) * Math.PI / 6) * (i % 3 === 0 ? 24 : 27)"
              :y2="32 + Math.sin((i - 1) * Math.PI / 6) * (i % 3 === 0 ? 24 : 27)"
              :stroke="i % 3 === 0 ? 'rgba(255,210,120,0.28)' : 'rgba(255,190,90,0.38)'"
              :stroke-width="i % 3 === 0 ? 0.9 : 1.2"
              stroke-linecap="round"
            />
          </g>
          <g filter="url(#sunGrain)" clip-path="url(#sunDiscClip)">
            <circle cx="32" cy="32" r="11.5" fill="url(#sunCoreGrad)" />
            <circle cx="32" cy="32" r="11.5" fill="url(#sunLimbGrad)" />
            <ellipse cx="27.5" cy="29" rx="2.4" ry="1.8" fill="rgba(190,95,25,0.32)" />
            <ellipse cx="35" cy="33.5" rx="1.6" ry="1.2" fill="rgba(180,85,20,0.26)" />
            <ellipse cx="30" cy="35.5" rx="1.1" ry="0.9" fill="rgba(170,75,15,0.22)" />
            <circle cx="28" cy="27" r="3.2" fill="rgba(255,255,235,0.28)" />
            <circle cx="36" cy="30" r="1.4" fill="rgba(255,230,180,0.18)" />
            <circle cx="24.5" cy="33" r="0.7" fill="rgba(255,210,140,0.2)" />
            <circle cx="33" cy="26" r="0.55" fill="rgba(255,220,160,0.16)" />
          </g>
          <circle cx="32" cy="32" r="11.5" fill="none" stroke="rgba(255,200,100,0.22)" stroke-width="0.6" />
          <circle cx="32" cy="32" r="16" fill="none" stroke="rgba(255,220,140,0.2)" stroke-width="0.8" />
        </svg>
      </div>
      <div class="celestial-body moon">
        <svg class="moon-svg" viewBox="0 0 64 64" width="30" height="30">
          <defs>
            <radialGradient id="moonLitGrad" cx="34%" cy="28%" r="62%">
              <stop offset="0%" stop-color="#f8faff" />
              <stop offset="48%" stop-color="#c4cedf" />
              <stop offset="100%" stop-color="#5a6888" />
            </radialGradient>
            <radialGradient id="moonShadeGrad" cx="78%" cy="68%" r="48%">
              <stop offset="0%" stop-color="rgba(12,18,40,0.55)" />
              <stop offset="100%" stop-color="rgba(12,18,40,0)" />
            </radialGradient>
            <radialGradient id="craterShade" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stop-color="rgba(255,255,255,0.12)" />
              <stop offset="55%" stop-color="rgba(60,72,100,0.35)" />
              <stop offset="100%" stop-color="rgba(30,38,58,0.55)" />
            </radialGradient>
            <filter id="moonGrain" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="9" result="noise" />
              <feColorMatrix in="noise" type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.28 0" result="softNoise" />
              <feComposite in="SourceGraphic" in2="softNoise" operator="arithmetic" k1="0" k2="1" k3="0.14" k4="0" />
            </filter>
            <clipPath id="moonDiscClip">
              <circle cx="32" cy="32" r="14.2" />
            </clipPath>
          </defs>
          <g clip-path="url(#moonDiscClip)" filter="url(#moonGrain)">
            <circle cx="32" cy="32" r="14.2" fill="url(#moonLitGrad)" />
            <ellipse cx="28" cy="34" rx="5.5" ry="4.2" fill="rgba(55,65,92,0.28)" />
            <ellipse cx="37" cy="29" rx="3.8" ry="2.8" fill="rgba(48,58,84,0.22)" />
            <ellipse cx="33" cy="38" rx="2.6" ry="2" fill="rgba(50,60,86,0.2)" />
            <circle cx="38" cy="36" r="12" fill="url(#moonShadeGrad)" />
            <g class="moon-craters">
              <circle cx="26" cy="28" r="2.4" fill="url(#craterShade)" />
              <circle cx="26" cy="28" r="1.5" fill="rgba(40,50,72,0.25)" />
              <circle cx="34" cy="24" r="1.7" fill="url(#craterShade)" />
              <circle cx="34" cy="24" r="1" fill="rgba(40,50,72,0.22)" />
              <circle cx="30" cy="36" r="2" fill="url(#craterShade)" />
              <circle cx="30" cy="36" r="1.2" fill="rgba(40,50,72,0.24)" />
              <circle cx="37" cy="32" r="1.3" fill="url(#craterShade)" />
              <circle cx="24" cy="34" r="1.1" fill="url(#craterShade)" />
              <circle cx="31" cy="30" r="0.75" fill="rgba(70,82,110,0.3)" />
              <circle cx="35" cy="37" r="0.6" fill="rgba(70,82,110,0.28)" />
              <circle cx="22" cy="30" r="0.55" fill="rgba(70,82,110,0.26)" />
            </g>
            <path
              d="M 21 23 Q 28 17 37 21"
              fill="none"
              stroke="rgba(240,248,255,0.24)"
              stroke-width="1.1"
              stroke-linecap="round"
            />
            <path
              d="M 23 39 Q 30 41 36 38"
              fill="none"
              stroke="rgba(180,195,225,0.12)"
              stroke-width="0.8"
              stroke-linecap="round"
            />
          </g>
          <circle cx="32" cy="32" r="14.2" fill="none" stroke="rgba(200,215,255,0.16)" stroke-width="0.7" />
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
