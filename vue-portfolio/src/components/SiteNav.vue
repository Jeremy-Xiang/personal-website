<script setup lang="ts">
import { useTheme } from '../composables/useTheme'
import { RouterLink } from 'vue-router'

defineProps<{ liteMode: boolean }>()
const emit = defineEmits<{ infinityClick: []; toggleLite: [] }>()
const { theme, toggleTheme } = useTheme()
</script>

<template>
  <nav>
    <RouterLink class="logo" to="/">
      <span class="inf" @click.stop="emit('infinityClick')">∞</span>jeremy xiang
    </RouterLink>
    <ul class="nav-links">
      <li><a href="/#now">now</a></li>
      <li><a href="/#projects">projects</a></li>
      <li><a href="/#experience">experience</a></li>
      <li><a href="/#traits">traits</a></li>
      <li><a href="/#tools">tools</a></li>
      <li><a href="/#contact">contact</a></li>
      <li><RouterLink to="/thesis">thesis</RouterLink></li>
      <li><RouterLink to="/portfolio">portfolio</RouterLink></li>
      <li><a href="https://lab.jeremyxiang.com" target="_blank" rel="noopener">lab ↗</a></li>
      <li class="res"><a href="/Jeremy_Xiang_Resume.pdf" target="_blank" rel="noopener">resume ↗</a></li>
      <li>
        <button
          type="button"
          class="effects-btn"
          :class="{ active: liteMode }"
          :aria-pressed="liteMode"
          @click="emit('toggleLite')"
        >
          {{ liteMode ? 'calm on' : 'calm' }}
        </button>
      </li>
      <li>
        <button class="theme-btn" aria-label="toggle theme" @click="toggleTheme">
          <span>{{ theme === 'dark' ? '☀' : '☾' }}</span>
        </button>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.logo { text-decoration: none; color: inherit; }
</style>
