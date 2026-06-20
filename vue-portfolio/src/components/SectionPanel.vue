<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps<{ id?: string; maxWidth?: string }>()
const panel = ref<HTMLElement | null>(null)
const visible = ref(false)

onMounted(() => {
  if (!panel.value) return
  const obs = new IntersectionObserver(
    ([e]) => {
      if (e?.isIntersecting) {
        visible.value = true
        obs.disconnect()
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
  )
  obs.observe(panel.value)
})
</script>

<template>
  <section :id="props.id" class="scroll-section">
    <Transition name="panel-rise" appear>
      <div
        ref="panel"
        class="section-panel"
        :class="{ visible }"
        :style="props.maxWidth ? { maxWidth: props.maxWidth } : undefined"
      >
        <slot />
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.panel-rise-enter-active {
  transition: opacity 0.75s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.75s cubic-bezier(0.22, 1, 0.36, 1);
}
.panel-rise-enter-from {
  opacity: 0;
  transform: translateY(32px) scale(0.97);
}
</style>
