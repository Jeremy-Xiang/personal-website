<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const visible = ref(true)
let hideTimer = 0

onMounted(() => {
  hideTimer = window.setTimeout(() => { visible.value = false }, 1300)
})

onUnmounted(() => clearTimeout(hideTimer))
</script>

<template>
  <div v-if="visible" class="domain-intro">
    <div class="d-rings">
      <div v-for="i in 4" :key="i" class="d-ring" />
    </div>
    <div class="d-word">∞</div>
  </div>
</template>
