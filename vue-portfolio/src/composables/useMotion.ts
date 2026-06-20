import { onMounted, onUnmounted, ref } from 'vue'

export function useReducedMotion() {
  const reduced = ref(false)
  let mq: MediaQueryList

  onMounted(() => {
    mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduced.value = mq.matches
    mq.addEventListener('change', onChange)
  })

  onUnmounted(() => mq?.removeEventListener('change', onChange))

  function onChange(e: MediaQueryListEvent) {
    reduced.value = e.matches
  }

  return { reducedMotion: reduced }
}

export function useFinePointer() {
  const fine = ref(false)
  onMounted(() => {
    fine.value = window.matchMedia('(hover:hover) and (pointer:fine)').matches
  })
  return { finePointer: fine }
}
