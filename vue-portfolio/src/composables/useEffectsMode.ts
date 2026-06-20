import { inject, onMounted, ref, type InjectionKey, type Ref } from 'vue'

export const effectsModeKey: InjectionKey<Ref<boolean>> = Symbol('effectsMode')

function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(max-width: 640px)').matches
    || (window.matchMedia('(pointer: coarse)').matches && window.matchMedia('(hover: none)').matches)
}

export function useEffectsModeProvider() {
  const liteMode = ref(false)

  onMounted(() => {
    try {
      const stored = localStorage.getItem('liteMode')
      if (stored !== null) {
        liteMode.value = stored === '1'
      } else if (isMobileDevice()) {
        liteMode.value = true
      }
    } catch { /* noop */ }
    document.documentElement.classList.toggle('lite-mode', liteMode.value)
  })

  function toggleLiteMode() {
    liteMode.value = !liteMode.value
    document.documentElement.classList.toggle('lite-mode', liteMode.value)
    try {
      localStorage.setItem('liteMode', liteMode.value ? '1' : '0')
    } catch { /* noop */ }
  }

  return { liteMode, toggleLiteMode }
}

export function useEffectsMode() {
  const liteMode = inject(effectsModeKey, ref(false))
  return { liteMode }
}
