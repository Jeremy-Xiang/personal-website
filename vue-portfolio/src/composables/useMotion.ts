import { onMounted, onUnmounted, ref } from 'vue'

function detectFinePointer(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

export function useFinePointer() {
  const finePointer = ref(detectFinePointer())
  let mq: MediaQueryList

  onMounted(() => {
    finePointer.value = detectFinePointer()
    mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    mq.addEventListener('change', onChange)
  })

  onUnmounted(() => mq?.removeEventListener('change', onChange))

  function onChange() {
    finePointer.value = mq.matches
  }

  return { finePointer }
}

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
