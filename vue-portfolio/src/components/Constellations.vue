<script setup lang="ts">
import { ref } from 'vue'
import { CONSTELLATIONS } from '../data/content'

const skyRef = ref<HTMLElement | null>(null)

defineExpose({ skyRef })
</script>

<template>
  <div ref="skyRef" class="sky">
    <div
      v-for="(c, ci) in CONSTELLATIONS"
      :key="c.name"
      class="constellation"
      :data-name="c.name"
      :style="{
        left: c.x + '%',
        top: c.y + '%',
        width: c.w + '%',
        height: c.h + 'vh',
        animationDelay: `${0.1 + ci * 0.15}s, ${ci}s`,
        '--dx1': (c.drift[0] ?? 0) + 'px',
        '--dy1': (c.drift[1] ?? 0) + 'px',
        '--dx2': (c.drift[2] ?? 0) + 'px',
        '--dy2': (c.drift[3] ?? 0) + 'px',
        '--dx3': (c.drift[4] ?? 0) + 'px',
        '--dy3': (c.drift[5] ?? 0) + 'px',
        '--drift-dur': (c.drift[6] ?? 44) + 's',
      }"
    >
      <svg class="const-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <line
          v-for="([a, b], li) in c.lines"
          :key="li"
          class="const-line"
        :x1="c.stars[a]?.x ?? 0"
        :y1="c.stars[a]?.y ?? 0"
        :x2="c.stars[b]?.x ?? 0"
        :y2="c.stars[b]?.y ?? 0"
          :style="{ animationDelay: `${0.4 + ci * 0.15 + li * 0.05}s, ${2 + ci * 0.15 + li * 0.05}s` }"
        />
      </svg>
      <div
        v-for="(s, si) in c.stars"
        :key="si"
        class="const-star"
        :class="{ bright: s.bright, faint: s.faint }"
        :style="{
          left: s.x + '%',
          top: s.y + '%',
          transform: 'translate(-50%, -50%)',
          '--tw': s.bright ? '0.85' : s.faint ? '0.32' : '0.55',
        }"
      />
    </div>
  </div>
</template>

<style scoped>
.const-line {
  stroke: var(--line-col);
  stroke-width: 0.5;
  stroke-linecap: round;
}
</style>
