<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const visible = ref(true)

onMounted(() => {
  const t = setTimeout(() => { visible.value = false }, 1300)
  onUnmounted(() => clearTimeout(t))
})
</script>

<template>
  <div v-if="visible" class="domain-intro">
    <div class="d-rings">
      <div v-for="i in 4" :key="i" class="d-ring" />
    </div>
    <div class="d-word">∞</div>
  </div>
</template>
